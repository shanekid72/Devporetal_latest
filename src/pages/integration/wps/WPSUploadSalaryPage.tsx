import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import ScrollRevealContainer from '../../../components/ScrollRevealContainer';
import ApiEndpointCard from '../../../components/ApiEndpointCard';
import AskPageSection from '../../../components/AskPageSection';
import { wpsApiEndpoints } from '../../../data/wpsApiEndpoints';
import { createApiTryItHandler } from '../../../utils/apiTryItHandler';
import { Theme } from '../../../types';

interface WPSUploadSalaryPageProps {
  theme?: Theme;
}

const WPSUploadSalaryPage: React.FC<WPSUploadSalaryPageProps> = ({ theme = { mode: 'light' } }) => {
  const endpoint = wpsApiEndpoints.find(e => e.id === 'wps-upload-salary');
  const handleTryIt = createApiTryItHandler();

  if (!endpoint) {
    return <div>Endpoint not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <ScrollRevealContainer>
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Upload Salary Information
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Upload salary files to the WPS system. Supports NU (Normal Upload) for SIF/XLS/XLSX formats and NW (Non WPS) for CSV formats.
          </p>
        </div>
      </ScrollRevealContainer>

      {/* AskPage Section */}
      <ScrollRevealContainer>
        <AskPageSection showButtons={false} notebookUrl="https://notebooklm.google.com/notebook/d8afa9b5-2d9e-497a-b659-a6ea4367f6d7?authuser=5" />
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Overview
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Uploads the salary file to the server, parses the file and returns the MPN number and SIF FILENAME. 
              The system supports two processing types: NU (Normal Upload) for SIF/XLS/XLSX formats and NW (Non WPS) for CSV formats.
            </p>
            <p>
              Base URL: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-sm font-mono">https://orvillestaging.luluone.com:8443</code>
            </p>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ApiEndpointCard 
              {...endpoint} 
              theme={theme} 
              onTryIt={(requestBody, headers, queryParams, pathParams) => 
                handleTryIt(endpoint, requestBody, headers, queryParams, pathParams)
              }
            />
          </motion.div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Processing Types
          </h2>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">NU (Normal Upload) - processingtype: 1</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Use this processing type for standard WPS salary file uploads.
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Supported formats: SIF, XLS, XLSX</li>
                <li>Used for regular WPS companies</li>
                <li>Returns MPN number and SIF filename upon successful upload</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">NW (Non WPS) - processingtype: 4</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Use this processing type for freezone corporates salary uploads.
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Supported format: CSV (Comma Separated Values)</li>
                <li>Used for non-WPS companies such as freezone corporates</li>
                <li>Returns MPN number and SIF filename upon successful upload</li>
              </ul>
            </div>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Common Error Responses
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <p>
              The Upload Salary Information API uses standard HTTP response codes to indicate success or failure:
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                200
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">OK</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  File uploaded and processed successfully. MPN number and SIF filename returned.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                400
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Bad Request</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Invalid file format, missing parameters, or file format doesn't match processing type.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                401
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Unauthorized</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Missing or invalid authorization token.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                500
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Internal Server Error</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  File processing failed on the server side.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealContainer>
    </div>
  );
};

export default WPSUploadSalaryPage;

