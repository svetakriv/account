import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Расчетный счет в Т-Банке",
  description: "Прототип заявочной формы Т-Бизнеса для UX-исследования.",
  icons: {
    icon: "/assets/favicon-32x32.png",
    shortcut: "/assets/favicon-32x32.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
