import React from 'react';
import { useTranslation } from 'react-i18next';

const ProfileStats = ({ expenses, income }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 text-center text-white/90">
      <div className="bg-white/10 rounded-lg p-3">
        <p className="text-sm opacity-80">{t('dashboard.totalExpenses')}</p>
        <p className="text-lg font-semibold">{expenses}</p>
      </div>
      <div className="bg-white/10 rounded-lg p-3">
        <p className="text-sm opacity-80">{t('dashboard.totalIncome')}</p>
        <p className="text-lg font-semibold">{income}</p>
      </div>
    </div>
  );
};

export default ProfileStats;
