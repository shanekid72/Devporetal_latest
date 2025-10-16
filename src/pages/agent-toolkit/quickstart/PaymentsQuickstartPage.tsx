import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, ArrowDown, CheckCircle, Code, Download, AlertTriangle } from 'lucide-react';
import { Theme } from '../../../types';
import CodeBlock from '../../../components/CodeBlock';
import AskPageSection from '../../../components/AskPageSection';
import { downloadZip } from '../../../utils/downloadUtils';
import { paasTemplateFiles } from '../../../data/agentTemplates';

interface PaymentsQuickstartPageProps {
  theme?: Theme;
}

const PaymentsQuickstartPage = ({ theme }: PaymentsQuickstartPageProps) => {
  // Handle download of payments agent templates
  const handleDownloadTemplate = () => {
    const files = Object.entries(paasTemplateFiles).map(([name, content]) => ({
      name,
      content
    }));
    
    downloadZip(files, 'payments-agent-template');
  };

  // Code examples for the payments quickstart
  const authCodeExample = {
    language: 'bash',
    label: 'cURL',
    code: `# Step 1 - Authenticate
curl -X POST "https://<BASE_URL>/auth/realms/cdp/protocol/openid-connect/token" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=password" \\
  -d "client_id=<CLIENT_ID>" \\
  -d "client_secret=<CLIENT_SECRET>" \\
  -d "username=<USERNAME>" \\
  -d "password=<PASSWORD>"`
  };

  const raasFlowExample = {
    language: 'javascript',
    label: 'JavaScript',
    code: `// RaaS Flow Example
const token = await getToken();

// Step 1: Create Quote
const quoteResponse = await fetch(\`\${BASE_URL}/amr/ras/api/v1_0/ras/quote\`, {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json',
    'sender': '<SENDER>',
    'channel': '<CHANNEL>',
    'company': '<COMPANY>',
    'branch': '<BRANCH>'
  },
  body: JSON.stringify({
    // Quote payload from master data
    receiving_country_code: 'PK',
    sending_amount: 1000,
    sending_currency: 'USD'
  })
});

const quote = await quoteResponse.json();

// Step 2: Confirm Transaction
const confirmResponse = await fetch(\`\${BASE_URL}/amr/ras/api/v1_0/ras/confirmtransaction\`, {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json',
    'sender': '<SENDER>',
    'channel': '<CHANNEL>',
    'company': '<COMPANY>',
    'branch': '<BRANCH>'
  },
  body: JSON.stringify({
    quote_id: quote.quote_id,
    // Additional transaction details
  })
});`
  };

  const paasFlowExample = {
    language: 'python',
    label: 'Python',
    code: `# PaaS Flow Example
import requests

def paas_flow():
    token = get_token()
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "sender": "<SENDER>",
        "channel": "<CHANNEL>", 
        "company": "<COMPANY>",
        "branch": "<BRANCH>"
    }
    
    # Step 1: Authorize Clearance
    authorize_response = requests.post(
        f"{BASE_URL}/amr/paas/api/v1_0/paas/authorize-clearance",
        headers=headers,
        json={
            # Authorization payload
        }
    )
    
    transaction_ref = authorize_response.json()["transaction_ref_number"]
    
    # Step 2: Enquire Transaction
    enquiry_response = requests.get(
        f"{BASE_URL}/amr/paas/api/v1_0/paas/enquire-transaction",
        headers=headers,
        params={"transaction_ref_number": transaction_ref}
    )
    
    # Step 3: Get Receipt
    receipt_response = requests.get(
        f"{BASE_URL}/amr/paas/api/v1_0/paas/transaction-receipt",
        headers=headers,
        params={"transaction_ref_number": transaction_ref}
    )
    
    return receipt_response.json()`
  };

  const callbackExample = {
    language: 'typescript',
    label: 'TypeScript',
    code: `// Callback Handling with SHA-512 Verification
import crypto from 'crypto';

export function verifyCallbackIntegrity(
  rawPayload: string, 
  preSharedSecret: string, 
  receivedHash: string
): boolean {
  const expectedHash = crypto
    .createHash('sha512')
    .update(rawPayload + preSharedSecret)
    .digest('hex');
    
  return expectedHash === receivedHash;
}

// Express.js callback handler
app.post('/webhook/transaction-status', (req, res) => {
  const rawPayload = JSON.stringify(req.body);
  const receivedHash = req.headers['x-signature-sha512'];
  const preSharedSecret = process.env.CALLBACK_SECRET;
  
  if (!verifyCallbackIntegrity(rawPayload, preSharedSecret, receivedHash)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const { state, sub_state, transaction_ref_number } = req.body;
  
  // Process callback based on state/sub_state
  switch (state) {
    case 'COMPLETED':
      // Handle successful transaction
      break;
    case 'FAILED':
      // Handle failed transaction
      break;
    default:
      // Handle other states
  }
  
  res.status(200).json({ received: true });
});`
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
          <li><span className="text-gray-500">Quickstart</span></li>
          <li>→</li>
          <li className="text-gray-900 dark:text-white">Payments</li>
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
            className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mr-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Zap className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Payments Agent Toolkit
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Run an end‑to‑end payments flow with RaaS or PaaS
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
        <AskPageSection showButtons={false} notebookUrl="https://notebooklm.google.com/notebook/7ee8593c-e11a-4c94-8a85-242cc596f3cb?authuser=5" />
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
            This quickstart guide helps you build AI agents that integrate with Digit9's payment APIs. 
            You'll learn how to implement both <strong>RaaS (Remittance as a Service)</strong> and 
            <strong>PaaS (Payments as a Service)</strong> flows with proper authentication, callbacks, and error handling.
          </p>
        </div>
      </motion.section>

      {/* Prerequisites */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Prerequisites</h2>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Before You Begin</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>• Base URL + network whitelisting</li>
            <li>• Token credentials (client_id/secret, username/password)</li>
            <li>• Callback URL</li>
            <li>• Pre-shared secret for callback verification</li>
          </ul>
        </div>
      </motion.section>

      {/* Step-by-Step Implementation */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Step-by-Step Implementation</h2>

        {/* Step 1 - Authentication */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center font-bold text-sm mr-4 border border-gray-200 dark:border-gray-700">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Authenticate</h3>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              First, obtain an access token using your credentials. Use <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">Authorization: Bearer &lt;TOKEN&gt;</code> for all subsequent requests.
            </p>
            <CodeBlock theme={theme} examples={[authCodeExample]} />
          </div>
        </div>

        {/* Step 2 - Master Data */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center font-bold text-sm mr-4 border border-gray-200 dark:border-gray-700">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Fetch Master Data</h3>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Resolve master data to populate UIs and validate requests. Essential endpoints include:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <ul className="space-y-2 text-sm">
                <li><strong>Codes:</strong> System codes and reason codes</li>
                <li><strong>Corridors:</strong> Available payment corridors</li>
                <li><strong>Banks/Branches:</strong> Financial institution data</li>
                <li><strong>Rates:</strong> Current exchange rates</li>
                <li><strong>Account validation:</strong> Validate recipient accounts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 3 - Choose Flow */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center font-bold text-sm mr-4 border border-gray-200 dark:border-gray-700">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Execute Payment Flow</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Option A - RaaS Flow</h4>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Create Quote</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Confirm Transaction</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-400">Optional: Cancel or BRN Update</span>
                </div>
              </div>
              <CodeBlock theme={theme} examples={[raasFlowExample]} />
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Option B - PaaS Flow</h4>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Authorize Clearance</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Enquire Transaction</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Get Receipt</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Status Update</span>
                </div>
              </div>
              <CodeBlock theme={theme} examples={[paasFlowExample]} />
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Required Headers</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Include these headers where required: <code>Authorization</code>, <code>sender</code>, <code>channel</code>, <code>company</code>, <code>branch</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 - Callbacks */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center font-bold text-sm mr-4 border border-gray-200 dark:border-gray-700">
              4
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Handle Callbacks</h3>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Receive <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">state/sub_state</code> updates from Digit9. 
              Always verify callback integrity using SHA‑512.
            </p>
            <CodeBlock theme={theme} examples={[callbackExample]} />
          </div>
        </div>

        {/* Step 5 - Validation */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center font-bold text-sm mr-4 border border-gray-200 dark:border-gray-700">
              5
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Validate Outcomes</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">Success Handling</h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• Branch logic on <code>state/sub_state</code> only</li>
                <li>• Fetch receipt on completion</li>
                <li>• Update your system status</li>
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">Error Handling</h4>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• HTTP: 401, 404, 422, 500, 504</li>
                <li>• Business: invalid corridor/bank/branch</li>
                <li>• AML pending, already processed</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Error Handling */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Common Error Scenarios</h2>
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-red-500 text-white rounded text-xs flex items-center justify-center mr-3">
                401
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Authentication Errors</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Refresh token; ensure Authorization header is present</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-yellow-500 text-white rounded text-xs flex items-center justify-center mr-3">
                422
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Validation Errors</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Verify corridor/bank/branch/rate/charge and other master‑based inputs</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-orange-500 text-white rounded text-xs flex items-center justify-center mr-3">
                500
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Server Errors</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Retry with backoff; add app‑level idempotency when re‑issuing</p>
          </div>
        </div>
      </motion.section>

      {/* Next Steps */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Link
              to="/agent-toolkit/quickstart/llm-integration"
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">LLM Integration</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Learn framework adapters and Tools reference for endpoint details</p>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Link
              to="/agent-toolkit/reference/agent-tools"
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Agent Tools Reference</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Complete API reference for all agent tools and endpoints</p>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Download Template */}
      <motion.section 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Payments Agent Template</h3>
              <p className="text-gray-600 dark:text-gray-300">Complete Node.js/Python templates with RaaS/PaaS implementations</p>
            </div>
            <motion.button
              onClick={handleDownloadTemplate}
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

export default PaymentsQuickstartPage;
