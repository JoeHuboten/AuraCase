import { getCategories, getFeaturedProducts, getTopSelling } from '@/lib/database';
import HomePage from '@/components/HomePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AURACASE - Премиум мобилни аксесоари | Защитни калъфи, безжично зареждане, слушалки",
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
    "адаптери",
    "онлайн магазин",
    "доставка"
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
    title: "AURACASE - Премиум мобилни аксесоари",
    description: "Открийте премиум мобилни аксесоари за всички устройства. Защитни калъфи, безжично зареждане, слушалки, power bank-ове и много повече.",
    url: "https://auracase.bg",
    siteName: "AURACASE",
    images: [
      {
        url: "/og-homepage.jpg",
        width: 1200,
        height: 630,
        alt: "AURACASE - Премиум мобилни аксесоари",
      },
    ],
    locale: "bg_BG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURACASE - Премиум мобилни аксесоари",
    description: "Открийте премиум мобилни аксесоари за всички устройства. Защитни калъфи, безжично зареждане, слушалки, power bank-ове и много повече.",
    images: ["/og-homepage.jpg"],
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
};

export default async function Home() {
  try {
    const [categories, featuredProducts, topSelling] = await Promise.all([
      getCategories(),
      getFeaturedProducts(4),
      getTopSelling(4)
    ]);

    console.log('Home page data:', { categories: categories?.length, featuredProducts: featuredProducts?.length, topSelling: topSelling?.length });

    const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AURACASE",
    "description": "Премиум мобилни аксесоари за всички устройства",
    "url": "https://auracase.bg",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://auracase.bg/shop?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Премиум мобилни аксесоари",
      "description": "Най-добрите мобилни аксесоари за всички устройства",
      "numberOfItems": topSelling.length,
      "itemListElement": topSelling.map((product, index) => ({
        "@type": "Product",
        "position": index + 1,
        "name": product.name,
        "description": product.description,
        "image": product.image,
        "url": `https://auracase.bg/product/${product.slug}`,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "BGN",
          "availability": "https://schema.org/InStock"
        }
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePage 
        categories={categories}
        featuredProducts={featuredProducts}
        topSelling={topSelling}
      />
    </>
  );
  } catch (error) {
    console.error('Error loading home page data:', error);
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading page</h1>
          <p className="text-text-secondary">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
}