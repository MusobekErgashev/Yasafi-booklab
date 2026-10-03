const { Bot, InlineKeyboard, Keyboard } = require("grammy");
require("dotenv").config();
const axios = require("axios");
const api = process.env.API_URL || (process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/api/` : "http://localhost:8000/api/");

const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error("BOT_TOKEN .env faylida ko'rsatilmagan!");
}

const bot = new Bot(token);
const userData = new Map();

async function getOrderStatus(telegram_id) {
    try {
        const res = await axios.get(`${api}orders/status/${telegram_id}`);
        if (res.data === "ordered") return "⏳ Buyurtma uchun so'rov yuborilgan!"
        if (res.data === "accepted") return "✅ Buyurtma tasdiqlandi!"
        if (res.data === "in_progress") return "⚙️ Buyurtmangiz tayyorlanmoqda!"
        if (res.data === "completed") return "🎉 Buyurtmangiz tayyor!"
        if (res.data === "delivered") return "📦 Buyurtmangiz yetkazildi!"
        if (res.data === "rejected") return "❌ Buyurtmangiz rad etildi!"
    } catch (error) {
        return error.response?.data?.message;
    }
}

// Helper function to send order data to API
async function createOrderInApi(ctx, user) {
    try {
        const order_payload = {
            customer_name: user.name,
            branch_name: user.organization,
            phone: user.phone,
            book_name: user.book_name,
            book_size: user.book_size,
            book_count: user.book_count,
            note: user.note || "",
            customer_id: ctx.from.id
        };

        const user_payload = {
            customer_name: user.name,
            phone: user.phone,
            branch_name: user.organization,
            telegram_id: ctx.from.id,
        };

        await axios.post(`${api}orders/`, order_payload);
        await axios.post(`${api}customers/`, user_payload);

        user.step = "done";
        userData.delete(ctx.from.id);

        await ctx.reply(
            `Buyurtmangiz muvaffaqiyatli yuborildi!\n\n` +
            `👤 Ism: ${order_payload.customer_name}\n` +
            `📞 Telefon: ${order_payload.phone}\n` +
            `📚 Kitob: ${order_payload.book_name}\n` +
            `📐 O'lcham: ${order_payload.book_size}\n` +
            `🔢 Soni: ${order_payload.book_count} ta\n` +
            `🏢 Tashkilot: ${order_payload.branch_name}\n` +
            (order_payload.note ? `📝 Eslatma: ${order_payload.note}\n` : "") +
            `\nTez orada siz bilan bog'lanamiz! Buyurtmangiz admin tomonidan tasdiqlansa sizga holat haqida xabar beramiz!`
        );
    } catch (error) {
        console.error("Order POST error:", error?.response?.data || error.message);
        await ctx.reply("Buyurtma yuborishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    }
}

bot.api.setMyCommands([
    {
        command: "start",
        description: "Boshlash"
    },
]);

bot.command("start", async (ctx) => {
    await ctx.reply("Assalomu alaykum! Yasafi Booklab botiga xush kelibsiz!", {
        reply_markup: new InlineKeyboard()
            .text("Buyurtmam holati", "order_status")
            .row()
            .text("Buyurtma berish", "order_book")
    });
});

bot.on("callback_query:data", async (ctx) => {
    await ctx.answerCallbackQuery();
    const data = ctx.callbackQuery.data;

    if (data === "order_status") {
        const status = await getOrderStatus(ctx.from.id);
        await ctx.reply(`Buyurtmangiz holati:\n\n${status}`);
    }
    else if (data === "order_book") {
        await ctx.reply("Buyurtma berish uchun pastdagi telefon raqamni ulashish tugmasini bosing:", {
            reply_markup: new Keyboard()
                .requestContact("📱 Telefon raqamni ulashish")
                .resized()
                .oneTime()
        });
    }
    else if (["a0", "a1", "a2", "a3", "a4", "a5"].includes(data.toLowerCase())) {
        if (userData.has(ctx.from.id)) {
            const user = userData.get(ctx.from.id);
            user.book_size = data.toUpperCase();
            user.step = "book_count";
            userData.set(ctx.from.id, user);

            await ctx.reply(`Kitob o'lchami: ${user.book_size}\n\nEndi kitob sonini kiriting:`);
        }
    }
    else if (data === "no_note") {
        if (userData.has(ctx.from.id)) {
            const user = userData.get(ctx.from.id);
            if (user.step === "note") {
                user.note = "";
                await createOrderInApi(ctx, user);
            }
        }
    }
});

bot.on("message:contact", async (ctx) => {
    const phoneNumber = ctx.message.contact.phone_number;
    const firstName = ctx.message.contact.first_name;

    userData.set(ctx.from.id, {
        phone: phoneNumber,
        name: firstName,
        step: "name"
    });

    await ctx.reply(`Telefon raqamingiz qabul qilindi: ${phoneNumber}\n\nEndi ismingizni kiriting:`, {
        reply_markup: { remove_keyboard: true }
    });
});

bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;

    if (userData.has(ctx.from.id)) {
        const user = userData.get(ctx.from.id);

        if (user.step === "name") {
            user.name = text;
            user.step = "book_name";
            userData.set(ctx.from.id, user);

            await ctx.reply(`Ismingiz qabul qilindi: ${text}\n\nEndi buyurtma qilmoqchi bo'lgan kitob nomini kiriting:`, {
                reply_markup: { remove_keyboard: true }
            });
        } else if (user.step === "book_name") {
            user.book_name = text;
            user.step = "book_size";
            userData.set(ctx.from.id, user);

            await ctx.reply(`Kitob nomi: ${text}\n\nKitob o'lchamini tanlang:`, {
                reply_markup: new InlineKeyboard()
                    .text("A0", "a0").text("A1", "a1").text('A2', 'a2')
                    .row()
                    .text('A3', 'a3').text('A4', 'a4').text('A5', 'a5')
            });
        } else if (user.step === "book_size") {
            user.book_size = text.toUpperCase();
            user.step = "book_count";
            userData.set(ctx.from.id, user);

            await ctx.reply(`Kitob o'lchami: ${user.book_size}\n\nEndi kitob sonini kiriting:`);
        } else if (user.step === "book_count") {
            user.book_count = text;
            user.step = "organization";
            userData.set(ctx.from.id, user);

            await ctx.reply(`Kitob soni: ${user.book_count}\n\nQaysi tashkilot yoki filialdansiz? Yozing:`);
        } else if (user.step === "organization") {
            user.organization = text;
            user.step = "note";
            userData.set(ctx.from.id, user);

            await ctx.reply(`Tashkilot: ${user.organization}\n\nQo'shimcha ma'lumot yoki eslatmalar (agar bo'lsa):`, {
                reply_markup: new InlineKeyboard()
                    .text("Qo'shimcha ma'lumot yo'q", "no_note")
            });
        } else if (user.step === "note") {
            user.note = text;
            await createOrderInApi(ctx, user);
        }
    }
});

bot.start();
console.log("Telegram bot ishga tushdi...");

module.exports = bot;