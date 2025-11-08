import { motion } from 'framer-motion';
import { BookOpen, AlertCircle } from 'lucide-react';
import ScrollRevealContainer from '../../components/ScrollRevealContainer';
import AskPageSection from '../../components/AskPageSection';

const BillPaymentsIntroductionPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ScrollRevealContainer>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Introduction to <span className="text-gradient">UPaaS</span>
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Learn about the UPaaS (Utility Payments as a Service) API and how to get started with bill payment integration.
            </p>
          </motion.div>

          {/* Placeholder Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8"
          >
            <div className="flex items-start space-x-4 mb-6">
              <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Content Coming Soon
                </h2>
                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  This page will contain detailed information about:
                </p>
              </div>
            </div>

            <ul className="space-y-3 text-base leading-relaxed text-gray-600 dark:text-gray-300 ml-10">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                <span>Overview of UPaaS and its capabilities</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                <span>BBPS (Bharat Bill Payment System) integration details</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                <span>Supported bill categories and providers</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                <span>API workflow and transaction lifecycle</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                <span>Prerequisites and environment setup</span>
              </li>
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 grid md:grid-cols-2 gap-6"
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Next Step
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                Learn how to authenticate your API requests
              </p>
              <a
                href="/integration/bill-payments/authentication"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Authentication Guide →
              </a>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Start Building
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                Explore the master APIs to get started
              </p>
              <a
                href="/integration/bill-payments/masters/get-rates"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Masters APIs →
              </a>
            </div>
          </motion.div>

          {/* AskPage Section */}
          <ScrollRevealContainer>
            <AskPageSection showButtons={false} notebookUrl="https://notebooklm.google.com/notebook/51c6bfb1-107e-4eb7-a579-2311c9f4c738?authuser=5" />
          </ScrollRevealContainer>
        </ScrollRevealContainer>
      </div>
    </div>
  );
};

export default BillPaymentsIntroductionPage;

