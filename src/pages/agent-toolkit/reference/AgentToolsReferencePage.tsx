import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, ArrowDown, Code, Key, Shield, DollarSign, UserCircle, Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Theme } from '../../../types';
import CodeBlock from '../../../components/CodeBlock';
import AskPageSection from '../../../components/AskPageSection';
import { downloadJSON } from '../../../utils/downloadUtils';
import { apiReferenceJSON } from '../../../data/agentTemplates';

interface AgentToolsReferencePageProps {
  theme?: Theme;
}

const AgentToolsReferencePage = ({ theme }: AgentToolsReferencePageProps) => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  // Handle download of API reference JSON
  const handleDownloadAPIReference = () => {
    downloadJSON(apiReferenceJSON, 'digit9-api-reference.json');
  };

  const handleCopyEndpoint = (endpoint: string) => {
    navigator.clipboard.writeText(endpoint);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  // Common headers example
  const headersExample = {
    language: 'json',
    label: 'Common Headers',
    code: `{
  "Authorization": "Bearer <TOKEN>",
  "Content-Type": "application/json",
  "sender": "<SENDER>",
  "channel": "<CHANNEL>",
  "company": "<COMPANY>",
  "branch": "<BRANCH>"
}`
  };

  const tokenExample = {
    language: 'bash',
    label: 'cURL',
    code: `curl -X POST "https://<BASE_URL>/auth/realms/cdp/protocol/openid-connect/token" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=password" \\
  -d "client_id=<CLIENT_ID>" \\
  -d "client_secret=<CLIENT_SECRET>" \\
  -d "username=<USERNAME>" \\
  -d "password=<PASSWORD>"`
  };

  // Endpoint categories
  const endpoints = {
    auth: [
      {
        method: 'POST',
        path: '/auth/realms/cdp/protocol/openid-connect/token',
        title: 'Access Token',
        description: 'Obtain authentication token for API access',
        headers: 'Content-Type: application/x-www-form-urlencoded',
        params: 'grant_type, client_id, client_secret, username, password'
      }
    ],
    raas: [
      {
        method: 'POST',
        path: '/amr/ras/api/v1_0/ras/quote',
        title: 'Create Quote',
        description: 'Create a remittance quote for RaaS flow',
        headers: 'Authorization, sender, channel, company, branch',
        params: 'receiving_country_code, sending_amount, sending_currency'
      },
      {
        method: 'POST',
        path: '/amr/ras/api/v1_0/ras/confirmtransaction',
        title: 'Confirm Transaction',
        description: 'Confirm a transaction using quote ID',
        headers: 'Authorization, sender, channel, company, branch',
        params: 'quote_id, recipient_details'
      },
      {
        method: 'POST',
        path: '/amr/ras/api/v1_0/ras/canceltransaction',
        title: 'Cancel Transaction',
        description: 'Cancel a pending transaction',
        headers: 'Authorization, sender, channel, company, branch',
        params: 'transaction_ref_number, cancellation_reason'
      },
      {
        method: 'PUT',
        path: '/amr/ras/api/v1_0/ras/brn-update',
        title: 'BRN Update',
        description: 'Update Bank Reference Number',
        headers: 'Authorization, sender, channel, company, branch',
        params: 'transaction_ref_number, brn'
      },
      {
        method: 'POST',
        path: '/amr/ras/api/v1_0/ras/authorize-clearance',
        title: 'Authorize Clearance',
        description: 'Authorize transaction clearance',
        headers: 'Authorization, sender, channel, company, branch',
        params: 'transaction_ref_number'
      },
      {
        method: 'GET',
        path: '/amr/ras/api/v1_0/ras/enquire-transaction',
        title: 'Enquire Transaction',
        description: 'Check transaction status',
        headers: 'Authorization',
        params: 'transaction_ref_number (query param)'
      },
      {
        method: 'GET',
        path: '/amr/ras/api/v1_0/ras/transaction-receipt',
        title: 'Transaction Receipt',
        description: 'Get transaction receipt',
        headers: 'Authorization',
        params: 'transaction_ref_number (query param)'
      },
      {
        method: 'PUT',
        path: '/amr/ras/api/v1_0/ras/status-update',
        title: 'Status Update',
        description: 'Update transaction status (Partner→Digit9)',
        headers: 'Authorization, sender, channel, company, branch',
        params: 'transaction_ref_number, status'
      }
    ],
    paas: [
      {
        method: 'POST',
        path: '/amr/paas/api/v1_0/paas/quote',
        title: 'Create Quote',
        description: 'Create a payment quote for PaaS flow',
        headers: 'Authorization, sender, channel, company, branch',
        params: 'receiving_country_code, sending_amount, sending_currency'
      },
      {
        method: 'POST',
        path: '/amr/paas/api/v1_0/paas/createtransaction',
        title: 'Create Transaction',
        description: 'Create a new payment transaction',
        headers: 'Authorization, sender, channel, company, branch',
        params: 'quote_id, recipient_details'
      },
      {
        method: 'POST',
        path: '/amr/paas/api/v1_0/paas/confirmtransaction',
        title: 'Confirm Transaction',
        description: 'Confirm a payment transaction',
        headers: 'Authorization, sender, channel, company, branch',
        params: 'transaction_ref_number'
      },
      {
        method: 'POST',
        path: '/amr/paas/api/v1_0/paas/authorize-clearance',
        title: 'Authorize Clearance',
        description: 'Authorize payment clearance',
        headers: 'Authorization, sender, channel, company, branch',
        params: 'transaction_ref_number, clearance_details'
      },
      {
        method: 'GET',
        path: '/amr/paas/api/v1_0/paas/enquire-transaction',
        title: 'Enquire Transaction',
        description: 'Check payment transaction status',
        headers: 'Authorization',
        params: 'transaction_ref_number (query param)'
      },
      {
        method: 'GET',
        path: '/amr/paas/api/v1_0/paas/transaction-receipt',
        title: 'Transaction Receipt',
        description: 'Get payment receipt',
        headers: 'Authorization',
        params: 'transaction_ref_number (query param)'
      },
      {
        method: 'PUT',
        path: '/amr/paas/api/v1_0/paas/brn-update',
        title: 'BRN Update',
        description: 'Update Bank Reference Number',
        headers: 'Authorization, sender, channel, company, branch',
        params: 'transaction_ref_number, brn'
      },
      {
        method: 'POST',
        path: '/amr/paas/api/v1_0/paas/canceltransaction',
        title: 'Cancel Transaction',
        description: 'Cancel a payment transaction',
        headers: 'Authorization, sender, channel, company, branch',
        params: 'transaction_ref_number, cancellation_reason'
      },
      {
        method: 'PUT',
        path: '/amr/paas/api/v1_0/paas/status-update',
        title: 'Status Update (Partner→Digit9)',
        description: 'Update transaction status from partner',
        headers: 'Authorization, sender, channel, company, branch',
        params: 'transaction_ref_number, status, sub_status'
      }
    ],
    caas: [
      {
        method: 'POST',
        path: '/caas/api/v1/corpoarte/search',
        title: 'Corporate Search',
        description: 'Search for corporate entities',
        headers: 'Authorization',
        params: 'search_criteria, country_code'
      },
      {
        method: 'GET',
        path: '/caas/api/v1/corporate/{ecrn}',
        title: 'Get Corporate Profile',
        description: 'Retrieve corporate profile by ECRN',
        headers: 'Authorization',
        params: 'ecrn (path parameter)'
      },
      {
        method: 'GET',
        path: '/caas/api/v2/customer/{ecrn}',
        title: 'Get Customer (v2)',
        description: 'Retrieve customer information',
        headers: 'Authorization',
        params: 'ecrn (path parameter)'
      },
      {
        method: 'POST',
        path: '/caas-lcm/api/v1/CAAS/onBoarding/customer',
        title: 'Customer Onboarding (v1)',
        description: 'Submit customer onboarding data',
        headers: 'Authorization',
        params: 'customer_details, documents'
      }
    ],
    ekyc: [
      {
        method: 'POST',
        path: '/ekyc/api/v1/request',
        title: 'eKYC Request',
        description: 'Initiate eKYC verification process',
        headers: 'Authorization',
        params: 'customer_id, verification_type'
      },
      {
        method: 'POST',
        path: '/ekyc/api/v1/efr/ocrDetection',
        title: 'OCR Detection',
        description: 'Optical Character Recognition for documents',
        headers: 'Authorization',
        params: 'document_image, document_type'
      },
      {
        method: 'POST',
        path: '/ekyc/api/v1/efr/faceLive',
        title: 'Face Liveness',
        description: 'Face liveness detection for identity verification',
        headers: 'Authorization',
        params: 'selfie_image, verification_data'
      },
      {
        method: 'POST',
        path: '/ekyc/api/v1/efr/confirmIdentity',
        title: 'Confirm Identity',
        description: 'Confirm customer identity verification',
        headers: 'Authorization',
        params: 'verification_id, confirmation_data'
      },
      {
        method: 'POST',
        path: '/ekyc/api/v1/additionalInformation/{ekycRequestId}',
        title: 'Additional Information',
        description: 'Submit additional verification information',
        headers: 'Authorization',
        params: 'ekycRequestId (path), additional_data'
      }
    ]
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'POST':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'PUT':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-6 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link></li>
          <li>→</li>
          <li><Link to="/agent-toolkit/introduction" className="hover:text-blue-600 dark:hover:text-blue-400">Agent Toolkit</Link></li>
          <li>→</li>
          <li><span className="text-gray-500">Reference</span></li>
          <li>→</li>
          <li className="text-gray-900 dark:text-white">Agent Tools</li>
        </ol>
      </nav>

      {/* Header */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center mb-6">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <FileText className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Agent Tools Reference
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Complete API reference for AI agent integration with Digit9
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition"
          >
            Get Started
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* AskPage Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <AskPageSection showButtons={false} notebookUrl="https://notebooklm.google.com/notebook/9110dae6-dac3-4d16-8368-dd7a3ebac74b?authuser=5" />
      </motion.section>

      {/* Overview */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Overview</h2>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            This reference provides a compact overview of all Digit9 API endpoints for agent integration. 
            All entries are taken from Digit9 specifications with no mock fields.
          </p>
        </div>
        
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Note</h3>
          <p className="text-yellow-700 dark:text-yellow-300">
            Always derive enumerations from master APIs; do not hard‑code lists or reason codes.
          </p>
        </div>
      </motion.section>

      {/* Common Headers */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Common Headers</h2>
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Most endpoints require these headers. Authentication is always required, while payment endpoints 
            also need additional context headers:
          </p>
          <CodeBlock theme={theme} examples={[headersExample]} />
        </div>
      </motion.section>

      {/* Identity & Security */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-4">
            <Key className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Identity & Security</h2>
        </div>

        <div className="mb-6">
          <CodeBlock theme={theme} examples={[tokenExample]} />
        </div>

        <div className="space-y-4">
          {endpoints.auth.map((endpoint, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border mr-3 ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{endpoint.title}</h3>
                </div>
                <motion.button
                  onClick={() => handleCopyEndpoint(endpoint.path)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copiedEndpoint === endpoint.path ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                  <span className="text-gray-600 dark:text-gray-300">Copy</span>
                </motion.button>
              </div>
              
              <code className="text-sm font-mono text-blue-600 dark:text-blue-400 block mb-3">
                {endpoint.path}
              </code>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">{endpoint.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Headers</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{endpoint.headers}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Parameters</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{endpoint.params}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Payments - RaaS */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Payments — RaaS</h2>
        </div>

        <div className="space-y-4">
          {endpoints.raas.map((endpoint, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border mr-3 ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{endpoint.title}</h3>
                </div>
                <motion.button
                  onClick={() => handleCopyEndpoint(endpoint.path)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copiedEndpoint === endpoint.path ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                  <span className="text-gray-600 dark:text-gray-300">Copy</span>
                </motion.button>
              </div>
              
              <code className="text-sm font-mono text-blue-600 dark:text-blue-400 block mb-3">
                {endpoint.path}
              </code>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">{endpoint.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Headers</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{endpoint.headers}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Parameters</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{endpoint.params}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Payments - PaaS */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
            <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Payments — PaaS</h2>
        </div>

        <div className="space-y-4">
          {endpoints.paas.map((endpoint, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border mr-3 ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{endpoint.title}</h3>
                </div>
                <motion.button
                  onClick={() => handleCopyEndpoint(endpoint.path)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copiedEndpoint === endpoint.path ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                  <span className="text-gray-600 dark:text-gray-300">Copy</span>
                </motion.button>
              </div>
              
              <code className="text-sm font-mono text-blue-600 dark:text-blue-400 block mb-3">
                {endpoint.path}
              </code>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">{endpoint.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Headers</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{endpoint.headers}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Parameters</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{endpoint.params}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CAAS - Corporate & Individual */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
            <UserCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">CAAS — Corporate & Individual</h2>
        </div>

        <div className="space-y-4">
          {endpoints.caas.map((endpoint, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border mr-3 ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{endpoint.title}</h3>
                </div>
                <motion.button
                  onClick={() => handleCopyEndpoint(endpoint.path)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copiedEndpoint === endpoint.path ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                  <span className="text-gray-600 dark:text-gray-300">Copy</span>
                </motion.button>
              </div>
              
              <code className="text-sm font-mono text-blue-600 dark:text-blue-400 block mb-3">
                {endpoint.path}
              </code>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">{endpoint.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Headers</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{endpoint.headers}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Parameters</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{endpoint.params}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* eKYC - EFR */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-4">
            <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">eKYC — EFR</h2>
        </div>

        <div className="space-y-4">
          {endpoints.ekyc.map((endpoint, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border mr-3 ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{endpoint.title}</h3>
                </div>
                <motion.button
                  onClick={() => handleCopyEndpoint(endpoint.path)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copiedEndpoint === endpoint.path ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                  <span className="text-gray-600 dark:text-gray-300">Copy</span>
                </motion.button>
              </div>
              
              <code className="text-sm font-mono text-blue-600 dark:text-blue-400 block mb-3">
                {endpoint.path}
              </code>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">{endpoint.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Headers</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{endpoint.headers}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Parameters</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{endpoint.params}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Callbacks */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Callbacks</h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction Status Callback (Digit9 → Partner)</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Digit9 sends transaction <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">state</code>/
            <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">sub_state</code> updates to your callback URL.
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Verify integrity: <strong>SHA‑512</strong> of <code>&lt;raw_payload&gt;&lt;pre_shared_secret&gt;</code> against inbound hash header.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Next Steps */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Link
              to="/agent-toolkit/best-practices/integration"
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Integration Best Practices</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Learn best practices for reliable API integration</p>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Link
              to="/agent-toolkit/best-practices/prompting"
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Prompting & Agents</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Best practices for agent prompting and design</p>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Download Reference */}
      <motion.section 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">API Reference JSON</h3>
              <p className="text-gray-600 dark:text-gray-300">Machine-readable API specification for automatic tool generation</p>
            </div>
            <motion.button
              onClick={handleDownloadAPIReference}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </motion.button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default AgentToolsReferencePage;
