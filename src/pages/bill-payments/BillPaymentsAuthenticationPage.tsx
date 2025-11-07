import { motion } from 'framer-motion';
import { Key, AlertCircle, Code } from 'lucide-react';
import ScrollRevealContainer from '../../components/ScrollRevealContainer';

const BillPaymentsAuthenticationPage = () => {
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <Key className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-display">
                Authentication for <span className="text-gradient">UPaaS APIs</span>
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-body">
              Secure your API requests with proper authentication and authorization.
            </p>
          </motion.div>

          {/* Placeholder Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-8 mb-8"
          >
            <div className="flex items-start space-x-4 mb-6">
              <AlertCircle className="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-display">
                  Content Coming Soon
                </h2>
                <p className="text-gray-600 dark:text-gray-400 font-body">
                  This page will contain detailed authentication information including:
                </p>
              </div>
            </div>

            <ul className="space-y-3 text-gray-600 dark:text-gray-400 font-body ml-10">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></span>
                <span>API key generation and management</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></span>
                <span>Authentication token structure and usage</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></span>
                <span>Required headers for API requests</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></span>
                <span>Security best practices</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></span>
                <span>Error handling and troubleshooting</span>
              </li>
            </ul>
          </motion.div>

          {/* Example Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Code className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-display">
                Example Request Headers (Sample)
              </h3>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm text-gray-300 font-mono">
{`{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_API_TOKEN",
  "X-API-Key": "YOUR_API_KEY"
}`}
              </pre>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 font-body">
              Note: This is a placeholder example. Actual authentication details will be provided soon.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 grid md:grid-cols-2 gap-6"
          >
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-display">
                Previous Step
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-body mb-4">
                Learn about UPaaS fundamentals
              </p>
              <a
                href="/integration/bill-payments/introduction"
                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                ← Introduction
              </a>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-display">
                Start Building
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-body mb-4">
                Explore the master APIs to get started
              </p>
              <a
                href="/integration/bill-payments/masters/get-rates"
                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                Masters APIs →
              </a>
            </div>
          </motion.div>
        </ScrollRevealContainer>
      </div>
    </div>
  );
};

export default BillPaymentsAuthenticationPage;

