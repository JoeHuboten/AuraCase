'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScrollAnimationLazy as ScrollAnimation, StaggerAnimationLazy as StaggerAnimation } from '@/components/ScrollAnimationLazy';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Защитете', 'Изразете', 'Впечатлете'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section - Immersive Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Dynamic cursor glow */}
        <div 
          className="pointer-events-none fixed w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] transition-all duration-300 ease-out z-0"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
            left: mousePosition.x - 250,
            top: mousePosition.y - 250,
          }}
        />

        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 blur-[80px] animate-float" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-[100px] animate-float" style={{ animationDelay: '-2s' }} />
          <div className="absolute top-[50%] left-[50%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-accent/10 to-purple-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[15%] right-[20%] w-20 h-20 border border-white/10 rounded-2xl rotate-45 animate-float" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-[25%] left-[15%] w-32 h-32 border border-accent/20 rounded-full animate-float" style={{ animationDuration: '8s', animationDelay: '-3s' }} />
          <div className="absolute top-[60%] right-[25%] w-16 h-16 bg-gradient-to-br from-accent/20 to-transparent rounded-xl rotate-12 animate-float" style={{ animationDuration: '7s', animationDelay: '-1s' }} />
          <div className="absolute top-[30%] left-[25%] w-24 h-24 border-2 border-purple-500/10 rounded-3xl -rotate-12 animate-float" style={{ animationDuration: '9s', animationDelay: '-4s' }} />
        </div>

        <div className="relative z-10 container-custom">
          <div className="max-w-6xl mx-auto">
            {/* Overline */}
            <ScrollAnimation animation="fadeIn">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
                <span className="text-accent text-sm font-medium tracking-[0.3em] uppercase">Премиум аксесоари</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent" />
              </div>
            </ScrollAnimation>

            {/* Main Hero Content */}
            <div className="text-center">
              <ScrollAnimation animation="slideUp">
                {/* Animated word */}
                <div className="relative h-[1.2em] mb-4 overflow-hidden">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight">
                    {words.map((word, index) => (
                      <span
                        key={word}
                        className={`absolute inset-0 transition-all duration-700 ${
                          index === currentWord 
                            ? 'opacity-100 translate-y-0' 
                            : index < currentWord 
                              ? 'opacity-0 -translate-y-full' 
                              : 'opacity-0 translate-y-full'
                        } bg-gradient-to-r from-white via-accent to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient`}
                      >
                        {word}.
                      </span>
                    ))}
                  </h1>
                </div>

                {/* Subtitle with unique styling */}
                <p className="text-xl md:text-2xl lg:text-3xl text-white/60 font-light max-w-3xl mx-auto mb-12 leading-relaxed">
                  Вашето устройство заслужава 
                  <span className="text-white font-medium"> нещо специално</span>
                </p>
              </ScrollAnimation>

              {/* CTA Group */}
              <ScrollAnimation animation="fadeIn" className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
                <Link
                  href="/shop"
                  className="group relative px-10 py-5 bg-white text-primary font-bold text-lg rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Разгледай колекцията
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                
                <Link
                  href="/about"
                  className="group flex items-center gap-3 text-white/70 hover:text-white transition-colors font-medium"
                >
                  <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 group-hover:bg-white/5 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Научи повече
                </Link>
              </ScrollAnimation>

              {/* Stats Row - Minimal */}
              <ScrollAnimation animation="fadeIn">
                <div className="flex flex-wrap justify-center gap-12 md:gap-20 text-center">
                  {[
                    { value: '2K+', label: 'Продукти' },
                    { value: '30K+', label: 'Клиенти' },
                    { value: '4.9', label: 'Рейтинг' },
                  ].map((stat, i) => (
                    <div key={i} className="group">
                      <div className="text-4xl md:text-5xl font-bold text-white mb-1 group-hover:text-accent transition-colors">{stat.value}</div>
                      <div className="text-white/40 text-sm tracking-wide">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-white/30">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-8 border-y border-white/5 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-8">
              {['ЗАЩИТА', 'СТИЛ', 'КАЧЕСТВО', 'ИНОВАЦИЯ', 'ДИЗАЙН', 'КОМФОРТ'].map((word, j) => (
                <span key={j} className="flex items-center gap-8">
                  <span className="text-2xl md:text-3xl font-bold text-white/10 hover:text-white/30 transition-colors cursor-default">{word}</span>
                  <span className="text-accent/30">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-32 relative">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <div className="max-w-xl mb-20">
              <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">Защо ние?</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Качество в<br />
                <span className="text-white/30">всеки детайл</span>
              </h2>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large Feature Card */}
            <ScrollAnimation animation="slideUp" className="md:col-span-2 lg:col-span-2 row-span-2">
              <div className="group relative h-full min-h-[400px] bg-gradient-to-br from-accent/20 via-primary-light to-primary-light rounded-[2rem] p-10 overflow-hidden border border-white/5 hover:border-accent/30 transition-all duration-500">
                <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-full opacity-50" />
                <div className="absolute bottom-0 left-0 text-[15rem] leading-none font-black text-white/[0.03] select-none">01</div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                      <span className="text-3xl">🛡️</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Военен стандарт защита</h3>
                    <p className="text-white/50 text-lg max-w-md">
                      Всеки наш продукт е тестван при екстремни условия. Издържат падане от 3 метра без повреда.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-8">
                    <div className="flex -space-x-3">
                      {['🔵', '🟣', '🟢'].map((emoji, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-primary-light border-2 border-primary flex items-center justify-center text-lg">{emoji}</div>
                      ))}
                    </div>
                    <span className="text-white/40 text-sm">10,000+ защитени устройства</span>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Smaller Feature Cards */}
            {[
              { icon: '✨', title: 'Премиум материали', desc: 'Силикон, карбон, естествена кожа', num: '02' },
              { icon: '🎨', title: 'Уникален дизайн', desc: '500+ модела за всеки вкус', num: '03' },
              { icon: '🚀', title: 'Бърза доставка', desc: '1-3 работни дни до вратата', num: '04' },
              { icon: '💯', title: '30 дни гаранция', desc: 'Пълно възстановяване', num: '05' },
            ].map((feature, i) => (
              <ScrollAnimation key={i} animation="slideUp" delay={i * 100}>
                <div className="group relative h-full min-h-[200px] bg-gradient-to-br from-white/[0.05] to-transparent rounded-[2rem] p-8 border border-white/5 hover:border-white/20 hover:bg-white/[0.08] transition-all duration-500">
                  <div className="absolute top-4 right-4 text-5xl font-black text-white/[0.03]">{feature.num}</div>
                  <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/40">{feature.desc}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Compatibility - Horizontal Scroll Effect */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-primary z-10 pointer-events-none" />
        <div className="container-custom relative z-20 mb-12">
          <p className="text-center text-white/30 text-sm tracking-widest uppercase">Съвместими с всички марки</p>
        </div>
        <div className="flex gap-16 animate-scroll-x">
          {[...Array(3)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-16 shrink-0">
              {['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Google', 'OnePlus', 'Sony', 'LG'].map((brand) => (
                <span key={brand} className="text-4xl md:text-5xl font-bold text-white/[0.07] hover:text-white/20 transition-colors whitespace-nowrap cursor-default">
                  {brand}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials - Card Stack */}
      <section className="py-32 relative">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollAnimation animation="slideRight">
              <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">Отзиви</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Доверени от<br />
                <span className="text-white/30">хиляди клиенти</span>
              </h2>
              <p className="text-white/50 text-lg mb-8 max-w-md">
                Присъединете се към 30,000+ доволни клиенти, които вече защитават устройствата си с нашите продукти.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {['М', 'Г', 'Е', 'И'].map((letter, i) => (
                    <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white font-bold border-2 border-primary">
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-400 mb-1">
                    {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="text-white/40 text-sm">4.9 от 2,000+ отзива</span>
                </div>
              </div>
            </ScrollAnimation>

            <StaggerAnimation animation="slideUp" stagger={0.15} className="space-y-6">
              {[
                { name: 'Мария И.', text: 'Калъфът е невероятен! Изглежда много по-скъп отколкото е.', device: 'iPhone 15 Pro' },
                { name: 'Георги П.', text: 'Доставката беше супер бърза. Вече поръчах и за жена ми.', device: 'Samsung S24' },
                { name: 'Елена К.', text: 'Третата ми поръчка. Винаги съм доволна!', device: 'Xiaomi 14' },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="group relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-accent/30 transition-all duration-300 hover:translate-x-2"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/50 to-purple-600/50 flex items-center justify-center text-white font-bold shrink-0">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="text-white/80 mb-3">&ldquo;{testimonial.text}&rdquo;</p>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{testimonial.name}</span>
                        <span className="text-white/30 text-sm">{testimonial.device}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </StaggerAnimation>
          </div>
        </div>
      </section>

      {/* Final CTA - Full Width */}
      <section className="relative py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-purple-600/20 to-primary" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent/30 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[120px]" />
        </div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="container-custom relative z-10">
          <ScrollAnimation animation="fadeIn">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
                Готови за<br />
                <span className="bg-gradient-to-r from-white via-accent to-cyan-400 bg-clip-text text-transparent">следващото ниво?</span>
              </h2>
              <p className="text-white/60 text-xl mb-12 max-w-2xl mx-auto">
                Открийте перфектния аксесоар за вашето устройство. Над 2000 продукта ви очакват.
              </p>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-4 px-12 py-6 bg-white rounded-full text-primary font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
              >
                Започни пазаруването
                <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:bg-accent transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}

