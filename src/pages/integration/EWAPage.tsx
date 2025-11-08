import { useEffect } from 'react';
import { motion } from 'framer-motion';

const EWAPage = () => {
  useEffect(() => {
    // Set portal type to ewa when this page loads
    localStorage.setItem('selected_portal_type', 'ewa');
    window.dispatchEvent(new Event('portalTypeChanged'));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Employee Wage Access (EWA)
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Welcome to the EWA (Employee Wage Access) integration guide for salary advance solutions.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Overview
          </h2>
          <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
            The EWA integration model provides a comprehensive solution for managing Employee Wage Access operations. 
            This API allows integration to check employee eligibility, calculate pricing, record consents, create salary 
            advance applications, and manage the complete lifecycle of salary advance transactions.
          </p>
          <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
            Use the sidebar navigation to explore Getting Started guides, Core Resources, Agent Toolkit, 
            and additional resources tailored for EWA integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Key Features
            </h3>
            <ul className="space-y-2 text-base leading-relaxed text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-teal-600 dark:text-teal-400 mr-2">•</span>
                Eligibility Verification
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 dark:text-teal-400 mr-2">•</span>
                Pricing Calculation
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 dark:text-teal-400 mr-2">•</span>
                Consent Management
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 dark:text-teal-400 mr-2">•</span>
                Application Management
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 dark:text-teal-400 mr-2">•</span>
                Status Tracking
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Get Started
            </h3>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
              Begin your integration journey with our comprehensive guides and resources available in the sidebar.
            </p>
            <div className="space-y-2">
              <a href="/introduction" className="block text-teal-600 dark:text-teal-400 hover:underline">
                → API Introduction
              </a>
              <a href="/authentication" className="block text-teal-600 dark:text-teal-400 hover:underline">
                → Authentication Guide
              </a>
              <a href="/integration/ewa/authentication" className="block text-teal-600 dark:text-teal-400 hover:underline">
                → EWA API Reference
              </a>
              <a href="/agent-toolkit" className="block text-teal-600 dark:text-teal-400 hover:underline">
                → Agent Toolkit
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default EWAPage;

