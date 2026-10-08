const { Bot, InlineKeyboard, Keyboard } = require("grammy");
require("dotenv").config();
const axios = require("axios");
const api = process.env.API_URL || (process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/api/` : "http://localhost:8000/api/");

const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error("BOT_TOKEN .env faylida ko'rsatilmagan!");
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const bot = new Bot(token);
const userData = new Map();

async function getOrderStatus(telegram_id) {
    try {
        const res = await axios.get(`${api}orders/status/${telegram_id}`);
        if (Array.isArray(res.data)) {
            const statusMap = {
                ordered: "⏳ Buyurtma uchun so'rov yuborilgan!",
                accepted: "✅ Buyurtma tasdiqlandi!",
                in_progress: "⚙️ Buyurtmangiz tayyorlanmoqda!",
                completed: "🎉 Buyurtmangiz tayyor!",
                delivered: "📦 Buyurtmangiz yetkazildi!",
                rejected: "❌ Buyurtmangiz rad etildi!"
            };
            return res.data
                .map(item => `Kitob nomi: 📚 ${item.book_name}\nHolati: ${statusMap[item.status] || item.status}\nSanasi: ${formatDate(item.created_at)}`)
                .join("\n\n");
        }
        return res.data?.message || res.data;
    } catch (error) {
        return error.response?.data?.message || "Buyurtma topilmadi!";
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

async function getCustomerInfo(telegram_id) {
    try {
        const res = await axios.get(`${api}customers/${telegram_id}`);
        if (res.data && res.data.customer_name && res.data.phone && res.data.message !== "Mijoz topilmadi") {
            return res.data;
        }
        return null;
    } catch (error) {
        return null;
    }
}

// setMyCommands logic moved to startBot() async function with proper error catching

const sendStartMenu = async (ctx) => {
    userData.delete(ctx.from.id);
    await ctx.reply("Assalomu alaykum! Yasafi Booklab botiga xush kelibsiz!\n\nBuyurtma berish uchun 'Buyurtma berish' tugmasini bosing!", {
        reply_markup: new InlineKeyboard()
            .text("📦 Buyurtmalarim holati", "order_status")
            .row()
            .text("📞 Aloqa", 'contact')
            .text("👤 Profilim", 'profile')
            .row()
            .text("✅ Buyurtma berish", "order_book")
    });
};

bot.command("start", async (ctx) => {
    await sendStartMenu(ctx);
});

bot.on("callback_query:data", async (ctx) => {
    await ctx.answerCallbackQuery();
    const data = ctx.callbackQuery.data;

    if (data === "order_status") {
        const status = await getOrderStatus(ctx.from.id);
        await ctx.reply(`Buyurtmalaringiz holati:\n\n${status}`);
    }
    else if (data === "profile") {
        const customer = await getCustomerInfo(ctx.from.id);
        if (customer) {
            await ctx.reply(`Profilingiz:\n\n👤 Ism: ${customer.customer_name}\n📞 Telefon: ${customer.phone}\n🏢 Tashkilot: ${customer.branch_name}`, {
                reply_markup: new InlineKeyboard()
                    .text("🔙 Orqaga", "back")
                    .text("✏️ Tahrirlash", "profile_edit")
            });
        }
    }
    else if (data === "back") {
        try {
            await ctx.deleteMessage();
        } catch (e) { }
    }
    else if (data === "profile_edit") {
        userData.set(ctx.from.id, { step: "edit_name" });
        await ctx.reply("Yangi ismingizni kiriting:", {
            reply_markup: { remove_keyboard: true }
        });
    }
    else if (data === "contact") {
        await ctx.reply(`Aloqa\n\nTelefon: +998901234567\nTelegram: @yasafi_booklab`);
    }
    else if (data === "order_book") {
        const customer = await getCustomerInfo(ctx.from.id);
        if (customer) {
            userData.set(ctx.from.id, {
                phone: customer.phone,
                name: customer.customer_name,
                organization: customer.branch_name || "",
                step: "book_name"
            });
            await ctx.reply(
                `Assalomu alaykum, ${customer.customer_name}!\n\nBuyurtma qilmoqchi bo'lgan kitob nomini kiriting:`,
                { reply_markup: { remove_keyboard: true } }
            );
        } else {
            await ctx.reply("Buyurtma berish uchun pastdagi telefon raqamni ulashish tugmasini bosing:", {
                reply_markup: new Keyboard()
                    .requestContact("📱 Telefon raqamni ulashish")
                    .resized()
                    .oneTime()
            });
        }
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

    const user = userData.get(ctx.from.id);
    if (user && user.step === "edit_phone") {
        user.phone = phoneNumber;
        user.step = "edit_branch";
        userData.set(ctx.from.id, user);

        await ctx.reply(`Telefon raqamingiz qabul qilindi: ${phoneNumber}\n\nEndi yangi tashkilot yoki filial nomini kiriting:`, {
            reply_markup: { remove_keyboard: true }
        });
        return;
    }

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

        if (user.step === "edit_name") {
            user.customer_name = text;
            user.step = "edit_phone";
            userData.set(ctx.from.id, user);

            await ctx.reply(`Ismingiz qabul qilindi: ${text}\n\nEndi yangi telefon raqamingizni kiriting:`);
        } else if (user.step === "edit_phone") {
            user.phone = text;
            user.step = "edit_branch";
            userData.set(ctx.from.id, user);

            await ctx.reply(`Telefon raqamingiz qabul qilindi: ${text}\n\nEndi yangi tashkilot yoki filial nomini kiriting:`);
        } else if (user.step === "edit_branch") {
            user.branch_name = text;

            try {
                const update_payload = {
                    customer_name: user.customer_name,
                    phone: user.phone,
                    branch_name: user.branch_name,
                    telegram_id: ctx.from.id
                };

                await axios.put(`${api}customers/${ctx.from.id}`, update_payload);
                await axios.put(`${api}orders/${ctx.from.id}`, update_payload);

                userData.delete(ctx.from.id);

                await ctx.reply(
                    `Profilingiz muvaffaqiyatli tahrirlandi!\n\n` +
                    `👤 Ism: ${update_payload.customer_name}\n` +
                    `📞 Telefon: ${update_payload.phone}\n` +
                    `🏢 Tashkilot: ${update_payload.branch_name}`
                );
            } catch (error) {
                console.error("Profile update error:", error?.response?.data || error.message);
                await ctx.reply("Profilni tahrirlashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
            }
        } else if (user.step === "name") {
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

bot.catch((err) => {
    console.error("Telegram bot update xatoligi:", err.error?.message || err.message || err);
});

async function startBot() {
    try {
        await bot.api.setMyCommands([
            {
                command: "start",
                description: "Boshlash"
            },
        ]);
    } catch (error) {
        console.error("Telegram bot setMyCommands xatoligi (Internet yoki DNS ulanishda muammo):", error?.message || error);
    }

    try {
        bot.start({
            onStart: (botInfo) => {
                console.log(`Telegram bot @${botInfo.username} muvaffaqiyatli ishga tushdi...`);
            }
        });
    } catch (error) {
        console.error("Telegram bot start xatoligi:", error?.message || error);
    }
}

startBot();

module.exports = bot;