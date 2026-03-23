import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BackToTop from "@/components/back-to-top";
import Providers from "@/components/providers";
import PageLoader from "@/components/page-loader";
import { MusicPlayerButton } from "@/components/music-player-button";
import { getProfile } from "@/app/actions/profile";

const font = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "M Iqbal Firmansyah | Portfolio",
  description: "Clean, minimal, and professional portfolio of M Iqbal Firmansyah - Web Developer & UI Designer.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <PageLoader />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <div className="flex min-h-screen flex-col relative text-primary">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <BackToTop />
              <MusicPlayerButton />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
