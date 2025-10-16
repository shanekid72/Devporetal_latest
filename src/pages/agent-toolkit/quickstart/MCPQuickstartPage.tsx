import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GitBranch, ArrowDown, CheckCircle, Download, Settings, AlertTriangle, Server } from 'lucide-react';
import { Theme } from '../../../types';
import CodeBlock from '../../../components/CodeBlock';
import AskPageSection from '../../../components/AskPageSection';
import { downloadZip } from '../../../utils/downloadUtils';
import { mcpTemplateFiles } from '../../../data/agentTemplates';

interface MCPQuickstartPageProps {
  theme?: Theme;
}

const MCPQuickstartPage = ({ theme }: MCPQuickstartPageProps) => {
  // Handle download of MCP integration templates
  const handleDownloadTemplate = () => {
    const files = Object.entries(mcpTemplateFiles).map(([name, content]) => ({
      name,
      content
    }));
    
    downloadZip(files, 'mcp-integration-template');
  };

  // Code examples for MCP quickstart
  const mcpConfigExample = {
    language: 'json',
    label: 'JSON Configuration',
    code: `{
  "mcpServers": {
    "worldAPI": {
      "name": "WorldAPI finder",
      "version": "0.1.0",
      "description": "An MCP server that retrieves API details related to WorldAPI and Digit9.",
      "url": "http://worldapi.block9.ai:8000/sse",
      "env": { 
        "PARTNER_ID": "<your_partner_id>" 
      },
      "capabilities": { 
        "tools": { 
          "listChanged": true 
        } 
      }
    }
  }
}`
  };

  const clientUsageExample = {
    language: 'typescript',
    label: 'TypeScript Client',
    code: `import { MCPClient } from '@modelcontextprotocol/client';

// Initialize MCP client
const client = new MCPClient({
  serverUrl: 'http://worldapi.block9.ai:8000/sse',
  capabilities: {
    tools: {
      listChanged: true
    }
  }
});

// Set environment variables
await client.setEnvironment({
  PARTNER_ID: process.env.PARTNER_ID
});

// Connect to the server
await client.connect();

// List available tools
const tools = await client.listTools();
console.log('Available tools:', tools);

// Use a tool
const result = await client.callTool({
  name: 'digit9_api_search',
  arguments: {
    query: 'authentication endpoints',
    category: 'auth'
  }
});

console.log('Tool result:', result);`
  };

  const agentIntegrationExample = {
    language: 'python',
    label: 'Python Agent Integration',
    code: `# MCP Integration with LangChain
from langchain.tools import BaseTool
from mcp import MCPClient
import asyncio

class MCPTool(BaseTool):
    name = "digit9_mcp_tool"
    description = "Access Digit9 APIs through MCP server"
    
    def __init__(self):
        self.mcp_client = MCPClient("http://worldapi.block9.ai:8000/sse")
        
    async def _arun(self, query: str) -> str:
        """Async implementation."""
        try:
            # Connect to MCP server
            await self.mcp_client.connect()
            
            # Set partner ID
            await self.mcp_client.set_environment({
                "PARTNER_ID": "<your_partner_id>"
            })
            
            # Call MCP tool
            result = await self.mcp_client.call_tool({
                "name": "worldapi_search",
                "arguments": {"query": query}
            })
            
            return result
            
        except Exception as e:
            return f"Error calling MCP server: {str(e)}"
            
    def _run(self, query: str) -> str:
        """Sync implementation."""
        return asyncio.run(self._arun(query))

# Use in agent
mcp_tool = MCPTool()
agent_tools = [mcp_tool]`
  };

  const troubleshootingExample = {
    language: 'bash',
    label: 'Shell',
    code: `# Test MCP server connectivity
curl -I http://worldapi.block9.ai:8000/sse

# Check MCP server health
curl http://worldapi.block9.ai:8000/health

# Verify environment variables
echo $PARTNER_ID

# Test with MCP CLI tool (if available)
mcp-client connect --url http://worldapi.block9.ai:8000/sse --env PARTNER_ID=<your_id>

# Debug connection issues
telnet worldapi.block9.ai 8000`
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
          <li className="text-gray-900 dark:text-white">MCP</li>
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
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mr-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <GitBranch className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              MCP Quickstart
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Model Context Protocol integration with Digit9 APIs
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
        <AskPageSection showButtons={false} notebookUrl="https://notebooklm.google.com/notebook/c612f92d-c2f8-4e61-8979-0629c4e6c9e4?authuser=5" />
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
            Expose Digit9/WorldAPI operations to your agent runtime via an MCP server. 
            The Model Context Protocol provides a standardized way for AI agents to access 
            external tools and data sources.
          </p>
        </div>
      </motion.section>

      {/* What is MCP */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">What is MCP?</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
              <Server className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Standardized Protocol</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              MCP provides a consistent interface for AI agents to interact with external services and APIs.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
              <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Easy Integration</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Simple configuration allows agents to discover and use Digit9 APIs without custom implementations.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Framework Agnostic</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Works with any MCP-compatible agent framework including OpenAI, Anthropic, and open-source solutions.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Step 1: Install MCP Server */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Step 1: Install the MCP Server</h2>
        
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <span className="text-white text-sm font-bold">ℹ</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pre-configured Server</h3>
              <p className="text-gray-900 dark:text-white">
                The Digit9 MCP server is already running and available. You just need to configure your MCP client to connect to it.
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Use your MCP‑aware client and add the server configuration. No installation required.
        </p>
      </motion.section>

      {/* Step 2: Configure MCP */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Step 2: Configure MCP Client</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Add the WorldAPI MCP server to your client configuration:
          </p>
          <CodeBlock theme={theme} examples={[mcpConfigExample]} />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Important</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Each partner has its own <code>PARTNER_ID</code>. Replace <code>&lt;your_partner_id&gt;</code> with your actual partner identifier.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Step 3: Discover Tools */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Step 3: Discover Tools</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Start your MCP client and retrieve the tool list from the WorldAPI server:
          </p>
          <CodeBlock theme={theme} examples={[clientUsageExample]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Available Tools</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• <code>worldapi_search</code> - Search API documentation</li>
              <li>• <code>digit9_endpoints</code> - List available endpoints</li>
              <li>• <code>api_examples</code> - Get code examples</li>
              <li>• <code>master_data</code> - Access master data APIs</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Tool Capabilities</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• Dynamic tool discovery</li>
              <li>• Real-time API updates</li>
              <li>• Partner-specific configurations</li>
              <li>• Contextual help and examples</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Step 4: Use with Agents */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Step 4: Use with Agents</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Integrate the MCP server with your agent framework. Here's an example with LangChain:
          </p>
          <CodeBlock theme={theme} examples={[agentIntegrationExample]} />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workflow Steps</h3>
          <ol className="space-y-2 text-gray-900 dark:text-white">
            <li>1. Fetch token via Digit9 token endpoint</li>
            <li>2. Resolve master data using the exposed tools</li>
            <li>3. Route tool calls to Digit9 HTTPS endpoints (RaaS/PaaS/CAAS/eKYC as needed)</li>
          </ol>
        </div>
      </motion.section>

      {/* Supported Frameworks */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Supported Frameworks</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'OpenAI Agents', description: 'GPT-4 and GPT-3.5 with function calling', supported: true },
            { name: 'Anthropic Claude', description: 'Claude 3 with tool use capabilities', supported: true },
            { name: 'LangChain', description: 'Popular Python agent framework', supported: true },
            { name: 'LlamaIndex', description: 'Data framework for LLM applications', supported: true },
            { name: 'CrewAI', description: 'Multi-agent orchestration framework', supported: true },
            { name: 'AutoGen', description: 'Microsoft multi-agent framework', supported: true }
          ].map((framework, index) => (
            <motion.div
              key={framework.name}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
            >
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{framework.name}</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">{framework.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Troubleshooting */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Troubleshooting</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Common issues and debugging steps:
          </p>
          <CodeBlock theme={theme} examples={[troubleshootingExample]} />
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Connection Issues</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Ensure outbound network access to the MCP server URL</li>
              <li>• Check firewall and proxy settings</li>
              <li>• Verify the server URL is correct and reachable</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Authentication Issues</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Verify your <code>PARTNER_ID</code> is set and valid in the environment</li>
              <li>• Check that the partner ID corresponds to your tenancy</li>
              <li>• Ensure proper permissions for your partner account</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tool Discovery Issues</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Tools may take a moment to populate after first connection</li>
              <li>• Restart your MCP client if tools don't appear</li>
              <li>• Check server logs for any error messages</li>
            </ul>
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
              to="/agent-toolkit/quickstart/llm-integration"
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">LLM Integration Guide</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Learn how to integrate MCP with specific LLM frameworks</p>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Link
              to="/agent-toolkit/best-practices/integration"
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Integration Best Practices</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Learn best practices for reliable MCP integrations</p>
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
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">MCP Integration Template</h3>
              <p className="text-gray-600 dark:text-gray-300">Complete examples for popular frameworks with MCP configuration</p>
            </div>
            <motion.button
              onClick={handleDownloadTemplate}
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

export default MCPQuickstartPage;
