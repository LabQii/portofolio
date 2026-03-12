import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BackToTop from "@/components/back-to-top";
import Providers from "@/components/providers";

const font = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "M Iqbal Firmansyah | Portfolio",
  description: "Clean, minimal, and professional portfolio of M Iqbal Firmansyah - Web Developer & UI Designer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <div className="flex min-h-screen flex-col bg-white text-slate-800 relative">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <BackToTop />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
