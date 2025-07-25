import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, Calendar, Clock, Tag, Users, Edit, PlusCircle, CreditCard, Ticket, ShoppingCart, Sun, Moon, ArrowRight, Wallet, X, Copy, CheckCircle, XCircle, Home, Settings, Package, Trophy, UserCircle2 } from 'lucide-react';

// --- MOCK DATA --- //
// Simulating a database for our self-contained application

const GOLF_COURSES = [
  "Babe Zaharias GC", "Bardmoor GC", "Black Diamond Ranch", "Bloomingdale GC", "Brooksville C.C.", "Candler Hills", "Canyon Lake Golf Club", "Chi Chi Rodriguez GC", "Citrus Springs Golf & CC", "Cove Cay CC", "Crescent Oaks GC", "Cypress Creek", "Dunes Golf Club (The Villages)", "Dunedin GC", "Eagles Golf Forest/Lakes", "Fox Hollow GC", "Golden Ocala", "Heritage Harbor GC", "Heritage Isles GC", "Juliette Falls", "Lake Jovita G&CC", "Lansbrook GC", "Links of Lake Bernadette", "Northdale Golf", "Ocala Golf Club", "Plantation Golf Club", "Plantation Palms GC", "Rocky Point GC", "Rogers Park GC", "Saddlebrook Resort", "Seminole Lake CC", "SilverDollar GC", "Stoneybrook Golf Club (Sarasota)", "Summerfield Golf & CC", "Tara Golf & CC", "Tarpon Springs GC", "Tarpon Woods GC", "Temple Terrace Golf & CC", "The Groves G&CC", "Timber Greens GC", "TPC Tampa Bay", "Wentworth GC", "Westchase GC"
];

const initialProShopItems = [
  { id: 'polo-01', name: 'Titleist Performance Polo', category: 'Apparel', originalPrice: 85.00 },
  { id: 'polo-02', name: 'FootJoy ProDry Polo', category: 'Apparel', originalPrice: 78.00, salePrice: 65.00 },
  { id: 'glove-01', name: 'Titleist Players Glove', category: 'Accessories', originalPrice: 32.00 },
  { id: 'balls-01', name: 'Titleist Pro V1 (Dozen)', category: 'Equipment', originalPrice: 55.00 },
  { id: 'shoes-01', name: 'FootJoy HyperFlex Shoes', category: 'Footwear', originalPrice: 150.00 },
];

const initialMembershipTiers = [
  { id: 'summer', name: 'Summer Membership', originalPrice: 599, benefits: ['Weekday Golf', '10% off Pro Shop'] },
  { id: 'winter', name: 'Winter Membership', originalPrice: 899, benefits: ['Anytime Golf', '15% off Pro Shop'] },
  { id: 'year-around', name: 'Year-Around Membership', originalPrice: 1299, benefits: ['Unlimited Anytime Golf', '20% off Pro Shop', 'Free Range Balls'] },
];

const initialTournaments = [
  { id: 'tour-01', name: 'Florida Summer Classic', originalPrice: 250 },
  { id: 'tour-02', name: 'Tampa Bay Amateur Open', originalPrice: 300 },
];

const MOCK_GOLFERS = [
  { id: 'golfer-01', name: 'John Doe', email: 'john.doe@example.com', membershipTier: 'year-around', isNew: false, redemptions: {}, lastActivityDate: '2025-07-15T10:00:00Z', dob: '1985-07-26', membershipValidUntil: '2026-03-31' },
  { id: 'golfer-02', name: 'Jane Smith', email: 'jane.smith@example.com', membershipTier: 'summer', isNew: true, redemptions: {}, lastActivityDate: '2025-07-25T10:00:00Z', dob: '1992-03-15', membershipValidUntil: '2025-09-30' },
  { id: 'golfer-03', name: 'Peter Jones', email: 'peter.jones@example.com', membershipTier: 'winter', isNew: false, redemptions: {}, lastActivityDate: '2024-01-10T10:00:00Z', dob: '1978-11-05', membershipValidUntil: '2025-12-31' },
];

const initialTeeTimes = [
  { id: 'tt1', course: 'Westchase GC', teeTime: `2025-07-21T14:30:00Z`, originalPrice: 75.00 },
  { id: 'tt2', course: 'Fox Hollow GC', teeTime: `2025-07-21T16:00:00Z`, originalPrice: 80.00 },
  { id: 'tt3', course: 'TPC Tampa Bay', teeTime: `2025-07-21T10:00:00Z`, originalPrice: 150.00 },
];

