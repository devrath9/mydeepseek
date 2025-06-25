import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppcontextProvider } from "@/context/Appcontext";
import { Toaster } from "react-hot-toast";

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
        <Toaster
        toastOptions={
          {
            success:{style:{backgroundColor:'black', color:'white'}},
            error:{style:{backgroundColor:'black', color:'white'}}
          }
          }/>
        {children}
      </body>
    </html>
    </AppcontextProvider>
    </ClerkProvider>
  );
}
