'use client';

import { FiShield, FiZap, FiSmartphone, FiHeadphones, FiBattery, FiWifi } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import Head from 'next/head';

export default function FeaturesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Функции на AURACASE - Премиум мобилни аксесоари",
    "description": "Открийте защо нашите премиум мобилни аксесоари са изборът на хиляди клиенти. Максимална защита, бързо зареждане, универсална съвместимост и много повече.",
    "url": "https://auracase.bg/features",
    "mainEntity": {
      "@type": "Organization",
      "name": "AURACASE",
      "description": "Премиум мобилни аксесоари за всички устройства",
      "url": "https://auracase.bg",
      "logo": "https://auracase.bg/logo.png",
      "sameAs": [
        "https://facebook.com/auracase",
        "https://instagram.com/auracase",
        "https://twitter.com/auracase"
      ]
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Начало",
          "item": "https://auracase.bg"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Функции",
          "item": "https://auracase.bg/features"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <title>Функции на AURACASE - Премиум мобилни аксесоари | Максимална защита и бързо зареждане</title>
        <meta name="description" content="Открийте защо нашите премиум мобилни аксесоари са изборът на хиляди клиенти. Максимална защита, бързо зареждане, универсална съвместимост, премиум звук, дълготрайна батерия и безжична технология." />
        <meta name="keywords" content="мобилни аксесоари, защитни калъфи, безжично зареждане, слушалки, power bank, iPhone аксесоари, Samsung аксесоари, премиум качество, AURACASE" />
        <meta name="author" content="AURACASE" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="bg" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://auracase.bg/features" />
        <meta property="og:title" content="Функции на AURACASE - Премиум мобилни аксесоари" />
        <meta property="og:description" content="Открийте защо нашите премиум мобилни аксесоари са изборът на хиляди клиенти. Максимална защита, бързо зареждане, универсална съвместимост и много повече." />
        <meta property="og:image" content="https://auracase.bg/og-features.jpg" />
        <meta property="og:site_name" content="AURACASE" />
        <meta property="og:locale" content="bg_BG" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://auracase.bg/features" />
        <meta property="twitter:title" content="Функции на AURACASE - Премиум мобилни аксесоари" />
        <meta property="twitter:description" content="Открийте защо нашите премиум мобилни аксесоари са изборът на хиляди клиенти. Максимална защита, бързо зареждане, универсална съвместимост и много повече." />
        <meta property="twitter:image" content="https://auracase.bg/og-features.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://auracase.bg/features" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      
      <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-700 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">Функции на AURACASE</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Открийте защо нашите премиум мобилни аксесоари са изборът на хиляди клиенти по целия свят.
            </p>
          </ScrollAnimation>
        </div>
      </header>

      {/* Main Features */}
      <main className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Основни функции</h2>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.2} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiShield className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Максимална защита</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                Нашите калъфи и защитни стъкла осигуряват военен стандарт защита срещу падания, 
                драскотини и ежедневно износване, като същевременно запазват елегантния дизайн.
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiZap className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Бързо зареждане</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                Безжичните заряди и power bank-овете ни поддържат най-новите стандарти за бързо зареждане, 
                включително Qi, MagSafe и USB-C Power Delivery.
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiSmartphone className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Универсална съвместимост</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                Поддържаме всички основни марки и модели устройства - iPhone, Samsung, Google Pixel, 
                OnePlus и много други, с точни размери и перфектно прилягане.
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiHeadphones className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Премиум звук</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                Нашите слушалки и безжични зарядни станции осигуряват кристално чист звук и 
                безпроблемно зареждане с най-високо качество на звука.
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiBattery className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Дълготрайна батерия</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                Power bank-овете ни имат висококачествени литиево-йонни батерии с дълъг живот, 
                интелигентни защитни схеми и LED индикатори за нивото на заряд.
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiWifi className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Безжична технология</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                Всички наши безжични продукти използват най-новите Bluetooth и Qi стандарти за 
                стабилна връзка и ефективно зареждане без кабели.
              </p>
            </div>
          </StaggerAnimation>
        </div>
      </main>

      {/* Technology Section */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="slideRight">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">Най-новите технологии</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Магнитен MagSafe дизайн</h3>
                      <p className="text-gray-300">
                        Перфектно прилягане с магнитни прикрепки за стабилно зареждане и аксесоари.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Активна защита</h3>
                      <p className="text-gray-300">
                        Интелигентни сензори и защитни материали, които се адаптират към различни условия.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Екологично производство</h3>
                      <p className="text-gray-300">
                        Използваме рециклирани материали и екологично чисти процеси в производството.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slideLeft">
              <div className="bg-primary rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔬</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Лабораторно тестване</h3>
                  <p className="text-gray-300 mb-6">
                    Всеки продукт преминава през строги тестове за издръжливост, безопасност и производителност.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-accent">1000+</div>
                      <div className="text-sm text-gray-300">Тестови цикли</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">24/7</div>
                      <div className="text-sm text-gray-300">Мониторинг</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Стандарти за качество</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-accent rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">CE</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">CE сертификация</h3>
              <p className="text-gray-300 text-sm">
                Съответствие с европейските стандарти за безопасност
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">FCC</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">FCC одобрение</h3>
              <p className="text-gray-300 text-sm">
                Съответствие с американските стандарти за радиовълни
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">IP</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">IP68 защита</h3>
              <p className="text-gray-300 text-sm">
                Пълна защита срещу прах и вода
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">ISO</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ISO 9001</h3>
              <p className="text-gray-300 text-sm">
                Международен стандарт за управление на качеството
              </p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