const initialPromotions = [
  {
    id: 'promo-01',
    couponCode: 'TWILIGHT49',
    name: 'Weekday Golf Special',
    type: 'Fixed Price',
    headline: 'Play a Round for a Flat $49 on Weekdays!',
    fixedPrice: 49.00,
    description: 'Enjoy a round of golf at a special price. Valid on weekdays at participating courses.',
    applicableProductType: 'Tee Times',
    applicableCourses: ['Westchase GC', 'Fox Hollow GC', 'TPC Tampa Bay', 'Lansbrook GC'],
    excludedCourses: [],
    applicableItems: [],
    applicableCategories: [],
    applicableTiers: [],
    applicableTournaments: [],
    targetAudience: 'All Golfers',
    startDate: '2025-06-01T00:00:00Z',
    endDate: '2025-08-31T23:59:59Z',
    totalRedemptionsLimit: 100,
    totalRedemptionsUsed: 25,
    redemptionsPerGolfer: 3,
    applicableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    startTime: '08:00',
    endTime: '18:00',
    playerCount: 'Per Player',
    validChannels: ['Online', 'POS'],
    autoApply: true,
    stackable: false,
    fullPriceItemsOnly: true,
  },
  {
    id: 'promo-02',
    couponCode: 'APPARELDEAL',
    name: 'Pro Shop Apparel Deal',
    type: 'Fixed Price',
    headline: 'All Apparel Just $60!',
    fixedPrice: 60.00,
    description: 'Upgrade your style with our premium apparel at an unbeatable price.',
    applicableProductType: 'Golfer Pro Shop',
    applicableCourses: [],
    excludedCourses: [],
    applicableItems: [],
    applicableCategories: ['Apparel'],
    applicableTiers: [],
    applicableTournaments: [],
    targetAudience: 'All Golfers',
    startDate: '2025-07-20T00:00:00Z',
    endDate: '2025-07-28T23:59:59Z',
    totalRedemptionsLimit: 50,
    totalRedemptionsUsed: 10,
    redemptionsPerGolfer: 1,
    applicableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    startTime: '',
    endTime: '',
    validChannels: ['Online'],
    autoApply: true,
    stackable: false,
    fullPriceItemsOnly: true,
  },
  {
    id: 'promo-03',
    couponCode: 'MEMBERPROV1',
    name: 'Year-Around Member Exclusive',
    type: 'Fixed Price',
    headline: 'Exclusive: Titleist Pro V1 Dozen for $40',
    fixedPrice: 40.00,
    description: 'A special thank you to our most loyal members.',
    applicableProductType: 'Golfer Pro Shop',
    applicableCourses: [],
    excludedCourses: [],
    applicableItems: ['balls-01'],
    applicableCategories: [],
    applicableTiers: [],
    applicableTournaments: [],
    targetAudience: 'Specific Membership Tiers',
    targetTiers: ['year-around'],
    startDate: '2025-07-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    totalRedemptionsLimit: null,
    totalRedemptionsUsed: 5,
    redemptionsPerGolfer: 5,
    applicableDays: [],
    startTime: '',
    endTime: '',
    validChannels: ['Online', 'POS'],
    autoApply: true,
    stackable: false,
    fullPriceItemsOnly: false,
  },
  {
    id: 'promo-04',
    couponCode: 'SUMMER500',
    name: 'Summer Membership Special',
    type: 'Fixed Price',
    headline: 'Get the Summer Membership for $500!',
    fixedPrice: 500.00,
    description: 'Kick off the summer with a great deal on membership.',
    applicableProductType: 'Membership Tiers',
    applicableCourses: [],
    excludedCourses: [],
    applicableItems: [],
    applicableCategories: [],
    applicableTiers: ['summer'],
    applicableTournaments: [],
    targetAudience: 'All Golfers',
    startDate: '2025-05-01T00:00:00Z',
    endDate: '2025-07-31T23:59:59Z',
    totalRedemptionsLimit: 20,
    totalRedemptionsUsed: 10,
    redemptionsPerGolfer: 1,
    applicableDays: [],
    startTime: '',
    endTime: '',
    validChannels: ['Online'],
    autoApply: true,
    stackable: false,
    fullPriceItemsOnly: true,
  },
  {
    id: 'promo-05',
    couponCode: 'FLCLASSIC200',
    name: 'Early Bird Tournament Pass',
    type: 'Fixed Price',
    headline: 'Florida Summer Classic Pass for $200',
    fixedPrice: 200.00,
    description: 'Get your pass early for the Florida Summer Classic and save!',
    applicableProductType: 'Tournament Passes',
    applicableCourses: [],
    excludedCourses: [],
    applicableItems: [],
    applicableCategories: [],
    applicableTiers: [],
    applicableTournaments: ['tour-01'],
    targetAudience: 'All Golfers',
    startDate: '2025-06-01T00:00:00Z',
    endDate: '2025-07-25T23:59:59Z',
    totalRedemptionsLimit: 50,
    totalRedemptionsUsed: 15,
    redemptionsPerGolfer: 1,
    applicableDays: [],
    startTime: '',
    endTime: '',
    validChannels: ['Online'],
    autoApply: true,
    stackable: false,
    fullPriceItemsOnly: true,
  }
];


// --- UTILITY FUNCTIONS --- //
const dayOfWeekAsString = (date) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getUTCDay()];

const applyBestDeal = (product, productType, golfer, promotions, simulationDate) => {
  let bestOffer = { ...product, finalPrice: product.salePrice || product.originalPrice, appliedPromotion: null };
  let bestPrice = product.salePrice || product.originalPrice;

  const applicablePromotions = promotions.filter(promo => {
    // Channel check (Online only)
    if (!promo.validChannels.includes('Online')) return false;

    // Auto-apply check
    if (!promo.autoApply) return false;

    // Status check
    const now = simulationDate;
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);
    if (now < startDate || now > endDate) return false;
    if (promo.totalRedemptionsLimit !== null && promo.totalRedemptionsUsed >= promo.totalRedemptionsLimit) return false;

    // Full price item check
    if (promo.fullPriceItemsOnly && product.salePrice) return false;

    // User Eligibility & Limit Check
    const userRedemptions = (golfer.redemptions || {})[promo.id] || 0;
    if (userRedemptions >= promo.redemptionsPerGolfer) return false;

    // Advanced Audience Targeting
    if (promo.targetAudience === 'Specific Membership Tiers' && !(promo.targetTiers || []).includes(golfer.membershipTier)) return false;
    if (promo.targetAudience === 'New Customers Only' && !golfer.isNew) return false;

    // Product & Contextual Eligibility Check
    if (promo.applicableProductType !== productType) return false;

    switch (productType) {
      case 'Tee Times':
        if (!promo.applicableCourses.includes(product.course)) return false;
        const teeTimeDate = new Date(product.teeTime);
        if (promo.applicableDays.length > 0 && !promo.applicableDays.includes(dayOfWeekAsString(teeTimeDate))) return false;
        const teeTimeHour = teeTimeDate.getUTCHours();
        const teeTimeMinutes = teeTimeDate.getUTCMinutes();
        const teeTimeValue = teeTimeHour + teeTimeMinutes / 60;

        if (promo.startTime) {
          const [startHour, startMinute] = promo.startTime.split(':').map(Number);
          if (teeTimeValue < (startHour + startMinute / 60)) return false;
        }
        if (promo.endTime) {
          const [endHour, endMinute] = promo.endTime.split(':').map(Number);
          if (teeTimeValue > (endHour + endMinute / 60)) return false;
        }
        break;
      case 'Golfer Pro Shop':
        if ((promo.excludedCategories || []).includes(product.category)) return false;
        if ((promo.excludedItems || []).includes(product.id)) return false;
        if (promo.applicableCategories.length > 0 && !promo.applicableCategories.includes(product.category)) return false;
        if (promo.applicableItems.length > 0 && !promo.applicableItems.includes(product.id)) return false;
        break;
      case 'Membership Tiers':
        if ((promo.applicableTiers || []).length > 0 && !promo.applicableTiers.includes(product.id)) return false;
        break;
      case 'Tournament Passes':
        if ((promo.applicableTournaments || []).length > 0 && !promo.applicableTournaments.includes(product.id)) return false;
        break;
      default:
        return false;
    }

    return true;
  });

  applicablePromotions.forEach(promo => {
    if (promo.fixedPrice < bestPrice) {
      bestPrice = promo.fixedPrice;
      bestOffer = {
        ...product,
        finalPrice: promo.fixedPrice,
        appliedPromotion: {
          id: promo.id,
          headline: promo.headline,
        },
      };
    }
  });

  return bestOffer;
};


// --- UI COMPONENTS --- //

