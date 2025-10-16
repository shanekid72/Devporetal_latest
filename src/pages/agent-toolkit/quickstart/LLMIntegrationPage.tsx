import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, ArrowDown, Download, Code, Brain, Zap } from 'lucide-react';
import { Theme } from '../../../types';
import CodeBlock from '../../../components/CodeBlock';
import AskPageSection from '../../../components/AskPageSection';
import { downloadZip } from '../../../utils/downloadUtils';
import { llmTemplateFiles } from '../../../data/agentTemplates';

interface LLMIntegrationPageProps {
  theme?: Theme;
}

const LLMIntegrationPage = ({ theme }: LLMIntegrationPageProps) => {
  // Handle download of LLM integration templates
  const handleDownloadTemplates = () => {
    const files = Object.entries(llmTemplateFiles).map(([name, content]) => ({
      name,
      content
    }));
    
    downloadZip(files, 'llm-integration-templates');
  };

  // Code examples for LLM integration
  const openaiExample = {
    language: 'typescript',
    label: 'OpenAI Integration',
    code: `// openai-integration.ts
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const BASE_URL = process.env.BASE_URL!;

async function getToken() { 
  const url = \`\${BASE_URL}/auth/realms/cdp/protocol/openid-connect/token\`;
  const body = new URLSearchParams({
    grant_type: 'password',
    client_id: process.env.CLIENT_ID!,
    client_secret: process.env.CLIENT_SECRET!,
    username: process.env.USERNAME!,
    password: process.env.PASSWORD!,
  });
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(\`Token failed: \${res.status}\`);
  const data = await res.json();
  return data.access_token;
}

async function d9Post(path: string, payload: unknown, token: string, extra?: Record<string,string>) {
  const res = await fetch(\`\${BASE_URL}\${path}\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json',
      ...(extra || {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(\`POST \${path} -> \${res.status}\`);
  return res.json();
}

export async function run(messages: any[]) {
  const tools = [
    { 
      type: 'function', 
      function: {
        name: 'd9_create_quote',
        description: 'Create quote (RaaS).',
        parameters: {
          type: 'object',
          properties: {
            payload: { type: 'object' },
            headers: { type: 'object' }
          },
          required: ['payload']
        }
      }
    },
    { 
      type: 'function', 
      function: {
        name: 'd9_authorize_clearance',
        description: 'Authorize clearance (PaaS).',
        parameters: {
          type: 'object',
          properties: {
            payload: { type: 'object' },
            headers: { type: 'object' }
          },
          required: ['payload']
        }
      }
    }
  ];
  
  const chat = await client.chat.completions.create({ 
    model: 'gpt-4', 
    messages, 
    tools 
  });
  
  const token = await getToken();
  for (const tc of chat.choices[0].message.tool_calls || []) {
    const args = JSON.parse(tc.function!.arguments);
    if (tc.function!.name === 'd9_create_quote') {
      await d9Post('/amr/ras/api/v1_0/ras/quote', args.payload, token, args.headers);
    }
    if (tc.function!.name === 'd9_authorize_clearance') {
      await d9Post('/amr/paas/api/v1_0/paas/authorize-clearance', args.payload, token, args.headers);
    }
  }
}`
  };

  const anthropicExample = {
    language: 'typescript',
    label: 'Anthropic Claude Integration',
    code: `// anthropic-integration.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function runWithClaude(userMessage: string) {
  const token = await getToken();
  
  const tools = [
    {
      name: "d9_create_quote",
      description: "Create a remittance quote using Digit9 RaaS API",
      input_schema: {
        type: "object",
        properties: {
          receiving_country_code: { type: "string", description: "ISO country code" },
          sending_amount: { type: "number", description: "Amount to send" },
          sending_currency: { type: "string", description: "Currency code" }
        },
        required: ["receiving_country_code", "sending_amount", "sending_currency"]
      }
    },
    {
      name: "d9_confirm_transaction",
      description: "Confirm a transaction using quote ID",
      input_schema: {
        type: "object",
        properties: {
          quote_id: { type: "string", description: "Quote identifier" },
          recipient_details: { type: "object", description: "Recipient information" }
        },
        required: ["quote_id"]
      }
    }
  ];

  const message = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1024,
    tools,
    messages: [{ role: "user", content: userMessage }]
  });

  // Process tool calls
  for (const content of message.content) {
    if (content.type === 'tool_use') {
      const { name, input } = content;
      
      if (name === 'd9_create_quote') {
        const result = await d9Post('/amr/ras/api/v1_0/ras/quote', input, token);
        console.log('Quote created:', result);
      }
      
      if (name === 'd9_confirm_transaction') {
        const result = await d9Post('/amr/ras/api/v1_0/ras/confirmtransaction', input, token);
        console.log('Transaction confirmed:', result);
      }
    }
  }
}`
  };

  const langchainExample = {
    language: 'python',
    label: 'LangChain Integration',
    code: `# langchain_tools.py
from langchain.tools import StructuredTool
from typing import Dict, Any
import requests
import os

BASE_URL = os.environ["BASE_URL"]

def get_d9_token():
    """Get Digit9 API token"""
    url = f"{BASE_URL}/auth/realms/cdp/protocol/openid-connect/token"
    data = {
        "grant_type": "password",
        "client_id": os.environ["CLIENT_ID"],
        "client_secret": os.environ["CLIENT_SECRET"],
        "username": os.environ["USERNAME"],
        "password": os.environ["PASSWORD"],
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    r = requests.post(url, data=data, headers=headers)
    r.raise_for_status()
    return r.json()["access_token"]

def d9_call(path: str, payload: Dict[str, Any], token: str, headers: Dict[str, str] = None):
    """Make authenticated call to Digit9 API"""
    h = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    if headers:
        h.update(headers)
    
    r = requests.post(f"{BASE_URL}{path}", json=payload, headers=h)
    r.raise_for_status()
    return r.json()

# Create LangChain tools
def create_quote_tool():
    def _create_quote(
        receiving_country_code: str,
        sending_amount: float,
        sending_currency: str,
        additional_headers: Dict[str, str] = None
    ) -> str:
        """Create a remittance quote"""
        token = get_d9_token()
        payload = {
            "receiving_country_code": receiving_country_code,
            "sending_amount": sending_amount,
            "sending_currency": sending_currency
        }
        
        result = d9_call("/amr/ras/api/v1_0/ras/quote", payload, token, additional_headers)
        return f"Quote created successfully. Quote ID: {result.get('quote_id')}"
    
    return StructuredTool.from_function(
        name="d9_create_quote",
        description="Create a remittance quote using Digit9 RaaS API. Requires country code, amount, and currency.",
        func=_create_quote
    )

def confirm_transaction_tool():
    def _confirm_transaction(
        quote_id: str,
        recipient_details: Dict[str, Any],
        additional_headers: Dict[str, str] = None
    ) -> str:
        """Confirm a transaction using quote ID"""
        token = get_d9_token()
        payload = {
            "quote_id": quote_id,
            **recipient_details
        }
        
        result = d9_call("/amr/ras/api/v1_0/ras/confirmtransaction", payload, token, additional_headers)
        return f"Transaction confirmed. Reference: {result.get('transaction_ref_number')}"
    
    return StructuredTool.from_function(
        name="d9_confirm_transaction", 
        description="Confirm a transaction using a quote ID and recipient details.",
        func=_confirm_transaction
    )

# Usage with agent
from langchain.agents import initialize_agent, AgentType
from langchain.llms import OpenAI

tools = [create_quote_tool(), confirm_transaction_tool()]
llm = OpenAI(temperature=0)

agent = initialize_agent(
    tools, 
    llm, 
    agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)`
  };

  const bedrockExample = {
    language: 'typescript',
    label: 'Amazon Bedrock Integration',
    code: `// bedrock-integration.ts
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { d9Post, getToken } from './http';

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

export async function runWithBedrock(userMessage: string) {
  const token = await getToken();
  
  const toolConfig = {
    tools: [
      {
        toolSpec: {
          name: "d9_create_quote",
          description: "Create a remittance quote",
          inputSchema: {
            json: {
              type: "object",
              properties: {
                receiving_country_code: { type: "string" },
                sending_amount: { type: "number" },
                sending_currency: { type: "string" }
              },
              required: ["receiving_country_code", "sending_amount", "sending_currency"]
            }
          }
        }
      },
      {
        toolSpec: {
          name: "d9_enquire_transaction",
          description: "Check transaction status",
          inputSchema: {
            json: {
              type: "object", 
              properties: {
                transaction_ref_number: { type: "string" }
              },
              required: ["transaction_ref_number"]
            }
          }
        }
      }
    ]
  };

  const command = new ConverseCommand({
    modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0',
    messages: [
      {
        role: 'user',
        content: [{ text: userMessage }]
      }
    ],
    toolConfig
  });

  const response = await client.send(command);
  
  // Process tool use requests
  if (response.output?.message?.content) {
    for (const content of response.output.message.content) {
      if (content.toolUse) {
        const { name, input } = content.toolUse;
        
        switch (name) {
          case 'd9_create_quote':
            const quoteResult = await d9Post('/amr/ras/api/v1_0/ras/quote', input, token);
            console.log('Quote created:', quoteResult);
            break;
            
          case 'd9_enquire_transaction':
            const enquiryResult = await d9Post('/amr/ras/api/v1_0/ras/enquire-transaction', input, token);
            console.log('Transaction status:', enquiryResult);
            break;
        }
      }
    }
  }
}`
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
          <li className="text-gray-900 dark:text-white">LLM Integration</li>
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
              LLM Integration
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Integrate Digit9 APIs with popular Large Language Model frameworks
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
        <AskPageSection showButtons={false} notebookUrl="https://notebooklm.google.com/notebook/859edd49-be13-40bb-84da-7b92075666ea?authuser=5" />
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
            This guide shows you how to integrate Digit9's payment and remittance APIs with popular 
            LLM frameworks. Agent frameworks treat HTTPS calls as <strong>tools</strong>, allowing 
            AI agents to interact with Digit9 endpoints naturally through conversation.
          </p>
        </div>
      </motion.section>

      {/* Before You Begin */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Before You Begin</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Prerequisites</h3>
            <ul className="space-y-2 text-gray-900 dark:text-white text-sm">
              <li>• Base URL & network whitelisting per environment</li>
              <li>• Authentication credentials (client_id/secret, username/password)</li>
              <li>• Required headers: sender, channel, company, branch</li>
              <li>• Callback endpoint and pre-shared secret</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Concepts</h3>
            <ul className="space-y-2 text-gray-900 dark:text-white text-sm">
              <li>• Payment flows: RaaS vs PaaS selection</li>
              <li>• Master data: Codes, Corridors, Banks/Branches, Rates</li>
              <li>• Callback integrity: SHA‑512 verification</li>
              <li>• State management: state/sub_state as truth</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Framework Integrations */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Framework Integrations</h2>

        {/* OpenAI Integration */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-4">
              <Zap className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">OpenAI Integration</h3>
              <p className="text-gray-600 dark:text-gray-300">Use OpenAI's function calling with GPT-4 and GPT-3.5</p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Route tool/function calls to Digit9 HTTPS endpoints using OpenAI's structured function calling:
            </p>
            <CodeBlock theme={theme} examples={[openaiExample]} />
          </div>
        </div>

        {/* Anthropic Integration */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-4">
              <Brain className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Anthropic Claude Integration</h3>
              <p className="text-gray-600 dark:text-gray-300">Use Claude's tool use capabilities with Digit9 APIs</p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Claude 3 supports structured tool use with JSON schemas for API integration:
            </p>
            <CodeBlock theme={theme} examples={[anthropicExample]} />
          </div>
        </div>

        {/* LangChain Integration */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-4">
              <Code className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">LangChain Integration</h3>
              <p className="text-gray-600 dark:text-gray-300">Register StructuredTool for each Digit9 operation</p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Create LangChain tools that proxy to Digit9 endpoints with exact schema matching:
            </p>
            <CodeBlock theme={theme} examples={[langchainExample]} />
          </div>
        </div>

        {/* Amazon Bedrock Integration */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-4">
              <Target className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Amazon Bedrock Integration</h3>
              <p className="text-gray-600 dark:text-gray-300">Wrap Digit9 operations as callable tools for Bedrock models</p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Use Bedrock's Converse API with tool configurations for Digit9 integration:
            </p>
            <CodeBlock theme={theme} examples={[bedrockExample]} />
          </div>
        </div>
      </motion.section>

      {/* Framework Comparison */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Framework Comparison</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Framework</th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Tool Pattern</th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Schema Support</th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 font-medium text-gray-900 dark:text-white">OpenAI</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-300">Function Calling</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-400">Excellent</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-300">Production apps, GPT-4</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 font-medium text-gray-900 dark:text-white">Anthropic</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-300">Tool Use</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-400">Excellent</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-300">Complex reasoning, Claude 3</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 font-medium text-gray-900 dark:text-white">LangChain</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-300">StructuredTool</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-400">Good</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-300">Python ecosystem, chains</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 font-medium text-gray-900 dark:text-white">Bedrock</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-300">Tool Config</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-400">Excellent</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-300">AWS integration, enterprise</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 font-medium text-gray-900 dark:text-white">LlamaIndex</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-300">FunctionTool</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-400">Good</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-600 dark:text-gray-300">RAG applications, data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* Best Practices */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Integration Best Practices</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✅ Do's</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Fetch tokens before API calls</li>
                <li>• Use master data to validate inputs</li>
                <li>• Implement proper error handling</li>
                <li>• Verify callback integrity with SHA-512</li>
                <li>• Cache tokens until expiry</li>
                <li>• Include required headers</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🔧 Tools Pattern</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• One tool per API endpoint</li>
                <li>• Pass-through JSON payloads</li>
                <li>• Match exact field names</li>
                <li>• Include comprehensive descriptions</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">❌ Don'ts</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Don't hard-code enumerations</li>
                <li>• Don't ignore callback verification</li>
                <li>• Don't guess transaction completion</li>
                <li>• Don't fabricate field names</li>
                <li>• Don't skip master data validation</li>
                <li>• Don't store sensitive credentials</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⚠️ Security</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Use environment variables for secrets</li>
                <li>• Implement proper TLS (≥ 1.2)</li>
                <li>• Validate all inputs</li>
                <li>• Log only non-sensitive data</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Troubleshooting */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Troubleshooting</h2>
        
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-gray-400 dark:bg-gray-600 text-white rounded text-xs flex items-center justify-center mr-3">
                401
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Authentication Errors</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Refresh token; ensure Authorization header is present</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-gray-400 dark:bg-gray-600 text-white rounded text-xs flex items-center justify-center mr-3">
                422
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Validation Errors</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Verify corridor/bank/branch/rate/charge and other master-based inputs</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-gray-400 dark:bg-gray-600 text-white rounded text-xs flex items-center justify-center mr-3">
                500
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Server Errors</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Retry with backoff; add app-level idempotency when re-issuing</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-gray-400 dark:bg-gray-600 text-white rounded text-xs flex items-center justify-center mr-3">
                🔒
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Callback Trust Issues</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Recompute SHA‑512 over &lt;raw_payload&gt;&lt;pre_shared_secret&gt; and compare to inbound hash header</p>
          </div>
        </div>
      </motion.section>

      {/* Next Steps */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Link
              to="/agent-toolkit/reference/agent-tools"
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Code className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Agent Tools Reference</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Complete API reference for all agent tools and endpoints</p>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Link
              to="/agent-toolkit/best-practices/prompting"
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Prompting & Agents</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Best practices for prompting and agent design</p>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Download Template */}
      <motion.section 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">LLM Integration Templates</h3>
              <p className="text-gray-600 dark:text-gray-300">Complete examples for all major frameworks with working tool implementations</p>
            </div>
            <motion.button
              onClick={handleDownloadTemplates}
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

export default LLMIntegrationPage;
