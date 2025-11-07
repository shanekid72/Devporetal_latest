import { motion } from 'framer-motion';
import { FileSearch } from 'lucide-react';
import ScrollRevealContainer from '../../../components/ScrollRevealContainer';
import ApiEndpointCard from '../../../components/ApiEndpointCard';
import AskPageSection from '../../../components/AskPageSection';
import { wpsApiEndpoints } from '../../../data/wpsApiEndpoints';
import { createApiTryItHandler } from '../../../utils/apiTryItHandler';
import { Theme } from '../../../types';

interface WPSGetFileStatusPageProps {
  theme?: Theme;
}

const WPSGetFileStatusPage: React.FC<WPSGetFileStatusPageProps> = ({ theme = { mode: 'light' } }) => {
  const endpoint = wpsApiEndpoints.find(e => e.id === 'wps-get-file-status');
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
              <FileSearch className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Get File Status
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Query the current status of salary files uploaded and processed in the WPS system.
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
              Get the current status of salary files uploaded and processed. This endpoint allows you to query file 
              statuses based on various filters including date range, establishment ID, SIF filename, salary month, 
              file format, search type, and status code.
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
            Status Codes
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <p>
              The following status codes are used to indicate the current state of uploaded files:
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">0</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">All (No Status filter)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Use this to retrieve all files regardless of status</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="font-mono text-sm bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">1</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">New/SIF Generated</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">File has been uploaded and SIF file has been generated</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="font-mono text-sm bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">4</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">MPN Generated</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Master Payment Number has been generated for the file</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="font-mono text-sm bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">8</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">MPN Received</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">MPN received (Applicable only for Cheque and Bank transfers, indicates acknowledgement that CQ/BT was received)</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="font-mono text-sm bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">16</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">MPN Paid</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment has been completed</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="font-mono text-sm bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">2048</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Sent to CB</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">File has been sent to Central Bank</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="font-mono text-sm bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">8192</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">SIF - ACK</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">SIF file acknowledged</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="font-mono text-sm bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">16384</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">SIF - NAK</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">SIF file not acknowledged</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="font-mono text-sm bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">1073741824</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Rejected</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">File has been rejected</p>
              </div>
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
              The Get File Status API uses standard HTTP response codes to indicate success or failure:
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
                  File statuses retrieved successfully. Returns array of files matching the criteria.
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
                  Invalid parameters provided in the request.
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
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                404
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Not Found</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No files found matching the specified criteria.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealContainer>
    </div>
  );
};

export default WPSGetFileStatusPage;

