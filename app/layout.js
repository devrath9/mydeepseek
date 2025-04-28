import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppcontextProvider } from "@/context/Appcontext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});



export const metadata = {
  title: "DEEPSEEK ",
  description: "Full Stack Application",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <AppcontextProvider>
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
    </AppcontextProvider>
    </ClerkProvider>
  );
}
