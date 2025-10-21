import { FiUsers, FiTarget, FiAward, FiHeart } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-700 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">За AURACASE</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Страстни сме да предоставяме премиум мобилни аксесоари, които подобряват изживяването с вашето устройство, като същевременно отразяват вашия личен стил.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="slideRight">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">Нашата мисия</h2>
                <p className="text-gray-300 text-lg mb-6">
                  В AURACASE вярваме, че вашето мобилно устройство е продължение на вашата личност. Нашата мисия е да предоставяме висококачествени, стилни аксесоари, които не само защитават вашите устройства, но и изразяват вашия уникален стил.
                </p>
                <p className="text-gray-300 text-lg">
                  Внимателно подбираме нашата колекция, за да гарантираме, че всеки продукт отговаря на нашите стандарти за качество, издръжливост и дизайнерско съвършенство.
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slideLeft">
              <div className="bg-primary rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Премиум качество</h3>
                  <p className="text-gray-300">
                    Всеки продукт в нашата колекция е избран заради своето високо качество и иновативен дизайн.
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Нашите ценности</h2>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.2} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Клиентът на първо място</h3>
              <p className="text-gray-300">
                Нашите клиенти са в сърцето на всичко, което правим. Слушаме, учим се и непрекъснато подобряваме въз основа на вашите отзиви.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiTarget className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Фокус върху качеството</h3>
              <p className="text-gray-300">
                Никога не правим компромиси с качеството. Всеки продукт е тестван и проверен, за да отговаря на нашите високи стандарти.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiAward className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Иновация</h3>
              <p className="text-gray-300">
                Оставаме в крак с тенденциите и технологиите, за да ви предложим най-новите и най-иновативни аксесоари.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiHeart className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Страст</h3>
              <p className="text-gray-300">
                Страстни сме към мобилните аксесоари и помагаме ви да намерите идеалното съчетание за вашето устройство.
              </p>
            </div>
          </StaggerAnimation>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-8">Нашата история</h2>
            <div className="text-gray-300 text-lg space-y-6">
              <p>
                AURACASE беше основана с една проста визия: да направи премиум мобилните аксесоари достъпни за всички. 
                Започнахме като малък екип от ентусиасти по технологии, които бяха разочаровани от липсата на качествени, 
                стилни аксесоари на пазара.
              </p>
              <p>
                Днес се превърнахме в доверена марка, която обслужва хиляди клиенти по целия свят. 
                Нашата внимателно подбрана колекция включва всичко - от защитни калъфи и защитни стъкла 
                до безжични заряди и премиум слушалки.
              </p>
              <p>
                Това, което ни отличава, е нашата ангажираност към качеството и разбирането, че вашето мобилно устройство 
                е повече от просто инструмент – то е отражение на това кой сте. Ето защо предлагаме аксесоари, 
                които не са само функционални, но и стилни и уникални.
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black py-16">
        <div className="container-custom">
          <StaggerAnimation animation="scaleUp" stagger={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-white mb-2">200+</h3>
              <p className="text-gray-400">Продукти</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-2">30K+</h3>
              <p className="text-gray-400">Доволни клиенти</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-2">50+</h3>
              <p className="text-gray-400">Държави</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-2">99%</h3>
              <p className="text-gray-400">Ниво на удовлетвореност</p>
            </div>
          </StaggerAnimation>
        </div>
      </section>
    </div>
  );
}
