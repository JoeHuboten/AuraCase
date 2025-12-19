'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'bg' | 'en';
export type Currency = 'BGN' | 'USD' | 'EUR';

interface LanguageContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  t: (key: string, fallback?: string) => string;
  formatPrice: (price: number) => string;
  formatDate: (date: Date | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations = {
  bg: {
    // Navigation
    'nav.home': 'Начало',
    'nav.shop': 'Магазин',
    'nav.about': 'За нас',
    'nav.contact': 'Контакти',
    'nav.cart': 'Кошница',
    'nav.wishlist': 'Желания',
    'nav.account': 'Акаунт',
    'nav.orders': 'Поръчки',
    'nav.signin': 'Вход',
    'nav.signup': 'Регистрация',
    'nav.signout': 'Изход',
    
    // Common
    'common.loading': 'Зареждане...',
    'common.error': 'Грешка',
    'common.success': 'Успешно',
    'common.cancel': 'Отказ',
    'common.save': 'Запази',
    'common.delete': 'Изтрий',
    'common.edit': 'Редактирай',
    'common.add': 'Добави',
    'common.remove': 'Премахни',
    'common.search': 'Търсене',
    'common.filter': 'Филтър',
    'common.sort': 'Сортирай',
    'search.placeholder': 'Търсене на продукти...',
    'common.price': 'Цена',
    'common.quantity': 'Количество',
    'common.total': 'Общо',
    'common.subtotal': 'Междинна сума',
    'common.discount': 'Отстъпка',
    'common.delivery': 'Доставка',
    'common.free': 'Безплатно',
    'common.inStock': 'В наличност',
    'common.outOfStock': 'Няма в наличност',
    'common.addToCart': 'Добави в кошницата',
    'common.buyNow': 'Купи сега',
    'common.viewDetails': 'Виж детайли',
    'common.relatedProducts': 'Свързани продукти',
    'common.reviews': 'Отзиви',
    'common.rating': 'Рейтинг',
    'common.description': 'Описание',
    'common.specifications': 'Спецификации',
    'common.features': 'Функции',
    'common.benefits': 'Предимства',
    'common.warranty': 'Гаранция',
    'common.returnPolicy': 'Политика за връщане',
    'common.shippingInfo': 'Информация за доставка',
    'common.paymentMethods': 'Начини на плащане',
    'common.contactUs': 'Свържете се с нас',
    'common.faq': 'ЧЗВ',
    'common.help': 'Помощ',
    'common.support': 'Поддръжка',
    'common.privacy': 'Поверителност',
    'common.terms': 'Условия',
    'common.copyright': 'Авторски права',
    'common.allRightsReserved': 'Всички права запазени',
    
    // Product
    'product.name': 'Име на продукта',
    'product.category': 'Категория',
    'product.brand': 'Марка',
    'product.model': 'Модел',
    'product.color': 'Цвят',
    'product.size': 'Размер',
    'product.material': 'Материал',
    'product.weight': 'Тегло',
    'product.dimensions': 'Размери',
    'product.compatibility': 'Съвместимост',
    'product.warranty': 'Гаранция',
    'product.availability': 'Наличност',
    'product.sku': 'SKU',
    'product.barcode': 'Баркод',
    
    // Cart & Checkout
    'cart.title': 'Кошница',
    'cart.empty': 'Кошницата е празна',
    'cart.item': 'продукт',
    'cart.items': 'продукта',
    'cart.removeItem': 'Премахни продукт',
    'cart.updateQuantity': 'Обнови количеството',
    'cart.continueShopping': 'Продължи пазаруването',
    'cart.proceedToCheckout': 'Продължи към плащане',
    'cart.applyCoupon': 'Приложи купон',
    'cart.couponCode': 'Код на купон',
    'cart.invalidCoupon': 'Невалиден купон',
    'cart.couponApplied': 'Купонът е приложен',
    'cart.estimatedDelivery': 'Очаквана доставка',
    'cart.orderSummary': 'Резюме на поръчката',
    
    // Checkout
    'checkout.title': 'Плащане',
    'checkout.shippingInfo': 'Информация за доставка',
    'checkout.paymentInfo': 'Информация за плащане',
    'checkout.orderReview': 'Преглед на поръчката',
    'checkout.firstName': 'Име',
    'checkout.lastName': 'Фамилия',
    'checkout.email': 'Имейл',
    'checkout.phone': 'Телефон',
    'checkout.address': 'Адрес',
    'checkout.city': 'Град',
    'checkout.postalCode': 'Пощенски код',
    'checkout.country': 'Държава',
    'checkout.paymentMethod': 'Начин на плащане',
    'checkout.cardNumber': 'Номер на карта',
    'checkout.expiryDate': 'Дата на изтичане',
    'checkout.cvv': 'CVV',
    'checkout.cardholderName': 'Име на притежателя',
    'checkout.placeOrder': 'Направи поръчка',
    'checkout.orderPlaced': 'Поръчката е направена',
    'checkout.orderNumber': 'Номер на поръчка',
    'checkout.confirmationEmail': 'Имейл за потвърждение',
    
    // Account
    'account.title': 'Моят акаунт',
    'account.profile': 'Профил',
    'account.orders': 'Поръчки',
    'account.addresses': 'Адреси',
    'account.paymentMethods': 'Начини на плащане',
    'account.settings': 'Настройки',
    'account.notifications': 'Известия',
    'account.privacy': 'Поверителност',
    'account.security': 'Сигурност',
    'account.changePassword': 'Смени парола',
    'account.deleteAccount': 'Изтрий акаунт',
    'account.logout': 'Изход',
    
    // Home Page
    'home.hero.find': 'НАМЕРЕТЕ',
    'home.hero.perfect': 'ПЕРФЕКТНИТЕ АКСЕСОАРИ',
    'home.hero.forDevice': 'ЗА ВАШЕТО УСТРОЙСТВО',
    'home.hero.description': 'Разгледайте нашия разнообразен асортимент от внимателно изработени аксесоари, предназначени да подчертаят личността на вашето устройство.',
    'home.hero.shopNow': 'Пазарувай сега',
    'home.hero.learnMore': 'Научи повече',
    'home.hero.premium': 'Премиум аксесоари',
    'home.stats.brands': 'Марки',
    'home.stats.products': 'Продукти',
    'home.stats.customers': 'Клиенти',
    'home.categories.title': 'Разгледайте нашите категории',
    'home.categories.description': 'Открийте широка гама от премиум аксесоари за всички ваши устройства',
    'home.featured.title': 'Препоръчани продукти',
    'home.featured.description': 'Открийте нашите най-популярни продукти, които клиентите обичат',
    'home.topSelling.title': 'Най-продавани',
    'home.topSelling.description': 'Най-търсените продукти от нашите клиенти',
    'home.viewAll': 'Виж всички продукти',

    // Product Page
    'product.breadcrumb.home': 'Начало',
    'product.breadcrumb.shop': 'Магазин',
    'product.reviews': 'отзива',
    'product.description': 'Описание',
    'product.specifications': 'Спецификации',
    'product.relatedProducts': 'Свързани продукти',
    'product.colors': 'Цветове',
    'product.sizes': 'Размери',
    'product.addToCart': 'Добави в количката',
    'product.adding': 'Добавяне...',
    'product.addedToCart': 'Продуктът е добавен в количката!',
    'product.failedToAdd': 'Неуспешно добавяне в количката',
    'product.reviews.title': 'Отзиви',
    'product.reviews.write': 'Напиши отзив',
    'product.reviews.edit': 'Редактирай отзива',
    'product.reviews.writeFor': 'Напиши отзив за',
    'product.reviews.rating': 'Рейтинг',
    'product.reviews.titleLabel': 'Заглавие',
    'product.reviews.titlePlaceholder': 'Кратко заглавие на отзива',
    'product.reviews.comment': 'Коментар',
    'product.reviews.commentPlaceholder': 'Споделете вашето мнение за продукта...',
    'product.reviews.saving': 'Запазване...',
    'product.reviews.update': 'Обнови отзива',
    'product.reviews.publish': 'Публикувай отзива',
    'product.reviews.cancel': 'Отказ',
    'product.reviews.sortBy': 'Сортирай по:',
    'product.reviews.newest': 'Най-нови',
    'product.reviews.oldest': 'Най-стари',
    'product.reviews.ratingHigh': 'Най-висок рейтинг',
    'product.reviews.ratingLow': 'Най-нисък рейтинг',
    'product.reviews.helpful': 'Най-полезни',
    'product.reviews.noReviews': 'Няма отзиви за този продукт все още.',
    'product.reviews.beFirst': 'Бъди първият, който пише отзив',
    'product.reviews.verified': 'Потвърдена покупка',
    'product.reviews.editTitle': 'Редактирай',
    'product.reviews.deleteTitle': 'Изтрий',
    'product.reviews.helpfulButton': 'Полезно',
    'product.reviews.previous': 'Предишна',
    'product.reviews.next': 'Следваща',
    'product.reviews.page': 'Страница',
    'product.reviews.of': 'от',
    'product.reviews.deleteConfirm': 'Сигурни ли сте, че искате да изтриете този отзив?',
    'product.reviews.failedSubmit': 'Неуспешно публикуване на отзива',
    'product.reviews.failedUpdate': 'Неуспешно обновяване на отзива',
    'product.reviews.failedDelete': 'Неуспешно изтриване на отзива',
    'product.premiumAccessory': 'Премиум мобилен аксесоар от AURACASE',
    
    // Wishlist
    'wishlist.title': 'Списък с желания',
    'wishlist.empty': 'Списъкът с желания е празен',
    'wishlist.addToWishlist': 'Добави в желанията',
    'wishlist.removeFromWishlist': 'Премахни от желанията',
    'wishlist.moveToCart': 'Премести в кошницата',
    'wishlist.clearWishlist': 'Изчисти списъка с желания',
    'wishlist.loginRequired': 'Входът е задължителен',
    'wishlist.loginMessage': 'Моля, влезте в акаунта си, за да видите списъка с желания.',
    
    // Reviews (legacy - keeping for compatibility)
    'reviews.title': 'Отзиви',
    'reviews.writeReview': 'Напиши отзив',
    'reviews.editReview': 'Редактирай отзив',
    'reviews.deleteReview': 'Изтрий отзив',
    'reviews.helpful': 'Полезно',
    'reviews.verifiedPurchase': 'Потвърдена покупка',
    'reviews.noReviews': 'Няма отзиви за този продукт',
    'reviews.beFirst': 'Бъди първият, който пише отзив',
    'reviews.rating': 'Рейтинг',
    'reviews.titleField': 'Заглавие',
    'reviews.comment': 'Коментар',
    'reviews.submit': 'Публикувай отзив',
    'reviews.update': 'Обнови отзива',
    'reviews.cancel': 'Отказ',
    'reviews.sortBy': 'Сортирай по',
    'reviews.newest': 'Най-нови',
    'reviews.oldest': 'Най-стари',
    'reviews.highestRating': 'Най-висок рейтинг',
    'reviews.lowestRating': 'Най-нисък рейтинг',
    'reviews.mostHelpful': 'Най-полезни',
    
    // Search
    'search.title': 'Търсене',
    'search.advanced.placeholder': 'Търсете продукти, марки, категории...',
    'search.noResults': 'Няма резултати',
    'search.resultsFor': 'Резултати за',
    'search.filters': 'Филтри',
    'search.clearFilters': 'Изчисти филтрите',
    'search.priceRange': 'Ценови диапазон',
    'search.minPrice': 'Минимална цена',
    'search.maxPrice': 'Максимална цена',
    'search.brand': 'Марка',
    'search.category': 'Категория',
    'search.color': 'Цвят',
    'search.size': 'Размер',
    'search.availability': 'Наличност',
    'search.featured': 'Препоръчани',
    'search.recentSearches': 'Последни търсения',
    'search.savedSearches': 'Запазени търсения',
    'search.popularSearches': 'Популярни търсения',
    'search.clearHistory': 'Изчисти историята',
    
    // Footer
    'footer.newsletter.title': 'Получавайте новини',
    'footer.newsletter.description': 'Бъдете първите, които научават за нови продукти и оферти',
    'footer.brand.description': 'Имаме премиум мобилни аксесоари, които отговарят на вашия стил и с които се гордеете да използвате. От калъфи до power bank-ове.',
    'footer.company': 'Компания',
    'footer.about': 'За нас',
    'footer.features': 'Функции',
    'footer.howItWorks': 'Как работи',
    'footer.career': 'Кариера',
    'footer.help': 'Помощ',
    'footer.customerSupport': 'Клиентска поддръжка',
    'footer.deliveryDetails': 'Детайли за доставка',
    'footer.terms': 'Условия за ползване',
    'footer.privacyPolicy': 'Политика за поверителност',
    'footer.faq': 'ЧЗВ',
    'footer.account': 'Акаунт',
    'footer.manageDeliveries': 'Управление на доставки',
    'footer.orders': 'Поръчки',
    'footer.payments': 'Плащания',
    'footer.copyright': '© 2025 AuraCase. Всички права запазени.',
    'footer.followTwitter': 'Следвайте ни в Twitter',
    'footer.followFacebook': 'Следвайте ни във Facebook',
    'footer.followInstagram': 'Следвайте ни в Instagram',
    'footer.viewGithub': 'Вижте кода ни в GitHub',
    
    // About Page
    'about.title': 'За AURACASE',
    'about.subtitle': 'Страстни сме да предоставяме премиум мобилни аксесоари, които подобряват изживяването с вашето устройство, като същевременно отразяват вашия личен стил.',
    'about.mission': 'Нашата мисия',
    'about.mission.text1': 'В AURACASE вярваме, че вашето мобилно устройство е продължение на вашата личност. Нашата мисия е да предоставяме висококачествени, стилни аксесоари, които не само защитават вашите устройства, но и изразяват вашия уникален стил.',
    'about.mission.text2': 'Внимателно подбираме нашата колекция, за да гарантираме, че всеки продукт отговаря на нашите стандарти за качество, издръжливост и дизайнерско съвършенство.',
    'about.premiumQuality': 'Премиум качество',
    'about.premiumQuality.text': 'Всеки продукт в нашата колекция е избран заради своето високо качество и иновативен дизайн.',
    'about.values': 'Нашите ценности',
    'about.value.customerFirst': 'Клиентът на първо място',
    'about.value.customerFirst.text': 'Нашите клиенти са в сърцето на всичко, което правим. Слушаме, учим се и непрекъснато подобряваме въз основа на вашите отзиви.',
    'about.value.qualityFocus': 'Фокус върху качеството',
    'about.value.qualityFocus.text': 'Никога не правим компромиси с качеството. Всеки продукт е тестван и проверен, за да отговаря на нашите високи стандарти.',
    'about.value.innovation': 'Иновация',
    'about.value.innovation.text': 'Оставаме в крак с тенденциите и технологиите, за да ви предложим най-новите и най-иновативни аксесоари.',
    'about.value.sustainability': 'Устойчивост',
    'about.value.sustainability.text': 'Ангажирани сме към опазването на околната среда и към устойчиви бизнес практики.',
    'about.whyChooseUs': 'Защо да изберете нас',
    'about.whyChooseUs.text': 'С години опит в индустрията за мобилни аксесоари, изградихме репутация за предоставяне на изключителни продукти и услуги. Нашата страст към качеството и иновациите ни прави предпочитан избор за клиенти по целия свят.',
    'about.stat.products': 'Продукта',
    'about.stat.customers': 'Доволни клиенти',
    'about.stat.rating': 'Рейтинг',
    
    // Cart Page
    'cart.yourCart': 'Your cart is empty',
    'cart.emptyDescription': 'Discover amazing products and start shopping today!',
    'cart.startShopping': 'Start Shopping',
    'cart.shoppingCart': 'Shopping Cart',
    'cart.youHave': 'You have',
    'cart.inYourCart': 'in your cart',
    'cart.continueShopping': 'Continue Shopping',
    'cart.clearCart': 'Clear Cart',
    'cart.product': 'Product',
    'cart.price': 'Price',
    'cart.quantity': 'Quantity',
    'cart.subtotal': 'Subtotal',
    'cart.actions': 'Actions',
    'cart.orderSummary': 'Order Summary',
    'cart.items': 'items',
    'cart.discountCode': 'Discount Code',
    'cart.applyCode': 'Apply Code',
    'cart.validCode': 'Valid code',
    'cart.remove': 'Remove',
    'cart.shipping': 'Shipping',
    'cart.freeShipping': 'Free Shipping',
    'cart.discount': 'Discount',
    'cart.total': 'Total',
    'cart.proceedToCheckout': 'Proceed to Checkout',
    'cart.secureCheckout': 'Secure Checkout',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cart': 'Cart',
    'nav.wishlist': 'Wishlist',
    'nav.account': 'Account',
    'nav.orders': 'Orders',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    'nav.signout': 'Sign Out',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'search.placeholder': 'Search products...',
    'common.price': 'Price',
    'common.quantity': 'Quantity',
    'common.total': 'Total',
    'common.subtotal': 'Subtotal',
    'common.discount': 'Discount',
    'common.delivery': 'Delivery',
    'common.free': 'Free',
    'common.inStock': 'In Stock',
    'common.outOfStock': 'Out of Stock',
    'common.addToCart': 'Add to Cart',
    'common.buyNow': 'Buy Now',
    'common.viewDetails': 'View Details',
    'common.relatedProducts': 'Related Products',
    'common.reviews': 'Reviews',
    'common.rating': 'Rating',
    'common.description': 'Description',
    'common.specifications': 'Specifications',
    'common.features': 'Features',
    'common.benefits': 'Benefits',
    'common.warranty': 'Warranty',
    'common.returnPolicy': 'Return Policy',
    'common.shippingInfo': 'Shipping Information',
    'common.paymentMethods': 'Payment Methods',
    'common.contactUs': 'Contact Us',
    'common.faq': 'FAQ',
    'common.help': 'Help',
    'common.support': 'Support',
    'common.privacy': 'Privacy',
    'common.terms': 'Terms',
    'common.copyright': 'Copyright',
    'common.allRightsReserved': 'All Rights Reserved',
    
    // Product
    'product.name': 'Product Name',
    'product.category': 'Category',
    'product.brand': 'Brand',
    'product.model': 'Model',
    'product.color': 'Color',
    'product.size': 'Size',
    'product.material': 'Material',
    'product.weight': 'Weight',
    'product.dimensions': 'Dimensions',
    'product.compatibility': 'Compatibility',
    'product.warranty': 'Warranty',
    'product.availability': 'Availability',
    'product.sku': 'SKU',
    'product.barcode': 'Barcode',
    
    // Cart & Checkout
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.item': 'item',
    'cart.items': 'items',
    'cart.removeItem': 'Remove item',
    'cart.updateQuantity': 'Update quantity',
    'cart.continueShopping': 'Continue Shopping',
    'cart.proceedToCheckout': 'Proceed to Checkout',
    'cart.applyCoupon': 'Apply Coupon',
    'cart.couponCode': 'Coupon Code',
    'cart.invalidCoupon': 'Invalid coupon',
    'cart.couponApplied': 'Coupon applied',
    'cart.estimatedDelivery': 'Estimated Delivery',
    'cart.orderSummary': 'Order Summary',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.shippingInfo': 'Shipping Information',
    'checkout.paymentInfo': 'Payment Information',
    'checkout.orderReview': 'Order Review',
    'checkout.firstName': 'First Name',
    'checkout.lastName': 'Last Name',
    'checkout.email': 'Email',
    'checkout.phone': 'Phone',
    'checkout.address': 'Address',
    'checkout.city': 'City',
    'checkout.postalCode': 'Postal Code',
    'checkout.country': 'Country',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.cardNumber': 'Card Number',
    'checkout.expiryDate': 'Expiry Date',
    'checkout.cvv': 'CVV',
    'checkout.cardholderName': 'Cardholder Name',
    'checkout.placeOrder': 'Place Order',
    'checkout.orderPlaced': 'Order Placed',
    'checkout.orderNumber': 'Order Number',
    'checkout.confirmationEmail': 'Confirmation Email',
    
    // Account
    'account.title': 'My Account',
    'account.profile': 'Profile',
    'account.orders': 'Orders',
    'account.addresses': 'Addresses',
    'account.paymentMethods': 'Payment Methods',
    'account.settings': 'Settings',
    'account.notifications': 'Notifications',
    'account.privacy': 'Privacy',
    'account.security': 'Security',
    'account.changePassword': 'Change Password',
    'account.deleteAccount': 'Delete Account',
    'account.logout': 'Logout',
    
    // Home Page
    'home.hero.find': 'FIND',
    'home.hero.perfect': 'THE PERFECT ACCESSORIES',
    'home.hero.forDevice': 'FOR YOUR DEVICE',
    'home.hero.description': 'Explore our diverse range of carefully crafted accessories designed to highlight your device\'s personality.',
    'home.hero.shopNow': 'Shop Now',
    'home.hero.learnMore': 'Learn More',
    'home.hero.premium': 'Premium Accessories',
    'home.stats.brands': 'Brands',
    'home.stats.products': 'Products',
    'home.stats.customers': 'Customers',
    'home.categories.title': 'Explore Our Categories',
    'home.categories.description': 'Discover a wide range of premium accessories for all your devices',
    'home.featured.title': 'Featured Products',
    'home.featured.description': 'Discover our most popular products that customers love',
    'home.topSelling.title': 'Top Selling',
    'home.topSelling.description': 'The most sought-after products from our customers',
    'home.viewAll': 'View All Products',

    // Product Page
    'product.breadcrumb.home': 'Home',
    'product.breadcrumb.shop': 'Shop',
    'product.reviews': 'reviews',
    'product.description': 'Description',
    'product.specifications': 'Specifications',
    'product.relatedProducts': 'Related Products',
    'product.colors': 'Colors',
    'product.sizes': 'Sizes',
    'product.addToCart': 'Add to Cart',
    'product.adding': 'Adding...',
    'product.addedToCart': 'Product added to cart!',
    'product.failedToAdd': 'Failed to add product to cart',
    'product.reviews.title': 'Reviews',
    'product.reviews.write': 'Write Review',
    'product.reviews.edit': 'Edit Review',
    'product.reviews.writeFor': 'Write a review for',
    'product.reviews.rating': 'Rating',
    'product.reviews.titleLabel': 'Title',
    'product.reviews.titlePlaceholder': 'Brief review title',
    'product.reviews.comment': 'Comment',
    'product.reviews.commentPlaceholder': 'Share your opinion about the product...',
    'product.reviews.saving': 'Saving...',
    'product.reviews.update': 'Update Review',
    'product.reviews.publish': 'Publish Review',
    'product.reviews.cancel': 'Cancel',
    'product.reviews.sortBy': 'Sort by:',
    'product.reviews.newest': 'Newest',
    'product.reviews.oldest': 'Oldest',
    'product.reviews.ratingHigh': 'Highest Rating',
    'product.reviews.ratingLow': 'Lowest Rating',
    'product.reviews.helpful': 'Most Helpful',
    'product.reviews.noReviews': 'No reviews for this product yet.',
    'product.reviews.beFirst': 'Be the first to write a review',
    'product.reviews.verified': 'Verified Purchase',
    'product.reviews.editTitle': 'Edit',
    'product.reviews.deleteTitle': 'Delete',
    'product.reviews.helpfulButton': 'Helpful',
    'product.reviews.previous': 'Previous',
    'product.reviews.next': 'Next',
    'product.reviews.page': 'Page',
    'product.reviews.of': 'of',
    'product.reviews.deleteConfirm': 'Are you sure you want to delete this review?',
    'product.reviews.failedSubmit': 'Failed to submit review',
    'product.reviews.failedUpdate': 'Failed to update review',
    'product.reviews.failedDelete': 'Failed to delete review',
    'product.premiumAccessory': 'Premium mobile accessory from AURACASE',
    
    // Wishlist
    'wishlist.title': 'Wishlist',
    'wishlist.empty': 'Your wishlist is empty',
    'wishlist.addToWishlist': 'Add to Wishlist',
    'wishlist.removeFromWishlist': 'Remove from Wishlist',
    'wishlist.moveToCart': 'Move to Cart',
    'wishlist.clearWishlist': 'Clear Wishlist',
    'wishlist.loginRequired': 'Login Required',
    'wishlist.loginMessage': 'Please log in to your account to see your wishlist.',
    
    // Reviews (legacy - keeping for compatibility)
    'reviews.title': 'Reviews',
    'reviews.writeReview': 'Write Review',
    'reviews.editReview': 'Edit Review',
    'reviews.deleteReview': 'Delete Review',
    'reviews.helpful': 'Helpful',
    'reviews.verifiedPurchase': 'Verified Purchase',
    'reviews.noReviews': 'No reviews for this product yet',
    'reviews.beFirst': 'Be the first to write a review',
    'reviews.rating': 'Rating',
    'reviews.titleField': 'Title',
    'reviews.comment': 'Comment',
    'reviews.submit': 'Submit Review',
    'reviews.update': 'Update Review',
    'reviews.cancel': 'Cancel',
    'reviews.sortBy': 'Sort by',
    'reviews.newest': 'Newest',
    'reviews.oldest': 'Oldest',
    'reviews.highestRating': 'Highest Rating',
    'reviews.lowestRating': 'Lowest Rating',
    'reviews.mostHelpful': 'Most Helpful',
    
    // Search
    'search.title': 'Search',
    'search.advanced.placeholder': 'Search products, brands, categories...',
    'search.noResults': 'No results found',
    'search.resultsFor': 'Results for',
    'search.filters': 'Filters',
    'search.clearFilters': 'Clear Filters',
    'search.priceRange': 'Price Range',
    'search.minPrice': 'Min Price',
    'search.maxPrice': 'Max Price',
    'search.brand': 'Brand',
    'search.category': 'Category',
    'search.color': 'Color',
    'search.size': 'Size',
    'search.availability': 'Availability',
    'search.featured': 'Featured',
    'search.recentSearches': 'Recent Searches',
    'search.savedSearches': 'Saved Searches',
    'search.popularSearches': 'Popular Searches',
    'search.clearHistory': 'Clear History',
    
    // Footer
    'footer.newsletter.title': 'Get Newsletter',
    'footer.newsletter.description': 'Be the first to know about new products and offers',
    'footer.brand.description': 'We have premium mobile accessories that match your style and that you are proud to use. From cases to power banks.',
    'footer.company': 'Company',
    'footer.about': 'About Us',
    'footer.features': 'Features',
    'footer.howItWorks': 'How It Works',
    'footer.career': 'Career',
    'footer.help': 'Help',
    'footer.customerSupport': 'Customer Support',
    'footer.deliveryDetails': 'Delivery Details',
    'footer.terms': 'Terms of Use',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.faq': 'FAQ',
    'footer.account': 'Account',
    'footer.manageDeliveries': 'Manage Deliveries',
    'footer.orders': 'Orders',
    'footer.payments': 'Payments',
    'footer.copyright': '© 2025 AuraCase. All Rights Reserved.',
    'footer.followTwitter': 'Follow us on Twitter',
    'footer.followFacebook': 'Follow us on Facebook',
    'footer.followInstagram': 'Follow us on Instagram',
    'footer.viewGithub': 'View our code on GitHub',
    
    // About Page
    'about.title': 'About AURACASE',
    'about.subtitle': 'We are passionate about providing premium mobile accessories that enhance your device experience while reflecting your personal style.',
    'about.mission': 'Our Mission',
    'about.mission.text1': 'At AURACASE, we believe your mobile device is an extension of your personality. Our mission is to provide high-quality, stylish accessories that not only protect your devices but also express your unique style.',
    'about.mission.text2': 'We carefully curate our collection to ensure every product meets our standards for quality, durability, and design excellence.',
    'about.premiumQuality': 'Premium Quality',
    'about.premiumQuality.text': 'Every product in our collection is chosen for its high quality and innovative design.',
    'about.values': 'Our Values',
    'about.value.customerFirst': 'Customer First',
    'about.value.customerFirst.text': 'Our customers are at the heart of everything we do. We listen, learn, and continuously improve based on your feedback.',
    'about.value.qualityFocus': 'Quality Focus',
    'about.value.qualityFocus.text': 'We never compromise on quality. Every product is tested and verified to meet our high standards.',
    'about.value.innovation': 'Innovation',
    'about.value.innovation.text': 'We stay ahead of trends and technologies to bring you the latest and most innovative accessories.',
    'about.value.sustainability': 'Sustainability',
    'about.value.sustainability.text': 'We are committed to environmental protection and sustainable business practices.',
    'about.whyChooseUs': 'Why Choose Us',
    'about.whyChooseUs.text': 'With years of experience in the mobile accessories industry, we have built a reputation for delivering exceptional products and services. Our passion for quality and innovation makes us the preferred choice for customers worldwide.',
    'about.stat.products': 'Products',
    'about.stat.customers': 'Happy Customers',
    'about.stat.rating': 'Rating',
    
    // Cart Page
    'cart.yourCart': 'Your cart is empty',
    'cart.emptyDescription': 'Discover amazing products and start shopping today!',
    'cart.startShopping': 'Start Shopping',
    'cart.shoppingCart': 'Shopping Cart',
    'cart.youHave': 'You have',
    'cart.inYourCart': 'in your cart',
    'cart.continueShopping': 'Continue Shopping',
    'cart.clearCart': 'Clear Cart',
    'cart.product': 'Product',
    'cart.price': 'Price',
    'cart.quantity': 'Quantity',
    'cart.subtotal': 'Subtotal',
    'cart.actions': 'Actions',
    'cart.orderSummary': 'Order Summary',
    'cart.items': 'items',
    'cart.discountCode': 'Discount Code',
    'cart.applyCode': 'Apply Code',
    'cart.validCode': 'Valid code',
    'cart.remove': 'Remove',
    'cart.shipping': 'Shipping',
    'cart.freeShipping': 'Free Shipping',
    'cart.discount': 'Discount',
    'cart.total': 'Total',
    'cart.proceedToCheckout': 'Proceed to Checkout',
    'cart.secureCheckout': 'Secure Checkout',
  },
};

// Currency conversion rates (simplified - in real app, use real-time rates)
const currencyRates = {
  BGN: 1,
  USD: 0.55,
  EUR: 0.51,
};

const currencySymbols = {
  BGN: 'лв',
  USD: '$',
  EUR: '€',
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('bg');
  const [currency, setCurrencyState] = useState<Currency>('BGN');

  useEffect(() => {
    // Load saved preferences
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      const savedCurrency = localStorage.getItem('currency') as Currency;
      
      if (savedLanguage && ['bg', 'en'].includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      }
      
      if (savedCurrency && ['BGN', 'USD', 'EUR'].includes(savedCurrency)) {
        setCurrencyState(savedCurrency);
      }
    }
  }, []);

  useEffect(() => {
    // Save preferences
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      localStorage.setItem('currency', currency);
      
      // Update document language
      document.documentElement.lang = language;
      
      // Debug logging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('Language changed to:', language);
        console.log('Currency changed to:', currency);
      }
    }
  }, [language, currency]);

  const t = (key: string, fallback?: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || fallback || key;
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = price * currencyRates[currency];
    const symbol = currencySymbols[currency];
    
    if (currency === 'BGN') {
      return `${convertedPrice.toFixed(2)} ${symbol}`;
    } else {
      return `${symbol}${convertedPrice.toFixed(2)}`;
    }
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = language === 'bg' ? 'bg-BG' : 'en-US';
    return dateObj.toLocaleDateString(locale);
  };

  const setLanguage = (lang: Language) => {
    try {
      console.log('setLanguage called with:', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  const setCurrency = (curr: Currency) => {
    try {
      console.log('setCurrency called with:', curr);
      setCurrencyState(curr);
    } catch (error) {
      console.error('Error setting currency:', error);
    }
  };

  const value: LanguageContextType = {
    language,
    currency,
    setLanguage,
    setCurrency,
    t,
    formatPrice,
    formatDate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    console.error('useLanguage must be used within a LanguageProvider');
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
