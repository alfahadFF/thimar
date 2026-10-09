/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MarketItem, 
  CartItem, 
  Specialist, 
  CategoryId, 
  ConsultationBooking,
  ClinicDirectoryItem,
  ScientificArticle,
  WeatherAlert,
  PriceAlert,
  FarmerDiaryTask
} from './types';
import { 
  INITIAL_PRODUCTS, 
  SPECIALISTS, 
  MARKET_RATES,
  CLINIC_DIRECTORY,
  SCIENTIFIC_ARTICLES,
  WEATHER_ALERTS,
  INITIAL_PRICE_ALERTS,
  INITIAL_DIARY_TASKS
} from './data/mockData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Overview } from './components/Overview';
import { Marketplace } from './components/Marketplace';
import { ClinicsDirectory } from './components/ClinicsDirectory';
import { InteractiveClinicsMap } from './components/InteractiveClinicsMap';
import { ScientificArticles } from './components/ScientificArticles';
import { FarmerDiary } from './components/FarmerDiary';
import { WeatherAlertsSection } from './components/WeatherAlertsSection';
import { PriceAlertsModal } from './components/PriceAlertsModal';
import { ClinicsConsultations } from './components/ClinicsConsultations';
import { EngineeringCalculators } from './components/EngineeringCalculators';
import { MarketRates } from './components/MarketRates';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AddProductModal } from './components/AddProductModal';
import { BookingModal } from './components/BookingModal';
import { AIConsultantModal } from './components/AIConsultantModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [products, setProducts] = useState<MarketItem[]>(INITIAL_PRODUCTS);
  const [specialists] = useState<Specialist[]>(SPECIALISTS);
  const [rates] = useState(MARKET_RATES);
  const [directory, setDirectory] = useState<ClinicDirectoryItem[]>(CLINIC_DIRECTORY);
  const [articles] = useState<ScientificArticle[]>(SCIENTIFIC_ARTICLES);
  const [weatherAlerts] = useState<WeatherAlert[]>(WEATHER_ALERTS);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(INITIAL_PRICE_ALERTS);
  const [diaryTasks, setDiaryTasks] = useState<FarmerDiaryTask[]>(INITIAL_DIARY_TASKS);

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Price Alerts Modal
  const [isPriceAlertsOpen, setIsPriceAlertsOpen] = useState<boolean>(false);

  // Modals state
  const [selectedProductDetail, setSelectedProductDetail] = useState<MarketItem | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);
  const [selectedSpecialistBooking, setSelectedSpecialistBooking] = useState<Specialist | null>(null);
  
  // AI Consultant state
  const [isAiConsultantOpen, setIsAiConsultantOpen] = useState<boolean>(false);
  const [aiInitialTopic, setAiInitialTopic] = useState<string>('استشارة عامة');
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');

  // Cart Handlers
  const handleAddToCart = (product: MarketItem, qty: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Add Product Handler
  const handleAddNewProduct = (newItem: MarketItem) => {
    setProducts(prev => [newItem, ...prev]);
    setSelectedCategory(newItem.category);
    setActiveTab('market');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Clinic to Directory
  const handleAddClinic = (newClinic: ClinicDirectoryItem) => {
    setDirectory(prev => [newClinic, ...prev]);
  };

  // Price Alerts Handlers
  const handleAddPriceAlert = (newAlert: PriceAlert) => {
    setPriceAlerts(prev => [newAlert, ...prev]);
  };

  const handleTogglePriceAlert = (id: string) => {
    setPriceAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const handleDeletePriceAlert = (id: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Farmer Diary Handlers
  const handleAddDiaryTask = (newTask: FarmerDiaryTask) => {
    setDiaryTasks(prev => [newTask, ...prev]);
  };

  const handleToggleDiaryTask = (id: string) => {
    setDiaryTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? 'اليوم' : undefined } : t));
  };

  const handleDeleteDiaryTask = (id: string) => {
    setDiaryTasks(prev => prev.filter(t => t.id !== id));
  };

  // Navigation Helper
  const handleNavigateTab = (tab: string, category?: CategoryId) => {
    if (category) {
      setSelectedCategory(category);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAiWithContext = (topic: string, prompt: string) => {
    setAiInitialTopic(topic);
    setAiInitialPrompt(prompt);
    setIsAiConsultantOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const activeAlertsCount = priceAlerts.filter(a => a.active).length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      
      {/* 3-Zone Sticky Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAiConsultant={() => {
          setAiInitialTopic('استشارة عامة');
          setAiInitialPrompt('');
          setIsAiConsultantOpen(true);
        }}
        onOpenPriceAlerts={() => setIsPriceAlertsOpen(true)}
        activeAlertsCount={activeAlertsCount}
      />

      <main className="flex-1">
        
        {/* Render Tab Contents */}
        {activeTab === 'overview' && (
          <>
            <Hero
              onExploreMarket={() => {
                setActiveTab('market');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDirectory={() => {
                setActiveTab('directory');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenMap={() => {
                setActiveTab('map');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDiary={() => {
                setActiveTab('diary');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenArticles={() => {
                setActiveTab('articles');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenWeather={() => {
                setActiveTab('weather');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenPriceAlerts={() => setIsPriceAlertsOpen(true)}
              onOpenAiConsultant={() => {
                setAiInitialTopic('استشارة عامة');
                setAiInitialPrompt('');
                setIsAiConsultantOpen(true);
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchSubmit={(e) => {
                e.preventDefault();
                setActiveTab('market');
              }}
            />

            <Overview
              products={products}
              specialists={specialists}
              rates={rates}
              directory={directory}
              articles={articles}
              weatherAlerts={weatherAlerts}
              diaryTasks={diaryTasks}
              onToggleDiaryTask={handleToggleDiaryTask}
              onNavigateTab={handleNavigateTab}
              onOpenProductDetail={(prod) => setSelectedProductDetail(prod)}
              onAddToCart={(prod) => handleAddToCart(prod, 1)}
              onOpenAiConsultant={() => {
                setAiInitialTopic('استشارة عامة');
                setAiInitialPrompt('');
                setIsAiConsultantOpen(true);
              }}
              onOpenPriceAlerts={() => setIsPriceAlertsOpen(true)}
            />
          </>
        )}

        {/* Tab 2: Marketplace */}
        {activeTab === 'market' && (
          <Marketplace
            products={products}
            onAddToCart={(prod) => handleAddToCart(prod, 1)}
            onOpenProductDetail={(prod) => setSelectedProductDetail(prod)}
            onOpenAddProduct={() => setIsAddProductOpen(true)}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* Tab 3: Clinics & Labs Directory */}
        {activeTab === 'directory' && (
          <ClinicsDirectory
            directory={directory}
            onAddClinic={handleAddClinic}
          />
        )}

        {/* Tab: Interactive Map */}
        {activeTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
                  <span>الخريطة الجغرافية التفاعلية</span>
                  <span aria-hidden="true">·</span>
                  <span>تحديد الموقع عبر GPS أو اختيار المنطقة الحقلية</span>
                </div>
                <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                  خريطة العيادات البيطرية والمختبرات الزراعية الأقرب لمزرعتك
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  تحديد مباشر للمسافة بالكيلومتر بين موقعك الجغرافي وأقرب المراكز التخصصية، مع إمكانية التوجيه الملاحي والاتصال السريع.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('directory')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  استعراض بطاقات الدليل ({directory.length})
                </button>
              </div>
            </div>

            <InteractiveClinicsMap facilities={directory} />
          </div>
        )}

        {/* Tab 4: Scientific Articles */}
        {activeTab === 'articles' && (
          <ScientificArticles
            articles={articles}
          />
        )}

        {/* Tab 5: Farmer Diary */}
        {activeTab === 'diary' && (
          <FarmerDiary
            tasks={diaryTasks}
            onAddTask={handleAddDiaryTask}
            onToggleTask={handleToggleDiaryTask}
            onDeleteTask={handleDeleteDiaryTask}
          />
        )}

        {/* Tab 6: Agricultural Engineering Calculations */}
        {activeTab === 'engineering' && (
          <EngineeringCalculators />
        )}

        {/* Tab 6: Weather & Rain Alerts */}
        {activeTab === 'weather' && (
          <WeatherAlertsSection
            alerts={weatherAlerts}
          />
        )}

        {/* Tab 7: Market Rates */}
        {activeTab === 'rates' && (
          <MarketRates rates={rates} />
        )}

      </main>

      {/* Footer */}
      <Footer 
        onNavigateTab={handleNavigateTab}
        onOpenAiConsultant={() => {
          setAiInitialTopic('استشارة عامة');
          setAiInitialPrompt('');
          setIsAiConsultantOpen(true);
        }}
        onOpenPriceAlerts={() => setIsPriceAlertsOpen(true)}
      />

      {/* Price Alerts Modal */}
      <PriceAlertsModal
        isOpen={isPriceAlertsOpen}
        onClose={() => setIsPriceAlertsOpen(false)}
        rates={rates}
        alerts={priceAlerts}
        onAddAlert={handleAddPriceAlert}
        onToggleAlert={handleTogglePriceAlert}
        onDeleteAlert={handleDeletePriceAlert}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
      />

      {/* Add Product Modal for Farmers & Vendors */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddNewProduct}
      />

      {/* Specialist Booking Modal */}
      <BookingModal
        specialist={selectedSpecialistBooking}
        onClose={() => setSelectedSpecialistBooking(null)}
        onConfirmBooking={(_booking: ConsultationBooking) => {
          // Booking recorded
        }}
      />

      {/* AI Agricultural & Veterinary Consultant Modal */}
      <AIConsultantModal
        isOpen={isAiConsultantOpen}
        onClose={() => setIsAiConsultantOpen(false)}
        initialTopic={aiInitialTopic}
        initialPrompt={aiInitialPrompt}
      />

    </div>
  );
}
