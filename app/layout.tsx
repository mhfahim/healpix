import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { ProtoBar } from "@/components/shell/proto-bar";
import { ThemeProvider, themeScript } from "@/components/shell/theme";

const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});

// Prototype screens read ?state= and ?lang= — render on request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Helpix Prototype",
  description: "Helpix: we show hospitals the revenue walking out their door, and bring it back.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${bengali.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <ToastProvider>
            {children}
            <ProtoBar />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
