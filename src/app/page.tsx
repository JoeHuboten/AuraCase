import Link from 'next/link'
import MagicBento from '@/components/MagicBento'
import dynamic from 'next/dynamic'

const LiquidEther = dynamic(() => import('@/components/LiquidEther'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-dark-600/80 via-dark-500/60 to-dark-400/40" />
})

export default function Home() {
  return (
    <div className="bg-dark-500 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-dark-600 py-32 overflow-hidden">
        {/* Animated Background - Only in Hero */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-dark-600/80 via-dark-500/60 to-dark-400/40">
          <LiquidEther
            colors={['#22d3ee', '#06b6d4', '#0891b2']}
            mouseForce={25}
            cursorSize={120}
            isViscous={false}
            viscous={20}
            iterationsViscous={16}
            iterationsPoisson={16}
            resolution={0.4}
            isBounce={false}
            autoDemo={true}
            autoSpeed={1.2}
            autoIntensity={2.5}
            takeoverDuration={0.15}
            autoResumeDelay={1000}
            autoRampDuration={0.5}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <p className="text-gray-400 text-sm mb-4">Премиум.Аксесоари.</p>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gray-100">
                AuraCase <span className="font-extrabold">Pro</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Премиум аксесоари за вашите устройства. Качеството среща стила във всеки продукт.
              </p>
              <Link
                href="/products"
                className="inline-block border-2 border-gray-100 text-gray-100 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 hover:text-dark-900 transition"
              >
                Пазарувай сега
              </Link>
            </div>

            {/* Right Content - Product Showcase */}
            <div className="relative">
              <div className="relative w-full h-[600px] flex items-center justify-center">
                {/* Product Mockup */}
                <div className="relative w-80 h-[600px] bg-gradient-to-br from-primary-600 to-primary-900 rounded-[3rem] p-2 shadow-2xl">
                  {/* Screen */}
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-cyan-500 rounded-[2.5rem] flex flex-col items-center justify-center text-white">
                    <div className="text-center">
                      <p className="text-lg font-medium">AuraCase</p>
                      <p className="text-4xl font-light">Премиум</p>
                    </div>
                  </div>
                  
                  {/* Brand Badge */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AURACASE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Products Section */}
      <section className="py-20 bg-dark-400 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-100 mb-4">
              Нашите <span className="text-gradient">Продукти</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Открийте нашата колекция от премиум аксесоари, проектирани за най-доброто изживяване
            </p>
          </div>
          
          <MagicBento
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            clickEffect={true}
            enableMagnetism={true}
            glowColor="34, 211, 238"
            particleCount={8}
            spotlightRadius={250}
          />
        </div>
      </section>
    </div>
  )
}

