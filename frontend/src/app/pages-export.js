import { Briefcase, CalendarCheck, CalendarCheck2, ChartPie, ClipboardCheck, Handshake, Hourglass, LibraryBig, ListChecks, NotebookPen, Package, ShoppingCart, SquareCheckBig, Users, Warehouse } from "lucide-react";

export const pages = [
    {
        id: 1,
        title: "Buyurtmalar",
        path: "/buyurtmalar",
        icon: <Package size={24} />,
        headTitle: "Buyurtmalar",
        headDescription: "Buyurtmalar ro'yxati"
    },
    {
        id: 2,
        title: "Mijozlar",
        path: "/mijozlar",
        icon: <Users  size={24}/>,
        headTitle: "Mijozlar",
        headDescription: "Mijozlar ro'yxati"
    },
    {
        id: 3,
        title: "Sotuv",
        path: "/sotuv",
        icon: <ShoppingCart size={24} />,
        headTitle: "Sotuvlar",
        headDescription: "Sotuvlar ro'yxati"
    },
    {
        id: 4,
        title: "Kitoblar",
        path: "/kitoblar",
        icon: <LibraryBig size={24} />,
        headTitle: "Kitoblar",
        headDescription: "Kitoblar ro'yxati"
    },
    {
        id: 5,
        title: "Xodimlar",
        path: "/xodimlar",
        icon: <Briefcase size={24} />,
        headTitle: "Xodimlar",
        headDescription: "Xodimlar ro'yxati"
    },
    {
        id: 6,
        title: "Hisobot",
        path: "/hisobot",
        icon: <NotebookPen size={24} />,
        headTitle: "Hisobot",
        headDescription: "Hisobotlar ro'yxati"
    },
    {
        id: 7,
        title: "Topshiriqlar",
        path: "/topshiriqlar",
        icon: <SquareCheckBig size={24} />,
        headTitle: "Topshiriqlar",
        headDescription: "Topshiriqlar ro'yxati"
    },
    {
        id: 8,
        title: "Smena",
        path: "/smena",
        icon: <Hourglass size={24} />,
        headTitle: "Smena",
        headDescription: "Smena ro'yxati"
    },
    {
        id: 9,
        title: "Ombor",
        path: "/ombor",
        icon: <Warehouse size={24} />,
        headTitle: "Ombor",
        headDescription: "Omborlar ro'yxati"
    },
    {
        id: 10,
        title: "Moliya",
        path: "/moliya",
        icon: <Handshake size={24} />,
        headTitle: "Moliya",
        headDescription: "Moliya"
    },
    {
        id: 11,
        title: "Dashboard",
        path: "/dashboard",
        icon: <ChartPie size={24} />,
        headTitle: "Dashboard",
        headDescription: "Dashboard"
    },
]