const Header = ({ currentView, setView }) => (
  <header className="bg-white shadow-md p-4 sticky top-0 z-20">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      {/* <div className="flex items-center space-x-2"> */}
      {/*   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-600"> */}
      {/*     <path fillRule="evenodd" d="M11.226 1.062c.33-.233.788-.233 1.118 0l8.25 5.828a.75.75 0 01.226.53v12.75a.75.75 0 01-.75.75h-3.75a.75.75 0 01-.75-.75V16.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v3.75a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V7.42a.75.75 0 01.226-.53l8.25-5.828zM12 3.42L4.5 9.045V19.5h3V16.5a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25v3h3V9.045L12 3.42z" clipRule="evenodd" /> */}
      {/*   </svg> */}
      {/*   <h1 className="text-2xl font-bold text-gray-800">Paradise Golf Tech</h1> */}
      {/* </div> */}
      <div className="bg-gray-200 p-1 rounded-full flex space-x-1">
        {['Admin', 'Golfer', 'Golf Course'].map(view => (
          <button
            key={view}
            onClick={() => setView(view.toLowerCase().replace(' ', ''))}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${currentView === view.toLowerCase().replace(' ', '') ? 'bg-green-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  </header>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- ADMIN VIEW COMPONENTS --- //

const PromotionForm = ({ promotion, onSave, onCancel, proShopItems, membershipTiers, tournaments }) => {
  const [formData, setFormData] = useState(promotion || {
    type: 'Fixed Price',
    name: '',
    headline: '',
    couponCode: '',
    fixedPrice: '',
    description: '',
    applicableProductType: '',
    applicableCourses: [],
    excludedCourses: [],
    applicableItems: [],
    applicableCategories: [],
    applicableTiers: [],
    applicableTournaments: [],
    targetAudience: 'All Golfers',
    targetTiers: [],
    startDate: '',
    endDate: '',
    totalRedemptionsLimit: '',
    redemptionsPerGolfer: '',
    applicableDays: [],
    startTime: '',
    endTime: '',
    playerCount: 'Per Player',
    validChannels: ['Online', 'POS'],
    autoApply: true,
    stackable: false,
    fullPriceItemsOnly: true,
  });

  useEffect(() => {
    if (!promotion) { // Only for new promotions
      const code = `${(formData.name || 'PROMO').toUpperCase().replace(/\s/g, '')}${formData.fixedPrice || ''}`;
      setFormData(fd => ({ ...fd, couponCode: code }));
    }
  }, [formData.name, formData.fixedPrice, promotion]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const list = formData[name] || [];
      if (checked) {
        setFormData({ ...formData, [name]: [...list, value] });
      } else {
        setFormData({ ...formData, [name]: list.filter(item => item !== value) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id: promotion ? promotion.id : `promo-${Date.now()}` });
  };

  const renderProductSpecificFields = () => {
    switch (formData.applicableProductType) {
      case 'Tee Times':
        return (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-gray-700">Tee Time Conditions</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Courses</label>
              <select multiple name="applicableCourses" value={formData.applicableCourses} onChange={(e) => handleMultiSelectChange('applicableCourses', Array.from(e.target.selectedOptions, option => option.value))} className="w-full p-2 border rounded-md h-32">
                {GOLF_COURSES.map(course => <option key={course} value={course}>{course}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excluded Courses</label>
              <select multiple name="excludedCourses" value={formData.excludedCourses} onChange={(e) => handleMultiSelectChange('excludedCourses', Array.from(e.target.selectedOptions, option => option.value))} className="w-full p-2 border rounded-md h-32">
                {GOLF_COURSES.map(course => <option key={course} value={course}>{course}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Days</label>
              <div className="grid grid-cols-4 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <label key={day} className="flex items-center space-x-2">
                    <input type="checkbox" name="applicableDays" value={day} checked={(formData.applicableDays || []).includes(day)} onChange={(e) => {
                      const list = formData.applicableDays || [];
                      if (e.target.checked) {
                        setFormData({ ...formData, applicableDays: [...list, day] });
                      } else {
                        setFormData({ ...formData, applicableDays: list.filter(item => item !== day) });
                      }
                    }} className="rounded" />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                <input type="time" name="startTime" value={formData.startTime || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                <input type="time" name="endTime" value={formData.endTime || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
            </div>
            <div>
              <label htmlFor="playerCount" className="block text-sm font-medium text-gray-700">Price Applied</label>
              <select name="playerCount" value={formData.playerCount} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                <option>Per Player</option>
                <option>For Group (e.g., Foursome)</option>
              </select>
            </div>
          </div>
        );
      case 'Golfer Pro Shop':
        return (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-gray-700">Pro Shop Conditions</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Categories</label>
              <select multiple name="applicableCategories" value={formData.applicableCategories} onChange={(e) => handleMultiSelectChange('applicableCategories', Array.from(e.target.selectedOptions, option => option.value))} className="w-full p-2 border rounded-md h-24">
                {[...new Set(proShopItems.map(item => item.category))].map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Items (SKUs)</label>
              <select multiple name="applicableItems" value={formData.applicableItems} onChange={(e) => handleMultiSelectChange('applicableItems', Array.from(e.target.selectedOptions, option => option.value))} className="w-full p-2 border rounded-md h-32">
                {proShopItems.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>
          </div>
        );
      case 'Membership Tiers':
        return (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-gray-700">Membership Conditions</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Tiers</label>
              <select multiple name="applicableTiers" value={formData.applicableTiers} onChange={(e) => handleMultiSelectChange('applicableTiers', Array.from(e.target.selectedOptions, option => option.value))} className="w-full p-2 border rounded-md h-24">
                {membershipTiers.map(tier => <option key={tier.id} value={tier.id}>{tier.name}</option>)}
              </select>
            </div>
          </div>
        );
      case 'Tournament Passes':
        return (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-gray-700">Tournament Conditions</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Tournaments</label>
              <select multiple name="applicableTournaments" value={formData.applicableTournaments} onChange={(e) => handleMultiSelectChange('applicableTournaments', Array.from(e.target.selectedOptions, option => option.value))} className="w-full p-2 border rounded-md h-24">
                {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">{promotion ? 'Edit' : 'Create'} Fixed Price Promotion</h2>

      {/* General Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required placeholder="Promotion Name (Internal)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
        <input type="text" name="headline" value={formData.headline || ''} onChange={handleChange} required placeholder="Display Headline (Public)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
        <input type="number" name="fixedPrice" value={formData.fixedPrice || ''} onChange={handleChange} required placeholder="Fixed Price (USD)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" step="0.01" />
        <input type="text" name="couponCode" value={formData.couponCode || ''} onChange={handleChange} required placeholder="Coupon Code" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 focus:border-green-500 focus:ring-green-500" />
        <textarea name="description" value={formData.description || ''} onChange={handleChange} rows="3" placeholder="Description" className="md:col-span-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"></textarea>
      </div>

      {/* Applicability */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Product Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Tee Times', 'Golfer Pro Shop', 'Membership Tiers', 'Tournament Passes'].map(type => (
              <label key={type} className="flex items-center space-x-2">
                <input type="radio" name="applicableProductType" value={type} checked={formData.applicableProductType === type} onChange={handleChange} className="text-green-600 focus:ring-green-500" />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>
        {renderProductSpecificFields()}
      </div>

      {/* Application Rules */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Application Rules</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="autoApply" checked={formData.autoApply} onChange={e => setFormData({ ...formData, autoApply: e.target.checked })} />
            <span>Auto-Apply</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="stackable" checked={formData.stackable} onChange={e => setFormData({ ...formData, stackable: e.target.checked })} />
            <span>Stackable</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="fullPriceItemsOnly" checked={formData.fullPriceItemsOnly} onChange={e => setFormData({ ...formData, fullPriceItemsOnly: e.target.checked })} />
            <span>Full-Price Items Only</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valid Channels</label>
          <div className="flex space-x-4">
            <label><input type="checkbox" name="validChannels" value="Online" checked={formData.validChannels.includes('Online')} onChange={handleChange} /> Online</label>
            <label><input type="checkbox" name="validChannels" value="POS" checked={formData.validChannels.includes('POS')} onChange={handleChange} /> POS</label>
          </div>
        </div>
      </div>

      {/* Targeting & Conditions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Targeting & Conditions</h3>
        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">Target Audience</label>
          <select name="targetAudience" value={formData.targetAudience} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
            <option>All Golfers</option>
            <option>New Customers Only</option>
            <option>Specific Membership Tiers</option>
            <option>Dormant Members</option>
            <option>Birthday</option>
          </select>
        </div>
        {formData.targetAudience === 'Specific Membership Tiers' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Tiers</label>
            <select multiple name="targetTiers" value={formData.targetTiers} onChange={(e) => handleMultiSelectChange('targetTiers', Array.from(e.target.selectedOptions, option => option.value))} className="w-full p-2 border rounded-md h-24">
              {membershipTiers.map(tier => <option key={tier.id} value={tier.id}>{tier.name}</option>)}
            </select>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" name="startDate" value={(formData.startDate || '').split('T')[0]} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" name="endDate" value={(formData.endDate || '').split('T')[0]} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
          </div>
          <div>
            <label htmlFor="totalRedemptionsLimit" className="block text-sm font-medium text-gray-700">Total Redemptions Limit (0 for unlimited)</label>
            <input type="number" name="totalRedemptionsLimit" value={formData.totalRedemptionsLimit || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
          </div>
          <div>
            <label htmlFor="redemptionsPerGolfer" className="block text-sm font-medium text-gray-700">Redemptions Per Golfer</label>
            <input type="number" name="redemptionsPerGolfer" value={formData.redemptionsPerGolfer || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow">Save Promotion</button>
      </div>
    </form>
  );
};

const PromotionsManager = ({ promotions, setPromotions, simulationDate, proShopItems, membershipTiers, tournaments }) => {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [selectedPromo, setSelectedPromo] = useState(null);

  const handleCreate = () => {
    setSelectedPromo(null);
    setView('form');
  };

  const handleEdit = (promo) => {
    setSelectedPromo(promo);
    setView('form');
  };

  const handleSave = (promoData) => {
    // Ensure numeric fields are stored as numbers, not strings
    const processedData = {
      ...promoData,
      fixedPrice: parseFloat(promoData.fixedPrice) || 0,
      redemptionsPerGolfer: parseInt(promoData.redemptionsPerGolfer, 10) || 0,
      totalRedemptionsLimit: promoData.totalRedemptionsLimit ? parseInt(promoData.totalRedemptionsLimit, 10) : null,
    };

    if (selectedPromo) {
      setPromotions(promotions.map(p => p.id === processedData.id ? processedData : p));
    } else {
      setPromotions([...promotions, { ...processedData, id: `promo-${Date.now()}`, totalRedemptionsUsed: 0 }]);
    }
    setView('list');
  };

  const getStatus = (promo) => {
    const now = simulationDate;
    const start = new Date(promo.startDate);
    const end = new Date(promo.endDate);
    if (now < start) return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Scheduled</span>;
    if (now > end) return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Expired</span>;
    if (promo.totalRedemptionsLimit && promo.totalRedemptionsUsed >= promo.totalRedemptionsLimit) return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Ended</span>;
    return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
  };

  if (view === 'form') {
    return <PromotionForm promotion={selectedPromo} onSave={handleSave} onCancel={() => setView('list')} proShopItems={proShopItems} membershipTiers={membershipTiers} tournaments={tournaments} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Manage Promotions</h2>
        <button onClick={handleCreate} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors">
          <PlusCircle size={20} />
          <span>Create Promotion</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {promotions.map(promo => (
              <tr key={promo.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{promo.name}</div>
                  <div className="text-sm text-gray-500">{promo.headline}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">{promo.couponCode}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatus(promo)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(promo)} className="text-green-600 hover:text-green-900 flex items-center space-x-1">
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminView = ({ promotions, setPromotions, simulationDate, proShopItems, setProShopItems, membershipTiers, setMembershipTiers, tournaments, setTournaments }) => {
  const [activeMenu, setActiveMenu] = useState('promotions');

  const menuItems = [
    { id: 'promotions', label: 'Promotions', icon: Tag },
    { id: 'memberships', label: 'Memberships', icon: CreditCard },
    { id: 'proShop', label: 'Pro Shop', icon: ShoppingCart },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
  ];

  // A generic component for managing simple product lists
  const ManageProduct = ({ items, setItems, title, fields }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const handleSave = (itemData) => {
      const processedData = { ...itemData };
      fields.forEach(field => {
        if (field.type === 'number') {
          if (processedData[field.name] && processedData[field.name] !== '') {
            processedData[field.name] = parseFloat(processedData[field.name]);
          } else {
            delete processedData[field.name];
          }
        }
      });

      if (currentItem) {
        setItems(items.map(i => i.id === processedData.id ? processedData : i));
      } else {
        setItems([...items, { ...processedData, id: `${title.toLowerCase()}-${Date.now()}` }]);
      }
      setIsFormOpen(false);
      setCurrentItem(null);
    };

    const ItemForm = ({ item, onSave, onCancel }) => {
      const [formData, setFormData] = useState(item || {});
      const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
      const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
      }
      return (
        <Modal isOpen={true} onClose={onCancel} title={`${item ? 'Edit' : 'Create'} ${title.slice(0, -1)}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <input type={field.type} name={field.name} value={formData[field.name] || ''} onChange={handleChange} required={field.required !== false} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
            ))}
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Save</button>
            </div>
          </form>
        </Modal>
      )
    };

    return (
      <div>
        {isFormOpen && <ItemForm item={currentItem} onSave={handleSave} onCancel={() => { setIsFormOpen(false); setCurrentItem(null); }} />}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Manage {title}</h2>
          <button onClick={() => { setCurrentItem(null); setIsFormOpen(true); }} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors">
            <PlusCircle size={20} />
            <span>Add New {title.slice(0, -1)}</span>
          </button>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {fields.map(f => <th key={f.name} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{f.label}</th>)}
                <th className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map(item => (
                <tr key={item.id}>
                  {fields.map(f => <td key={f.name} className="px-6 py-4 whitespace-nowrap text-sm">{item[f.name]}</td>)}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => { setCurrentItem(item); setIsFormOpen(true); }} className="text-green-600 hover:text-green-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  };

  return (
    <div className="flex">
      <aside className="w-64 pr-8">
        <nav className="space-y-1">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveMenu(item.id)} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${activeMenu === item.id ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1">
        {activeMenu === 'promotions' && <PromotionsManager promotions={promotions} setPromotions={setPromotions} simulationDate={simulationDate} proShopItems={proShopItems} membershipTiers={membershipTiers} tournaments={tournaments} />}
        {activeMenu === 'memberships' && <ManageProduct items={membershipTiers} setItems={setMembershipTiers} title="Memberships" fields={[{ name: 'name', label: 'Tier Name', type: 'text' }, { name: 'originalPrice', label: 'Price ($)', type: 'number' }]} />}
        {activeMenu === 'proShop' && <ManageProduct items={proShopItems} setItems={setProShopItems} title="Pro Shop Items" fields={[{ name: 'name', label: 'Item Name', type: 'text' }, { name: 'category', label: 'Category', type: 'text' }, { name: 'originalPrice', label: 'Price ($)', type: 'number' }, { name: 'salePrice', label: 'Sale Price ($)', type: 'number', required: false }]} />}
        {activeMenu === 'tournaments' && <ManageProduct items={tournaments} setItems={setTournaments} title="Tournaments" fields={[{ name: 'name', label: 'Tournament Name', type: 'text' }, { name: 'originalPrice', label: 'Price ($)', type: 'number' }]} />}
      </main>
    </div>
  );
};

// --- GOLFER VIEW COMPONENTS --- //

const SimulationTimeController = ({ simulationDate, setSimulationDate }) => {
  // Helper to format date for input[type=date]
  const toInputDateString = (date) => date.toISOString().split('T')[0];
  // Helper to format time for input[type=time]
  const toInputTimeString = (date) => {
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    const currentISODate = toInputDateString(simulationDate);
    const currentISOTime = toInputTimeString(simulationDate);

    let newDateStr;
    if (name === 'date') {
      newDateStr = `${value}T${currentISOTime}:00.000Z`;
    } else { // name === 'time'
      newDateStr = `${currentISODate}T${value}:00.000Z`;
    }
    setSimulationDate(new Date(newDateStr));
  }

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-sm mb-8">
      <h4 className="font-bold mb-2">Simulation Control</h4>
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label htmlFor="sim-date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="sim-date"
            name="date"
            value={toInputDateString(simulationDate)}
            onChange={handleDateTimeChange}
            className="mt-1 block w-full md:w-auto rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="sim-time" className="block text-sm font-medium text-gray-700">Time (UTC)</label>
          <input
            type="time"
            id="sim-time"
            name="time"
            value={toInputTimeString(simulationDate)}
            onChange={handleDateTimeChange}
            className="mt-1 block w-full md:w-auto rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>
        <div className="self-end pb-1">
          <p className="font-mono text-sm text-gray-800">
            {dayOfWeekAsString(simulationDate)}, {simulationDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};

const GolferView = ({ promotions, simulationDate, setSimulationDate, proShopItems, membershipTiers, tournaments, teeTimes }) => {
  const [activeGolfer, setActiveGolfer] = useState(MOCK_GOLFERS[0]);
  const [activeMenu, setActiveMenu] = useState('home'); // home, teeTimes, memberships, proShop, tournaments
  const [copiedCode, setCopiedCode] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWalletAdded, setIsWalletAdded] = useState(false);

  const availablePromotions = useMemo(() => {
    return promotions.filter(promo => {
      if (!promo.validChannels.includes('Online') && !promo.validChannels.includes('POS')) return false;

      const now = simulationDate;
      const startDate = new Date(promo.startDate);
      const endDate = new Date(promo.endDate);
      if (now < startDate || now > endDate) return false;
      if (promo.totalRedemptionsLimit !== null && promo.totalRedemptionsUsed >= promo.totalRedemptionsLimit) return false;
      const userRedemptions = (activeGolfer.redemptions || {})[promo.id] || 0;
      if (userRedemptions >= promo.redemptionsPerGolfer) return false;
      if (promo.targetAudience === 'Specific Membership Tiers' && !(promo.targetTiers || []).includes(activeGolfer.membershipTier)) return false;
      return true;
    });
  }, [promotions, activeGolfer, simulationDate]);

  const copyCode = (code) => {
    const textArea = document.createElement("textarea");
    textArea.value = code;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const showDetails = (promo) => {
    setModalContent({ type: 'promoDetails', data: promo });
    setIsModalOpen(true);
  };

  const addToWallet = (promo) => {
    setIsWalletAdded(false);
    setModalContent({ type: 'walletConfirm', data: promo });
    setIsModalOpen(true);
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'teeTimes', label: 'Book Tee Times', icon: Clock },
    { id: 'memberships', label: 'Buy Membership', icon: CreditCard },
    { id: 'proShop', label: 'Pro Shop', icon: ShoppingCart },
    { id: 'tournaments', label: 'Buy Tournament Pass', icon: Ticket },
  ];

  // --- Page Components ---
  const HomePage = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <MyMembershipCard />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">My Coupons</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {availablePromotions.length > 0 ? availablePromotions.map(promo => (
            <div key={promo.id} className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="font-bold text-green-700">{promo.headline}</p>
              <p className="text-xs text-gray-500 mt-1">{promo.description}</p>
              <div className="mt-3 flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <span className="font-mono text-sm text-gray-800">{promo.couponCode}</span>
                <button onClick={() => copyCode(promo.couponCode)} className="flex items-center space-x-1 text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                  {copiedCode === promo.couponCode ? <CheckCircle size={14} className="text-green-600" /> : <Copy size={14} />}
                  <span>{copiedCode === promo.couponCode ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="flex space-x-2 mt-3 text-xs">
                <button onClick={() => showDetails(promo)} className="font-semibold text-green-600 hover:underline">View Details</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => addToWallet(promo)} className="font-semibold text-green-600 hover:underline">Add to Wallet</button>
              </div>
            </div>
          )) : <p className="text-sm text-gray-500 bg-gray-100 p-4 rounded-md">No special promotions available for you at this time.</p>}
        </div>
      </div>
    </div>
  );

  const ProShopPage = () => {
    const itemsWithDeals = proShopItems.map(item => applyBestDeal(item, 'Golfer Pro Shop', activeGolfer, promotions, simulationDate));
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {itemsWithDeals.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border flex flex-col justify-between">
            <div>
              <p className="font-bold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-500">{item.category}</p>
              {item.salePrice && <p className="text-sm text-red-600 font-bold">ON SALE!</p>}
              {item.appliedPromotion && (
                <p className="text-xs text-green-600 font-semibold mt-2 flex items-center">
                  <Tag size={12} className="inline mr-1" />
                  {item.appliedPromotion.headline}
                </p>
              )}
            </div>
            <div className="mt-4 text-right">
              <p className="text-xl font-bold text-green-600">${item.finalPrice.toFixed(2)}</p>
              {item.finalPrice < item.originalPrice && (
                <p className="text-sm text-gray-500 line-through">${item.originalPrice.toFixed(2)}</p>
              )}
              <button className="mt-2 text-sm text-white bg-green-600 px-4 py-1.5 rounded-full hover:bg-green-700 w-full">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const MyMembershipCard = () => {
    const membership = membershipTiers.find(m => m.id === activeGolfer.membershipTier);
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl py-6 px-4 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500 rounded-full opacity-20"></div>
        <div className="absolute bottom-4 left-4 w-20 h-20 bg-green-500 rounded-full opacity-10"></div>
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">Paradise Golf Tech</h3>
            <span className="px-3 py-1 bg-green-500 text-gray-900 rounded-full text-xs font-bold uppercase">{membership.name}</span>
          </div>
          <div className="flex-grow mt-4 flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
              <UserCircle2 className="w-16 h-16 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Golfer</p>
              <p className="text-2xl font-mono tracking-wider">{activeGolfer.name}</p>
              <p className="text-sm text-gray-400 mt-2">Member ID</p>
              <p className="text-lg font-mono">{activeGolfer.id}</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-4 pt-4">
            <div className="flex justify-between text-xs">
              <div>
                <p className="text-gray-400">VALID UNTIL</p>
                <p className="font-semibold">{activeGolfer.membershipValidUntil}</p>
              </div>
              <div>
                <p className="text-gray-400">BENEFITS</p>
                <ul className="text-right font-semibold">
                  {membership.benefits.map(b => <li key={b}>{b}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TeeTimesPage = () => {
    const slotsWithDeals = teeTimes.map(slot => applyBestDeal(slot, 'Tee Times', activeGolfer, promotions, simulationDate));
    return (
      <div className="space-y-3">
        {slotsWithDeals.map(slot => (
          <div key={slot.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">{slot.course}</p>
              <p className="text-sm text-gray-600">
                <Clock size={14} className="inline mr-1" />
                {new Date(slot.teeTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
              </p>
              {slot.appliedPromotion && (
                <p className="text-xs text-green-600 font-semibold mt-1 flex items-center">
                  <Tag size={12} className="inline mr-1" />
                  {slot.appliedPromotion.headline}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-600">${slot.finalPrice.toFixed(2)}</p>
              {slot.finalPrice < slot.originalPrice && (
                <p className="text-sm text-gray-500 line-through">${slot.originalPrice.toFixed(2)}</p>
              )}
              <button className="mt-1 text-sm text-white bg-green-600 px-3 py-1 rounded-full hover:bg-green-700">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const MembershipPage = () => {
    const tiersWithDeals = membershipTiers.map(tier => applyBestDeal(tier, 'Membership Tiers', activeGolfer, promotions, simulationDate));
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiersWithDeals.map(tier => (
          <div key={tier.id} className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <h4 className="text-xl font-bold text-gray-800">{tier.name}</h4>
            {tier.appliedPromotion && (
              <p className="text-xs text-green-600 font-semibold my-2 flex items-center justify-center">
                <Tag size={12} className="inline mr-1" />
                {tier.appliedPromotion.headline}
              </p>
            )}
            <div className="my-4">
              <p className="text-3xl font-bold text-green-600">${tier.finalPrice.toFixed(2)}</p>
              {tier.finalPrice < tier.originalPrice && (
                <p className="text-md text-gray-500 line-through">${tier.originalPrice.toFixed(2)}</p>
              )}
            </div>
            <button className="w-full text-sm text-white bg-green-600 px-4 py-2 rounded-full hover:bg-green-700">Buy Now</button>
          </div>
        ))}
      </div>
    );
  };

  const TournamentPage = () => {
    const tournamentsWithDeals = tournaments.map(t => applyBestDeal(t, 'Tournament Passes', activeGolfer, promotions, simulationDate));
    return (
      <div className="space-y-3">
        {tournamentsWithDeals.map(t => (
          <div key={t.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">{t.name}</p>
              {t.appliedPromotion && (
                <p className="text-xs text-green-600 font-semibold mt-1 flex items-center">
                  <Tag size={12} className="inline mr-1" />
                  {t.appliedPromotion.headline}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-600">${t.finalPrice.toFixed(2)}</p>
              {t.finalPrice < t.originalPrice && (
                <p className="text-sm text-gray-500 line-through">${t.originalPrice.toFixed(2)}</p>
              )}
              <button className="mt-1 text-sm text-white bg-green-600 px-3 py-1 rounded-full hover:bg-green-700">Buy Pass</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderModalContent = () => {
    if (!modalContent) return null;
    const { data: promo } = modalContent;
    switch (modalContent.type) {
      case 'promoDetails':
        return (
          <div className="space-y-4 text-sm">
            <p className="text-gray-600 italic">{promo.description}</p>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Key Details</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <p><strong>Value:</strong></p><p className="font-bold text-green-600">${promo.fixedPrice.toFixed(2)}</p>
                <p><strong>Product Type:</strong></p><p>{promo.applicableProductType}</p>
                <p><strong>Valid:</strong></p><p>{new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Conditions & Rules</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <p><strong>Audience:</strong></p><p>{promo.targetAudience}</p>
                {promo.targetTiers && promo.targetTiers.length > 0 && <>
                  <p><strong>For Tiers:</strong></p><p>{promo.targetTiers.join(', ')}</p>
                </>}
                <p><strong>Usage Limit:</strong></p><p>{promo.redemptionsPerGolfer} per golfer</p>
                <p><strong>Channels:</strong></p><p>{promo.validChannels.join(', ')}</p>
              </div>
            </div>

            {promo.applicableProductType === 'Tee Times' && (
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Tee Time Specifics</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p><strong>Days:</strong></p><p>{(promo.applicableDays || []).join(', ')}</p>
                  <p><strong>Time:</strong></p><p>{promo.startTime} - {promo.endTime}</p>
                  <p><strong>Price For:</strong></p><p>{promo.playerCount}</p>
                  {(promo.applicableCourses || []).length > 0 && <>
                    <p><strong>Valid At:</strong></p><p>{promo.applicableCourses.join(', ')}</p>
                  </>}
                  {(promo.excludedCourses || []).length > 0 && <>
                    <p><strong>Not Valid At:</strong></p><p>{promo.excludedCourses.join(', ')}</p>
                  </>}
                </div>
              </div>
            )}
          </div>
        );
      case 'walletConfirm':
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
              <Wallet className="h-8 w-8 text-gray-600" />
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 text-white">
              <p className="text-left text-xs font-semibold">Paradise Golf Tech</p>
              <p className="text-lg font-bold my-2">{promo.headline}</p>
              <p className="text-sm font-mono bg-gray-700 inline-block px-2 py-1 rounded">{promo.couponCode}</p>
            </div>
            <button
              onClick={() => setIsWalletAdded(true)}
              disabled={isWalletAdded}
              className={`w-full px-4 py-2 rounded-md font-semibold transition-colors ${isWalletAdded ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {isWalletAdded ? 'Added to Wallet!' : 'Add Pass to Wallet'}
            </button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8  sm:p-0">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent?.data?.headline || 'Details'}>
        {renderModalContent()}
      </Modal>

      {/* Header Section - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome, {activeGolfer.name}!</h2>
        </div>

        {/* Golfer Selector - Mobile Optimized */}
        <div className="flex items-center space-x-2 bg-white p-3 sm:p-2 rounded-lg shadow-sm w-full sm:w-auto">
          <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Switch Golfer:</span>
          <select
            value={activeGolfer.id}
            onChange={(e) => setActiveGolfer(MOCK_GOLFERS.find(g => g.id === e.target.value))}
            className="rounded-md border-gray-300 text-xs sm:text-sm flex-1 sm:flex-none min-w-0"
          >
            {MOCK_GOLFERS.map(g => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.membershipTier})
              </option>
            ))}
          </select>
        </div>
      </div>

      <SimulationTimeController simulationDate={simulationDate} setSimulationDate={setSimulationDate} />

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Mobile-Optimized Tab Navigation */}
        <div className="border-b">
          {/* Mobile: Horizontal Scrollable Tabs */}
          <div className="sm:hidden">
            <div className="flex overflow-x-auto scrollbar-hide px-4 py-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center space-x-2 px-4 py-3 font-semibold transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${activeMenu === item.id
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                  <item.icon size={16} />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: Regular Tab Layout */}
          <div className="hidden sm:flex space-x-1 px-4">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`flex items-center space-x-2 px-4 py-3 font-semibold transition-colors duration-200 ${activeMenu === item.id
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="py-4 sm:py-6">
          {activeMenu === 'home' && <HomePage />}
          {activeMenu === 'teeTimes' && <TeeTimesPage />}
          {activeMenu === 'memberships' && <MembershipPage />}
          {activeMenu === 'proShop' && <ProShopPage />}
          {activeMenu === 'tournaments' && <TournamentPage />}
        </div>
      </div>
    </div>
  );
};

// --- GOLF COURSE VIEW --- //
const GolfCourseView = ({ promotions, setPromotions, simulationDate, golfers, setGolfers, teeTimes, setTeeTimes }) => {
  const [selectedCourse, setSelectedCourse] = useState(GOLF_COURSES[0]);
  const [couponCode, setCouponCode] = useState('');
  const [golferId, setGolferId] = useState('');
  const [redemptionStatus, setRedemptionStatus] = useState(null); // { type: 'success'/'error', message: '...' }
  const [activeTab, setActiveTab] = useState('redemption');
  const [isTeeTimeFormOpen, setIsTeeTimeFormOpen] = useState(false);
  const [currentTeeTime, setCurrentTeeTime] = useState(null);

  const handleRedeem = () => {
    setRedemptionStatus(null);
    const promo = promotions.find(p => p.couponCode.toUpperCase() === couponCode.toUpperCase());
    if (!promo) {
      setRedemptionStatus({ type: 'error', message: 'Invalid coupon code.' });
      return;
    }

    const golfer = golfers.find(g => g.id === golferId);
    if (!golfer) {
      setRedemptionStatus({ type: 'error', message: 'Invalid Golfer ID.' });
      return;
    }

    // --- Run validation checks ---
    if (!promo.validChannels.includes('POS')) {
      setRedemptionStatus({ type: 'error', message: 'This coupon is for Online use only.' }); return;
    }

    const now = simulationDate;
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);
    if (now < startDate) {
      setRedemptionStatus({ type: 'error', message: 'Coupon is not yet active.' }); return;
    }
    if (now > endDate) {
      setRedemptionStatus({ type: 'error', message: 'Coupon has expired.' }); return;
    }
    if (promo.totalRedemptionsLimit !== null && promo.totalRedemptionsUsed >= promo.totalRedemptionsLimit) {
      setRedemptionStatus({ type: 'error', message: 'Coupon has reached its total usage limit.' }); return;
    }
    const userRedemptions = (golfer.redemptions || {})[promo.id] || 0;
    if (userRedemptions >= promo.redemptionsPerGolfer) {
      setRedemptionStatus({ type: 'error', message: `Golfer has already redeemed this offer ${userRedemptions} time(s).` }); return;
    }
    if (promo.targetAudience === 'Specific Membership Tiers' && !(promo.targetTiers || []).includes(golfer.membershipTier)) {
      setRedemptionStatus({ type: 'error', message: `This coupon is only for ${promo.targetTiers.join(', ')} members.` }); return;
    }
    if (promo.applicableProductType === 'Tee Times' && (promo.excludedCourses || []).includes(selectedCourse)) {
      setRedemptionStatus({ type: 'error', message: `This coupon is not valid at ${selectedCourse}.` }); return;
    }

    // --- Success ---
    setRedemptionStatus({ type: 'success', message: `Success! '${promo.headline}' applied for ${golfer.name}. Final Price: $${promo.fixedPrice.toFixed(2)}` });

    // Update state to reflect redemption
    setPromotions(promotions.map(p => p.id === promo.id ? { ...p, totalRedemptionsUsed: p.totalRedemptionsUsed + 1 } : p));
    setGolfers(golfers.map(g => g.id === golfer.id ? { ...g, redemptions: { ...g.redemptions, [promo.id]: userRedemptions + 1 } } : g));

    // Clear inputs after success
    setCouponCode('');
    setGolferId('');
  };

  const handleTeeTimeSave = (teeTimeData) => {
    if (currentTeeTime) {
      setTeeTimes(teeTimes.map(t => t.id === teeTimeData.id ? { ...t, ...teeTimeData } : t));
    } else {
      setTeeTimes([...teeTimes, { ...teeTimeData, id: `tt-${Date.now()}`, course: selectedCourse }]);
    }
    setIsTeeTimeFormOpen(false);
    setCurrentTeeTime(null);
  };

  const TeeTimeForm = ({ teeTime, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      date: teeTime ? teeTime.teeTime.split('T')[0] : '',
      time: teeTime ? teeTime.teeTime.split('T')[1].substring(0, 5) : '',
      originalPrice: teeTime ? teeTime.originalPrice : ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
      e.preventDefault();
      const teeTimeISO = `${formData.date}T${formData.time}:00.000Z`;
      onSave({ teeTime: teeTimeISO, originalPrice: parseFloat(formData.originalPrice), id: teeTime?.id });
    };

    return (
      <Modal isOpen={true} onClose={onCancel} title={`${teeTime ? 'Edit' : 'Create'} Tee Time`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input type="time" name="time" value={formData.time} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Save</button>
          </div>
        </form>
      </Modal>
    )
  };

  return (
    <div className="space-y-6 px-4 sm:px-0">
      {/* Header with select */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Course Operator View</h2>
        <div className="w-full sm:w-auto">
          <label htmlFor="course-select" className="text-sm font-medium mr-2 block sm:inline-block mb-1 sm:mb-0">
            Select a Course:
          </label>
          <select
            id="course-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="p-2 rounded-md border border-gray-300 shadow-sm w-full sm:w-auto"
          >
            {GOLF_COURSES.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav
          className="flex space-x-4 sm:space-x-8 whitespace-nowrap"
          aria-label="Tabs"
        >
          <button
            onClick={() => setActiveTab('redemption')}
            className={`${activeTab === 'redemption'
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-2 sm:px-4 border-b-2 font-medium text-sm sm:text-base`}
          >
            Coupon Redemption
          </button>
          <button
            onClick={() => setActiveTab('manageTeeTimes')}
            className={`${activeTab === 'manageTeeTimes'
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-2 sm:px-4 border-b-2 font-medium text-sm sm:text-base`}
          >
            Manage Tee Times
          </button>
        </nav>
      </div>

      {/* Coupon Redemption Tab */}
      {activeTab === 'redemption' && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
            Coupon Redemption at{' '}
            <span className="text-green-600">{selectedCourse}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label
                htmlFor="coupon-code"
                className="block text-sm font-medium text-gray-700"
              >
                Coupon Code
              </label>
              <input
                type="text"
                id="coupon-code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 font-mono uppercase"
                placeholder="e.g., TWILIGHT49"
              />
            </div>
            <div>
              <label
                htmlFor="golfer-id"
                className="block text-sm font-medium text-gray-700"
              >
                Golfer ID
              </label>
              <input
                type="text"
                id="golfer-id"
                value={golferId}
                onChange={(e) => setGolferId(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="e.g., golfer-01"
              />
            </div>
            <button
              onClick={handleRedeem}
              className="w-full sm:w-auto bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Validate &amp; Redeem
            </button>
          </div>
          {redemptionStatus && (
            <div
              className={`mt-4 p-4 rounded-md text-sm ${redemptionStatus.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}
            >
              <div className="flex items-center">
                {redemptionStatus.type === 'success' ? (
                  <CheckCircle className="mr-2" />
                ) : (
                  <XCircle className="mr-2" />
                )}
                <p>{redemptionStatus.message}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manage Tee Times Tab */}
      {activeTab === 'manageTeeTimes' && (
        <div>
          {isTeeTimeFormOpen && (
            <TeeTimeForm
              teeTime={currentTeeTime}
              onSave={handleTeeTimeSave}
              onCancel={() => {
                setIsTeeTimeFormOpen(false);
                setCurrentTeeTime(null);
              }}
            />
          )}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">
              Tee Times for{' '}
              <span className="text-green-600">{selectedCourse}</span>
            </h3>
            <button
              onClick={() => {
                setCurrentTeeTime(null);
                setIsTeeTimeFormOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors w-full sm:w-auto justify-center"
            >
              <PlusCircle size={20} />
              <span>Add Tee Time</span>
            </button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time (UTC)
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="relative px-4 sm:px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teeTimes
                  .filter((t) => t.course === selectedCourse)
                  .map((t) => (
                    <tr key={t.id}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(t.teeTime).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(t.teeTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'UTC',
                        })}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        ${t.originalPrice.toFixed(2)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setCurrentTeeTime(t);
                            setIsTeeTimeFormOpen(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


export default function FixedPriceForm() {
  const [view, setView] = useState('golfer'); // 'admin', 'golfer', 'golfcourse'
  const [promotions, setPromotions] = useState(initialPromotions);
  const [golfers, setGolfers] = useState(MOCK_GOLFERS);
  const [simulationDate, setSimulationDate] = useState(new Date('2025-07-21T15:00:00Z'));
  const [proShopItems, setProShopItems] = useState(initialProShopItems);
  const [membershipTiers, setMembershipTiers] = useState(initialMembershipTiers);
  const [tournaments, setTournaments] = useState(initialTournaments);
  const [teeTimes, setTeeTimes] = useState(initialTeeTimes);

  const renderView = () => {
    switch (view) {
      case 'admin':
        return <AdminView promotions={promotions} setPromotions={setPromotions} simulationDate={simulationDate} proShopItems={proShopItems} setProShopItems={setProShopItems} membershipTiers={membershipTiers} setMembershipTiers={setMembershipTiers} tournaments={tournaments} setTournaments={setTournaments} />;
      case 'golfer':
        return <GolferView promotions={promotions} simulationDate={simulationDate} setSimulationDate={setSimulationDate} proShopItems={proShopItems} membershipTiers={membershipTiers} tournaments={tournaments} teeTimes={teeTimes} />;
      case 'golfcourse':
        return <GolfCourseView promotions={promotions} setPromotions={setPromotions} simulationDate={simulationDate} golfers={golfers} setGolfers={setGolfers} teeTimes={teeTimes} setTeeTimes={setTeeTimes} />;
      default:
        return <GolferView promotions={promotions} simulationDate={simulationDate} setSimulationDate={setSimulationDate} proShopItems={proShopItems} membershipTiers={membershipTiers} tournaments={tournaments} teeTimes={teeTimes} />;
    }
  };

  return (
    <div className=" min-h-screen font-sans">
      <Header currentView={view} setView={setView} />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {renderView()}
      </main>
    </div>
  );
}
