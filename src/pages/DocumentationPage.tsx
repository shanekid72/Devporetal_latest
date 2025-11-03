import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const DocumentationPage = () => {
  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-display">
              Documentation
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-body">
            Comprehensive guides and references for Digit9 worldAPI.
          </p>
        </div>

        <div className="glass-card p-8">
          <div className="text-center py-12">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 font-display">
              Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-body max-w-2xl mx-auto">
              We're preparing extensive documentation covering all aspects of the Digit9 worldAPI platform. 
              This will include conceptual guides, tutorials, API references, and implementation best practices 
              to help you build robust remittance solutions.
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

export default DocumentationPage;

