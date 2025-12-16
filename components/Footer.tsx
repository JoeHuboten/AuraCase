import Link from 'next/link';
import { FiTwitter, FiFacebook, FiInstagram, FiGithub, FiMail, FiArrowRight } from 'react-icons/fi';
import { SiVisa, SiMastercard, SiPaypal, SiApplepay, SiGooglepay } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-light via-primary to-background pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Newsletter Section */}
      <div className="relative container-custom py-12">
        <div className="bg-gradient-to-br from-accent/10 via-primary-light/50 to-primary/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/5 shadow-2xl shadow-accent/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Получавайте новини</h3>
              <p className="text-text-secondary">Бъдете първите, които научават за нови продукти и оферти</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <div className="relative flex-1 md:w-72">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input 
                  type="email" 
                  placeholder="Вашият имейл" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/30 transition-all duration-300"
                />
              </div>
              <button className="btn-primary flex items-center gap-2 whitespace-nowrap">
                Абониране <FiArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block text-2xl font-bold mb-6 group">
              <span className="bg-gradient-to-r from-white via-white to-accent-light bg-clip-text text-transparent group-hover:from-accent-light group-hover:to-accent transition-all duration-300">AURA</span>
              <span className="text-accent group-hover:text-accent-light transition-colors duration-300">CASE</span>
            </Link>
            <p className="text-text-secondary text-sm mb-8 leading-relaxed">
              Имаме премиум мобилни аксесоари, които отговарят на вашия стил и с които се гордеете да използвате. От калъфи до power bank-ове.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 hover:border-accent/30 transition-all duration-300">
                <FiTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 hover:border-accent/30 transition-all duration-300">
                <FiFacebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 hover:border-accent/30 transition-all duration-300">
                <FiInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 hover:border-accent/30 transition-all duration-300">
                <FiGithub size={18} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm tracking-wider uppercase">Компания</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>За нас</Link></li>
              <li><Link href="/features" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>Функции</Link></li>
              <li><Link href="/works" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>Как работи</Link></li>
              <li><Link href="/career" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>Кариера</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm tracking-wider uppercase">Помощ</h3>
            <ul className="space-y-4">
              <li><Link href="/support" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>Клиентска поддръжка</Link></li>
              <li><Link href="/delivery" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>Детайли за доставка</Link></li>
              <li><Link href="/terms" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>Условия за ползване</Link></li>
              <li><Link href="/privacy" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>Политика за поверителност</Link></li>
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm tracking-wider uppercase">ЧЗВ</h3>
            <ul className="space-y-4">
              <li><Link href="/account" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>Акаунт</Link></li>
              <li><Link href="/deliveries" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>Управление на доставки</Link></li>
              <li><Link href="/orders" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>Поръчки</Link></li>
              <li><Link href="/payments" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>Плащания</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-text-secondary/70 text-sm">
            © 2025 AuraCase. Всички права запазени.
          </p>
          <div className="flex items-center gap-4">
            <SiVisa className="text-text-secondary/50 hover:text-white/80 transition-colors duration-300 text-2xl" />
            <SiMastercard className="text-text-secondary/50 hover:text-white/80 transition-colors duration-300 text-2xl" />
            <SiPaypal className="text-text-secondary/50 hover:text-white/80 transition-colors duration-300 text-2xl" />
            <SiApplepay className="text-text-secondary/50 hover:text-white/80 transition-colors duration-300 text-2xl" />
            <SiGooglepay className="text-text-secondary/50 hover:text-white/80 transition-colors duration-300 text-2xl" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

