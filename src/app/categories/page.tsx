import Link from 'next/link'
import { Smartphone, Shield, Zap, Headphones, Cable, Watch } from 'lucide-react'

export default function CategoriesPage() {
  const categories = [
    {
      name: 'Кейсове и калъфи',
      slug: 'cases',
      description: 'Защитете телефона си с стил',
      icon: Smartphone,
      count: 156
    },
    {
      name: 'Стъклени протектори',
      slug: 'screen-protectors',
      description: 'Максимална защита за екрана',
      icon: Shield,
      count: 89
    },
    {
      name: 'Зарядни устройства',
      slug: 'chargers',
      description: 'Бързо и безопасно зареждане',
      icon: Zap,
      count: 67
    },
    {
      name: 'Слушалки',
      slug: 'headphones',
      description: 'Перфектен звук навсякъде',
      icon: Headphones,
      count: 45
    },
    {
      name: 'Кабели',
      slug: 'cables',
      description: 'Издръжливи и качествени кабели',
      icon: Cable,
      count: 78
    },
    {
      name: 'Смарт устройства',
      slug: 'smart-devices',
      description: 'Смарт часовници и гривни',
      icon: Watch,
      count: 34
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Категории</h1>
        <p className="text-gray-600 text-lg">Разгледайте нашата разнообразна гама от аксесоари</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-primary-100 p-4 rounded-lg group-hover:bg-primary-600 transition-colors">
                <category.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {category.count} продукта
              </span>
            </div>
            
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition">
              {category.name}
            </h3>
            <p className="text-gray-600">{category.description}</p>
            
            <div className="mt-4 text-primary-600 group-hover:text-primary-700 font-semibold flex items-center">
              Разгледай <span className="ml-2">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

