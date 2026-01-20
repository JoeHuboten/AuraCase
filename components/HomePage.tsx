'use client';

import Link from 'next/link';
import { ScrollAnimationLazy as ScrollAnimation, StaggerAnimationLazy as StaggerAnimation } from '@/components/ScrollAnimationLazy';
import { useLanguage } from '@/contexts/LanguageContext';
import { CountUp } from '@/components/InteractiveElements';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-accent/40 via-blue-600/20 to-transparent rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-tl from-purple-600/30 via-accent/15 to-transparent rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        
        <div className="relative container-custom py-20">
          <div className="max-w-5xl mx-auto text-center">
            <ScrollAnimation animation="fadeIn">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/30 mb-10 backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                </span>
                <span className="text-accent text-sm font-semibold tracking-wide">Премиум аксесоари за вашето устройство</span>
              </div>
              
              {/* Main headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-8 leading-[1.05] tracking-tight">
                Защитете.
                <br />
                <span className="bg-gradient-to-r from-accent via-blue-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  Изразете се.
                </span>
                <br />
                Впечатлете.
              </h1>
              
              <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
                Открийте перфектните аксесоари, които съчетават стил, защита и функционалност за вашето устройство.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
                <Link
                  href="/shop"
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-accent to-blue-600 rounded-2xl text-white font-bold text-lg shadow-2xl shadow-accent/30 hover:shadow-accent/50 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative">Разгледай магазина</span>
                  <svg className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl text-white font-bold text-lg border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                >
                  Научи повече
                </Link>
              </div>
            </ScrollAnimation>
            
            {/* Stats */}
            <StaggerAnimation animation="fadeIn" stagger={0.15} className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {[
                { value: 200, suffix: '+', label: 'Марки', icon: '🏷️' },
                { value: 2000, suffix: '+', label: 'Продукти', icon: '📦' },
                { value: 30000, suffix: '+', label: 'Доволни клиенти', icon: '😊' },
                { value: 49, suffix: '/5', label: 'Среден рейтинг', icon: '⭐' },
              ].map((stat, i) => (
                <div key={i} className="group">
                  <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-accent/30 transition-all duration-500">
                    <div className="text-3xl mb-3">{stat.icon}</div>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                      <CountUp end={stat.value} duration={2500} suffix={stat.suffix} />
                    </div>
                    <p className="text-text-secondary text-sm">{stat.label}</p>
                  </div>
                </div>
              ))}
            </StaggerAnimation>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.03] to-transparent" />
        
        <div className="container-custom relative">
          <ScrollAnimation animation="fadeIn">
            <div className="text-center mb-20">
              <span className="inline-block px-5 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold tracking-wide mb-6">
                Защо AuraCase?
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Качество, на което
                <br />
                <span className="text-accent">можете да разчитате</span>
              </h2>
              <p className="text-text-secondary text-xl max-w-2xl mx-auto">
                Ние вярваме, че всяко устройство заслужава най-доброто. Затова предлагаме само премиум аксесоари.
              </p>
            </div>
          </ScrollAnimation>

          <StaggerAnimation animation="slideUp" stagger={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🛡️',
                title: 'Максимална защита',
                description: 'Военен стандарт на защита за вашето устройство. Тествани при падане от 3 метра.',
                gradient: 'from-blue-500/20 to-cyan-500/20',
              },
              {
                icon: '✨',
                title: 'Премиум материали',
                description: 'Използваме само най-качествените материали - от силикон до карбон и естествена кожа.',
                gradient: 'from-purple-500/20 to-pink-500/20',
              },
              {
                icon: '🎨',
                title: 'Уникален дизайн',
                description: 'Стотици дизайни за всеки вкус. Намерете този, който изразява вашата индивидуалност.',
                gradient: 'from-orange-500/20 to-red-500/20',
              },
              {
                icon: '🚀',
                title: 'Бърза доставка',
                description: 'Безплатна доставка за поръчки над 50лв. Получавате за 1-3 работни дни.',
                gradient: 'from-green-500/20 to-emerald-500/20',
              },
              {
                icon: '💯',
                title: '100% Гаранция',
                description: '30 дни право на връщане без въпроси. Вашето удовлетворение е наш приоритет.',
                gradient: 'from-yellow-500/20 to-orange-500/20',
              },
              {
                icon: '💬',
                title: '24/7 Поддръжка',
                description: 'Нашият екип е винаги на линия да ви помогне с всякакви въпроси.',
                gradient: 'from-cyan-500/20 to-blue-500/20',
              },
            ].map((feature, i) => (
              <div key={i} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </StaggerAnimation>
        </div>
      </section>

      {/* Brands Banner */}
      <section className="py-20 border-y border-white/5">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <p className="text-center text-text-secondary text-sm uppercase tracking-widest mb-10">Съвместими с всички популярни марки</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
              {['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Google', 'OnePlus'].map((brand) => (
                <span key={brand} className="text-2xl md:text-3xl font-bold text-white/50 hover:text-white/80 transition-colors cursor-default">
                  {brand}
                </span>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] -translate-y-1/2" />
        
        <div className="container-custom relative">
          <ScrollAnimation animation="fadeIn">
            <div className="text-center mb-16">
              <span className="inline-block px-5 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold tracking-wide mb-6">
                Отзиви
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Какво казват нашите
                <br />
                <span className="text-accent">клиенти</span>
              </h2>
            </div>
          </ScrollAnimation>

          <StaggerAnimation animation="slideUp" stagger={0.15} className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Мария И.',
                role: 'iPhone потребител',
                text: 'Калъфът е невероятен! Перфектно пасва и изглежда много по-скъп отколкото е. Препоръчвам!',
                rating: 5,
              },
              {
                name: 'Георги П.',
                role: 'Samsung потребител',
                text: 'Доставката беше супер бърза, а качеството надмина очакванията ми. Вече поръчах и за жена ми.',
                rating: 5,
              },
              {
                name: 'Елена К.',
                role: 'Xiaomi потребител',
                text: 'Третата ми поръчка от AuraCase. Винаги съм доволна от качеството и обслужването.',
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <span key={j} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-white/90 text-lg mb-6 leading-relaxed">&quot;{testimonial.text}&quot;</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-text-secondary text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </StaggerAnimation>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-blue-600/10 to-purple-600/20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="container-custom relative">
          <ScrollAnimation animation="fadeIn">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
                Готови ли сте да намерите
                <br />
                <span className="bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">перфектния аксесоар?</span>
              </h2>
              <p className="text-text-secondary text-xl mb-12 max-w-2xl mx-auto">
                Разгледайте нашата колекция от над 2000 продукта и намерете този, който е създаден специално за вас.
              </p>
              <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center gap-3 px-12 py-6 bg-white rounded-2xl text-primary font-bold text-xl shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative">Започни пазаруването</span>
                <svg className="w-6 h-6 relative group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}

