import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, ArrowDown, CheckCircle, Download, Brain, MessageCircle, Zap, AlertTriangle } from 'lucide-react';
import { Theme } from '../../../types';
import CodeBlock from '../../../components/CodeBlock';
import AskPageSection from '../../../components/AskPageSection';
import { downloadZip } from '../../../utils/downloadUtils';
import { promptTemplates } from '../../../data/agentTemplates';

interface PromptingBestPracticesPageProps {
  theme?: Theme;
}

const PromptingBestPracticesPage = ({ theme }: PromptingBestPracticesPageProps) => {
  // Handle download of prompt templates library
  const handleDownloadPrompts = () => {
    const files = Object.entries(promptTemplates).map(([name, content]) => ({
      name,
      content
    }));
    
    downloadZip(files, 'prompt-templates-library');
  };

  // Code examples for prompting best practices
  const structuredPromptExample = {
    language: 'text',
    label: 'Structured Prompt Example',
    code: `You are a financial services AI agent that helps users with cross-border payments and remittances using the Digit9 worldAPI.

## Your Capabilities:
- Create remittance quotes (RaaS)
- Process payment authorizations (PaaS) 
- Search for banks and branches
- Validate recipient account details
- Check transaction status
- Retrieve master data (codes, corridors, rates)

## Important Rules:
1. ALWAYS fetch fresh master data before making requests
2. NEVER hard-code bank codes, country codes, or reason codes
3. ALWAYS verify callback integrity using SHA-512
4. Treat state/sub_state as the authoritative transaction status
5. Only retry on 5xx server errors, never on 4xx client errors

## Required Process:
1. First authenticate and get a valid token
2. Fetch relevant master data (codes, corridors, banks)
3. Validate all inputs against master data
4. Execute the appropriate API flow (RaaS or PaaS)
5. Monitor transaction status through callbacks or enquiry

## When helping users:
- Ask clarifying questions if the request is ambiguous
- Explain which payment stack (RaaS vs PaaS) you're using and why
- Provide clear status updates during the process
- Always verify that all required information is available before proceeding

Current user request: [USER_INPUT]`
  };

  const errorHandlingPromptExample = {
    language: 'text',
    label: 'Error-Aware Prompting',
    code: `## Error Handling Instructions:

When API calls fail, analyze the error and respond appropriately:

### HTTP Status Codes:
- 401 Unauthorized: "I need to refresh my authentication token. Let me try again."
- 404 Not Found: "The endpoint or resource wasn't found. Let me verify the URL and parameters."
- 422 Validation Error: "There's an issue with the request data. Let me check the master data and validate all fields."
- 500/504 Server Error: "The server is experiencing issues. I'll retry with exponential backoff."

### Business Logic Errors:
- Missing corridor: "I need to fetch the latest corridor data to find valid payment routes for your destination."
- Invalid bank/branch: "Let me search the current bank directory to find the correct institution details."
- Rate not available: "Current exchange rates aren't available for this corridor. Let me check alternative routes."
- AML pending: "This transaction requires additional compliance review. I'll monitor the status."

### Response Format:
1. Acknowledge the error clearly
2. Explain what went wrong in simple terms
3. Describe what you're doing to fix it
4. Provide an estimated timeline if possible
5. Offer alternatives if the primary approach fails

Never guess about transaction completion - always verify through proper channels.`
  };

  const toolRoutingExample = {
    language: 'javascript',
    label: 'Tool Routing Logic',
    code: `// Agent tool routing example
const toolConfig = {
  // Authentication
  get_token: {
    description: "Obtain authentication token for Digit9 API access",
    when_to_use: "Always call first before any other API operations",
    parameters: {
      grant_type: "password",
      client_id: "required",
      client_secret: "required", 
      username: "required",
      password: "required"
    }
  },
  
  // Master Data Tools
  get_codes: {
    description: "Fetch system codes and reason codes",
    when_to_use: "When you need to validate cancellation reasons, purpose codes, etc.",
    cache_duration: "1 hour"
  },
  
  get_corridors: {
    description: "Get available payment corridors",
    when_to_use: "To check if payments are supported between specific countries",
    cache_duration: "1 hour"
  },
  
  get_banks: {
    description: "Search banks by country",
    when_to_use: "When user needs to find recipient bank details",
    parameters: {
      receiving_country_code: "ISO country code (from corridors)"
    }
  },
  
  // RaaS Flow Tools
  create_quote_raas: {
    description: "Create remittance quote (quote->confirm flow)",
    when_to_use: "For standard remittance transactions",
    flow: "quote -> confirm -> [optional: cancel/brn-update]",
    required_data: ["receiving_country", "sending_amount", "currency", "recipient_details"]
  },
  
  confirm_transaction_raas: {
    description: "Confirm a RaaS transaction using quote ID",
    when_to_use: "After user approves the quote",
    parameters: {
      quote_id: "from create_quote_raas response"
    }
  },
  
  // PaaS Flow Tools  
  authorize_clearance_paas: {
    description: "Authorize payment clearance (authorize->enquire->receipt flow)",
    when_to_use: "For partner-fulfilled payment scenarios",
    flow: "authorize -> enquire -> receipt -> [optional: status-update]"
  },
  
  enquire_transaction: {
    description: "Check transaction status",
    when_to_use: "To get current status of any transaction",
    parameters: {
      transaction_ref_number: "from transaction creation response"
    }
  }
};

// Tool selection logic
function selectAppropriateTools(userIntent, context) {
  // Always start with authentication
  const tools = ['get_token'];
  
  // Add master data tools based on what's needed
  if (userIntent.includes('quote') || userIntent.includes('send money')) {
    tools.push('get_corridors', 'get_banks');
  }
  
  // Select payment flow based on requirements
  if (context.requiresQuote) {
    tools.push('create_quote_raas', 'confirm_transaction_raas');
  } else if (context.requiresAuthorization) {
    tools.push('authorize_clearance_paas', 'enquire_transaction');
  }
  
  return tools;
}`
  };

  const validationPromptExample = {
    language: 'text',
    label: 'Validation Prompting',
    code: `## Input Validation Protocol:

Before making any API calls, validate all inputs against master data:

### Step 1: Country Validation
- Check if sending/receiving countries are supported
- Verify country codes against corridor data
- Confirm payment methods available for the corridor

### Step 2: Amount Validation  
- Verify amount is within corridor limits
- Check if currency is supported
- Validate decimal precision requirements

### Step 3: Recipient Information
- Ensure all required fields are provided
- Validate bank codes against bank master data
- Check branch codes if required by the destination country

### Step 4: Purpose Code Validation
- Verify transaction purpose is allowed for the corridor
- Check compliance requirements
- Validate supporting documents if needed

### Validation Response Format:
✅ "All information validated successfully. Proceeding with transaction."
❌ "Validation failed: [specific issue]. Here's what I need: [requirements]"
⚠️  "Partial validation: [what's valid]. Still need: [missing items]"

### If Validation Fails:
1. Clearly explain what information is missing or invalid
2. Provide specific examples of valid values when possible
3. Offer to search master data to find correct values
4. Guide the user through providing the correct information

Never proceed with API calls using unvalidated data.`
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
          <li><span className="text-gray-500">Best Practices</span></li>
          <li>→</li>
          <li className="text-gray-900 dark:text-white">Prompting & Agents</li>
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
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Brain className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Prompting & Agents Best Practices
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Advanced prompt engineering for tool-using agents with Digit9 APIs
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
        <AskPageSection showButtons={false} notebookUrl="https://notebooklm.google.com/notebook/8a2ac2e4-288e-4765-bf20-4b982e96d8c3?authuser=5" />
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
            This guide provides advanced prompt engineering guidance for tool-using agents that integrate 
            with Digit9 APIs. These patterns ensure reliable, secure, and user-friendly agent behavior 
            in financial services contexts.
          </p>
        </div>
      </motion.section>

      {/* Structure Prompts for Tools */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
            <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Structure Prompts for Tools</h2>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Principles</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Ask the model to <strong>choose a stack</strong> (RaaS vs PaaS) and explain why</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Require the agent to <strong>fetch masters</strong> before forming requests</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Specify required <strong>headers</strong> and <strong>exact field names</strong></span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Define clear <strong>validation requirements</strong> and error handling</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Structured Template</h3>
              <CodeBlock theme={theme} examples={[structuredPromptExample]} />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Grounding and Validation */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Grounding and Validation</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Validation Requirements</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Pull enumerations from <strong>Get Codes</strong> and master APIs; never invent values</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Validate callbacks by recomputing <strong>SHA‑512</strong> over &lt;raw_payload&gt;&lt;pre_shared_secret&gt;</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Treat <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm">state/sub_state</code> as truth; prohibit guessing finality</span>
              </li>
            </ul>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Critical Rule</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    Never proceed without validating all inputs against current master data. Hard-coded values lead to failures.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Validation Protocol</h3>
            <CodeBlock theme={theme} examples={[validationPromptExample]} />
          </div>
        </div>
      </motion.section>

      {/* Error-Aware Prompting */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-4">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Error-Aware Prompting</h2>
        </div>

        <div className="mb-8">
          <CodeBlock theme={theme} examples={[errorHandlingPromptExample]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">401/404 Errors</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Map to authentication/endpoint issues. Refresh tokens or verify URLs.</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">422 Validation</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Check for missing master data or invalid combinations.</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">500/504 Errors</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Server issues. Implement retry with exponential backoff.</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Business Errors</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">AML pending, limits exceeded, already processed states.</p>
          </div>
        </div>
      </motion.section>

      {/* Token & Secrets Hygiene */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Token & Secrets Hygiene</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">✅ Security Best Practices</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Prompt agent to refresh token before <code>expires_in</code></li>
              <li>• Never log or display actual token values</li>
              <li>• Mask sensitive data in outputs (PII, credentials)</li>
              <li>• Use environment variables for all secrets</li>
              <li>• Implement proper token rotation</li>
              <li>• Validate callback signatures before processing</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">❌ Security Anti-Patterns</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Hard-coding credentials in prompts</li>
              <li>• Logging full request/response bodies</li>
              <li>• Displaying tokens in user interfaces</li>
              <li>• Using the same credentials across environments</li>
              <li>• Ignoring token expiry warnings</li>
              <li>• Skipping callback signature verification</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Response Shaping */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Response Shaping</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User-Friendly Responses</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Surface identifiers like <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm">transaction_ref_number</code> and <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm">quote_id</code></span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Ask for a concise status summary keyed by <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm">state/sub_state</code></span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Translate technical codes into user-friendly descriptions</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Provide clear next steps and expected timelines</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Example Response Templates</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quote Created</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  "I've created quote #QT123456 for sending $1,000 USD to Pakistan. 
                  The recipient will receive 275,000 PKR. This quote is valid for 30 minutes. 
                  Would you like me to proceed with the transaction?"
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Transaction Confirmed</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  "Transaction TR789012 has been confirmed and is now processing. 
                  You'll receive updates as it progresses. Expected completion: 2-3 business days."
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Tool Routing Strategy */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
            <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Tool Routing Strategy</h2>
        </div>

        <div className="mb-8">
          <CodeBlock theme={theme} examples={[toolRoutingExample]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">RaaS Flow (Quote-Confirm)</h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p className="text-sm"><strong>When to use:</strong> Standard remittance transactions</p>
              <p className="text-sm"><strong>Process:</strong> Token → Masters → Quote → Confirm → Monitor</p>
              <p className="text-sm"><strong>Best for:</strong> Consumer-facing applications, direct customer transactions</p>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">PaaS Flow (Authorize-Enquire)</h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p className="text-sm"><strong>When to use:</strong> Partner-fulfilled scenarios</p>
              <p className="text-sm"><strong>Process:</strong> Token → Masters → Authorize → Enquire → Receipt → Update</p>
              <p className="text-sm"><strong>Best for:</strong> B2B integrations, partner networks</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Example Task Plans */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Example Task Plans</h2>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              "Create and confirm a quote (RaaS)"
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {[
                'Token',
                'Masters',
                '/amr/ras/api/v1_0/ras/quote',
                '/amr/ras/api/v1_0/ras/confirmtransaction',
                'Await callback or Enquire',
                'Receipt (if applicable)'
              ].map((step, index) => (
                <div key={index} className="flex items-center">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-gray-900 dark:text-white rounded-full text-sm">
                    {step}
                  </span>
                  {index < 5 && <span className="mx-2 text-gray-400">→</span>}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              "Authorize and enquire (PaaS)"
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {[
                'Token',
                'Masters',
                '/amr/paas/api/v1_0/paas/authorize-clearance',
                'Enquire',
                'Receipt',
                '(if partner-fulfilled) Status Update'
              ].map((step, index) => (
                <div key={index} className="flex items-center">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-gray-900 dark:text-white rounded-full text-sm">
                    {step}
                  </span>
                  {index < 5 && <span className="mx-2 text-gray-400">→</span>}
                </div>
              ))}
            </div>
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
              to="/agent-toolkit/reference/agent-tools"
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Agent Tools Reference</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Complete API reference for implementing these patterns</p>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Link
              to="/agent-toolkit/quickstart/llm-integration"
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">LLM Integration Guide</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Framework-specific implementation of these prompting patterns</p>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Download Template */}
      <motion.section 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Prompt Templates Library</h3>
              <p className="text-gray-600 dark:text-gray-300">Ready-to-use prompts for various agent frameworks and use cases</p>
            </div>
            <motion.button
              onClick={handleDownloadPrompts}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
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

export default PromptingBestPracticesPage;
