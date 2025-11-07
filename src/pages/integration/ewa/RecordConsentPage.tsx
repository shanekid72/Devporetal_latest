import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import ScrollRevealContainer from '../../../components/ScrollRevealContainer';
import ApiEndpointCard from '../../../components/ApiEndpointCard';
import { ewaApiEndpoints } from '../../../data/ewaApiEndpoints';
import { createApiTryItHandler } from '../../../utils/apiTryItHandler';

const RecordConsentPage = () => {
  const endpoint = ewaApiEndpoints.find(e => e.id === 'record-consent');
  const handleTryIt = createApiTryItHandler();

  if (!endpoint) {
    return <div>Endpoint not found</div>;
  }

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
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white font-display">
                {endpoint.title}
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-body">
              {endpoint.description}
            </p>
          </motion.div>

          {/* API Endpoint Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ApiEndpointCard 
              {...endpoint} 
              theme={{ mode: 'light' }} 
              onTryIt={(requestBody, headers, queryParams, pathParams) => 
                handleTryIt(endpoint, requestBody, headers, queryParams, pathParams)
              }
            />
          </motion.div>
        </ScrollRevealContainer>
      </div>
    </div>
  );
};

export default RecordConsentPage;
