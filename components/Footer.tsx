import Link from 'next/link';
import { FiTwitter, FiFacebook, FiInstagram, FiGithub } from 'react-icons/fi';
import { SiVisa, SiMastercard, SiPaypal, SiApplepay, SiGooglepay } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="bg-primary-light mt-20">
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white mb-4 block">
              AURACASE
            </Link>
            <p className="text-text-secondary text-sm mb-6">
              Имаме премиум мобилни аксесоари, които отговарят на вашия стил и с които се гордеете да използвате. От калъфи до power bank-ове.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent transition">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent transition">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent transition">
                <FiGithub size={20} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">КОМПАНИЯ</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-text-secondary hover:text-white transition">За нас</Link></li>
              <li><Link href="/features" className="text-text-secondary hover:text-white transition">Функции</Link></li>
              <li><Link href="/works" className="text-text-secondary hover:text-white transition">Как работи</Link></li>
              <li><Link href="/career" className="text-text-secondary hover:text-white transition">Кариера</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-semibold mb-4">ПОМОЩ</h3>
            <ul className="space-y-3">
              <li><Link href="/support" className="text-text-secondary hover:text-white transition">Клиентска поддръжка</Link></li>
              <li><Link href="/delivery" className="text-text-secondary hover:text-white transition">Детайли за доставка</Link></li>
              <li><Link href="/terms" className="text-text-secondary hover:text-white transition">Условия за ползване</Link></li>
              <li><Link href="/privacy" className="text-text-secondary hover:text-white transition">Политика за поверителност</Link></li>
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="text-white font-semibold mb-4">ЧЗВ</h3>
            <ul className="space-y-3">
              <li><Link href="/account" className="text-text-secondary hover:text-white transition">Акаунт</Link></li>
              <li><Link href="/deliveries" className="text-text-secondary hover:text-white transition">Управление на доставки</Link></li>
              <li><Link href="/orders" className="text-text-secondary hover:text-white transition">Поръчки</Link></li>
              <li><Link href="/payments" className="text-text-secondary hover:text-white transition">Плащания</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">
            AuraCase © 2000-2025, Всички права запазени
          </p>
          <div className="flex items-center space-x-3">
            <SiVisa className="text-white text-3xl" />
            <SiMastercard className="text-white text-3xl" />
            <SiPaypal className="text-white text-3xl" />
            <SiApplepay className="text-white text-3xl" />
            <SiGooglepay className="text-white text-3xl" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

