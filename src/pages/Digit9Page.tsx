import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const Digit9Page = () => {
  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-display">
              Digit9.com
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-body">
            Learn more about Digit9 and our worldAPI platform.
          </p>
        </div>

        <div className="glass-card p-8">
          <div className="text-center py-12">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 font-display">
              Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-body max-w-2xl mx-auto">
              Discover more about Digit9, our mission, vision, and the innovative solutions we provide 
              to enable seamless global remittance services. Learn about our platform capabilities, 
              partnership opportunities, and success stories.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-500 font-body">
              Check back soon for updates
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Digit9Page;

