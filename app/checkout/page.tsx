'use client';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Image from 'next/image';
import { FiUser, FiMapPin, FiPhone, FiMail, FiFileText, FiTruck, FiShield, FiCheckCircle } from 'react-icons/fi';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
}

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { items, getSubtotal, getDiscount, getTotal, discountCode, clearCart } = useCartStore();
  const [error, setError] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isValidating, setIsValidating] = useState(false);
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'България',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/signin');
    if (items.length === 0 && !paymentComplete) router.push('/cart');
  }, [authLoading, user, items, paymentComplete, router]);

  useEffect(() => {
    if (user?.email && !shippingAddress.email) {
      setShippingAddress(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  const validateShippingForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!shippingAddress.firstName.trim() || shippingAddress.firstName.length < 2) {
      newErrors.firstName = 'Името трябва да е поне 2 символа';
    }
    if (!shippingAddress.lastName.trim() || shippingAddress.lastName.length < 2) {
      newErrors.lastName = 'Фамилията трябва да е поне 2 символа';
    }
    if (!shippingAddress.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      newErrors.email = 'Въведете валиден имейл адрес';
    }
    if (!shippingAddress.phone.trim() || shippingAddress.phone.length < 6) {
      newErrors.phone = 'Въведете валиден телефонен номер';
    }
    if (!shippingAddress.address.trim() || shippingAddress.address.length < 5) {
      newErrors.address = 'Адресът трябва да е поне 5 символа';
    }
    if (!shippingAddress.city.trim() || shippingAddress.city.length < 2) {
      newErrors.city = 'Въведете валиден град';
    }
    if (!shippingAddress.postalCode.trim() || shippingAddress.postalCode.length < 4) {
      newErrors.postalCode = 'Въведете валиден пощенски код';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    setIsValidating(true);
    if (validateShippingForm()) {
      setStep('payment');
      setError('');
    }
    setIsValidating(false);
  };

  const createOrder = async () => {
    const res = await fetch('/api/payment/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        items, 
        discountCode: discountCode?.code,
        shippingAddress 
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.orderId;
  };

  const onApprove = async (data: any) => {
    try {
      console.log('PayPal approved, capturing order:', data.orderID);
      const res = await fetch('/api/payment/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: data.orderID, 
          items, 
          discountCode: discountCode?.code,
          shippingAddress 
        }),
      });
      const result = await res.json();
      console.log('Capture response:', result);
      if (!res.ok) throw new Error(result.message);
      setPaymentComplete(true);
      clearCart();
      router.push(`/payment/success?orderId=${result.orderId}`);
    } catch (err: any) {
      console.error('Capture failed:', err);
      setError('Плащането не е успешно: ' + (err.message || 'Неизвестна грешка'));
    }
  };

  const InputField = ({ 
    icon: Icon, 
    label, 
    name, 
    type = 'text', 
    placeholder,
    required = true,
    error: fieldError 
  }: { 
    icon: any; 
    label: string; 
    name: keyof ShippingAddress; 
    type?: string;
    placeholder: string;
    required?: boolean;
    error?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        <span className="flex items-center gap-2">
          <Icon size={16} className="text-accent" />
          {label} {required && <span className="text-red-400">*</span>}
        </span>
      </label>
      <input
        type={type}
        value={shippingAddress[name]}
        onChange={(e) => {
          setShippingAddress(prev => ({ ...prev, [name]: e.target.value }));
          if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
        }}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
          fieldError 
            ? 'border-red-500 focus:ring-red-500/50' 
            : 'border-gray-700 focus:ring-accent/50 focus:border-accent'
        }`}
      />
      {fieldError && <p className="text-red-400 text-sm mt-1">{fieldError}</p>}
    </div>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID === 'your_paypal_client_id') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="bg-primary border border-gray-800 rounded-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">PayPal не е конфигуриран</h2>
          <p className="text-gray-400 mb-6">Моля, конфигурирайте PayPal в .env файла</p>
          <button onClick={() => router.push('/cart')} className="btn-primary">
            Обратно към кошницата
          </button>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'EUR' }}>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header with Steps */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-6">Плащане</h1>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-accent' : 'text-green-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'shipping' ? 'bg-accent' : 'bg-green-500'
                }`}>
                  {step === 'payment' ? <FiCheckCircle /> : '1'}
                </div>
                <span className="font-medium hidden sm:inline">Доставка</span>
              </div>
              
              <div className={`flex-1 h-1 ${step === 'payment' ? 'bg-green-500' : 'bg-gray-700'}`} />
              
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-accent' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'payment' ? 'bg-accent' : 'bg-gray-700'
                }`}>
                  2
                </div>
                <span className="font-medium hidden sm:inline">Плащане</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6 text-red-400">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {step === 'shipping' ? (
                /* Shipping Form */
                <div className="bg-primary border border-gray-800 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FiTruck className="text-accent" />
                    Адрес за доставка
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputField
                      icon={FiUser}
                      label="Име"
                      name="firstName"
                      placeholder="Въведете името си"
                      error={errors.firstName}
                    />
                    <InputField
                      icon={FiUser}
                      label="Фамилия"
                      name="lastName"
                      placeholder="Въведете фамилията си"
                      error={errors.lastName}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <InputField
                      icon={FiMail}
                      label="Имейл"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      error={errors.email}
                    />
                    <InputField
                      icon={FiPhone}
                      label="Телефон"
                      name="phone"
                      type="tel"
                      placeholder="+359 888 123 456"
                      error={errors.phone}
                    />
                  </div>

                  <div className="mt-4">
                    <InputField
                      icon={FiMapPin}
                      label="Адрес"
                      name="address"
                      placeholder="ул. Примерна 123, бл. 1, ап. 1"
                      error={errors.address}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <InputField
                      icon={FiMapPin}
                      label="Град"
                      name="city"
                      placeholder="София"
                      error={errors.city}
                    />
                    <InputField
                      icon={FiMapPin}
                      label="Пощенски код"
                      name="postalCode"
                      placeholder="1000"
                      error={errors.postalCode}
                    />
                    <InputField
                      icon={FiMapPin}
                      label="Държава"
                      name="country"
                      placeholder="България"
                      error={errors.country}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <span className="flex items-center gap-2">
                        <FiFileText size={16} className="text-accent" />
                        Бележки към поръчката (по избор)
                      </span>
                    </label>
                    <textarea
                      value={shippingAddress.notes}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Допълнителни инструкции за доставка..."
                      rows={3}
                      className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none"
                    />
                  </div>

                  <button
                    onClick={handleContinueToPayment}
                    disabled={isValidating}
                    className="w-full mt-6 bg-accent hover:bg-accent-light text-white font-bold py-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isValidating ? 'Валидиране...' : 'Продължи към плащане'}
                  </button>
                </div>
              ) : (
                /* Payment Step */
                <div className="space-y-6">
                  {/* Shipping Summary */}
                  <div className="bg-primary border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <FiTruck className="text-accent" />
                        Адрес за доставка
                      </h2>
                      <button 
                        onClick={() => setStep('shipping')}
                        className="text-accent hover:text-accent-light text-sm"
                      >
                        Промени
                      </button>
                    </div>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p className="font-medium text-white">
                        {shippingAddress.firstName} {shippingAddress.lastName}
                      </p>
                      <p>{shippingAddress.address}</p>
                      <p>{shippingAddress.postalCode} {shippingAddress.city}, {shippingAddress.country}</p>
                      <p>{shippingAddress.phone}</p>
                      <p>{shippingAddress.email}</p>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="bg-primary border border-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <FiShield className="text-accent" />
                      Метод на плащане
                    </h2>
                    
                    <div className="bg-background/50 p-4 rounded-lg mb-4">
                      <p className="text-gray-400 text-sm mb-4">
                        Плащането се обработва сигурно чрез PayPal. Можете да платите с PayPal акаунт или директно с карта.
                      </p>
                    </div>

                    <PayPalButtons 
                      createOrder={createOrder} 
                      onApprove={onApprove} 
                      onError={(err) => setError('PayPal грешка: ' + err)}
                      style={{ layout: 'vertical', shape: 'rect' }}
                    />

                    <button 
                      onClick={() => setStep('shipping')}
                      className="w-full mt-4 border border-gray-700 text-gray-300 hover:text-white py-3 rounded-lg transition-colors"
                    >
                      ← Обратно към адреса
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-primary border border-gray-800 rounded-xl p-6 sticky top-8">
                <h2 className="text-xl font-bold text-white mb-6">Обобщение на поръчката</h2>
                
                {/* Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover rounded-lg" 
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent rounded-full text-xs flex items-center justify-center text-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.name}</p>
                        {item.color && <p className="text-gray-500 text-xs">Цвят: {item.color}</p>}
                        {item.size && <p className="text-gray-500 text-xs">Размер: {item.size}</p>}
                      </div>
                      <p className="text-white font-bold text-sm">
                        {(item.price * item.quantity).toFixed(2)} лв
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-700 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-400">
                    <span>Междинна сума</span>
                    <span>{getSubtotal().toFixed(2)} лв</span>
                  </div>
                  
                  {discountCode && (
                    <div className="flex justify-between text-green-400">
                      <span>Отстъпка ({discountCode.percentage}%)</span>
                      <span>-{getDiscount().toFixed(2)} лв</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-400">
                    <span>Доставка</span>
                    <span className="text-green-400">Безплатна</span>
                  </div>
                  
                  <div className="flex justify-between text-white font-bold text-xl pt-2 border-t border-gray-700">
                    <span>Общо</span>
                    <span className="text-accent">{getTotal().toFixed(2)} лв</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center gap-2 text-gray-400 text-sm">
                  <FiShield className="text-green-400" />
                  <span>Сигурно плащане с SSL криптиране</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
