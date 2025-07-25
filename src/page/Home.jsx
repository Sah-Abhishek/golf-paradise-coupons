import React, { useState } from 'react';
import FixedPriceForm from '../components/FixedPricePromotionSimulation';
import PercentageForm from '../components/Pgtpercentageoffsimulation';
import FlatForm from '../components/FlatDiscountCouponSimulationCode';

const formTypes = ['Flat', 'Fixed', 'Percentage'];

const Home = () => {
  const [activeRole, setActiveRole] = useState('Flat');


  return (
    <div >
      {/* Role Switcher */}

      <div className="inline-flex bg-gray-200 rounded-full p-1 shadow-inner">
        {formTypes.map((role) => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeRole === role
              ? 'bg-green-600 text-white shadow-md'
              : 'text-gray-800'
              }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Conditionally Render Content */}
      <div className='' >

        {activeRole === 'Fixed' && (
          <FixedPriceForm />
        )}
        {activeRole === 'Percentage' && (
          <PercentageForm />
        )}
        {activeRole === 'Flat' && (
          <FlatForm />
        )}
      </div>
    </div >
  );
};

export default Home;
