import { useEffect } from 'react';
import { motion } from 'framer-motion';

const LFIPage = () => {
  useEffect(() => {
    // Set portal type to lfi when this page loads
    localStorage.setItem('selected_portal_type', 'lfi');
    window.dispatchEvent(new Event('portalTypeChanged'));
  }, []);

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-display">
            LFI Integration
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-body">
            Welcome to the LFI (Licensed Financial Institutions) PaaS (Payment as a Service) integration guide.
          </p>
        </div>

        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 font-display">
            Overview
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 font-body">
            The LFI integration model is designed specifically for Licensed Financial Institutions, 
            providing access to our comprehensive PaaS APIs. This model supports full KYC data submission 
            with each transaction without requiring pre-registered customers.
          </p>
          <p className="text-gray-700 dark:text-gray-300 font-body">
            Use the sidebar navigation to explore Getting Started guides, Core Resources, Agent Toolkit, 
            and additional resources tailored for LFI integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="glass-card p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 font-display">
              Key Features
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 font-body">
              <li className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                No pre-registration required
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                Full KYC data submission per transaction
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                Enhanced bank and branch APIs
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                Transaction cancellation support
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="glass-card p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 font-display">
              Get Started
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4 font-body">
              Begin your integration journey with our comprehensive guides and resources available in the sidebar.
            </p>
            <div className="space-y-2">
              <a href="/introduction" className="block text-purple-600 dark:text-purple-400 hover:underline font-body">
                → API Introduction
              </a>
              <a href="/authentication" className="block text-purple-600 dark:text-purple-400 hover:underline font-body">
                → Authentication Guide
              </a>
              <a href="/api-reference/auth" className="block text-purple-600 dark:text-purple-400 hover:underline font-body">
                → API Reference
              </a>
              <a href="/agent-toolkit" className="block text-purple-600 dark:text-purple-400 hover:underline font-body">
                → Agent Toolkit
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LFIPage;

