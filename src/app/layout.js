import { Inter, Outfit } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import PageTransition from "@/components/PageTransition/PageTransition";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "PACKnPLAN — AI-Powered Travel Planning Platform",
  description:
    "Plan your dream trip with AI-powered suggestions, smart budgets, real-time weather, transport booking, and group collaboration. Your all-in-one travel companion.",
  keywords: "travel planning, AI travel, budget planner, trip planner, group travel, weather alerts",
  openGraph: {
    title: "PACKnPLAN — Plan. Pack. Explore.",
    description: "Your all-in-one AI-powered travel companion.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <PageTransition>
              {children}
            </PageTransition>
            <ScrollToTop />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
