import localFont from "next/font/local";
import { Geist, Geist_Mono, Hanken_Grotesk } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Header from "@/components/Header";
import Menu from "@/components/Menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata = {
  title: "Yasafi Booklab",
  description: "",
  icons: {
    icon: "/logo-icon.png",
  },
};

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${satoshi.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <body className="h-screen overflow-x-hidden bg-background flex">
        <Toaster position="top-center" reverseOrder={false} />
        <Menu />
        <div className="flex flex-col w-full">
          <Header />
          <div className="overflow-y-auto h-full w-full p-4">{children}</div>
        </div>
      </body>
    </html>
  );
}