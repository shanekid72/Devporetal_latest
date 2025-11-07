import { motion } from 'framer-motion';
import { CreditCard, Zap, Shield, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollRevealContainer from '../components/ScrollRevealContainer';

const UseCaseBillPaymentsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ScrollRevealContainer>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <CreditCard className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-display">
                UPaaS - <span className="text-gradient">Utility Payments as a Service</span>
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-body max-w-3xl">
              Comprehensive bill payment solution powered by BBPS (Bharat Bill Payment System) integration. 
              Enable seamless utility bill payments with real-time exchange rates and multi-category support.
            </p>
          </motion.div>

          {/* Key Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="glass-card p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-display">
                BBPS Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-body">
                Direct integration with Bharat Bill Payment System for reliable and secure utility payments across India.
              </p>
            </div>

            <div className="glass-card p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-display">
                Real-Time Exchange Rates
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-body">
                Access live exchange rates for accurate international payment processing and currency conversion.
              </p>
            </div>

            <div className="glass-card p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-display">
                Multi-Category Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-body">
                Support for multiple bill categories including electricity, water, gas, telecom, and more.
              </p>
            </div>
          </motion.div>

          {/* API Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 font-display">
              API Categories
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Masters APIs */}
              <Link to="/integration/bill-payments/masters/get-rates" className="glass-card p-8 hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 font-display group-hover:text-gradient transition-all">
                      Masters APIs
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 font-body mb-4">
                      Access master data including exchange rates, service categories, providers, billers, and biller-specific parameters.
                    </p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                </div>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Get Rates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Get Categories</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Get Providers & Billers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Biller Custom Parameters & Plans</span>
                  </div>
                </div>
              </Link>

              {/* Transaction APIs */}
              <Link to="/integration/bill-payments/transactions/create-quote" className="glass-card p-8 hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 font-display group-hover:text-gradient transition-all">
                      Transaction APIs
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 font-body mb-4">
                      Complete bill payment transaction lifecycle from quote generation to payment confirmation and enquiry.
                    </p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                </div>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Create Quote</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Create Transaction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Confirm Transaction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Enquire Transaction</span>
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Getting Started */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-display">
              Getting Started
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-body mb-6">
              Ready to integrate UPaaS into your application? Start with our comprehensive guides and documentation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/integration/bill-payments/introduction"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                Introduction
              </Link>
              <Link
                to="/integration/bill-payments/authentication"
                className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-green-600 dark:hover:border-green-500 transition-all duration-200 font-medium"
              >
                Authentication Guide
              </Link>
            </div>
          </motion.div>
        </ScrollRevealContainer>
      </div>
    </div>
  );
};

export default UseCaseBillPaymentsPage;

