import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cpu, ArrowDown, Zap, Target, FileText, Download } from 'lucide-react';
import { Theme } from '../../types';
import CodeBlock from '../../components/CodeBlock';
import AskPageSection from '../../components/AskPageSection';
import { downloadZip } from '../../utils/downloadUtils';
import { agentIntegrationTemplates } from '../../data/agentTemplates';

interface AgentToolkitIntroductionPageProps {
  theme?: Theme;
}

const AgentToolkitIntroductionPage = ({ theme }: AgentToolkitIntroductionPageProps) => {
  // Handle download of agent integration templates
  const handleDownloadTemplates = () => {
    const files = [
      { name: 'openai-agent.ts', content: agentIntegrationTemplates.openaiTemplate },
      { name: 'langchain-agent.py', content: agentIntegrationTemplates.langchainTemplate },
      { name: '.env.example', content: agentIntegrationTemplates.envTemplate },
      { name: 'callback-handler.ts', content: agentIntegrationTemplates.callbackTemplate },
      { name: 'mcp-config.json', content: agentIntegrationTemplates.mcpConfigTemplate }
    ];
    
    downloadZip(files, 'agent-integration-templates');
  };

  // Code examples for the introduction
  const authExample = {
    language: 'typescript',
    label: 'TypeScript',
    code: `import { getToken, d9Post } from './http';

const BASE_URL = process.env.BASE_URL!;

export async function getToken() {
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
  return data.access_token as string;
}`
  };

  const quickExample = {
    language: 'python',
    label: 'Python',
    code: `import os, requests

BASE_URL = os.environ.get("BASE_URL")

def get_token():
    url = f"{BASE_URL}/auth/realms/cdp/protocol/openid-connect/token"
    data = {
        "grant_type": "password",
        "client_id": os.environ.get("CLIENT_ID"),
        "client_secret": os.environ.get("CLIENT_SECRET"),
        "username": os.environ.get("USERNAME"),
        "password": os.environ.get("PASSWORD"),
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    r = requests.post(url, data=data, headers=headers)
    r.raise_for_status()
    return r.json()["access_token"]

class D9Client:
    def __init__(self, token: str):
        self.token = token
        
    def _headers(self, extra=None):
        base = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }
        base.update(extra or {})
        return base`
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
          <li className="text-gray-900 dark:text-white">Agent Toolkit</li>
        </ol>
      </nav>

      {/* Header */}
      <motion.div 
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center justify-center mb-6">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Cpu className="h-8 w-8 text-white" />
          </motion.div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Agent Toolkit
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
          Build AI agents that integrate seamlessly with Digit9's APIs for remittance, payments, and customer onboarding. 
          Get started with modern agent frameworks and best practices.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
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
        <AskPageSection showButtons={false} notebookUrl="https://notebooklm.google.com/notebook/6050bbac-5a4c-44a0-b2cd-760601452cff?authuser=5" />
      </motion.section>

      {/* Overview Section */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Overview</h2>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            Digit9 Platform Services provide APIs for <strong>Remittance/Payments (RaaS/PaaS)</strong>, 
            <strong>Customer Onboarding (CAAS)</strong>, and <strong>eKYC (EFR)</strong>. Integrations are 
            HTTPS + JSON with token-based authentication and network whitelisting.
          </p>
        </div>
      </motion.section>

      {/* Capabilities Grid */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payments Stacks</h3>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>RaaS</strong> (quote→confirm) and <strong>PaaS</strong> (authorize clearance→enquire→receipt→status update).
            </p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Onboarding</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Corporate search/profile; individual get/validate; onboarding submit.
            </p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">eKYC</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Face liveness for identity assurance within onboarding journeys.
            </p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Master Data</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Codes, Corridors, Banks/Branches, Rates, Account validation.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* How it Works */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">How it Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "1",
              title: "Authenticate",
              description: "Retrieve an access token via the token endpoint; cache until expires_in.",
              color: "blue"
            },
            {
              step: "2", 
              title: "Resolve Masters",
              description: "Resolve master data to populate UIs/validate requests.",
              color: "green"
            },
            {
              step: "3",
              title: "Execute Flow", 
              description: "Execute the payments flow (RaaS or PaaS) and handle callbacks.",
              color: "purple"
            },
            {
              step: "4",
              title: "Get Receipts",
              description: "Retrieve receipts for completed transactions.",
              color: "orange"
            }
          ].map((item, index) => (
            <motion.div
              key={item.step}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 border border-gray-200 dark:border-gray-700">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Key Concepts */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Key Concepts</h2>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span className="text-gray-700 dark:text-gray-300">
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">state / sub_state</code> are authoritative
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span className="text-gray-700 dark:text-gray-300">
                Identifiers include <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">transaction_ref_number</code> and 
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">quote_id</code>
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span className="text-gray-700 dark:text-gray-300">
                Headers often include: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">Authorization: Bearer &lt;TOKEN&gt;</code>, 
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">sender</code>, 
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">channel</code>, 
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">company</code>, 
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">branch</code>
              </span>
            </li>
          </ul>
        </div>
      </motion.section>

      {/* Quick Start Examples */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Quick Start Examples</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">TypeScript Setup</h3>
            <CodeBlock theme={theme} examples={[authExample]} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Python Setup</h3>
            <CodeBlock theme={theme} examples={[quickExample]} />
          </div>
        </div>
      </motion.section>

      {/* Security & Access */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Security & Access</h2>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Requirements</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>• HTTPS (TLS ≥ 1.2)</li>
            <li>• IP/domain whitelisting for inbound/outbound traffic and callbacks</li>
            <li>• Callback integrity: compute SHA‑512 over &lt;raw_payload&gt;&lt;pre_shared_secret&gt;; compare to inbound hash header</li>
          </ul>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Agent Toolkit Quickstart",
              description: "Get started with building agents for payments",
              icon: Zap,
              href: "/agent-toolkit/quickstart/payments",
              color: "blue"
            },
            {
              title: "MCP Quickstart", 
              description: "Model Context Protocol integration guide",
              icon: Cpu,
              href: "/agent-toolkit/quickstart/mcp",
              color: "green"
            },
            {
              title: "LLM Integration",
              description: "Integrate with popular LLM frameworks",
              icon: Target,
              href: "/agent-toolkit/quickstart/llm-integration", 
              color: "purple"
            },
            {
              title: "Agent Tools Reference",
              description: "Complete API reference for agent tools",
              icon: FileText,
              href: "/agent-toolkit/reference/agent-tools",
              color: "orange"
            },
            {
              title: "Best Practices",
              description: "Integration and prompting best practices",
              icon: Target,
              href: "/agent-toolkit/best-practices/integration",
              color: "pink"
            }
          ].map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={item.href}
                className="block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <ArrowDown className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Downloads Section */}
      <motion.section 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Download Templates</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Agent Integration Templates</h3>
              <p className="text-gray-600 dark:text-gray-300">Ready-to-use code templates for popular agent frameworks</p>
            </div>
            <motion.button
              onClick={handleDownloadTemplates}
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

export default AgentToolkitIntroductionPage;
