import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AURACASE - Премиум мобилни аксесоари | Защитни калъфи, безжично зареждане, слушалки",
    template: "%s | AURACASE"
  },
  description: "Открийте премиум мобилни аксесоари за всички устройства. Защитни калъфи, безжично зареждане, слушалки, power bank-ове и много повече. Безплатна доставка над 50 лв.",
  keywords: [
    "мобилни аксесоари",
    "защитни калъфи",
    "безжично зареждане",
    "слушалки",
    "power bank",
    "iPhone аксесоари",
    "Samsung аксесоари",
    "премиум качество",
    "AURACASE",
    "мобилни калъфи",
    "защитни стъкла",
    "безжични слушалки",
    "зарядни устройства",
    "USB кабели",
    "адаптери"
  ],
  authors: [{ name: "AURACASE" }],
  creator: "AURACASE",
  publisher: "AURACASE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://auracase.bg'),
  alternates: {
    canonical: '/',
    languages: {
      'bg-BG': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'bg_BG',
    url: 'https://auracase.bg',
    siteName: 'AURACASE',
    title: 'AURACASE - Премиум мобилни аксесоари',
    description: 'Открийте премиум мобилни аксесоари за всички устройства. Защитни калъфи, безжично зареждане, слушалки, power bank-ове и много повече.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AURACASE - Премиум мобилни аксесоари',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@auracase',
    creator: '@auracase',
    title: 'AURACASE - Премиум мобилни аксесоари',
    description: 'Открийте премиум мобилни аксесоари за всички устройства. Защитни калъфи, безжично зареждане, слушалки, power bank-ове и много повече.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#1f2937',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "AURACASE",
              "description": "Премиум мобилни аксесоари за всички устройства",
              "url": "https://auracase.bg",
              "logo": "https://auracase.bg/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+359888123456",
                "contactType": "customer service",
                "email": "support@auracase.bg",
                "availableLanguage": "Bulgarian"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "BG",
                "addressLocality": "София"
              },
              "sameAs": [
                "https://facebook.com/auracase",
                "https://instagram.com/auracase",
                "https://twitter.com/auracase"
              ],
              "foundingDate": "2020",
              "founder": {
                "@type": "Person",
                "name": "AURACASE Team"
              }
            })
          }}
        />
               <AccessibilityProvider>
                 <LanguageProvider>
                   <AuthProvider>
                     <a href="#main-content" className="skip-to-main">Skip to main content</a>
                     <Header />
                     <main id="main-content">
                       {children}
                     </main>
                    <Footer />
                    <AccessibilityPanel />
                    <KeyboardShortcuts />
                    <PWAInstallPrompt />
                    <ServiceWorkerRegistration />
                   </AuthProvider>
                 </LanguageProvider>
               </AccessibilityProvider>
             </body>
    </html>
  );
}

