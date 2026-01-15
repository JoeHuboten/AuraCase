'use client';

import Link from 'next/link';
import { memo } from 'react';
import { FiTwitter, FiFacebook, FiInstagram, FiGithub } from 'react-icons/fi';
import { SiVisa, SiMastercard, SiPaypal, SiApplepay, SiGooglepay } from 'react-icons/si';
import NewsletterForm from './NewsletterForm';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = memo(function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-light via-primary to-background pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Newsletter Section */}
      <div className="relative container-custom py-8 sm:py-12">
        <div className="bg-gradient-to-br from-accent/10 via-primary-light/50 to-primary/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/5 shadow-2xl shadow-accent/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{t('footer.newsletter.title')}</h3>
              <p className="text-text-secondary text-sm sm:text-base">{t('footer.newsletter.description')}</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative container-custom py-10 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block text-xl sm:text-2xl font-bold mb-4 sm:mb-6 group">
              <span className="bg-gradient-to-r from-white via-white to-accent-light bg-clip-text text-transparent group-hover:from-accent-light group-hover:to-accent transition-all duration-300">AURA</span>
              <span className="text-accent group-hover:text-accent-light transition-colors duration-300">CASE</span>
            </Link>
            <p className="text-text-secondary text-sm mb-6 sm:mb-8 leading-relaxed">
              {t('footer.brand.description')}
            </p>
            <div className="flex space-x-2 sm:space-x-3">
              <a href="#" aria-label={t('footer.followTwitter')} className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 hover:border-accent/30 transition-all duration-300">
                <FiTwitter size={18} />
              </a>
              <a href="#" aria-label={t('footer.followFacebook')} className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 hover:border-accent/30 transition-all duration-300">
                <FiFacebook size={18} />
              </a>
              <a href="#" aria-label={t('footer.followInstagram')} className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 hover:border-accent/30 transition-all duration-300">
                <FiInstagram size={18} />
              </a>
              <a href="#" aria-label={t('footer.viewGithub')} className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 hover:border-accent/30 transition-all duration-300">
                <FiGithub size={18} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm tracking-wider uppercase">{t('footer.company')}</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>{t('footer.about')}</Link></li>
              <li><Link href="/features" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>{t('footer.features')}</Link></li>
              <li><Link href="/works" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>{t('footer.howItWorks')}</Link></li>
              <li><Link href="/career" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>{t('footer.career')}</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm tracking-wider uppercase">{t('footer.help')}</h3>
            <ul className="space-y-4">
              <li><Link href="/support" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>{t('footer.customerSupport')}</Link></li>
              <li><Link href="/delivery" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>{t('footer.deliveryDetails')}</Link></li>
              <li><Link href="/terms" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>{t('footer.terms')}</Link></li>
              <li><Link href="/privacy" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>{t('footer.privacyPolicy')}</Link></li>
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm tracking-wider uppercase">{t('footer.faq')}</h3>
            <ul className="space-y-4">
              <li><Link href="/account" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>{t('footer.account')}</Link></li>
              <li><Link href="/deliveries" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>{t('footer.manageDeliveries')}</Link></li>
              <li><Link href="/orders" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>{t('footer.orders')}</Link></li>
              <li><Link href="/payments" className="text-text-secondary hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300"></span>{t('footer.payments')}</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 mt-10 sm:mt-16 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <p className="text-text-secondary/70 text-xs sm:text-sm text-center sm:text-left">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <SiVisa className="text-text-secondary/50 hover:text-white/80 transition-colors duration-300 text-xl sm:text-2xl" />
            <SiMastercard className="text-text-secondary/50 hover:text-white/80 transition-colors duration-300 text-xl sm:text-2xl" />
            <SiPaypal className="text-text-secondary/50 hover:text-white/80 transition-colors duration-300 text-xl sm:text-2xl" />
            <SiApplepay className="text-text-secondary/50 hover:text-white/80 transition-colors duration-300 text-xl sm:text-2xl" />
            <SiGooglepay className="text-text-secondary/50 hover:text-white/80 transition-colors duration-300 text-xl sm:text-2xl" />
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;