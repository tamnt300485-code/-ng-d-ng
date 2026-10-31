/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { FaqSection } from './components/FaqSection';
import { IpayDownloadSection } from './components/IpayDownloadSection';
import { GameHubSection } from './components/GameHubSection';
import { SavingsCalculatorSection } from './components/SavingsCalculatorSection';
import { LoanScheduleSection } from './components/LoanScheduleSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { BranchLocatorSection } from './components/BranchLocatorSection';
import { ConsultantFloat } from './components/ConsultantFloat';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('faq');

  // Smooth scroll to top when changing tab
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Official Header */}
      <Header activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* 7 Interactive Banking Modules Tabs */}
      <NavigationTabs activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'faq' && <FaqSection />}
        {activeTab === 'ipay' && <IpayDownloadSection />}
        {activeTab === 'games' && <GameHubSection />}
        {activeTab === 'savings' && <SavingsCalculatorSection />}
        {activeTab === 'loan' && <LoanScheduleSection />}
        {activeTab === 'products' && <FeaturedProductsSection />}
        {activeTab === 'branches' && <BranchLocatorSection />}
      </main>

      {/* Floating Adviser Contact Widget */}
      <ConsultantFloat />

      {/* Footer */}
      <Footer setActiveTab={handleTabChange} />
    </div>
  );
}
