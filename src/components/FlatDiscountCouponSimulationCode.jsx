import React, { useState, useRef, useEffect, useMemo } from 'react';

// MessageBox Component: A custom modal for displaying messages to the user.
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

// SecondaryCharacteristicsModal Component: Displays detailed terms and conditions of a coupon.
const SecondaryCharacteristicsModal = ({ coupon, onClose }) => {
  if (!coupon) return null; // Render nothing if no coupon is provided

  // Helper function to format date strings for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-lg w-full mx-4 relative transform scale-95 opacity-0 animate-scaleIn">
        {/* Close button for the modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-4xl font-light leading-none"
        >
          &times;
        </button>
        <h3 className="text-3xl font-extrabold text-gray-900 mb-6">Coupon Terms & Conditions</h3>
        <div className="text-gray-700 space-y-4 text-lg">
          {/* Display various coupon characteristics */}
          <p><span className="font-bold text-gray-800">Coupon Name:</span> {coupon.couponName || 'N/A'}</p>
          <p><span className="font-bold text-gray-800">Description:</span> {coupon.couponDescription || 'N/A'}</p>
          <p><span className="font-bold text-gray-800">Flat Discount Amount:</span> ${coupon.flatDiscountAmount ? coupon.flatDiscountAmount.toFixed(2) : '0.00'}</p>
          <p><span className="font-bold text-gray-800">Minimum Purchase Value:</span> {coupon.minPurchaseValue ? `$${coupon.minPurchaseValue.toFixed(2)}` : 'No Minimum'}</p>
          {coupon.minQuantity > 0 && <p><span className="font-bold text-gray-800">Minimum Quantity:</span> {coupon.minQuantity} {coupon.minPurchaseProductCategory ? `of ${coupon.minPurchaseProductCategory}` : 'items'}</p>}
          <p><span className="font-bold text-gray-800">Activation Date:</span> {formatDate(coupon.activationDate)}</p>
          <p><span className="font-bold text-gray-800">Validity Period:</span> {formatDate(coupon.validFrom)} to {formatDate(coupon.validUntil)}</p>
          <p><span className="font-bold text-gray-800">Total Redemption Limit:</span> {coupon.totalRedemptionLimit === 0 ? 'Unlimited' : coupon.totalRedemptionLimit}</p>
          <p><span className="font-bold text-gray-800">Per-User Redemption Limit:</span> {coupon.perUserRedemptionLimit === 0 ? 'Unlimited' : coupon.perUserRedemptionLimit}</p>
          <p><span className="font-bold text-gray-800">Target Audience:</span> {coupon.targetAudience.join(', ') || 'All'}</p>
          <p><span className="font-bold text-gray-800">Stackable:</span> {coupon.stackable ? 'Yes' : 'No'}</p>
          <p><span className="font-bold text-gray-800">Valid Channels:</span> {coupon.validChannels.join(', ') || 'All'}</p>
          <p><span className="font-bold text-gray-800">Auto-Apply Eligible:</span> {coupon.autoApplyEligible ? 'Yes' : 'No'}</p>
          {coupon.timeSeasonEventRestriction && <p><span className="font-bold text-gray-800">Time/Season/Event Restriction:</span> {coupon.timeSeasonEventRestriction}</p>}
          <p><span className="font-bold text-gray-800">Exclusions:</span> {coupon.exclusions || 'None specified.'}</p>
          {coupon.excludedCategories && coupon.excludedCategories.length > 0 && <p><span className="font-bold text-gray-800">Excluded Categories:</span> {coupon.excludedCategories.join(', ')}</p>}
          {coupon.excludedCategories.includes('Specific Membership Types') && coupon.excludedMembershipType && (
            <p><span className="font-bold text-gray-800">Excluded Membership Type:</span> {coupon.excludedMembershipType}</p>
          )}
          <p><span className="font-bold text-gray-800">Full-Price Items Only:</span> {coupon.fullPriceItemsOnly ? 'Yes' : 'No'}</p>
          {/* Conditionally display specific applicability details */}
          {coupon.discountProducts === 'Tee Times Coupon (Course Specific)' && (
            <>
              <p><span className="font-bold text-gray-800">Course:</span> {coupon.courseName || 'N/A'}</p>
              {coupon.teeTimeRestriction && <p><span className="font-bold text-gray-800">Tee Time Restriction:</span> {coupon.teeTimeRestriction}</p>}
            </>
          )}
          {coupon.discountProducts === 'Membership Card' && coupon.membershipType && (
            <p><span className="font-bold text-gray-800">Membership Type:</span> {coupon.membershipType}</p>
          )}
          {coupon.discountProducts === 'Pro Shop Items' && coupon.proShopCategory && (
            <p><span className="font-bold text-gray-800">Pro Shop Category:</span> {coupon.proShopCategory}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// DiscountCard Component: Displays a single coupon with its details and action buttons.
const DiscountCard = ({ coupon, showDetailsButton = false, onShowDetails,
  onRedeemToPurchase, onAddToWallet, onApplyAtCheckout,
  totalRedemptionCount, perUserRedemptionCount, perUserLimit }) => {
  if (!coupon) return null;

  // Helper function to format date strings for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Determine if the coupon has reached its global or per-user redemption limit
  const isRedeemedGlobally = totalRedemptionCount > 0 && coupon.totalRedemptionLimit > 0 && totalRedemptionCount >= coupon.totalRedemptionLimit;
  const isRedeemedByUser = perUserRedemptionCount > 0 && perUserLimit > 0 && perUserRedemptionCount >= perUserLimit;

  // Construct the redemption status message
  let redemptionStatusMessage = '';
  if (isRedeemedByUser) {
    redemptionStatusMessage = `Redeemed ${perUserRedemptionCount} / ${perUserLimit} times (limit reached)`;
  } else if (perUserLimit > 0) {
    redemptionStatusMessage = `Redeemed ${perUserRedemptionCount} / ${perUserLimit} times`;
  } else {
    redemptionStatusMessage = `Redeemed ${perUserRedemptionCount} times (Unlimited)`;
  }

  // Determine the text for what the coupon applies to
  let appliesToText = coupon.discountProducts || 'All Products';
  if (coupon.discountProducts === 'Tee Times Coupon (Course Specific)') {
    appliesToText = `Tee Times at ${coupon.courseName || 'Any Course'}`;
    if (coupon.teeTimeRestriction) appliesToText += ` (${coupon.teeTimeRestriction})`;
  } else if (coupon.discountProducts === 'Membership Card' && coupon.membershipType) {
    appliesToText = `${coupon.membershipType} Membership`;
  } else if (coupon.discountProducts === 'Pro Shop Items' && coupon.proShopCategory) {
    appliesToText = `${coupon.proShopCategory} in Pro Shop`;
  }


  return (
    <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-2xl p-8 mt-8 shadow-2xl relative overflow-hidden transform hover:scale-102 transition-all duration-300 ease-in-out">
      <div className="absolute inset-0 bg-white opacity-5 rounded-2xl transform -rotate-45 scale-150"></div>
      <h4 className="text-4xl font-extrabold mb-3 leading-tight">Flat ${coupon.flatDiscountAmount ? coupon.flatDiscountAmount.toFixed(2) : '0.00'} OFF</h4>
      <p className="text-xl mb-2">{coupon.couponName || 'Untitled Coupon'}</p>
      <p className="text-lg opacity-90 mb-3">{coupon.couponDescription || 'No description provided.'}</p>
      <p className="text-xl mb-2">
        {coupon.minPurchaseValue ? `Min. Purchase: $${coupon.minPurchaseValue.toFixed(2)}` : 'No Minimum Purchase'}
        {coupon.minQuantity > 0 && ` | Min. Qty: ${coupon.minQuantity} ${coupon.minPurchaseProductCategory ? `(${coupon.minPurchaseProductCategory})` : ''}`}
      </p>
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

      {/* Action buttons, shown only if showDetailsButton is true */}
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

// AdminView Component: Allows administrators to create, view, and edit coupons.
const AdminView = ({ onGenerateCoupon, allCoupons, onCopyCouponCode, onUpdateCoupon, golfCourses }) => {
  // Default form data for creating new coupons
  const defaultFormData = {
    couponName: '',
    couponDescription: '',
    flatDiscountAmount: '',
    minPurchaseValue: '',
    minQuantity: 0, // New: Minimum quantity
    minPurchaseProductCategory: '', // New: Category for minimum quantity
    discountProducts: '',
    membershipType: '', // New: Specific membership type
    teeTimeRestriction: '', // New: Specific tee time restriction
    proShopCategory: '', // New: Specific pro shop category
    courseName: '',
    activationDate: '',
    validFrom: '',
    validUntil: '',
    totalRedemptionLimit: 0,
    perUserRedemptionLimit: 0,
    targetAudience: ['All Golfers'],
    stackable: false,
    validChannels: ['Online/In-App', 'POS'],
    autoApplyEligible: false,
    exclusions: '',
    excludedCategories: [], // New: Specific excluded categories
    excludedMembershipType: '', // New: Specific excluded membership type
    fullPriceItemsOnly: false,
    timeSeasonEventRestriction: '', // New: Text field for time/season/event restriction
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [isEditing, setIsEditing] = useState(false); // State to track if currently editing a coupon
  const [editingCouponCode, setEditingCouponCode] = useState(null); // Stores the coupon code being edited
  const [showForm, setShowForm] = useState(false); // Controls the visibility of the coupon creation/edit form

  // List of all possible membership types for the dropdown
  const allMembershipTypes = ['Summer Membership', 'Winter Membership', 'Year-Around Membership', 'Bronze Membership', 'Silver Membership', 'Gold Membership'];


  // useEffect to populate the form when a coupon is selected for editing
  useEffect(() => {
    if (isEditing && editingCouponCode && allCoupons.has(editingCouponCode)) {
      const couponToEdit = allCoupons.get(editingCouponCode);
      setFormData({
        couponName: couponToEdit.couponName || '',
        couponDescription: couponToEdit.couponDescription || '',
        flatDiscountAmount: couponToEdit.flatDiscountAmount,
        minPurchaseValue: couponToEdit.minPurchaseValue,
        minQuantity: couponToEdit.minQuantity || 0, // Ensure default is 0
        minPurchaseProductCategory: couponToEdit.minPurchaseProductCategory || '',
        discountProducts: couponToEdit.discountProducts || '',
        membershipType: couponToEdit.membershipType || '',
        teeTimeRestriction: couponToEdit.teeTimeRestriction || '',
        proShopCategory: couponToEdit.proShopCategory || '',
        courseName: couponToEdit.courseName || '',
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
        excludedCategories: couponToEdit.excludedCategories || [],
        excludedMembershipType: couponToEdit.excludedMembershipType || '', // New
        fullPriceItemsOnly: couponToEdit.fullPriceItemsOnly,
        timeSeasonEventRestriction: couponToEdit.timeSeasonEventRestriction || '',
      });
      setShowForm(true); // Show the form when editing
    } else if (!isEditing) {
      // Reset form if not in editing mode or finished editing
      setFormData(defaultFormData);
      setEditingCouponCode(null);
    }
  }, [isEditing, editingCouponCode, allCoupons]);

  // Handles changes in form input fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? (value === '' ? '' : Number(value)) : value) // Convert to number if type is 'number', handle empty string
    }));
  };

  // Handles changes for multi-select checkboxes (e.g., target audience, valid channels, excluded categories)
  const handleMultiSelectChange = (e, fieldName) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const updatedArray = checked
        ? [...prev[fieldName], value] // Add value if checked
        : prev[fieldName].filter(item => item !== value); // Remove value if unchecked
      return { ...prev, [fieldName]: updatedArray };
    });
  };

  // Handles form submission (either generate new coupon or update existing)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      onUpdateCoupon({ ...formData, couponCode: editingCouponCode }); // Pass couponCode for update
      setIsEditing(false); // Exit editing mode
    } else {
      onGenerateCoupon(formData);
    }
    setFormData(defaultFormData); // Reset form after submission
    setShowForm(false); // Hide form after submission
  };

  // Sets the component to editing mode for a specific coupon
  const handleEditClick = (couponCode) => {
    setIsEditing(true);
    setEditingCouponCode(couponCode);
    setShowForm(true); // Show form when editing
  };

  // Sets the component to creation mode for a new coupon
  const handleCreateNewClick = () => {
    setIsEditing(false); // Ensure not in editing mode
    setEditingCouponCode(null); // Clear any editing coupon
    setFormData(defaultFormData); // Reset form for new creation
    setShowForm(true); // Show the form
  };

  // Cancels the current edit operation and hides the form
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCouponCode(null);
    setFormData(defaultFormData); // Reset form to default
    setShowForm(false); // Hide form on cancel
  };

  return (
    <div className="space-y-10">
      {showForm && (
        <h2 className="text-3xl font-extrabold text-gray-800 text-center">Admin: Coupon Setup</h2>
      )}

      {/* Coupon Creation/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Coupon Basic Info Section */}
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
                  placeholder="e.g., $10 off for new members"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Primary Characteristics Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Key Primary Characteristics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="flatDiscountAmount" className="block text-base font-medium text-gray-700 mb-2">Flat Discount Amount ($)</label>
                <input
                  type="number"
                  id="flatDiscountAmount"
                  name="flatDiscountAmount"
                  min="0"
                  step="0.01"
                  value={formData.flatDiscountAmount}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                  placeholder="e.g., 10.00"
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
                  step="0.01"
                  value={formData.minPurchaseValue}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                  placeholder="e.g., 50.00"
                />
              </div>
              <div>
                <label htmlFor="minQuantity" className="block text-base font-medium text-gray-700 mb-2">Minimum Quantity (0 for none)</label>
                <input
                  type="number"
                  id="minQuantity"
                  name="minQuantity"
                  min="0"
                  value={formData.minQuantity}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                  placeholder="e.g., 2"
                />
              </div>
              {formData.minQuantity > 0 && (
                <div>
                  <label htmlFor="minPurchaseProductCategory" className="block text-base font-medium text-gray-700 mb-2">Min. Quantity Product Category</label>
                  <select
                    id="minPurchaseProductCategory"
                    name="minPurchaseProductCategory"
                    value={formData.minPurchaseProductCategory}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                  >
                    <option value="">-- Select Category --</option>
                    <option value="Membership Card">Membership Card</option>
                    <option value="Tee Times">Tee Times</option>
                    <option value="Tournament Pass">Tournament Pass</option>
                    <option value="Pro Shop Items">Pro Shop Items</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">Discount Applied On Product</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Radio buttons for selecting a single product type */}
                  {['Membership Card', 'Tee Times Coupon (Course Specific)', 'Any Tournament Entry Pass', 'Specific Tournament Entry Pass', 'Pro Shop Items'].map(product => (
                    <label key={product} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="discountProducts"
                        value={product}
                        checked={formData.discountProducts === product}
                        onChange={handleChange}
                        className="rounded-full border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500 w-5 h-5 transition duration-150 ease-in-out"
                      />
                      <span className="ml-3 text-base text-gray-700">{product}</span>
                    </label>
                  ))}
                </div>
                {/* Conditional dropdowns based on discountProducts selection */}
                {formData.discountProducts === 'Tee Times Coupon (Course Specific)' && (
                  <div className="mt-4 space-y-4">
                    <div>
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
                    <div>
                      <label htmlFor="teeTimeRestriction" className="block text-base font-medium text-gray-700 mb-2">Tee Time Restriction</label>
                      <select
                        id="teeTimeRestriction"
                        name="teeTimeRestriction"
                        value={formData.teeTimeRestriction}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                      >
                        <option value="">-- No Specific Restriction --</option>
                        <option value="Weekday Tee Times">Weekday Tee Times</option>
                        <option value="Weekend Tee Times">Weekend Tee Times</option>
                        <option value="Morning Tee Times (before 12 PM)">Morning Tee Times (before 12 PM)</option>
                        <option value="Twilight Tee Times (after 3 PM)">Twilight Tee Times (after 3 PM)</option>
                      </select>
                    </div>
                  </div>
                )}
                {formData.discountProducts === 'Membership Card' && (
                  <div className="mt-4">
                    <label htmlFor="membershipType" className="block text-base font-medium text-gray-700 mb-2">Specific Membership Type</label>
                    <select
                      id="membershipType"
                      name="membershipType"
                      value={formData.membershipType}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                    >
                      <option value="">-- Any Membership Type --</option>
                      {allMembershipTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                )}
                {formData.discountProducts === 'Pro Shop Items' && (
                  <div className="mt-4">
                    <label htmlFor="proShopCategory" className="block text-base font-medium text-gray-700 mb-2">Specific Pro Shop Category</label>
                    <select
                      id="proShopCategory"
                      name="proShopCategory"
                      value={formData.proShopCategory}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                    >
                      <option value="">-- All Pro Shop Items --</option>
                      <option value="Apparel">Apparel</option>
                      <option value="Golf Clubs">Golf Clubs</option>
                      <option value="Balls & Accessories">Balls & Accessories</option>
                    </select>
                  </div>
                )}
                <div className="mt-4">
                  <label htmlFor="timeSeasonEventRestriction" className="block text-base font-medium text-gray-700 mb-2">Time/Season/Event Restriction (Descriptive)</label>
                  <input
                    type="text"
                    id="timeSeasonEventRestriction"
                    name="timeSeasonEventRestriction"
                    value={formData.timeSeasonEventRestriction}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                    placeholder="e.g., Off-peak Tee Times, Fall Membership Drive"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Usage Limits & Audience Section */}
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
                  {/* Checkboxes for selecting multiple target audiences */}
                  {['All Golfers', 'New Golfers', 'Existing Golfers', 'Gold Tier', 'Silver Tier', 'Paradise Card Members', 'Non Paradise Members', 'Referral Program Participants', 'Dormant Members', 'Tournament Participants', 'Local Residents', 'Birthday/Anniversary'].map(audience => (
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
            </div>
          </div>

          {/* Channel & Auto-Apply Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Channel & Auto-Apply</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">Valid Channels</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Checkboxes for selecting multiple valid channels */}
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
              {/* Moved "Application Rules" here */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner col-span-full md:col-span-1">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Application Rules</h4>
                <div className="space-y-4">
                  <div className="flex items-center">
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
                  <div className="flex items-center">
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
                  <div className="flex items-center">
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
              </div>
            </div>
          </div>

          {/* Secondary Characteristics (Terms & Conditions) Section */}
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
            <div className="mt-8 space-y-4">
              <div>
                <label htmlFor="exclusions" className="block text-base font-medium text-gray-700 mb-2">Exclusions (Free Text)</label>
                <textarea
                  id="exclusions"
                  name="exclusions"
                  rows="2"
                  value={formData.exclusions}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                  placeholder="e.g., Not valid on holidays"
                ></textarea>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">Specific Excluded Categories</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Gift Cards', 'Already Discounted Items', 'Specific Courses', 'Specific Membership Types', 'Tournament Entry Passes', 'Pro Shop Items'].map(category => (
                    <label key={category} className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="excludedCategories"
                        value={category}
                        checked={formData.excludedCategories.includes(category)}
                        onChange={(e) => handleMultiSelectChange(e, 'excludedCategories')}
                        className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500 w-5 h-5 transition duration-150 ease-in-out"
                      />
                      <span className="ml-3 text-base text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
                {formData.excludedCategories.includes('Specific Courses') && (
                  <div className="mt-4">
                    <label htmlFor="excludedCourseName" className="block text-base font-medium text-gray-700 mb-2">Excluded Golf Course (for 'Specific Courses' exclusion)</label>
                    <select
                      id="excludedCourseName"
                      name="excludedCourseName"
                      value={formData.excludedCourseName} // This would need to be a new state or handled more dynamically
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                    >
                      <option value="">-- Select Excluded Course --</option>
                      {golfCourses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>
                )}
                {formData.excludedCategories.includes('Specific Membership Types') && (
                  <div className="mt-4">
                    <label htmlFor="excludedMembershipType" className="block text-base font-medium text-gray-700 mb-2">Excluded Membership Type</label>
                    <select
                      id="excludedMembershipType"
                      name="excludedMembershipType"
                      value={formData.excludedMembershipType}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-lg p-3.5 transition duration-150 ease-in-out"
                    >
                      <option value="">-- Select Excluded Membership Type --</option>
                      {allMembershipTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Submission Buttons */}
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

      {/* List of All Coupons (shown when form is not visible) */}
      {!showForm && (
        <div className="mt-16 p-4 bg-gray-50 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">All Generated Coupons</h3>
            {/* Button to create a new coupon */}
            <button
              onClick={handleCreateNewClick}
              className="p-3 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-150 ease-in-out group"
              title="Create New Flat Discount"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="sr-only group-hover:not-sr-only group-hover:ml-2">Create New Flat Discount</span>
            </button>
          </div>
          {/* Display message if no coupons are generated */}
          {allCoupons.size === 0 ? (
            <p className="text-gray-600 text-center py-8">No coupons generated yet.</p>
          ) : (
            <div className="space-y-6">
              {/* Map through all generated coupons and display them */}
              {Array.from(allCoupons.values()).map(coupon => (
                <div key={coupon.couponCode} className="flex flex-col sm:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <div className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
                    {coupon.couponName} (Flat ${coupon.flatDiscountAmount ? coupon.flatDiscountAmount.toFixed(2) : '0.00'} OFF) - <span className="text-green-600">{coupon.couponCode}</span>
                  </div>
                  <div className="flex space-x-3">
                    {/* Buttons to edit or copy coupon code */}
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

// CheckoutSummaryModal Component: Displays a detailed invoice-like summary for checkout.
const CheckoutSummaryModal = ({ product, coupon, originalPrice, discountAmount, finalPrice, onClose, onPayNow }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative transform scale-95 opacity-0 animate-scaleIn">
        <h3 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Checkout Summary</h3>

        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto"> {/* Adjusted width */}
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3"> {/* Adjusted width */}
                  Original Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-normal break-words"> {/* Added whitespace-normal and break-words */}
                  {product.name}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-500">
                  ${originalPrice.toFixed(2)}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-normal break-words"> {/* Added whitespace-normal and break-words */}
                  Coupon Applied: {coupon.couponName}
                </td>
                <td className="px-6 py-3 text-right text-xs font-medium text-green-600 uppercase tracking-wider">
                  -${discountAmount.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-left text-base font-bold text-gray-900 uppercase">
                  Payable Amount
                </td>
                <td className="px-6 py-3 text-right text-base font-bold text-green-700 uppercase">
                  ${finalPrice.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={onPayNow}
            className="w-full py-3 px-6 rounded-xl shadow-lg text-xl font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Pay Now with Authorize.Net
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl shadow-md text-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


// RedeemToPurchaseSimulation: Simulates a golfer redeeming a coupon directly for a purchase.
const RedeemToPurchaseSimulation = ({ coupon, onBack, handleShowMessageBox, onRedeemInApp, sampleProductsData }) => {
  const [showCheckoutSummary, setShowCheckoutSummary] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState(null);

  const productType = coupon.discountProducts;
  let product = null;

  // Determine the product to display based on the coupon's discountProducts type
  if (productType === 'Tee Times Coupon (Course Specific)') {
    // For Tee Times, create a synthetic product to include the course name
    product = {
      id: 'tee-time-specific',
      name: `Tee Time at ${coupon.courseName || 'Selected Course'}`,
      price: 100.00, // Default price for simulation
      category: 'Tee Times', // Added category for minQuantity check
      description: `A specific tee time at ${coupon.courseName || 'your chosen course'}.`
    };
  } else if (productType === 'Membership Card') {
    product = sampleProductsData[productType]?.find(p => p.name.includes(coupon.membershipType)) || sampleProductsData[productType][0];
    if (product) product.category = 'Membership Card';
  } else if (productType === 'Pro Shop Items') {
    product = sampleProductsData[productType]?.find(p => p.category === coupon.proShopCategory) || sampleProductsData[productType][0];
    if (product) product.category = 'Pro Shop Items';
  } else if (productType === 'Specific Tournament Entry Pass' || productType === 'Any Tournament Entry Pass') {
    product = sampleProductsData['Tournament Pass'][0]; // Use a generic tournament pass
    if (product) product.category = 'Tournament Pass';
  } else {
    // For other product types, get the first sample product from the provided data
    product = sampleProductsData[productType] ? sampleProductsData[productType][0] : null;
    if (product) product.category = productType; // Assign category based on product type
  }

  const productPrice = product ? product.price : 100; // Use product price or default
  const productCategory = product ? product.category : '';
  const productQuantity = 1; // For simplicity, assume 1 item in this simulation

  // Check minimum purchase value
  if (coupon.minPurchaseValue && productPrice < coupon.minPurchaseValue) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Redemption Not Possible</h3>
        <p className="text-red-600 text-xl">This coupon requires a minimum purchase value of ${coupon.minPurchaseValue.toFixed(2)}.</p>
        <p className="text-gray-600">Current product price: ${productPrice.toFixed(2)}</p>
        <button
          onClick={onBack}
          className="w-full py-3 px-6 rounded-xl shadow-md text-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out"
        >
          Back to Coupons
        </button>
      </div>
    );
  }

  // Check minimum quantity and category
  if (coupon.minQuantity > 0) {
    if (productQuantity < coupon.minQuantity) {
      return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Redemption Not Possible</h3>
          <p className="text-red-600 text-xl">This coupon requires a minimum quantity of {coupon.minQuantity} items.</p>
          <p className="text-gray-600">Current quantity: {productQuantity}</p>
          <button
            onClick={onBack}
            className="w-full py-3 px-6 rounded-xl shadow-md text-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out"
          >
            Back to Coupons
          </button>
        </div>
      );
    }
    if (coupon.minPurchaseProductCategory && productCategory !== coupon.minPurchaseProductCategory) {
      return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Redemption Not Possible</h3>
          <p className="text-red-600 text-xl">This coupon requires the minimum quantity to be of category "{coupon.minPurchaseProductCategory}".</p>
          <p className="text-gray-600">Current product category: {productCategory}</p>
          <button
            onClick={onBack}
            className="w-full py-3 px-6 rounded-xl shadow-md text-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out"
          >
            Back to Coupons
          </button>
        </div>
      );
    }
  }

  // Check for exclusions
  if (coupon.excludedCategories && coupon.excludedCategories.length > 0) {
    if (coupon.excludedCategories.includes('Already Discounted Items') && productPrice < (product ? sampleProductsData[productType][0].price : 100)) { // Simplified check for 'already discounted'
      return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Redemption Not Possible</h3>
          <p className="text-red-600 text-xl">This coupon cannot be applied to already discounted items.</p>
          <button onClick={onBack} className="w-full py-3 px-6 rounded-xl shadow-md text-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out">Back to Coupons</button>
        </div>
      );
    }
    if (coupon.excludedCategories.includes('Gift Cards')) { // Assuming product is not a gift card for now
      // Add more specific logic if 'Gift Cards' were a product category
    }
    if (coupon.excludedCategories.includes('Specific Courses') && productType === 'Tee Times Coupon (Course Specific)' && coupon.courseName === 'TPC Tampa Bay') { // Example exclusion
      return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Redemption Not Possible</h3>
          <p className="text-red-600 text-xl">This coupon excludes bookings at TPC Tampa Bay.</p>
          <button onClick={onBack} className="w-full py-3 px-6 rounded-xl shadow-md text-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out">Back to Coupons</button>
        </div>
      );
    }
    if (coupon.excludedCategories.includes('Specific Membership Types') && productCategory === 'Membership Card' && coupon.excludedMembershipType === product.category) {
      return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Redemption Not Possible</h3>
          <p className="text-red-600 text-xl">This coupon excludes "{coupon.excludedMembershipType}" memberships.</p>
          <button onClick={onBack} className="w-full py-3 px-6 rounded-xl shadow-md text-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out">Back to Coupons</button>
        </div>
      );
    }
  }


  // Calculate the discount amount (flat discount, capped by product price)
  const discountAmount = Math.min(coupon.flatDiscountAmount || 0, productPrice);
  const finalPrice = productPrice - discountAmount; // Calculate the final price after discount

  // Handles the checkout process, triggering coupon redemption
  const handleProceedToCheckout = () => {
    setCheckoutDetails({ product, originalPrice: productPrice, discountAmount, finalPrice, coupon });
    setShowCheckoutSummary(true);
  };

  const handlePayNow = async () => {
    const success = await onRedeemInApp(coupon.couponCode, 'Online/In-App'); // Attempt to redeem the coupon
    if (success) {
      handleShowMessageBox('Payment Successful!', `Your payment for $${finalPrice.toFixed(2)} has been processed via Authorize.Net!`);
      setShowCheckoutSummary(false); // Close the summary modal
      onBack(); // Go back to coupons after payment
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Redeem to Purchase: {productType || 'Selected Product'}</h3>
      {product ? (
        <div className="flex items-center space-x-6">
          {/* Placeholder image for the product */}
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
      {/* Button to proceed to checkout */}
      <button
        onClick={handleProceedToCheckout}
        className="w-full py-3 px-6 rounded-xl shadow-lg text-xl font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-200 ease-in-out transform hover:scale-105"
      >
        Proceed to Checkout
      </button>
      {/* Button to go back to the main coupon list */}
      <button
        onClick={onBack}
        className="w-full py-3 px-6 rounded-xl shadow-md text-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out"
      >
        Back to Coupons
      </button>

      {showCheckoutSummary && checkoutDetails && (
        <CheckoutSummaryModal
          product={checkoutDetails.product}
          coupon={checkoutDetails.coupon}
          originalPrice={checkoutDetails.originalPrice}
          discountAmount={checkoutDetails.discountAmount}
          finalPrice={checkoutDetails.finalPrice} // Corrected this line
          onClose={() => setShowCheckoutSummary(false)}
          onPayNow={handlePayNow}
        />
      )}
    </div>
  );
};

// ApplyAtCheckoutSimulation: Simulates a golfer applying a coupon at checkout for various products.
const ApplyAtCheckoutSimulation = ({ selectedCoupon: initialSelectedCoupon, onBack, handleShowMessageBox, onRedeemInApp, sampleProductsData, preSelectedCategory, allCoupons }) => {
  const [showCheckoutSummary, setShowCheckoutSummary] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState(null);
  const [currentAppliedCoupon, setCurrentAppliedCoupon] = useState(initialSelectedCoupon); // State for the coupon actually applied

  // Determine the product type to display based on whether a specific coupon is selected
  // or if a category was pre-selected from the main menu
  const productType = initialSelectedCoupon?.discountProducts || preSelectedCategory;

  let productsToDisplay = useMemo(() => {
    if (productType === 'Tee Times Coupon (Course Specific)') {
      return [
        { id: 'tee-time-specific-1', name: `Morning Tee Time at ${initialSelectedCoupon?.courseName || 'Selected Course'}`, price: 75.00, category: 'Tee Times Coupon (Course Specific)', description: 'Early bird special.' },
        { id: 'tee-time-specific-2', name: `Afternoon Tee Time at ${initialSelectedCoupon?.courseName || 'Selected Course'}`, price: 120.00, category: 'Tee Times Coupon (Course Specific)', description: 'Prime slot.' },
      ];
    } else if (productType === 'Membership Card') {
      return sampleProductsData[productType].map(p => ({ ...p, category: 'Membership Card' }));
    } else if (productType === 'Pro Shop Items') {
      return sampleProductsData[productType].map(p => ({ ...p, category: 'Pro Shop Items' }));
    } else if (productType === 'Specific Tournament Entry Pass' || productType === 'Any Tournament Entry Pass') {
      return sampleProductsData['Tournament Pass'].map(p => ({ ...p, category: 'Tournament Pass' }));
    } else {
      const products = sampleProductsData[productType] || [];
      return products.map(p => ({ ...p, category: productType }));
    }
  }, [productType, initialSelectedCoupon, sampleProductsData]);


  // Filter applicable coupons based on preSelectedCategory if no initial coupon is selected
  const applicableCoupons = useMemo(() => {
    if (initialSelectedCoupon) return []; // If a specific coupon was clicked, don't show others for selection here
    if (!preSelectedCategory) return []; // No category selected, no coupons to show

    return Array.from(allCoupons.values()).filter(coupon => {
      // Check if the coupon's discountProducts matches the preSelectedCategory
      // This is a simplified check. More complex logic would involve checking if the coupon's
      // discountProducts type is a general category that applies to the specific preSelectedCategory.
      return coupon.discountProducts === preSelectedCategory;
    });
  }, [preSelectedCategory, allCoupons, initialSelectedCoupon]);

  // Effect to handle auto-applying a coupon when preSelectedCategory changes
  useEffect(() => {
    if (preSelectedCategory && !initialSelectedCoupon) {
      const autoApplyCandidate = applicableCoupons.find(coupon => coupon.autoApplyEligible);
      let showAutoApplyMessage = false; // Flag to control message display

      setCurrentAppliedCoupon(prevCoupon => {
        if (autoApplyCandidate && prevCoupon !== autoApplyCandidate) {
          showAutoApplyMessage = true; // Set flag if auto-apply occurs
          return autoApplyCandidate;
        } else if (!autoApplyCandidate && prevCoupon !== null) {
          return null; // No auto-apply eligible coupon, clear if one was applied
        }
        return prevCoupon; // No change needed
      });

      // Show message box outside of the state updater function
      if (showAutoApplyMessage) {
        handleShowMessageBox('Coupon Auto-Applied', `"${autoApplyCandidate.couponName}" has been auto-applied.`);
      }
    } else if (initialSelectedCoupon) {
      setCurrentAppliedCoupon(initialSelectedCoupon);
    }
  }, [preSelectedCategory, initialSelectedCoupon, applicableCoupons, handleShowMessageBox]);


  // Calculates the discounted price for a given original price and product category
  const calculateDiscountedPrice = (originalPrice, productCategory, productQuantity = 1) => {
    const coupon = currentAppliedCoupon; // Use currentAppliedCoupon for discount calculations

    // If no coupon is selected, return original price
    if (!coupon) {
      return originalPrice;
    }

    // Apply minimum purchase value check
    if (coupon.minPurchaseValue && originalPrice < coupon.minPurchaseValue) {
      return originalPrice; // No discount if min purchase not met
    }
    // Apply minimum quantity check
    if (coupon.minQuantity > 0 && productQuantity < coupon.minQuantity) {
      return originalPrice;
    }
    if (coupon.minQuantity > 0 && coupon.minPurchaseProductCategory && productCategory !== coupon.minPurchaseProductCategory) {
      return originalPrice;
    }

    // Check for exclusions
    if (coupon.excludedCategories && coupon.excludedCategories.length > 0) {
      if (coupon.excludedCategories.includes('Already Discounted Items') && originalPrice < (sampleProductsData[productType]?.[0]?.price || originalPrice)) { // Simplified check
        return originalPrice;
      }
      if (coupon.excludedCategories.includes('Gift Cards') && productCategory === 'Gift Cards') { // Placeholder
        return originalPrice;
      }
      if (coupon.excludedCategories.includes('Specific Courses') && productType === 'Tee Times Coupon (Course Specific)' && coupon.courseName === 'TPC Tampa Bay') { // Example exclusion
        return originalPrice;
      }
      if (coupon.excludedCategories.includes('Specific Membership Types') && productCategory === 'Membership Card' && coupon.excludedMembershipType === productCategory) { // Example exclusion
        return originalPrice;
      }
      if (coupon.excludedCategories.includes('Tournament Entry Passes') && productType.includes('Tournament Pass')) { // Example exclusion
        return originalPrice;
      }
      if (coupon.excludedCategories.includes('Pro Shop Items') && productType === 'Pro Shop Items') { // Example exclusion
        return originalPrice;
      }
    }

    const discountAmount = Math.min(coupon.flatDiscountAmount || 0, originalPrice);
    return originalPrice - discountAmount;
  };

  // Handles the checkout process for a selected product
  const handleProceedToCheckout = (product) => {
    const coupon = currentAppliedCoupon; // Use currentAppliedCoupon for discount calculations

    // If no coupon is selected, proceed without discount
    if (!coupon) {
      setCheckoutDetails({ product, originalPrice: product.price, discountAmount: 0, finalPrice: product.price, coupon: { couponName: 'No Coupon Applied' } });
      setShowCheckoutSummary(true);
      return;
    }

    // Pre-check for minimum purchase value
    if (coupon.minPurchaseValue && product.price < coupon.minPurchaseValue) {
      handleShowMessageBox('Redemption Not Possible', `This coupon requires a minimum purchase value of $${coupon.minPurchaseValue.toFixed(2)} for "${product.name}".`);
      return;
    }
    // Pre-check for minimum quantity
    if (coupon.minQuantity > 0 && 1 < coupon.minQuantity) { // Assuming quantity of 1 for this simulation
      handleShowMessageBox('Redemption Not Possible', `This coupon requires a minimum quantity of ${coupon.minQuantity} items for "${product.name}".`);
      return;
    }
    if (coupon.minQuantity > 0 && coupon.minPurchaseProductCategory && product.category !== coupon.minPurchaseProductCategory) {
      handleShowMessageBox('Redemption Not Possible', `This coupon requires the minimum quantity to be of category "${coupon.minPurchaseProductCategory}" for "${product.name}".`);
      return;
    }

    // Pre-check for exclusions
    if (coupon.excludedCategories && coupon.excludedCategories.length > 0) {
      if (coupon.excludedCategories.includes('Already Discounted Items') && product.price < (sampleProductsData[productType]?.[0]?.price || product.price)) {
        handleShowMessageBox('Redemption Not Possible', `This coupon cannot be applied to already discounted items like "${product.name}".`);
        return;
      }
      if (coupon.excludedCategories.includes('Specific Courses') && productType === 'Tee Times Coupon (Course Specific)' && coupon.courseName === 'TPC Tampa Bay') {
        handleShowMessageBox('Redemption Not Possible', `This coupon excludes bookings at TPC Tampa Bay.`);
        return;
      }
      if (coupon.excludedCategories.includes('Specific Membership Types') && product.category === 'Membership Card' && coupon.excludedMembershipType === product.category) {
        handleShowMessageBox('Redemption Not Possible', `This coupon excludes "${coupon.excludedMembershipType}" memberships.`);
        return;
      }
      // Add more specific pre-checks for other excluded categories if needed
    }

    const discountAmount = Math.min(coupon.flatDiscountAmount || 0, product.price);
    const finalPrice = product.price - discountAmount;
    setCheckoutDetails({ product, originalPrice: product.price, discountAmount, finalPrice, coupon });
    setShowCheckoutSummary(true);
  };

  const handlePayNow = async () => {
    // Only attempt redemption if a coupon was actually applied
    if (checkoutDetails.coupon && checkoutDetails.coupon.couponCode && checkoutDetails.coupon.couponName !== 'No Coupon Applied') {
      const success = await onRedeemInApp(checkoutDetails.coupon.couponCode, 'Online/In-App');
      if (!success) {
        // If redemption failed, keep the summary open and show an error message
        handleShowMessageBox('Payment Failed', 'Coupon redemption failed. Please try again or choose another coupon.');
        return;
      }
    }

    handleShowMessageBox('Payment Successful!', `Your payment for $${checkoutDetails.finalPrice.toFixed(2)} has been processed via Authorize.Net!`);
    setShowCheckoutSummary(false); // Close the summary modal
    onBack(); // Go back to coupons after payment
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Apply at Checkout: {productType || 'Products'}</h3>

      {applicableCoupons.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-3">Applicable Coupons:</h4>
          <div className="space-y-2">
            {applicableCoupons.map(coupon => (
              <div key={coupon.couponCode} className={`flex justify-between items-center p-3 rounded-md ${currentAppliedCoupon?.couponCode === coupon.couponCode ? 'bg-blue-200 border-2 border-blue-500' : 'bg-white border border-gray-200'}`}>
                <span className="font-medium text-gray-800">
                  {coupon.couponName} (Flat ${coupon.flatDiscountAmount.toFixed(2)} OFF)
                  {coupon.autoApplyEligible && <span className="ml-2 text-xs text-green-700 font-bold">(Auto-Eligible)</span>}
                </span>
                {currentAppliedCoupon?.couponCode === coupon.couponCode ? (
                  <span className="text-green-600 font-bold">Applied!</span>
                ) : (
                  <button
                    onClick={() => setCurrentAppliedCoupon(coupon)}
                    className="py-1 px-3 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 transition duration-150"
                  >
                    Apply
                  </button>
                )}
              </div>
            ))}
            {currentAppliedCoupon && (
              <button
                onClick={() => setCurrentAppliedCoupon(null)}
                className="w-full mt-2 py-1 px-3 rounded-md bg-red-100 text-red-700 text-sm hover:bg-red-200 transition duration-150"
              >
                Remove Applied Coupon
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {productsToDisplay.length > 0 ? (
          productsToDisplay.map(product => (
            <div key={product.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <div>
                <p className="font-semibold text-lg">{product.name}</p>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-gray-600">Original Price: ${product.price.toFixed(2)}</p>
                {currentAppliedCoupon && (
                  (currentAppliedCoupon.minPurchaseValue && product.price < currentAppliedCoupon.minPurchaseValue) ||
                  (currentAppliedCoupon.minQuantity > 0 && 1 < currentAppliedCoupon.minQuantity) ||
                  (currentAppliedCoupon.minQuantity > 0 && currentAppliedCoupon.minPurchaseProductCategory && product.category !== currentAppliedCoupon.minPurchaseProductCategory)
                ) ? (
                  <p className="text-red-500 text-sm">
                    {currentAppliedCoupon.minPurchaseValue && product.price < currentAppliedCoupon.minPurchaseValue && `Min. purchase $${currentAppliedCoupon.minPurchaseValue.toFixed(2)} required. `}
                    {currentAppliedCoupon.minQuantity > 0 && 1 < currentAppliedCoupon.minQuantity && `Min. quantity ${currentAppliedCoupon.minQuantity} required. `}
                    {currentAppliedCoupon.minQuantity > 0 && currentAppliedCoupon.minPurchaseProductCategory && product.category !== currentAppliedCoupon.minPurchaseProductCategory && `Min. quantity of category "${currentAppliedCoupon.minPurchaseProductCategory}" required.`}
                  </p>
                ) : (
                  <p className="text-green-600 font-bold text-lg">
                    Discounted Price: ${calculateDiscountedPrice(product.price, product.category).toFixed(2)}
                  </p>
                )}
              </div>
              {/* Button to add product to cart and simulate checkout */}
              <button
                onClick={() => handleProceedToCheckout(product)}
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
      {currentAppliedCoupon && (
        <p className="text-sm text-gray-500 text-center mt-4">Coupon "{currentAppliedCoupon.couponCode}" will be applied at checkout if eligible.</p>
      )}
      {/* Button to go back to the main coupon list */}
      <button
        onClick={onBack}
        className="w-full py-3 px-6 rounded-xl shadow-md text-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out"
      >
        Back to Coupons
      </button>

      {showCheckoutSummary && checkoutDetails && (
        <CheckoutSummaryModal
          product={checkoutDetails.product}
          coupon={checkoutDetails.coupon}
          originalPrice={checkoutDetails.originalPrice}
          discountAmount={checkoutDetails.discountAmount}
          finalPrice={checkoutDetails.finalPrice}
          onClose={() => setShowCheckoutSummary(false)}
          onPayNow={handlePayNow}
        />
      )}
    </div>
  );
};

// MembershipCardView Component: Displays a simulated golfer membership card.
const MembershipCardView = ({ membershipCardData, onBack }) => {
  if (!membershipCardData) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6 text-center">
        <p className="text-gray-600 text-xl py-16">No membership card data available.</p>
        <button
          onClick={onBack}
          className="w-full py-3 px-6 rounded-xl shadow-md text-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out"
        >
          Back to Coupons
        </button>
      </div>
    );
  }

  // Helper to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">My Membership Card</h3>
      <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-2xl p-8 shadow-2xl overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-black opacity-10 rounded-2xl transform -rotate-12 scale-125"></div>
        <div className="relative z-10 flex flex-col items-center">
          <img
            src={membershipCardData.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4"
          />
          <h4 className="text-4xl font-extrabold mb-2">{membershipCardData.memberName}</h4>
          <p className="text-xl font-semibold opacity-90 mb-1">Member ID: {membershipCardData.memberId}</p>
          <p className="text-2xl font-bold mb-4 px-4 py-1 rounded-full bg-white bg-opacity-20">
            {membershipCardData.membershipTier} Tier
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-center md:text-left mt-6">
            <div>
              <p className="text-lg font-medium opacity-80">Valid Until:</p>
              <p className="text-xl font-bold">{formatDate(membershipCardData.expiryDate)}</p>
            </div>
            <div>
              <p className="text-lg font-medium opacity-80">Benefits:</p>
              <ul className="list-disc list-inside text-xl font-bold">
                {membershipCardData.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Simulated QR Code */}
          <div className="mt-8 bg-white p-4 rounded-lg shadow-xl">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${membershipCardData.qrCodeData}`}
              alt="QR Code"
              className="w-32 h-32"
            />
            <p className="text-gray-700 text-sm mt-2">Scan for quick check-in</p>
          </div>
        </div>
      </div>
      <button
        onClick={onBack}
        className="w-full py-3 px-6 rounded-xl shadow-md text-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out"
      >
        Back to My Coupons
      </button>
    </div>
  );
};


// GolferView Component: Displays coupons available to a golfer and allows various actions.
const GolferView = ({ allCoupons, onShowDetails, handleShowMessageBox,
  couponRedemptionCounts, userCouponRedemptionCounts, simulatedUserId, onRedeemInApp, sampleProductsData, membershipCardData }) => {
  // State to manage the current sub-view within the Golfer perspective
  const [golferSubView, setGolferSubView] = useState('myCoupons'); // 'myCoupons', 'redeemToPurchase', 'applyAtCheckout', 'membershipCard'
  // State to hold the coupon object selected for an action in sub-views
  const [selectedCouponForAction, setSelectedCouponForAction] = useState(null);
  // New state to hold the pre-selected product category when navigating from menu options
  const [preSelectedProductCategoryForPurchase, setPreSelectedProductCategoryForPurchase] = useState(null);


  // Navigates to the "Redeem to Purchase" simulation view
  const handleGoToRedeemToPurchase = (coupon) => {
    setSelectedCouponForAction(coupon);
    setPreSelectedProductCategoryForPurchase(null); // Clear pre-selected category
    setGolferSubView('redeemToPurchase');
  };

  // Navigates to the "Apply at Checkout" simulation view (from a coupon)
  const handleGoToApplyAtCheckoutFromCoupon = (coupon) => {
    setSelectedCouponForAction(coupon);
    setPreSelectedProductCategoryForPurchase(null); // Clear pre-selected category
    setGolferSubView('applyAtCheckout');
  };

  // Navigates to the "Apply at Checkout" simulation view (from a product category menu item)
  const handleGoToApplyAtCheckoutFromCategory = (category) => {
    setSelectedCouponForAction(null); // Clear selected coupon
    setPreSelectedProductCategoryForPurchase(category); // Set pre-selected category
    setGolferSubView('applyAtCheckout');
  };

  // Navigates back to the "My Coupons" list
  const handleGoBackToMyCoupons = () => {
    setGolferSubView('myCoupons');
    setSelectedCouponForAction(null);
    setPreSelectedProductCategoryForPurchase(null);
  };

  // Navigates to the "Membership Card" view
  const handleGoToMembershipCard = () => {
    setGolferSubView('membershipCard');
    setSelectedCouponForAction(null);
    setPreSelectedProductCategoryForPurchase(null);
  };

  // Simulates adding a coupon to a digital wallet
  const handleAddToWallet = (coupon) => {
    handleShowMessageBox('Add to Wallet', `Simulating adding coupon "${coupon.couponCode}" to Google/Apple Wallet. (No actual integration)`);
  };

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-extrabold text-gray-800 text-center">Golfer App View</h2> {/* Changed title here */}
      <div className="space-y-8">
        {/* Navigation for Golfer sub-views */}
        <div className="flex justify-center flex-wrap gap-4 mb-8">
          <button
            onClick={handleGoBackToMyCoupons}
            className={`py-2 px-4 rounded-xl font-semibold transition-colors duration-200 ${golferSubView === 'myCoupons' && !preSelectedProductCategoryForPurchase ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            My Coupons
          </button>
          <button
            onClick={handleGoToMembershipCard}
            className={`py-2 px-4 rounded-xl font-semibold transition-colors duration-200 ${golferSubView === 'membershipCard' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            My Membership Card
          </button>
          <button
            onClick={() => handleGoToApplyAtCheckoutFromCategory('Tee Times Coupon (Course Specific)')}
            className={`py-2 px-4 rounded-xl font-semibold transition-colors duration-200 ${golferSubView === 'applyAtCheckout' && preSelectedProductCategoryForPurchase === 'Tee Times Coupon (Course Specific)' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Book Tee Time
          </button>
          <button
            onClick={() => handleGoToApplyAtCheckoutFromCategory('Membership Card')}
            className={`py-2 px-4 rounded-xl font-semibold transition-colors duration-200 ${golferSubView === 'applyAtCheckout' && preSelectedProductCategoryForPurchase === 'Membership Card' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Buy/Upgrade Membership
          </button>
          <button
            onClick={() => handleGoToApplyAtCheckoutFromCategory('Tournament Pass')}
            className={`py-2 px-4 rounded-xl font-semibold transition-colors duration-200 ${golferSubView === 'applyAtCheckout' && preSelectedProductCategoryForPurchase === 'Tournament Pass' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Tournament Pass
          </button>
          <button
            onClick={() => handleGoToApplyAtCheckoutFromCategory('Pro Shop Items')}
            className={`py-2 px-4 rounded-xl font-semibold transition-colors duration-200 ${golferSubView === 'applyAtCheckout' && preSelectedProductCategoryForPurchase === 'Pro Shop Items' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Pro Shop
          </button>
        </div>

        {/* Conditionally render content based on the current golferSubView */}
        {golferSubView === 'myCoupons' && (
          allCoupons.size === 0 ? (
            <p className="text-gray-600 text-center text-xl py-16 rounded-2xl bg-white shadow-lg border border-gray-200">No coupons generated yet. Switch to Admin view to create one!</p>
          ) : (
            // Map through all available coupons and display them as DiscountCards
            Array.from(allCoupons.values()).map(coupon => (
              <DiscountCard
                key={coupon.couponCode}
                coupon={coupon}
                showDetailsButton={true} // Enable action buttons for golfer view
                onShowDetails={() => onShowDetails(coupon)}
                totalRedemptionCount={couponRedemptionCounts.get(coupon.couponCode) || 0} // Pass total redemption count
                perUserRedemptionCount={userCouponRedemptionCounts.get(simulatedUserId)?.get(coupon.couponCode) || 0} // Pass per-user redemption count
                perUserLimit={coupon.perUserRedemptionLimit} // Pass per-user limit
                onRedeemToPurchase={() => handleGoToRedeemToPurchase(coupon)}
                onAddToWallet={() => handleAddToWallet(coupon)}
                onApplyAtCheckout={() => handleGoToApplyAtCheckoutFromCoupon(coupon)}
              />
            ))
          )
        )}

        {/* Render RedeemToPurchaseSimulation if selected */}
        {golferSubView === 'redeemToPurchase' && selectedCouponForAction && (
          <RedeemToPurchaseSimulation
            coupon={selectedCouponForAction}
            onBack={handleGoBackToMyCoupons}
            handleShowMessageBox={handleShowMessageBox}
            onRedeemInApp={onRedeemInApp} // Pass the in-app redemption function
            sampleProductsData={sampleProductsData} // Pass sample product data
          />
        )}

        {/* Render ApplyAtCheckoutSimulation if selected */}
        {golferSubView === 'applyAtCheckout' && (selectedCouponForAction || preSelectedProductCategoryForPurchase) && (
          <ApplyAtCheckoutSimulation
            selectedCoupon={selectedCouponForAction} // Pass selected coupon if available
            preSelectedCategory={preSelectedProductCategoryForPurchase} // Pass pre-selected category if available
            onBack={handleGoBackToMyCoupons}
            handleShowMessageBox={handleShowMessageBox}
            onRedeemInApp={onRedeemInApp} // Pass the in-app redemption function
            sampleProductsData={sampleProductsData} // Pass sample product data
            allCoupons={allCoupons} // Pass all coupons for filtering
          />
        )}

        {/* Render MembershipCardView if selected */}
        {golferSubView === 'membershipCard' && (
          <MembershipCardView
            membershipCardData={membershipCardData}
            onBack={handleGoBackToMyCoupons}
          />
        )}
      </div>
    </div>
  );
};

// GolfCourseView Component: Simulates a Point-of-Sale (POS) system for coupon redemption at a golf course.
const GolfCourseView = ({ allCoupons, onRedeemCoupon }) => {
  const [posCouponCode, setPosCouponCode] = useState(''); // State for the coupon code input
  const [redemptionStatus, setRedemptionStatus] = useState({ message: '', type: '' }); // State for redemption status message

  // Handles the redemption attempt when the "Redeem Coupon" button is clicked
  const handleRedeem = () => {
    // Call the centralized redemption logic, specifying 'POS' channel and a status setter
    onRedeemCoupon(posCouponCode, setRedemptionStatus, 'POS');
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
        {/* Button to trigger coupon redemption */}
        <button
          onClick={handleRedeem}
          className="w-full py-4 px-6 border border-transparent rounded-xl shadow-xl text-xl font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-200 ease-in-out transform hover:scale-105"
        >
          Redeem Coupon
        </button>
        {/* Display redemption status message */}
        {redemptionStatus.message && (
          <div className={`mt-6 text-center font-extrabold text-xl ${redemptionStatus.type === 'success' ? 'text-green-600' : redemptionStatus.type === 'warning' ? 'text-orange-600' : 'text-red-600'}`}>
            {redemptionStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component: Manages the overall state and view switching for the simulation.
const FlatForm = () => {
  const [currentPov, setCurrentPov] = useState('admin'); // Current Point of View: 'admin', 'golfer', or 'golf-course'
  const [allCoupons, setAllCoupons] = useState(new Map()); // Stores all generated coupons (Map for easy lookup by code)
  // Note: redeemedCoupons is kept for historical context but actual redemption counts are now in Maps
  const [redeemedCoupons, setRedeemedCoupons] = useState(new Set()); // Tracks globally redeemed coupons (for simplicity, not used for limits)
  const [couponRedemptionCounts, setCouponRedemptionCounts] = useState(new Map()); // Total redemptions per coupon code
  const [userCouponRedemptionCounts, setUserCouponRedemptionCounts] = useState(new Map()); // Per-user redemptions per coupon code
  const [membershipCardData, setMembershipCardData] = useState(null); // State for golfer's membership card data

  const [showMessageBox, setShowMessageBox] = useState(false); // Controls visibility of the main message box
  const [messageBoxContent, setMessageBoxContent] = useState({ title: '', message: '' }); // Content for the message box
  const [showSecondaryModal, setShowSecondaryModal] = useState(false); // Controls visibility of the secondary details modal
  const [modalCouponDetails, setModalCouponDetails] = useState(null); // Coupon details for the secondary modal

  // Refs for the POV toggle animation
  const toggleThumbRef = useRef(null);
  const toggleContainerRef = useRef(null);

  const simulatedUserId = "golfer-sim-user-123"; // A fixed ID for simulating a single user

  // List of sample golf courses for the Admin view dropdown
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

  // Sample product data for dynamic UI in Golfer view simulations
  const sampleProductsData = {
    'Membership Card': [
      { id: 'mem1', name: 'Bronze Membership', price: 299.99, description: 'Access to basic amenities.', category: 'Membership Card' },
      { id: 'mem2', name: 'Silver Membership', price: 499.99, description: 'Enhanced access and benefits.', category: 'Membership Card' },
      { id: 'mem3', name: 'Gold Membership', price: 799.99, description: 'Premium access and exclusive benefits.', category: 'Membership Card' },
      { id: 'mem4', name: 'Summer Membership', price: 350.00, description: 'Limited summer access.', category: 'Membership Card' },
      { id: 'mem5', name: 'Winter Membership', price: 400.00, description: 'Limited winter access.', category: 'Membership Card' },
      { id: 'mem6', name: 'Year-Around Membership', price: 850.00, description: 'Full year access.', category: 'Membership Card' },
    ],
    'Tee Times Coupon (Course Specific)': [ // This category name aligns with coupon.discountProducts
      // These will be dynamically named based on selected course in the simulation sub-views
      { id: 'tee1', name: 'Morning Tee Time', price: 75.00, description: 'Early bird special.', category: 'Tee Times Coupon (Course Specific)' },
      { id: 'tee2', name: 'Afternoon Tee Time', price: 120.00, description: 'Prime weekend slot.', category: 'Tee Times Coupon (Course Specific)' },
      { id: 'tee3', name: 'Twilight Tee Time', price: 50.00, description: 'Evening play.', category: 'Tee Times Coupon (Course Specific)' },
    ],
    'Tournament Pass': [ // This category name aligns with coupon.discountProducts
      { id: 'tour1', name: 'Amateur Open Pass', price: 150.00, description: 'Entry to local amateur tournament.', category: 'Tournament Pass' },
      { id: 'tour2', name: 'Club Championship Pass', price: 250.00, description: 'Entry to annual club championship.', category: 'Tournament Pass' },
      { id: 'tour3', name: 'Paradise Open Entry', price: 300.00, description: 'Entry to the Paradise Open.', category: 'Tournament Pass' },
    ],
    'Pro Shop Items': [ // This category name aligns with coupon.discountProducts
      { id: 'pro1', name: 'Golf Glove (Premium)', price: 25.00, description: 'High-quality leather glove.', category: 'Pro Shop Items' },
      { id: 'pro2', name: 'Pack of Golf Balls (Pro)', price: 45.00, description: 'Tour-grade golf balls.', category: 'Pro Shop Items' },
      { id: 'pro3', name: 'Golf Polo Shirt', price: 60.00, description: 'Stylish and breathable polo.', category: 'Pro Shop Items' },
      { id: 'pro4', name: 'Driver (Callaway)', price: 400.00, description: 'Latest Callaway driver.', category: 'Pro Shop Items' },
    ],
    'Any Tournament Entry Pass': [ // For coupons that apply to 'Any Tournament Entry Pass'
      { id: 'tour1', name: 'Amateur Open Pass', price: 150.00, description: 'Entry to local amateur tournament.', category: 'Any Tournament Entry Pass' },
      { id: 'tour2', name: 'Club Championship Pass', price: 250.00, description: 'Entry to annual club championship.', category: 'Any Tournament Entry Pass' },
    ],
    'Specific Tournament Entry Pass': [ // For coupons that apply to 'Specific Tournament Entry Pass'
      { id: 'tour3', name: 'Paradise Open Entry', price: 300.00, description: 'Entry to the Paradise Open.', category: 'Specific Tournament Entry Pass' },
    ]
  };

  // Generates a unique coupon code
  const generateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'PGT-DISCOUNT-';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Shows the custom message box with a given title and message
  const handleShowMessageBox = (title, message) => {
    setMessageBoxContent({ title, message });
    setShowMessageBox(true);
  };

  // Closes the custom message box
  const handleCloseMessageBox = () => {
    setShowMessageBox(false);
  };

  // Centralized Redemption Logic: Handles all coupon redemption attempts and applies validation rules.
  const processRedemption = (couponCode, channel, setStatus = null) => {
    const coupon = allCoupons.get(couponCode);

    // Check if coupon exists
    if (!coupon) {
      handleShowMessageBox('Redemption Failed', `Coupon code "${couponCode}" not found or invalid.`);
      if (setStatus) setStatus({ message: `Coupon code "${couponCode}" not found or invalid.`, type: 'error' });
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to start of day

    const activationDate = new Date(coupon.activationDate);
    activationDate.setHours(0, 0, 0, 0);
    const validFromDate = new Date(coupon.validFrom);
    validFromDate.setHours(0, 0, 0, 0);
    const validUntilDate = new Date(coupon.validUntil);
    validUntilDate.setHours(23, 59, 59, 999); // Normalize to end of day for validity

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
    setRedeemedCoupons(prev => new Set(prev).add(couponCode)); // Mark as globally redeemed (for simplicity)

    // Update total redemption count for the coupon
    setCouponRedemptionCounts(prev => {
      const newCounts = new Map(prev);
      newCounts.set(couponCode, currentTotalRedemptions + 1);
      return newCounts;
    });

    // Update per-user redemption count for the coupon
    setUserCouponRedemptionCounts(prev => {
      const newMap = new Map(prev);
      const userCoupons = new Map(newMap.get(simulatedUserId) || []); // Get the user's coupon redemption map
      userCoupons.set(couponCode, userRedemptionsForCoupon + 1); // Increment count for this coupon
      newMap.set(simulatedUserId, userCoupons); // Update the user's map in the main state
      return newMap;
    });

    // No MessageBox here, as the CheckoutSummaryModal will handle success message
    return true; // Indicate successful redemption
  };

  // Handler for POS (Point of Sale) redemption
  const handleRedeemCoupon = (couponCode, setStatus, channel) => {
    processRedemption(couponCode, channel, setStatus);
  };

  // Handler for In-App redemption (used by Golfer view)
  const handleInAppRedemption = async (couponCode, channel) => {
    // In-app redemption doesn't directly set a status message on the sub-view,
    // but it still uses the centralized logic and shows the main message box.
    return processRedemption(couponCode, channel);
  };

  // Handles the generation of a new coupon
  const handleGenerateCoupon = (formData) => {
    const { flatDiscountAmount, validFrom, validUntil, activationDate, minPurchaseValue, minQuantity, excludedCategories, excludedMembershipType } = formData;

    // Basic validation for required fields
    if (!flatDiscountAmount || !validFrom || !validUntil || !activationDate) {
      handleShowMessageBox('Input Error', 'Flat Discount Amount, Activation Date, Valid From, and Valid Until dates are required.');
      return;
    }
    if (minPurchaseValue && flatDiscountAmount > minPurchaseValue) {
      handleShowMessageBox('Input Error', 'Flat Discount Amount cannot be greater than Minimum Purchase Value.');
      return;
    }
    if (minQuantity > 0 && !formData.minPurchaseProductCategory) {
      handleShowMessageBox('Input Error', 'If Minimum Quantity is set, Minimum Purchase Product Category is required.');
      return;
    }
    if (excludedCategories.includes('Specific Membership Types') && !excludedMembershipType) {
      handleShowMessageBox('Input Error', 'If "Specific Membership Types" is excluded, you must select an Excluded Membership Type.');
      return;
    }


    // Date validation logic
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

    // Create a new coupon object with a generated code
    const newCoupon = {
      ...formData,
      couponCode: generateCouponCode(),
    };

    // Update the state with the new coupon and initialize its redemption counts
    setAllCoupons(prev => new Map(prev).set(newCoupon.couponCode, newCoupon));
    setCouponRedemptionCounts(prev => new Map(prev).set(newCoupon.couponCode, 0));
    setUserCouponRedemptionCounts(prev => {
      const newMap = new Map(prev);
      // Ensure the user's map exists before setting coupon count
      const userCoupons = new Map(newMap.get(simulatedUserId) || []);
      userCoupons.set(newCoupon.couponCode, 0);
      newMap.set(simulatedUserId, userCoupons);
      return newMap;
    });

    handleShowMessageBox('Coupon Generated!', `A new coupon "${newCoupon.couponCode}" has been created.`);
  };

  // Handles updating an existing coupon
  const handleUpdateCoupon = (updatedFormData) => {
    const { flatDiscountAmount, validFrom, validUntil, activationDate, minPurchaseValue, minQuantity, excludedCategories, excludedMembershipType } = updatedFormData;

    // Basic validation for required fields
    if (!flatDiscountAmount || !validFrom || !validUntil || !activationDate) {
      handleShowMessageBox('Input Error', 'Flat Discount Amount, Activation Date, Valid From, and Valid Until dates are required.');
      return;
    }
    if (minPurchaseValue && flatDiscountAmount > minPurchaseValue) {
      handleShowMessageBox('Input Error', 'Flat Discount Amount cannot be greater than Minimum Purchase Value.');
      return;
    }
    if (minQuantity > 0 && !updatedFormData.minPurchaseProductCategory) {
      handleShowMessageBox('Input Error', 'If Minimum Quantity is set, Minimum Purchase Product Category is required.');
      return;
    }
    if (excludedCategories.includes('Specific Membership Types') && !excludedMembershipType) {
      handleShowMessageBox('Input Error', 'If "Specific Membership Types" is excluded, you must select an Excluded Membership Type.');
      return;
    }

    // Date validation logic
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

    // Update the coupon in the state
    setAllCoupons(prev => new Map(prev).set(updatedFormData.couponCode, updatedFormData));
    handleShowMessageBox('Coupon Updated!', `Coupon "${updatedFormData.couponCode}" has been successfully updated.`);
  };

  // Copies a coupon code to the clipboard
  const handleCopyCouponCode = (code) => {
    const textArea = document.createElement('textarea');
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy'); // Use execCommand for broader compatibility in iframes
      handleShowMessageBox('Copied!', `Coupon code "${code}" copied to clipboard.`);
    } catch (err) {
      handleShowMessageBox('Error', 'Failed to copy coupon code. Please copy manually: ' + code);
    }
    document.body.removeChild(textArea);
  };

  // Shows the secondary modal with detailed coupon information
  const handleShowSecondaryModal = (coupon) => {
    setModalCouponDetails(coupon);
    setShowSecondaryModal(true);
  };

  // Closes the secondary modal
  const handleCloseSecondaryModal = () => {
    setShowSecondaryModal(false);
    setModalCouponDetails(null);
  };

  // useEffect hook to handle the visual animation of the POV toggle thumb.
  // This runs when the component mounts and whenever `currentPov` changes or the window is resized.
  useEffect(() => {
    const updateThumbPosition = () => {
      // Find the label corresponding to the currently selected POV
      const selectedLabel = document.querySelector(`label[for="pov${currentPov.charAt(0).toUpperCase() + currentPov.slice(1).replace(/-(\w)/g, (match, p1) => p1.toUpperCase())}"]`);

      // If both the selected label and the toggle refs exist, update the thumb's position and size
      if (selectedLabel && toggleThumbRef.current && toggleContainerRef.current) {
        const labelRect = selectedLabel.getBoundingClientRect();
        const containerRect = toggleContainerRef.current.getBoundingClientRect();

        // Set the thumb's left position relative to its container
        toggleThumbRef.current.style.left = `${labelRect.left - containerRect.left}px`;
        // Set the thumb's width and height to match the selected label
        // Added a small offset to ensure the thumb covers the label correctly on various screen sizes
        toggleThumbRef.current.style.width = `${labelRect.width}px`;
        toggleThumbRef.current.style.height = `${labelRect.height}px`;
      }
    };

    updateThumbPosition(); // Call once on mount/POV change
    window.addEventListener('resize', updateThumbPosition); // Add event listener for window resize

    // Cleanup function: remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', updateThumbPosition);
    };
  }, [currentPov]); // Dependency array: re-run effect if currentPov changes

  // useEffect hook to initialize sample coupons and membership card data on component mount.
  // This provides initial data for the simulation.
  useEffect(() => {
    // Get current date for dynamic validity periods
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    const twoMonthsLater = new Date(today);
    twoMonthsLater.setMonth(today.getMonth() + 2);

    // Helper to format dates for input fields (YYYY-MM-DD)
    const formatDateForInput = (date) => date.toISOString().split('T')[0];

    // Define sample coupon data
    const sampleCoupon1 = {
      couponName: 'Grand Opening Special',
      couponDescription: 'Save $25 on all Tee Times for new members!',
      flatDiscountAmount: 25.00,
      minPurchaseValue: 50.00,
      minQuantity: 0,
      minPurchaseProductCategory: '',
      discountProducts: 'Tee Times Coupon (Course Specific)',
      courseName: 'Babe Zaharias GC',
      teeTimeRestriction: 'Weekday Tee Times', // New
      membershipType: '',
      proShopCategory: '',
      activationDate: formatDateForInput(new Date(today.getFullYear(), today.getMonth(), 1)),
      validFrom: formatDateForInput(today),
      validUntil: formatDateForInput(twoMonthsLater),
      totalRedemptionLimit: 5,
      perUserRedemptionLimit: 1,
      targetAudience: ['New Golfers', 'Non Paradise Members'], // Updated target audience
      stackable: false,
      validChannels: ['Online/In-App', 'POS'],
      autoApplyEligible: true,
      exclusions: 'Not valid on major holidays. Cannot be combined with other offers.',
      excludedCategories: [],
      excludedMembershipType: '',
      fullPriceItemsOnly: true,
      timeSeasonEventRestriction: '',
      couponCode: 'PGT-SAMPLE-XYZ',
    };

    const sampleCoupon2 = {
      couponName: 'Loyalty Member Discount',
      couponDescription: 'Get $10 off Pro Shop Items for Gold Tier members.',
      flatDiscountAmount: 10.00,
      minPurchaseValue: 30.00,
      minQuantity: 0,
      minPurchaseProductCategory: '',
      discountProducts: 'Pro Shop Items',
      courseName: '',
      teeTimeRestriction: '',
      membershipType: '',
      proShopCategory: 'Apparel', // New
      activationDate: formatDateForInput(new Date(today.getFullYear(), today.getMonth() - 1, 15)),
      validFrom: formatDateForInput(today),
      validUntil: formatDateForInput(nextMonth),
      totalRedemptionLimit: 0, // Unlimited
      perUserRedemptionLimit: 0, // Unlimited
      targetAudience: ['Existing Golfers', 'Gold Tier', 'Paradise Card Members'], // Updated target audience
      stackable: true,
      validChannels: ['POS'],
      autoApplyEligible: false,
      exclusions: 'Excludes sale items.',
      excludedCategories: [],
      excludedMembershipType: '',
      fullPriceItemsOnly: true,
      timeSeasonEventRestriction: '',
      couponCode: 'PGT-LOYALTY-ABC',
    };

    const sampleCoupon3 = {
      couponName: 'Summer Membership Deal',
      couponDescription: 'Save $100 on your summer golf membership!',
      flatDiscountAmount: 100.00,
      minPurchaseValue: 500.00,
      minQuantity: 1, // New: requires 1 item
      minPurchaseProductCategory: 'Membership Card', // New: of type Membership Card
      discountProducts: 'Membership Card',
      courseName: '',
      teeTimeRestriction: '',
      membershipType: 'Summer Membership', // New
      proShopCategory: '',
      activationDate: formatDateForInput(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
      validFrom: formatDateForInput(today),
      validUntil: formatDateForInput(new Date(today.getFullYear(), today.getMonth() + 3, 0)),
      totalRedemptionLimit: 20,
      perUserRedemptionLimit: 1,
      targetAudience: ['All Golfers', 'New Golfers'],
      stackable: false,
      validChannels: ['Online/In-App'],
      autoApplyEligible: true,
      exclusions: 'Cannot be combined with other membership offers.',
      excludedCategories: ['Specific Membership Types'], // New exclusion
      excludedMembershipType: 'Gold Membership', // New specific exclusion
      fullPriceItemsOnly: true,
      timeSeasonEventRestriction: 'Pre-Summer Sale', // New descriptive field
      couponCode: 'PGT-SUMMER-MEM',
    };

    const sampleCoupon4 = {
      couponName: 'Tournament Entry Special',
      couponDescription: 'Get $50 off your next tournament pass!',
      flatDiscountAmount: 50.00,
      minPurchaseValue: 100.00,
      minQuantity: 0,
      minPurchaseProductCategory: '',
      discountProducts: 'Any Tournament Entry Pass', // Changed to Any Tournament Entry Pass
      courseName: '',
      teeTimeRestriction: '',
      membershipType: '',
      proShopCategory: '',
      activationDate: formatDateForInput(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)),
      validFrom: formatDateForInput(today),
      validUntil: formatDateForInput(tomorrow),
      totalRedemptionLimit: 10,
      perUserRedemptionLimit: 1,
      targetAudience: ['Existing Golfers', 'Tournament Participants'],
      stackable: false,
      validChannels: ['Online/In-App', 'POS'],
      autoApplyEligible: false,
      exclusions: 'Limited to select tournaments.',
      excludedCategories: ['Gift Cards', 'Specific Courses'], // New exclusions
      excludedMembershipType: '',
      fullPriceItemsOnly: true,
      timeSeasonEventRestriction: 'Holiday Tournament Special',
      couponCode: 'PGT-TOURNEY-50',
    };

    // Populate the allCoupons Map with sample data
    const initialCoupons = new Map();
    initialCoupons.set(sampleCoupon1.couponCode, sampleCoupon1);
    initialCoupons.set(sampleCoupon2.couponCode, sampleCoupon2);
    initialCoupons.set(sampleCoupon3.couponCode, sampleCoupon3);
    initialCoupons.set(sampleCoupon4.couponCode, sampleCoupon4);
    setAllCoupons(initialCoupons);

    // Initialize redemption counts for sample coupons to 0
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
      // Initialize a new Map for the simulated user's coupon redemptions
      newMap.set(simulatedUserId, new Map());
      newMap.get(simulatedUserId).set(sampleCoupon1.couponCode, 0);
      newMap.get(simulatedUserId).set(sampleCoupon2.couponCode, 0);
      newMap.get(simulatedUserId).set(sampleCoupon3.couponCode, 0);
      newMap.get(simulatedUserId).set(sampleCoupon4.couponCode, 0);
      return newMap;
    });

    // Initialize sample membership card data
    const sampleMembershipCard = {
      memberName: 'Alice Golfer',
      memberId: 'PGT-GOLFER-001',
      membershipTier: 'Gold',
      expiryDate: formatDateForInput(new Date(today.getFullYear() + 1, 0, 31)), // Jan 31st next year
      benefits: [
        'Unlimited Tee Times',
        '20% off Pro Shop items',
        'Early access to tournaments',
        'Complimentary club fitting'
      ],
      qrCodeData: 'PGT-GOLFER-001-GOLD', // Data for QR code simulation
      profilePicture: 'https://placehold.co/100x100/A7F3D0/065F46?text=AG' // Placeholder image
    };
    setMembershipCardData(sampleMembershipCard);

  }, []); // Empty dependency array means this effect runs only once on component mount

  return (
    <div className="font-sans antialiased text-gray-900 min-h-screen flex justify-center items-start">
      {/* Inline style for keyframe animation for modals */}
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
      <div className="bg-white rounded-3xl  py-10 w-full max-w-5xl">

        <h1 className="text-5xl font-extrabold text-gray-900 mb-2 text-center leading-tight">Paradise Golf Tech</h1>
        <h2 className="text-3xl font-bold text-gray-700 mb-10 text-center">Coupon Management Simulation</h2>

        {/* Point of View (POV) Toggle */}
        <div className="mb-12 flex justify-center">
          <div ref={toggleContainerRef} className="relative flex bg-gray-200 rounded-full p-1 shadow-inner max-w-sm w-full">
            {/* Radio inputs for switching POV */}
            <input type="radio" name="pov" value="admin" id="povAdmin" className="hidden" checked={currentPov === 'admin'} onChange={() => setCurrentPov('admin')} />
            <label htmlFor="povAdmin" className="flex-1 text-center py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer rounded-full transition-colors duration-300 relative z-20">Admin</label>

            <input type="radio" name="pov" value="golfer" id="povGolfer" className="hidden" checked={currentPov === 'golfer'} onChange={() => setCurrentPov('golfer')} />
            <label htmlFor="povGolfer" className="flex-1 text-center py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer rounded-full transition-colors duration-300 relative z-20">Golfer</label>

            <input type="radio" name="pov" value="golf-course" id="povGolfCourse" className="hidden" checked={currentPov === 'golf-course'} onChange={() => setCurrentPov('golf-course')} />
            <label htmlFor="povGolfCourse" className="flex-1 text-center py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer rounded-full transition-colors duration-300 relative z-20">Course</label>

            {/* Animated thumb for the toggle switch */}
            <div ref={toggleThumbRef} className="absolute bg-green-600 rounded-full shadow-lg transition-all duration-300 ease-in-out z-10"></div>
          </div>
        </div>

        {/* Conditional Rendering of Views based on currentPov */}
        {currentPov === 'admin' && (
          <AdminView
            onGenerateCoupon={handleGenerateCoupon}
            onUpdateCoupon={handleUpdateCoupon}
            allCoupons={allCoupons}
            onCopyCouponCode={handleCopyCouponCode}
            golfCourses={golfCourses}
          />
        )}
        {currentPov === 'golfer' && (
          <GolferView
            allCoupons={allCoupons}
            onShowDetails={handleShowSecondaryModal}
            couponRedemptionCounts={couponRedemptionCounts}
            userCouponRedemptionCounts={userCouponRedemptionCounts}
            simulatedUserId={simulatedUserId}
            handleShowMessageBox={handleShowMessageBox}
            onRedeemInApp={handleInAppRedemption}
            sampleProductsData={sampleProductsData}
            membershipCardData={membershipCardData}
          />
        )}
        {currentPov === 'golf-course' && (
          <GolfCourseView
            allCoupons={allCoupons}
            onRedeemCoupon={handleRedeemCoupon}
          />
        )}

        {/* Modals for messages and secondary details */}
        {showMessageBox && (
          <MessageBox
            title={messageBoxContent.title}
            message={messageBoxContent.message}
            onClose={handleCloseMessageBox}
          />
        )}
        {showSecondaryModal && (
          <SecondaryCharacteristicsModal
            coupon={modalCouponDetails}
            onClose={handleCloseSecondaryModal}
          />
        )}
      </div>
    </div>
  );
};

export default FlatForm;
