import React, { useState, useRef, useEffect } from 'react';

// MessageBox Component
const MessageBox = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center relative transform scale-95 opacity-0 animate-scaleIn">
        <h3 className="text-3xl font-extrabold text-gray-900 mb-4">{title}</h3>
        <p className="text-lg text-gray-700 mb-8">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-xl shadow-lg text-xl font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 ease-in-out transform hover:scale-105"
        >
          OK
        </button>
      </div>
    </div>
  );
};

// SecondaryCharacteristicsModal Component
const SecondaryCharacteristicsModal = ({ coupon, onClose }) => {
  if (!coupon) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-lg w-full mx-4 relative transform scale-95 opacity-0 animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-4xl font-light leading-none"
        >
          &times;
        </button>
        <h3 className="text-3xl font-extrabold text-gray-900 mb-6">Coupon Terms & Conditions</h3>
        <div className="text-gray-700 space-y-4 text-lg">
          <p><span className="font-bold text-gray-800">Coupon Name:</span> {coupon.couponName || 'N/A'}</p>
          <p><span className="font-bold text-gray-800">Description:</span> {coupon.couponDescription || 'N/A'}</p>
          <p><span className="font-bold text-gray-800">Activation Date:</span> {formatDate(coupon.activationDate)}</p>
          <p><span className="font-bold text-gray-800">Validity Period:</span> {formatDate(coupon.validFrom)} to {formatDate(coupon.validUntil)}</p>
          <p><span className="font-bold text-gray-800">Total Redemption Limit:</span> {coupon.totalRedemptionLimit === 0 ? 'Unlimited' : coupon.totalRedemptionLimit}</p>
          <p><span className="font-bold text-gray-800">Per-User Redemption Limit:</span> {coupon.perUserRedemptionLimit === 0 ? 'Unlimited' : coupon.perUserRedemptionLimit}</p>
          <p><span className="font-bold text-gray-800">Target Audience:</span> {coupon.targetAudience.join(', ') || 'All'}</p>
          <p><span className="font-bold text-gray-800">Stackable:</span> {coupon.stackable ? 'Yes' : 'No'}</p>
          <p><span className="font-bold text-gray-800">Valid Channels:</span> {coupon.validChannels.join(', ') || 'All'}</p>
          <p><span className="font-bold text-gray-800">Auto-Apply Eligible:</span> {coupon.autoApplyEligible ? 'Yes' : 'No'}</p>
          <p><span className="font-bold text-gray-800">Exclusions:</span> {coupon.exclusions || 'None specified.'}</p>
          <p><span className="font-bold text-gray-800">Full-Price Items Only:</span> {coupon.fullPriceItemsOnly ? 'Yes' : 'No'}</p>
          {coupon.discountProducts === 'Tee Times Coupon (Course Specific)' && (
            <p><span className="font-bold text-gray-800">Course:</span> {coupon.courseName || 'N/A'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// DiscountCard Component (Reusable)
const DiscountCard = ({ coupon, showDetailsButton = false, onShowDetails,
  onRedeemToPurchase, onAddToWallet, onApplyAtCheckout,
  totalRedemptionCount, perUserRedemptionCount, perUserLimit }) => { // Added redemption counts and limit
  if (!coupon) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isRedeemedGlobally = totalRedemptionCount > 0 && coupon.totalRedemptionLimit > 0 && totalRedemptionCount >= coupon.totalRedemptionLimit;
  const isRedeemedByUser = perUserRedemptionCount > 0 && perUserLimit > 0 && perUserRedemptionCount >= perUserLimit;

  // Determine redemption status message
  let redemptionStatusMessage = '';
  if (isRedeemedByUser) {
    redemptionStatusMessage = `Redeemed ${perUserRedemptionCount} / ${perUserLimit} times (limit reached)`;
  } else if (perUserLimit > 0) {
    redemptionStatusMessage = `Redeemed ${perUserRedemptionCount} / ${perUserLimit} times`;
  } else {
    redemptionStatusMessage = `Redeemed ${perUserRedemptionCount} times (Unlimited)`;
  }

  const appliesToText = coupon.discountProducts === 'Tee Times Coupon (Course Specific)'
    ? `Tee Times at ${coupon.courseName || 'Any Course'}`
    : (coupon.discountProducts || 'All Products');


  return (
    <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-2xl p-8 mt-8 shadow-2xl relative overflow-hidden transform hover:scale-102 transition-all duration-300 ease-in-out">
      <div className="absolute inset-0 bg-white opacity-5 rounded-2xl transform -rotate-45 scale-150"></div>
      <h4 className="text-4xl font-extrabold mb-3 leading-tight">{coupon.discountPercentage}% OFF</h4>
      <p className="text-xl mb-2">{coupon.couponName || 'Untitled Coupon'}</p>
      <p className="text-lg opacity-90 mb-3">{coupon.couponDescription || 'No description provided.'}</p>
      <p className="text-xl mb-2">{coupon.minPurchaseValue ? `Min. Purchase: $${coupon.minPurchaseValue}` : 'No Minimum Purchase'}</p>
      <p className="text-xl mb-3">{coupon.maxDiscountValue ? `Max Discount: $${coupon.maxDiscountValue}` : 'No Maximum Discount Cap'}</p>
      {/* Updated to display single product and course */}
      <p className="text-base opacity-90 mb-4">Applies to: {appliesToText}</p>
      <p className="text-base opacity-90 font-medium">Valid: {formatDate(coupon.validFrom)} - {formatDate(coupon.validUntil)}</p>
      <div className="bg-white bg-opacity-20 px-5 py-2 rounded-xl font-extrabold tracking-widest inline-block mt-6 text-xl">
        {coupon.couponCode}
      </div>
      {/* Display redemption status */}
      {redemptionStatusMessage && (
        <p className={`font-extrabold mt-4 text-lg ${isRedeemedByUser ? 'text-red-200 animate-pulse' : 'text-green-100'}`}>
          {redemptionStatusMessage}
        </p>
      )}

      {showDetailsButton && (
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={onShowDetails}
            className="py-3 px-6 rounded-xl shadow-lg text-base font-semibold text-green-800 bg-white hover:bg-gray-100 transition duration-200 ease-in-out transform hover:scale-105"
          >
            View Details
          </button>
          <button
            onClick={onRedeemToPurchase}
            className="py-3 px-6 rounded-xl shadow-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Redeem to Purchase
          </button>
          <button
            onClick={onAddToWallet}
            className="py-3 px-6 rounded-xl shadow-lg text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Add to Wallet
          </button>
          <button
            onClick={onApplyAtCheckout}
            className="py-3 px-6 rounded-xl shadow-lg text-base font-semibold text-white bg-yellow-600 hover:bg-yellow-700 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Apply at Checkout
          </button>
        </div>
      )}
    </div>
  );
};

// AdminView Component
const AdminView = ({ onGenerateCoupon, allCoupons, onCopyCouponCode, onUpdateCoupon, golfCourses }) => {
  const defaultFormData = {
    couponName: '',
    couponDescription: '',
    discountPercentage: '',
    minPurchaseValue: '',
    maxDiscountValue: '',
    discountProducts: '', // Changed to single string
    courseName: '', // New field for course
    activationDate: '',
    validFrom: '',
    validUntil: '',
    totalRedemptionLimit: 0, // 0 for unlimited
    perUserRedemptionLimit: 0, // 0 for unlimited
    targetAudience: ['All Golfers'], // Default
    stackable: false,
    validChannels: ['Online/In-App', 'POS'], // Updated default
    autoApplyEligible: false,
    exclusions: '',
    fullPriceItemsOnly: false,
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCouponCode, setEditingCouponCode] = useState(null); // To store the code of the coupon being edited
  const [showForm, setShowForm] = useState(false); // New state to control form visibility

  // Effect to populate form when a coupon is selected for editing
  useEffect(() => {
    if (isEditing && editingCouponCode && allCoupons.has(editingCouponCode)) {
      const couponToEdit = allCoupons.get(editingCouponCode);
      setFormData({
        couponName: couponToEdit.couponName || '',
        couponDescription: couponToEdit.couponDescription || '',
        discountPercentage: couponToEdit.discountPercentage,
        minPurchaseValue: couponToEdit.minPurchaseValue,
        maxDiscountValue: couponToEdit.maxDiscountValue,
        discountProducts: couponToEdit.discountProducts || '', // Updated for single product
        courseName: couponToEdit.courseName || '', // Populate courseName
        activationDate: couponToEdit.activationDate,
        validFrom: couponToEdit.validFrom,
        validUntil: couponToEdit.validUntil,
        totalRedemptionLimit: couponToEdit.totalRedemptionLimit,
        perUserRedemptionLimit: couponToEdit.perUserRedemptionLimit,
        targetAudience: couponToEdit.targetAudience || [],
        stackable: couponToEdit.stackable,
        validChannels: couponToEdit.validChannels || [],
        autoApplyEligible: couponToEdit.autoApplyEligible,
        exclusions: couponToEdit.exclusions || '',
        fullPriceItemsOnly: couponToEdit.fullPriceItemsOnly,
      });
      setShowForm(true); // Show form when editing
    } else if (!isEditing) {
      // Reset form if not editing or finished editing
      setFormData(defaultFormData);
      setEditingCouponCode(null);
    }
  }, [isEditing, editingCouponCode, allCoupons]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? (value === '' ? '' : Number(value)) : value) // Handle number conversion and empty string
    }));
  };

  const handleMultiSelectChange = (e, fieldName) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const updatedArray = checked
        ? [...prev[fieldName], value]
        : prev[fieldName].filter(item => item !== value);
      return { ...prev, [fieldName]: updatedArray };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      onUpdateCoupon({ ...formData, couponCode: editingCouponCode }); // Use editingCouponCode
      setIsEditing(false); // Exit editing mode
    } else {
      onGenerateCoupon(formData);
    }
    setFormData(defaultFormData); // Reset form after submission
    setShowForm(false); // Hide form after submission
  };

  const handleEditClick = (couponCode) => {
    setIsEditing(true);
    setEditingCouponCode(couponCode);
    setShowForm(true); // Show form when editing
  };

  const handleCreateNewClick = () => {
    setIsEditing(false); // Ensure not in editing mode
    setEditingCouponCode(null); // Clear any editing coupon
    setFormData(defaultFormData); // Reset form for new creation
    setShowForm(true); // Show the form
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCouponCode(null);
    setFormData(defaultFormData); // Reset form to default
    setShowForm(false); // Hide form on cancel
  };

  return (
    <div className="space-y-10">
      {showForm && (
        <h2 className="text-3xl font-extrabold text-gray-800 text-center">Golf Admin: Setup % Percentage Discount</h2>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Coupon Basic Info */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">

            <h3 className="text-2xl font-bold text-gray-800 mb-6">Coupon Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="couponName" className="block text-base font-medium text-gray-700 mb-2">Coupon Name</label>
                <input
                  type="text"
                  id="couponName"
                  name="couponName"
                  value={formData.couponName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                  placeholder="e.g., Summer Savings"
                  required
                />
              </div>
              <div>
                <label htmlFor="couponDescription" className="block text-base font-medium text-gray-700 mb-2">Coupon Description</label>
                <textarea
                  id="couponDescription"
                  name="couponDescription"
                  rows="2"
                  value={formData.couponDescription}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                  placeholder="e.g., 20% off for new members"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Primary Characteristics */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Key Primary Characteristics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="discountPercentage" className="block text-base font-medium text-gray-700 mb-2">Discount Percentage (%)</label>
                <input
                  type="number"
                  id="discountPercentage"
                  name="discountPercentage"
                  min="1" max="100"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                  placeholder="e.g., 20"
                  required
                />
              </div>
              <div>
                <label htmlFor="minPurchaseValue" className="block text-base font-medium text-gray-700 mb-2">Minimum Purchase Value ($)</label>
                <input
                  type="number"
                  id="minPurchaseValue"
                  name="minPurchaseValue"
                  min="0"
                  value={formData.minPurchaseValue}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                  placeholder="e.g., 50"
                />
              </div>
              <div>
                <label htmlFor="maxDiscountValue" className="block text-base font-medium text-gray-700 mb-2">Maximum Discount Value ($)</label>
                <input
                  type="number"
                  id="maxDiscountValue"
                  name="maxDiscountValue"
                  min="0"
                  value={formData.maxDiscountValue}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                  placeholder="e.g., 50"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">Discount Applied On Product</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Membership Card', 'Tee Times Coupon (Course Specific)', 'Tournament Pass', 'Pro Shop Items'].map(product => (
                    <label key={product} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio" // Changed to radio
                        name="discountProducts" // Same name for radio group
                        value={product}
                        checked={formData.discountProducts === product} // Check against single string
                        onChange={handleChange} // Use handleChange for single value
                        className="rounded-full border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500 w-5 h-5 transition duration-150 ease-in-out"
                      />
                      <span className="ml-3 text-base text-gray-700">{product}</span>
                    </label>
                  ))}
                </div>
                {formData.discountProducts === 'Tee Times Coupon (Course Specific)' && (
                  <div className="mt-4">
                    <label htmlFor="courseName" className="block text-base font-medium text-gray-700 mb-2">Select Golf Course</label>
                    <select
                      id="courseName"
                      name="courseName"
                      value={formData.courseName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                      required={formData.discountProducts === 'Tee Times Coupon (Course Specific)'}
                    >
                      <option value="">-- Select a Course --</option>
                      {golfCourses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Usage Limits & Audience */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Usage Limits & Audience</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="totalRedemptionLimit" className="block text-base font-medium text-gray-700 mb-2">Total Redemption Limit (0 for Unlimited)</label>
                <input
                  type="number"
                  id="totalRedemptionLimit"
                  name="totalRedemptionLimit"
                  min="0"
                  value={formData.totalRedemptionLimit}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                  placeholder="e.g., 100"
                />
              </div>
              <div>
                <label htmlFor="perUserRedemptionLimit" className="block text-base font-medium text-gray-700 mb-2">Per-User Redemption Limit (0 for Unlimited)</label>
                <input
                  type="number"
                  id="perUserRedemptionLimit"
                  name="perUserRedemptionLimit"
                  min="0"
                  value={formData.perUserRedemptionLimit}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                  placeholder="e.g., 1"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">Target Audience</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['All Golfers', 'New Golfers', 'Existing Golfers', 'Gold Tier', 'Silver Tier'].map(audience => (
                    <label key={audience} className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="targetAudience"
                        value={audience}
                        checked={formData.targetAudience.includes(audience)}
                        onChange={(e) => handleMultiSelectChange(e, 'targetAudience')}
                        className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500 w-5 h-5 transition duration-150 ease-in-out"
                      />
                      <span className="ml-3 text-base text-gray-700">{audience}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="stackable"
                  name="stackable"
                  checked={formData.stackable}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500 w-5 h-5 transition duration-150 ease-in-out"
                />
                <label htmlFor="stackable" className="ml-3 text-base text-gray-700">Stackable with other offers</label>
              </div>
            </div>
          </div>

          {/* Channel & Auto-Apply */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Channel & Auto-Apply</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">Valid Channels</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Online/In-App', 'POS'].map(channel => (
                    <label key={channel} className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="validChannels"
                        value={channel}
                        checked={formData.validChannels.includes(channel)}
                        onChange={(e) => handleMultiSelectChange(e, 'validChannels')}
                        className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500 w-5 h-5 transition duration-150 ease-in-out"
                      />
                      <span className="ml-3 text-base text-gray-700">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="autoApplyEligible"
                  name="autoApplyEligible"
                  checked={formData.autoApplyEligible}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500 w-5 h-5 transition duration-150 ease-in-out"
                />
                <label htmlFor="autoApplyEligible" className="ml-3 text-base text-gray-700">Auto-Apply Eligible</label>
              </div>
            </div>
          </div>

          {/* Secondary Characteristics */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Secondary Characteristics (Terms & Conditions)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="activationDate" className="block text-base font-medium text-gray-700 mb-2">Activation Date</label>
                <input
                  type="date"
                  id="activationDate"
                  name="activationDate"
                  value={formData.activationDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                  required
                />
              </div>
              <div>
                <label htmlFor="validFrom" className="block text-base font-medium text-gray-700 mb-2">Valid From</label>
                <input
                  type="date"
                  id="validFrom"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                  required
                />
              </div>
              <div>
                <label htmlFor="validUntil" className="block text-base font-medium text-gray-700 mb-2">Valid Until</label>
                <input
                  type="date"
                  id="validUntil"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                  required
                />
              </div>
            </div>
            <div className="mt-8">
              <label htmlFor="exclusions" className="block text-base font-medium text-gray-700 mb-2">Exclusions</label>
              <textarea
                id="exclusions"
                name="exclusions"
                rows="4"
                value={formData.exclusions}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                placeholder="e.g., Not valid on holidays, Blackout dates apply"
              ></textarea>
            </div>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="fullPriceItemsOnly"
                name="fullPriceItemsOnly"
                checked={formData.fullPriceItemsOnly}
                onChange={handleChange}
                className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500 w-5 h-5 transition duration-150 ease-in-out"
              />
              <label htmlFor="fullPriceItemsOnly" className="ml-3 text-base text-gray-700">Full-Price Items Only</label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 border border-transparent rounded-xl shadow-xl text-xl font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-200 ease-in-out transform hover:scale-105"
          >
            {isEditing ? 'Update Coupon' : 'Generate Coupon'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full py-4 px-6 border border-gray-300 rounded-xl shadow-xl text-xl font-bold text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 transition duration-200 ease-in-out transform hover:scale-105 mt-4"
            >
              Cancel Edit
            </button>
          )}
        </form>
      )}

      {/* List of All Coupons */}
      {!showForm && (
        <div className="mt-16 py-8 px-4 bg-gray-50 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">All Generated Coupons</h3>
            <button
              onClick={handleCreateNewClick}
              className="p-3 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-150 ease-in-out group"
              title="Create New % Discount"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="sr-only group-hover:not-sr-only group-hover:ml-2">Create New % Discount</span>
            </button>
          </div>
          {allCoupons.size === 0 ? (
            <p className="text-gray-600 text-center py-8">No coupons generated yet.</p>
          ) : (
            <div className="space-y-6">
              {Array.from(allCoupons.values()).map(coupon => (
                <div key={coupon.couponCode} className="flex flex-col sm:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <div className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
                    {coupon.couponName} ({coupon.discountPercentage}%) - <span className="text-green-600">{coupon.couponCode}</span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditClick(coupon.couponCode)}
                      className="py-2 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition duration-150 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onCopyCouponCode(coupon.couponCode)}
                      className="py-2 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out"
                    >
                      Copy Code
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Golfer Sub-Views
const RedeemToPurchaseSimulation = ({ coupon, onBack, handleShowMessageBox, onRedeemInApp, sampleProductsData }) => {
  const productType = coupon.discountProducts;
  let product = null;

  if (productType === 'Tee Times Coupon (Course Specific)') {
    // For Tee Times, create a synthetic product to include the course name
    product = {
      id: 'tee-time-specific',
      name: `Tee Time at ${coupon.courseName || 'Selected Course'}`,
      price: 100.00, // Default price for simulation
      description: `A specific tee time at ${coupon.courseName || 'your chosen course'}.`
    };
  } else {
    // For other product types, get the first sample product
    product = sampleProductsData[productType] ? sampleProductsData[productType][0] : null;
  }

  const productPrice = product ? product.price : 100; // Use product price or default
  const discountAmount = Math.min(
    (coupon.discountPercentage / 100) * productPrice,
    coupon.maxDiscountValue || productPrice // Cap at maxDiscountValue if set
  );
  const finalPrice = productPrice - discountAmount;

  const handleCheckout = async () => {
    const success = await onRedeemInApp(coupon.couponCode, 'Online/In-App');
    if (success) {
      handleShowMessageBox('Checkout Successful!', `Coupon "${coupon.couponCode}" applied! Original: $${productPrice.toFixed(2)}, Discount: $${discountAmount.toFixed(2)}, Final: $${finalPrice.toFixed(2)}`);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Redeem to Purchase: {productType || 'Selected Product'}</h3>
      {product ? (
        <div className="flex items-center space-x-6">
          <img src={`https://placehold.co/120x120/E0F2F7/000?text=${product.name.replace(/\s/g, '+').substring(0, 10)}`} alt={product.name} className="rounded-lg shadow-md" />
          <div>
            <p className="text-xl font-semibold">{product.name}</p>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-gray-600">Original Price: <span className="line-through">${productPrice.toFixed(2)}</span></p>
            <p className="text-green-600 font-bold text-2xl">Your Price: ${finalPrice.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Coupon "{coupon.couponCode}" auto-applied.</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No specific product data available for this category.</p>
      )}
      <button
        onClick={handleCheckout}
        className="w-full py-3 px-6 rounded-xl shadow-lg text-xl font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-200 ease-in-out transform hover:scale-105"
      >
        Proceed to Checkout
      </button>
      <button
        onClick={onBack}
        className="w-full py-3 px-6 rounded-xl shadow-md text-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out"
      >
        Back to Coupons
      </button>
    </div>
  );
};

const ApplyAtCheckoutSimulation = ({ coupon, onBack, handleShowMessageBox, onRedeemInApp, sampleProductsData }) => {
  const productType = coupon.discountProducts;
  let productsToDisplay = [];

  if (productType === 'Tee Times Coupon (Course Specific)') {
    // For Tee Times, create a synthetic product list with the specific course
    productsToDisplay = [
      { id: 'tee-time-specific-1', name: `Morning Tee Time at ${coupon.courseName || 'Selected Course'}`, price: 75.00, description: 'Early bird special.' },
      { id: 'tee-time-specific-2', name: `Afternoon Tee Time at ${coupon.courseName || 'Selected Course'}`, price: 120.00, description: 'Prime slot.' },
    ];
  } else {
    productsToDisplay = sampleProductsData[productType] || []; // Get all products of the type
  }

  const calculateDiscountedPrice = (originalPrice) => {
    const discountAmount = Math.min(
      (coupon.discountPercentage / 100) * originalPrice,
      coupon.maxDiscountValue || originalPrice // Cap at maxDiscountValue if set
    );
    return originalPrice - discountAmount;
  };

  const handleCheckout = async (product) => {
    const success = await onRedeemInApp(coupon.couponCode, 'Online/In-App');
    if (success) {
      const discountedPrice = calculateDiscountedPrice(product.price);
      handleShowMessageBox('Checkout Summary', `You are checking out with "${product.name}". Original: $${product.price.toFixed(2)}, Coupon "${coupon.couponCode}" applied. Final: $${discountedPrice.toFixed(2)}`);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Apply at Checkout: {productType || 'Products'}</h3>
      <div className="space-y-4">
        {productsToDisplay.length > 0 ? (
          productsToDisplay.map(product => (
            <div key={product.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <div>
                <p className="font-semibold text-lg">{product.name}</p>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => handleCheckout(product)}
                className="py-2 px-5 rounded-lg shadow-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out"
              >
                Add to Cart & Checkout
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center py-4">No specific product list available for this category.</p>
        )}
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">Coupon "{coupon.couponCode}" will be auto-applied if eligible.</p>
      <button
        onClick={onBack}
        className="w-full py-3 px-6 rounded-xl shadow-md text-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out"
      >
        Back to Coupons
      </button>
    </div>
  );
};


// GolferView Component
const GolferView = ({ allCoupons, onShowDetails, handleShowMessageBox,
  couponRedemptionCounts, userCouponRedemptionCounts, simulatedUserId, onRedeemInApp, sampleProductsData }) => {
  const [golferSubView, setGolferSubView] = useState('myCoupons'); // 'myCoupons', 'redeemToPurchase', 'applyAtCheckout'
  const [selectedCouponForAction, setSelectedCouponForAction] = useState(null); // To store the coupon object for sub-views

  const handleGoToRedeemToPurchase = (coupon) => {
    setSelectedCouponForAction(coupon);
    setGolferSubView('redeemToPurchase');
  };

  const handleGoToApplyAtCheckout = (coupon) => {
    setSelectedCouponForAction(coupon);
    setGolferSubView('applyAtCheckout');
  };

  const handleGoBackToMyCoupons = () => {
    setGolferSubView('myCoupons');
    setSelectedCouponForAction(null);
  };

  const handleAddToWallet = (coupon) => {
    handleShowMessageBox('Add to Wallet', `Simulating adding coupon "${coupon.couponCode}" to Google/Apple Wallet. (No actual integration)`);
  };

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-extrabold text-gray-800 text-center">Golfer: My Coupons</h2>
      <div className="space-y-8">
        {golferSubView === 'myCoupons' && (
          allCoupons.size === 0 ? (
            <p className="text-gray-600 text-center text-xl py-16 rounded-2xl bg-white shadow-lg border border-gray-200">No coupons generated yet. Switch to Admin view to create one!</p>
          ) : (
            Array.from(allCoupons.values()).map(coupon => (
              <DiscountCard
                key={coupon.couponCode}
                coupon={coupon}
                showDetailsButton={true}
                onShowDetails={() => onShowDetails(coupon)}
                totalRedemptionCount={couponRedemptionCounts.get(coupon.couponCode) || 0} // Pass total count
                perUserRedemptionCount={userCouponRedemptionCounts.get(simulatedUserId)?.get(coupon.couponCode) || 0} // Pass per-user count
                perUserLimit={coupon.perUserRedemptionLimit} // Pass per-user limit
                onRedeemToPurchase={() => handleGoToRedeemToPurchase(coupon)}
                onAddToWallet={() => handleAddToWallet(coupon)}
                onApplyAtCheckout={() => handleGoToApplyAtCheckout(coupon)}
              />
            ))
          )
        )}

        {golferSubView === 'redeemToPurchase' && selectedCouponForAction && (
          <RedeemToPurchaseSimulation
            coupon={selectedCouponForAction}
            onBack={handleGoBackToMyCoupons}
            handleShowMessageBox={handleShowMessageBox}
            onRedeemInApp={onRedeemInApp} // Pass redemption function
            sampleProductsData={sampleProductsData} // Pass sample data
          />
        )}

        {golferSubView === 'applyAtCheckout' && selectedCouponForAction && (
          <ApplyAtCheckoutSimulation
            coupon={selectedCouponForAction}
            onBack={handleGoBackToMyCoupons}
            handleShowMessageBox={handleShowMessageBox}
            onRedeemInApp={onRedeemInApp} // Pass redemption function
            sampleProductsData={sampleProductsData} // Pass sample data
          />
        )}
      </div>
    </div>
  );
};

// GolfCourseView Component
const GolfCourseView = ({ allCoupons, onRedeemCoupon }) => {
  const [posCouponCode, setPosCouponCode] = useState('');
  const [redemptionStatus, setRedemptionStatus] = useState({ message: '', type: '' });

  const handleRedeem = () => {
    onRedeemCoupon(posCouponCode, setRedemptionStatus, 'POS'); // Pass channel
    setPosCouponCode(''); // Clear input after attempt
  };

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-extrabold text-gray-800 text-center">Course: POS Redemption</h2>
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6">
        <div>
          <label htmlFor="posCouponCode" className="block text-base font-medium text-gray-700 mb-2">Enter Coupon Code or Scan QR Code</label>
          <input
            type="text"
            id="posCouponCode"
            value={posCouponCode}
            onChange={(e) => setPosCouponCode(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
            placeholder="e.g., PGT-DISCOUNT-XYZ"
          />
        </div>
        <button
          onClick={handleRedeem}
          className="w-full py-4 px-6 border border-transparent rounded-xl shadow-xl text-xl font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-200 ease-in-out transform hover:scale-105"
        >
          Redeem Coupon
        </button>
        {redemptionStatus.message && (
          <div className={`mt-6 text-center font-extrabold text-xl ${redemptionStatus.type === 'success' ? 'text-green-600' : redemptionStatus.type === 'warning' ? 'text-orange-600' : 'text-red-600'}`}>
            {redemptionStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const PercentageForm = () => {
  const [currentPov, setCurrentPov] = useState('admin');
  const [allCoupons, setAllCoupons] = useState(new Map());
  const [redeemedCoupons, setRedeemedCoupons] = useState(new Set()); // Still tracks global redemption status for simplicity
  const [couponRedemptionCounts, setCouponRedemptionCounts] = useState(new Map()); // total redemptions per coupon
  const [userCouponRedemptionCounts, setUserCouponRedemptionCounts] = useState(new Map()); // per-user redemptions per coupon

  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState({ title: '', message: '' });
  const [showSecondaryModal, setShowSecondaryModal] = useState(false);
  const [modalCouponDetails, setModalCouponDetails] = useState(null);

  const toggleThumbRef = useRef(null);
  const toggleContainerRef = useRef(null);

  const simulatedUserId = "golfer-sim-user-123";

  // List of golf courses
  const golfCourses = [
    'Babe Zaharias GC', 'Bardmoor GC', 'Black Diamond Ranch', 'Bloomingdale GC',
    'Brooksville C.C.', 'Candler Hills', 'Canyon Lake Golf Club', 'Chi Chi Rodriguez GC',
    'Citrus Springs Golf & CC', 'Cove Cay CC', 'Crescent Oaks GC', 'Cypress Creek',
    'Dunes Golf Club (The Villages)', 'Dunedin GC', 'Eagles Golf Forest/Lakes', 'Fox Hollow GC',
    'Golden Ocala', 'Heritage Harbor GC', 'Heritage Isles GC', 'Juliette Falls',
    'Lake Jovita G&CC', 'Lansbrook GC', 'Links of Lake Bernadette', 'Northdale Golf',
    'Ocala Golf Club', 'Plantation Golf Club', 'Plantation Palms GC', 'Rocky Point GC',
    'Rogers Park GC', 'Saddlebrook Resort', 'Seminole Lake CC', 'SilverDollar GC',
    'Stoneybrook Golf Club (Sarasota)', 'Summerfield Golf & CC', 'Tara Golf & CC',
    'Tarpon Springs GC', 'Tarpon Woods GC', 'Temple Terrace Golf & CC', 'The Groves G&CC',
    'Timber Greens GC', 'TPC Tampa Bay', 'Wentworth GC', 'Westchase GC'
  ];


  // Sample product data for dynamic UI in Golfer view
  const sampleProductsData = {
    'Membership Card': [
      { id: 'mem1', name: 'Bronze Membership', price: 299.99, description: 'Access to basic amenities.' },
      { id: 'mem2', name: 'Silver Membership', price: 499.99, description: 'Enhanced access and benefits.' },
      { id: 'mem3', name: 'Gold Membership', price: 799.99, description: 'Premium access and exclusive benefits.' },
    ],
    'Tee Times Coupon (Course Specific)': [
      // These will be dynamically named based on selected course
      { id: 'tee1', name: 'Morning Tee Time', price: 75.00, description: 'Early bird special.' },
      { id: 'tee2', name: 'Afternoon Tee Time', price: 120.00, description: 'Prime weekend slot.' },
      { id: 'tee3', name: 'Twilight Tee Time', price: 50.00, description: 'Evening play.' },
    ],
    'Tournament Pass': [
      { id: 'tour1', name: 'Amateur Open Pass', price: 150.00, description: 'Entry to local amateur tournament.' },
      { id: 'tour2', name: 'Club Championship Pass', price: 250.00, description: 'Entry to annual club championship.' },
    ],
    'Pro Shop Items': [
      { id: 'pro1', name: 'Golf Glove (Premium)', price: 25.00, description: 'High-quality leather glove.' },
      { id: 'pro2', name: 'Pack of Golf Balls (Pro)', price: 45.00, description: 'Tour-grade golf balls.' },
      { id: 'pro3', name: 'Golf Polo Shirt', price: 60.00, description: 'Stylish and breathable polo.' },
    ]
  };

  const generateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'PGT-DISCOUNT-';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleShowMessageBox = (title, message) => {
    setMessageBoxContent({ title, message });
    setShowMessageBox(true);
  };

  const handleCloseMessageBox = () => {
    setShowMessageBox(false);
  };

  // Centralized Redemption Logic
  const processRedemption = (couponCode, channel, setStatus = null) => {
    const coupon = allCoupons.get(couponCode);

    if (!coupon) {
      handleShowMessageBox('Redemption Failed', `Coupon code "${couponCode}" not found or invalid.`);
      if (setStatus) setStatus({ message: `Coupon code "${couponCode}" not found or invalid.`, type: 'error' });
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activationDate = new Date(coupon.activationDate);
    activationDate.setHours(0, 0, 0, 0);
    const validFromDate = new Date(coupon.validFrom);
    validFromDate.setHours(0, 0, 0, 0);
    const validUntilDate = new Date(coupon.validUntil);
    validUntilDate.setHours(23, 59, 59, 999);

    // 1. Check Activation Date
    if (today < activationDate) {
      handleShowMessageBox('Redemption Failed', `Coupon "${couponCode}" is not yet active. Activates on ${activationDate.toLocaleDateString()}.`);
      if (setStatus) setStatus({ message: `Coupon "${couponCode}" is not yet active.`, type: 'error' });
      return false;
    }

    // 2. Check Validity Period
    if (today < validFromDate || today > validUntilDate) {
      handleShowMessageBox('Redemption Failed', `Coupon code "${couponCode}" is outside its valid period.`);
      if (setStatus) setStatus({ message: `Coupon code "${couponCode}" is outside its valid period.`, type: 'error' });
      return false;
    }

    // 3. Check Channel Specificity
    if (!coupon.validChannels.includes(channel)) {
      handleShowMessageBox('Redemption Failed', `Coupon code "${couponCode}" is not valid for ${channel} redemption.`);
      if (setStatus) setStatus({ message: `Coupon "${couponCode}" is not valid for ${channel}.`, type: 'error' });
      return false;
    }

    // 4. Check Total Redemption Limit
    const currentTotalRedemptions = couponRedemptionCounts.get(couponCode) || 0;
    if (coupon.totalRedemptionLimit > 0 && currentTotalRedemptions >= coupon.totalRedemptionLimit) {
      handleShowMessageBox('Redemption Failed', `Coupon code "${couponCode}" has reached its total redemption limit.`);
      if (setStatus) setStatus({ message: `Coupon "${couponCode}" limit reached.`, type: 'error' });
      return false;
    }

    // 5. Check Per-User Redemption Limit
    const userRedemptionsForCoupon = userCouponRedemptionCounts.get(simulatedUserId)?.get(couponCode) || 0;
    if (coupon.perUserRedemptionLimit > 0 && userRedemptionsForCoupon >= coupon.perUserRedemptionLimit) {
      handleShowMessageBox('Redemption Failed', `Coupon code "${couponCode}" has reached its per-user redemption limit for this user.`);
      if (setStatus) setStatus({ message: `Coupon "${couponCode}" per-user limit reached.`, type: 'error' });
      return false;
    }

    // If all checks pass, proceed with redemption
    setRedeemedCoupons(prev => new Set(prev).add(couponCode)); // Mark as globally redeemed for simplicity

    // Update total redemption count
    setCouponRedemptionCounts(prev => {
      const newCounts = new Map(prev);
      newCounts.set(couponCode, currentTotalRedemptions + 1);
      return newCounts;
    });

    // Update per-user redemption count
    setUserCouponRedemptionCounts(prev => {
      const newMap = new Map(prev);
      const userCoupons = new Map(newMap.get(simulatedUserId));
      userCoupons.set(couponCode, userRedemptionsForCoupon + 1);
      newMap.set(simulatedUserId, userCoupons);
      return newMap;
    });

    handleShowMessageBox('Redemption Successful!', `Coupon code "${couponCode}" marked as REDEEMED!`);
    if (setStatus) setStatus({ message: `Success: Coupon code "${couponCode}" marked as REDEEMED!`, type: 'success' });
    return true; // Indicate successful redemption
  };

  // Handler for POS redemption
  const handleRedeemCoupon = (couponCode, setStatus, channel) => {
    processRedemption(couponCode, channel, setStatus);
  };

  // Handler for In-App redemption
  const handleInAppRedemption = async (couponCode, channel) => {
    // In-app redemption doesn't directly set a status message on the sub-view,
    // but it still uses the centralized logic and shows the main message box.
    return processRedemption(couponCode, channel);
  };


  const handleGenerateCoupon = (formData) => {
    const { discountPercentage, validFrom, validUntil, activationDate } = formData;

    if (!discountPercentage || !validFrom || !validUntil || !activationDate) {
      handleShowMessageBox('Input Error', 'Discount Percentage, Activation Date, Valid From, and Valid Until dates are required.');
      return;
    }

    const actDate = new Date(activationDate);
    actDate.setHours(0, 0, 0, 0);

    const fromDate = new Date(validFrom);
    fromDate.setHours(0, 0, 0, 0);
    const untilDate = new Date(validUntil);
    untilDate.setHours(23, 59, 59, 999);

    if (fromDate.getTime() > untilDate.getTime()) {
      handleShowMessageBox('Date Error', 'Valid From date cannot be after Valid Until date.');
      return;
    }
    if (actDate.getTime() > fromDate.getTime()) {
      handleShowMessageBox('Date Error', 'Activation Date cannot be after Valid From date.');
      return;
    }


    const newCoupon = {
      ...formData,
      couponCode: generateCouponCode(),
    };

    setAllCoupons(prev => new Map(prev).set(newCoupon.couponCode, newCoupon)); // Add to allCoupons
    setCouponRedemptionCounts(prev => new Map(prev).set(newCoupon.couponCode, 0));
    setUserCouponRedemptionCounts(prev => {
      const newMap = new Map(prev);
      newMap.set(simulatedUserId, new Map(newMap.get(simulatedUserId) || []).set(newCoupon.couponCode, 0));
      return newMap;
    });

    handleShowMessageBox('Coupon Generated!', `A new coupon "${newCoupon.couponCode}" has been created.`);
  };


  const handleUpdateCoupon = (updatedFormData) => {
    const { discountPercentage, validFrom, validUntil, activationDate } = updatedFormData;

    if (!discountPercentage || !validFrom || !validUntil || !activationDate) {
      handleShowMessageBox('Input Error', 'Discount Percentage, Activation Date, Valid From, and Valid Until dates are required.');
      return;
    }

    const actDate = new Date(activationDate);
    actDate.setHours(0, 0, 0, 0);

    const fromDate = new Date(validFrom);
    fromDate.setHours(0, 0, 0, 0);
    const untilDate = new Date(validUntil);
    untilDate.setHours(23, 59, 59, 999);

    if (fromDate.getTime() > untilDate.getTime()) {
      handleShowMessageBox('Date Error', 'Valid From date cannot be after Valid Until date.');
      return;
    }
    if (actDate.getTime() > fromDate.getTime()) {
      handleShowMessageBox('Date Error', 'Activation Date cannot be after Valid From date.');
      return;
    }

    setAllCoupons(prev => new Map(prev).set(updatedFormData.couponCode, updatedFormData)); // Update in allCoupons
    handleShowMessageBox('Coupon Updated!', `Coupon "${updatedFormData.couponCode}" has been successfully updated.`);
  };

  const handleCopyCouponCode = (code) => {
    const textArea = document.createElement('textarea');
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      handleShowMessageBox('Copied!', `Coupon code "${code}" copied to clipboard.`);
    } catch (err) {
      handleShowMessageBox('Error', 'Failed to copy coupon code. Please copy manually: ' + code);
    }
    document.body.removeChild(textArea);
  };

  const handleShowSecondaryModal = (coupon) => {
    setModalCouponDetails(coupon);
    setShowSecondaryModal(true);
  };

  const handleCloseSecondaryModal = () => {
    setShowSecondaryModal(false);
    setModalCouponDetails(null);
  };

  // Effect to position the toggle thumb when POV changes or component mounts
  useEffect(() => {
    const updateThumbPosition = () => {
      const selectedLabel = document.querySelector(`label[for="pov${currentPov.charAt(0).toUpperCase() + currentPov.slice(1).replace(/-(\w)/g, (match, p1) => p1.toUpperCase())}"]`);

      if (selectedLabel && toggleThumbRef.current && toggleContainerRef.current) {
        const labelRect = selectedLabel.getBoundingClientRect();
        const containerRect = toggleContainerRef.current.getBoundingClientRect();

        toggleThumbRef.current.style.left = `${labelRect.left - containerRect.left}px`;
        toggleThumbRef.current.style.width = `${labelRect.width}px`;
        toggleThumbRef.current.style.height = `${labelRect.height}px`;
      }
    };

    updateThumbPosition();
    window.addEventListener('resize', updateThumbPosition);

    return () => {
      window.removeEventListener('resize', updateThumbPosition);
    };
  }, [currentPov]);

  // Sample coupon initialization on component mount
  useEffect(() => {
    // Get current date for dynamic validity periods
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    const twoMonthsLater = new Date(today);
    twoMonthsLater.setMonth(today.getMonth() + 2);

    const formatDateForInput = (date) => date.toISOString().split('T')[0];

    const sampleCoupon1 = {
      couponName: 'Grand Opening Special',
      couponDescription: '25% off all Tee Times for new members!',
      discountPercentage: 25,
      minPurchaseValue: 20,
      maxDiscountValue: 75,
      discountProducts: 'Tee Times Coupon (Course Specific)', // Single product
      courseName: 'Babe Zaharias GC', // Added course name
      activationDate: formatDateForInput(new Date(today.getFullYear(), today.getMonth(), 1)), // Start of current month
      validFrom: formatDateForInput(today), // Today
      validUntil: formatDateForInput(twoMonthsLater), // Two months from now
      totalRedemptionLimit: 5,
      perUserRedemptionLimit: 1,
      targetAudience: ['New Golfers'],
      stackable: false,
      validChannels: ['Online/In-App', 'POS'],
      autoApplyEligible: true,
      exclusions: 'Not valid on major holidays. Cannot be combined with other offers.',
      fullPriceItemsOnly: true,
      couponCode: 'PGT-SAMPLE-XYZ',
    };

    const sampleCoupon2 = {
      couponName: 'Loyalty Member Discount',
      couponDescription: '10% off Pro Shop Items for Gold Tier members.',
      discountPercentage: 10,
      minPurchaseValue: 0,
      maxDiscountValue: 20,
      discountProducts: 'Pro Shop Items', // Single product
      courseName: '', // Not applicable for Pro Shop Items
      activationDate: formatDateForInput(new Date(today.getFullYear(), today.getMonth() - 1, 15)), // Middle of last month
      validFrom: formatDateForInput(today), // Today
      validUntil: formatDateForInput(nextMonth), // Next month
      totalRedemptionLimit: 0, // Unlimited
      perUserRedemptionLimit: 0, // Unlimited
      targetAudience: ['Existing Golfers', 'Gold Tier'],
      stackable: true,
      validChannels: ['POS'],
      autoApplyEligible: false,
      exclusions: 'Excludes sale items.',
      fullPriceItemsOnly: true,
      couponCode: 'PGT-LOYALTY-ABC',
    };

    const sampleCoupon3 = {
      couponName: 'Summer Membership Deal',
      couponDescription: 'Save big on your summer golf membership!',
      discountPercentage: 15,
      minPurchaseValue: 100,
      maxDiscountValue: 100,
      discountProducts: 'Membership Card', // Single product
      courseName: '', // Not applicable
      activationDate: formatDateForInput(new Date(today.getFullYear(), today.getMonth() - 1, 1)), // Start of last month
      validFrom: formatDateForInput(today), // Today
      validUntil: formatDateForInput(new Date(today.getFullYear(), today.getMonth() + 3, 0)), // End of next month
      totalRedemptionLimit: 20,
      perUserRedemptionLimit: 1,
      targetAudience: ['All Golfers'],
      stackable: false,
      validChannels: ['Online/In-App'],
      autoApplyEligible: true,
      exclusions: 'Cannot be combined with other membership offers.',
      fullPriceItemsOnly: true,
      couponCode: 'PGT-SUMMER-MEM',
    };

    const sampleCoupon4 = {
      couponName: 'Tournament Entry Special',
      couponDescription: 'Discount on your next tournament pass!',
      discountPercentage: 50,
      minPurchaseValue: 50,
      maxDiscountValue: 125,
      discountProducts: 'Tournament Pass', // Single product
      courseName: '', // Not applicable
      activationDate: formatDateForInput(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)), // 7 days ago
      validFrom: formatDateForInput(today), // Today
      validUntil: formatDateForInput(tomorrow), // Tomorrow
      totalRedemptionLimit: 10,
      perUserRedemptionLimit: 1,
      targetAudience: ['Existing Golfers'],
      stackable: false,
      validChannels: ['Online/In-App', 'POS'],
      autoApplyEligible: false,
      exclusions: 'Limited to select tournaments.',
      fullPriceItemsOnly: true,
      couponCode: 'PGT-TOURNEY-50',
    };


    const initialCoupons = new Map();
    initialCoupons.set(sampleCoupon1.couponCode, sampleCoupon1);
    initialCoupons.set(sampleCoupon2.couponCode, sampleCoupon2);
    initialCoupons.set(sampleCoupon3.couponCode, sampleCoupon3);
    initialCoupons.set(sampleCoupon4.couponCode, sampleCoupon4);
    setAllCoupons(initialCoupons);

    // Initialize redemption counts for sample coupons
    setCouponRedemptionCounts(prev => {
      const newCounts = new Map(prev);
      newCounts.set(sampleCoupon1.couponCode, 0);
      newCounts.set(sampleCoupon2.couponCode, 0);
      newCounts.set(sampleCoupon3.couponCode, 0);
      newCounts.set(sampleCoupon4.couponCode, 0);
      return newCounts;
    });
    setUserCouponRedemptionCounts(prev => {
      const newMap = new Map(prev);
      newMap.set(simulatedUserId, new Map()); // Initialize user's coupon map
      newMap.get(simulatedUserId).set(sampleCoupon1.couponCode, 0);
      newMap.get(simulatedUserId).set(sampleCoupon2.couponCode, 0);
      newMap.get(simulatedUserId).set(sampleCoupon3.couponCode, 0);
      newMap.get(simulatedUserId).set(sampleCoupon4.couponCode, 0);
      return newMap;
    });

  }, []); // Empty dependency array means this runs once on mount
  return (
    <div className="font-sans antialiased text-gray-900 min-h-screen flex justify-center items-start py-8 ">
      <style>
        {`
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}
      </style>

      <div className="bg-white rounded-3xl p-2  w-full max-w-md sm:max-w-5xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-2 text-center leading-tight">Paradise Golf Tech</h1>
        <h2 className="text-xl sm:text-3xl font-bold text-gray-700 mb-10 text-center">Golf Admin: Setup % Percentage Discount</h2>

        {/* POV Toggle */}
        <div className="mb-8 sm:mb-12 flex justify-center">
          <div
            ref={toggleContainerRef}
            className="relative flex bg-gray-200 rounded-full p-1 shadow-inner max-w-xs sm:max-w-sm w-full flex-wrap sm:flex-nowrap"
          >
            <input
              type="radio"
              name="pov"
              value="admin"
              id="povAdmin"
              className="hidden"
              checked={currentPov === "admin"}
              onChange={() => setCurrentPov("admin")}
            />
            <label
              htmlFor="povAdmin"
              className="flex-1 text-center py-2 px-3 sm:py-3 sm:px-6 text-sm sm:text-lg font-semibold text-gray-700 cursor-pointer rounded-full transition-colors duration-300 relative z-20"
            >
              Admin
            </label>

            <input
              type="radio"
              name="pov"
              value="golfer"
              id="povGolfer"
              className="hidden"
              checked={currentPov === "golfer"}
              onChange={() => setCurrentPov("golfer")}
            />
            <label
              htmlFor="povGolfer"
              className="flex-1 text-center py-2 px-3 sm:py-3 sm:px-6 text-sm sm:text-lg font-semibold text-gray-700 cursor-pointer rounded-full transition-colors duration-300 relative z-20"
            >
              Golfer
            </label>

            <input
              type="radio"
              name="pov"
              value="golf-course"
              id="povGolfCourse"
              className="hidden"
              checked={currentPov === "golf-course"}
              onChange={() => setCurrentPov("golf-course")}
            />
            <label
              htmlFor="povGolfCourse"
              className="flex-1 text-center py-2 px-3 sm:py-3 sm:px-6 text-sm sm:text-lg font-semibold text-gray-700 cursor-pointer rounded-full transition-colors duration-300 relative z-20"
            >
              Course
            </label>

            <div
              ref={toggleThumbRef}
              className="absolute bg-green-600 rounded-full shadow-lg transition-all duration-300 ease-in-out z-10"
              style={{
                height: "calc(100% - 0.5rem)",
                width: "33.33%",
                top: "0.25rem",
                left: currentPov === "admin" ? "0.25rem" : currentPov === "golfer" ? "33.58%" : "67.16%",
              }}
            ></div>
          </div>
        </div>

        {/* Conditional Rendering of Views */}
        {currentPov === "admin" && (
          <AdminView
            onGenerateCoupon={handleGenerateCoupon}
            onUpdateCoupon={handleUpdateCoupon}
            allCoupons={allCoupons}
            onCopyCouponCode={handleCopyCouponCode}
            golfCourses={golfCourses}
          />
        )}
        {currentPov === "golfer" && (
          <GolferView
            allCoupons={allCoupons}
            onShowDetails={handleShowSecondaryModal}
            couponRedemptionCounts={couponRedemptionCounts}
            userCouponRedemptionCounts={userCouponRedemptionCounts}
            simulatedUserId={simulatedUserId}
            handleShowMessageBox={handleShowMessageBox}
            onRedeemInApp={handleInAppRedemption}
            sampleProductsData={sampleProductsData}
          />
        )}
        {currentPov === "golf-course" && (
          <GolfCourseView allCoupons={allCoupons} onRedeemCoupon={handleRedeemCoupon} />
        )}

        {/* Modals */}
        {showMessageBox && (
          <MessageBox title={messageBoxContent.title} message={messageBoxContent.message} onClose={handleCloseMessageBox} />
        )}
        {showSecondaryModal && (
          <SecondaryCharacteristicsModal coupon={modalCouponDetails} onClose={handleCloseSecondaryModal} />
        )}
      </div>
    </div>
  );
}

export default PercentageForm;
