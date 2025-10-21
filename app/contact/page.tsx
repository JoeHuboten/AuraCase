'use client';

import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-700 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">Свържете се с нас</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Имате въпрос или се нуждаете от помощ? Тук сме, за да ви помогнем. Свържете се с нашия приятелски екип.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <ScrollAnimation animation="slideRight">
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Свържете се с нас</h2>
                <StaggerAnimation animation="fadeIn" stagger={0.1} className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full p-3">
                      <FiMail className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Имейл</h3>
                      <p className="text-gray-300">support@auracase.com</p>
                      <p className="text-gray-300">info@auracase.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full p-3">
                      <FiPhone className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Телефон</h3>
                      <p className="text-gray-300">+359 888 123 456</p>
                      <p className="text-gray-300">+359 888 987 654</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full p-3">
                      <FiMapPin className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Адрес</h3>
                      <p className="text-gray-300">
                        бул. Витоша 123<br />
                        Център<br />
                        София 1000
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full p-3">
                      <FiClock className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Работно време</h3>
                      <p className="text-gray-300">Понеделник - Петък: 9:00 - 18:00</p>
                      <p className="text-gray-300">Събота: 10:00 - 16:00</p>
                      <p className="text-gray-300">Неделя: Затворено</p>
                    </div>
                  </div>
                </StaggerAnimation>

                {/* FAQ Section */}
                <div className="mt-12">
                  <ScrollAnimation animation="fadeIn">
                    <h3 className="text-2xl font-bold text-white mb-6">Често задавани въпроси</h3>
                  </ScrollAnimation>
                  <StaggerAnimation animation="slideUp" stagger={0.1} className="space-y-4">
                    <div className="bg-primary p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Колко време отнема доставката?</h4>
                      <p className="text-gray-300 text-sm">
                        Стандартната доставка отнема 3-5 работни дни. Експресната доставка е налична за 1-2 работни дни.
                      </p>
                    </div>
                    <div className="bg-primary p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Каква е вашата политика за връщане?</h4>
                      <p className="text-gray-300 text-sm">
                        Предлагаме 30-дневна политика за връщане за всички неизползвани артикули в оригинална опаковка.
                      </p>
                    </div>
                    <div className="bg-primary p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Предлагате ли международна доставка?</h4>
                      <p className="text-gray-300 text-sm">
                        Да, доставяме в над 50 държави по целия свят. Разходите за доставка варират според местоположението.
                      </p>
                    </div>
                  </StaggerAnimation>
                </div>
              </div>
            </ScrollAnimation>

            {/* Contact Form */}
            <ScrollAnimation animation="slideLeft">
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Изпратете ни съобщение</h2>
                
                {/* Success Message */}
                {success && (
                  <div className="mb-6 bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
                    ✓ Благодарим за съобщението! Ще се свържем с вас скоро.
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                    ✗ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-white font-semibold mb-2">
                      Пълно име
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-background-secondary text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Вашето пълно име"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-white font-semibold mb-2">
                      Имейл адрес
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-background-secondary text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="ваш.имейл@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-white font-semibold mb-2">
                      Тема
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-background-secondary text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="За какво става дума?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-white font-semibold mb-2">
                      Съобщение
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full bg-background-secondary text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      placeholder="Кажете ни как можем да ви помогнем..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Изпращане...</span>
                      </>
                    ) : (
                      <>
                        <FiSend />
                        <span>Изпрати съобщение</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Намерете ни</h2>
          </ScrollAnimation>
          <ScrollAnimation animation="scaleUp" delay={0.3}>
            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold text-white mb-4">Посетете нашия магазин</h3>
              <p className="text-gray-300 mb-6">
                Елате да ни посетите в нашия флагмански магазин в центъра на София. 
                Опитайте нашите продукти лично и получете експертни съвети от нашия екип.
              </p>
              <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-white font-semibold mb-2">AURACASE Флагмански магазин</p>
                <p className="text-gray-300 text-sm">
                  бул. Витоша 123<br />
                  Център<br />
                  София 1000
                </p>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
