// Agent integration templates and downloadable content

export const agentIntegrationTemplates = {
  // OpenAI Agent Template
  openaiTemplate: `// OpenAI Agent Integration with Digit9 APIs
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const BASE_URL = process.env.BASE_URL!;

// Token management
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

// API call helper
async function d9Post(path: string, payload: unknown, token: string, extra?: Record<string,string>) {
  const res = await fetch(\`\${BASE_URL}\${path}\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json',
      'sender': process.env.SENDER!,
      'channel': process.env.CHANNEL!,
      'company': process.env.COMPANY!,
      'branch': process.env.BRANCH!,
      ...(extra || {}),
    },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) throw new Error(\`POST \${path} -> \${res.status}\`);
  return res.json();
}

// OpenAI tools configuration
const tools = [
  {
    type: 'function',
    function: {
      name: 'd9_create_quote',
      description: 'Create a remittance quote using Digit9 RaaS API',
      parameters: {
        type: 'object',
        properties: {
          receiving_country_code: { type: 'string', description: 'ISO country code' },
          sending_amount: { type: 'number', description: 'Amount to send' },
          sending_currency: { type: 'string', description: 'Currency code' },
          recipient_details: { type: 'object', description: 'Recipient information' }
        },
        required: ['receiving_country_code', 'sending_amount', 'sending_currency']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'd9_confirm_transaction',
      description: 'Confirm a transaction using quote ID',
      parameters: {
        type: 'object',
        properties: {
          quote_id: { type: 'string', description: 'Quote identifier' }
        },
        required: ['quote_id']
      }
    }
  }
];

// Main agent function
export async function runAgent(userMessage: string) {
  const token = await getToken();
  
  const chat = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: \`You are a financial services AI agent that helps with cross-border payments using Digit9 APIs.
        
        Always:
        1. Fetch fresh token before API calls
        2. Use master data to validate inputs
        3. Handle errors gracefully
        4. Verify callback integrity
        \`
      },
      { role: 'user', content: userMessage }
    ],
    tools
  });

  // Process tool calls
  for (const tc of chat.choices[0].message.tool_calls || []) {
    const args = JSON.parse(tc.function!.arguments);
    
    if (tc.function!.name === 'd9_create_quote') {
      const result = await d9Post('/amr/ras/api/v1_0/ras/quote', args, token);
      console.log('Quote created:', result);
    }
    
    if (tc.function!.name === 'd9_confirm_transaction') {
      const result = await d9Post('/amr/ras/api/v1_0/ras/confirmtransaction', args, token);
      console.log('Transaction confirmed:', result);
    }
  }
  
  return chat.choices[0].message;
}`,

  // Python LangChain Template
  langchainTemplate: `# LangChain Agent Integration with Digit9 APIs
from langchain.tools import StructuredTool
from langchain.agents import initialize_agent, AgentType
from langchain.llms import OpenAI
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
        "Content-Type": "application/json",
        "sender": os.environ["SENDER"],
        "channel": os.environ["CHANNEL"],
        "company": os.environ["COMPANY"],
        "branch": os.environ["BRANCH"],
    }
    if headers:
        h.update(headers)
    
    r = requests.post(f"{BASE_URL}{path}", json=payload, headers=h)
    r.raise_for_status()
    return r.json()

# LangChain tools
def create_quote_tool():
    def _create_quote(
        receiving_country_code: str,
        sending_amount: float,
        sending_currency: str
    ) -> str:
        """Create a remittance quote"""
        token = get_d9_token()
        payload = {
            "receiving_country_code": receiving_country_code,
            "sending_amount": sending_amount,
            "sending_currency": sending_currency
        }
        
        result = d9_call("/amr/ras/api/v1_0/ras/quote", payload, token)
        return f"Quote created successfully. Quote ID: {result.get('quote_id')}"
    
    return StructuredTool.from_function(
        name="d9_create_quote",
        description="Create a remittance quote using Digit9 RaaS API",
        func=_create_quote
    )

def confirm_transaction_tool():
    def _confirm_transaction(quote_id: str) -> str:
        """Confirm a transaction using quote ID"""
        token = get_d9_token()
        payload = {"quote_id": quote_id}
        
        result = d9_call("/amr/ras/api/v1_0/ras/confirmtransaction", payload, token)
        return f"Transaction confirmed. Reference: {result.get('transaction_ref_number')}"
    
    return StructuredTool.from_function(
        name="d9_confirm_transaction",
        description="Confirm a transaction using a quote ID",
        func=_confirm_transaction
    )

# Initialize agent
tools = [create_quote_tool(), confirm_transaction_tool()]
llm = OpenAI(temperature=0)

agent = initialize_agent(
    tools, 
    llm, 
    agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# Usage
if __name__ == "__main__":
    response = agent.run("Create a quote to send $1000 USD to Pakistan")
    print(response)`,

  // Environment Configuration Template
  envTemplate: `# Digit9 Agent Integration Environment Variables

# API Configuration
BASE_URL=https://your-digit9-base-url
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
USERNAME=your_username
PASSWORD=your_password

# Required Headers
SENDER=your_sender_id
CHANNEL=your_channel_id
COMPANY=your_company_id
BRANCH=your_branch_id

# Callback Configuration
CALLBACK_URL=https://your-domain.com/webhook/transaction-status
CALLBACK_SECRET=your_pre_shared_secret

# OpenAI Configuration (if using OpenAI)
OPENAI_API_KEY=your_openai_api_key

# Anthropic Configuration (if using Claude)
ANTHROPIC_API_KEY=your_anthropic_api_key

# AWS Configuration (if using Bedrock)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Node.js Environment
NODE_ENV=development`,

  // MCP Configuration Template
  mcpConfigTemplate: `{
  "mcpServers": {
    "worldAPI": {
      "name": "WorldAPI finder",
      "version": "0.1.0",
      "description": "An MCP server that retrieves API details related to WorldAPI and Digit9.",
      "url": "http://worldapi.block9.ai:8000/sse",
      "env": { 
        "PARTNER_ID": "your_partner_id_here" 
      },
      "capabilities": { 
        "tools": { 
          "listChanged": true 
        } 
      },
      "args": []
    }
  },
  "tools": {
    "worldapi_search": {
      "description": "Search WorldAPI documentation and endpoints",
      "parameters": {
        "query": {
          "type": "string",
          "description": "Search query for API documentation"
        },
        "category": {
          "type": "string",
          "enum": ["auth", "raas", "paas", "caas", "ekyc"],
          "description": "API category to search within"
        }
      }
    },
    "digit9_endpoints": {
      "description": "List available Digit9 API endpoints",
      "parameters": {
        "service": {
          "type": "string",
          "enum": ["all", "raas", "paas", "caas", "ekyc"],
          "description": "Service type to list endpoints for"
        }
      }
    }
  }
}`,

  // Callback Verification Template
  callbackTemplate: `// Callback Verification and Handling Template
import crypto from 'crypto';
import express from 'express';

const app = express();
app.use(express.json());

// Verify callback integrity using SHA-512
export function verifyCallbackIntegrity(
  rawPayload: string,
  preSharedSecret: string,
  receivedHash: string
): boolean {
  const expectedHash = crypto
    .createHash('sha512')
    .update(rawPayload + preSharedSecret)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedHash, 'hex'),
    Buffer.from(receivedHash, 'hex')
  );
}

// Callback verification middleware
export function callbackVerificationMiddleware(secret: string) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const receivedHash = req.headers['x-signature-sha512'] as string;
    const rawPayload = JSON.stringify(req.body);
    
    if (!receivedHash) {
      return res.status(401).json({ error: 'Missing signature header' });
    }
    
    if (!verifyCallbackIntegrity(rawPayload, secret, receivedHash)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    next();
  };
}

// Transaction status callback handler
app.post('/webhook/transaction-status', 
  callbackVerificationMiddleware(process.env.CALLBACK_SECRET!),
  (req, res) => {
    const { state, sub_state, transaction_ref_number } = req.body;
    
    console.log(\`Transaction \${transaction_ref_number} status: \${state}/\${sub_state}\`);
    
    // Process callback based on state/sub_state
    switch (state) {
      case 'COMPLETED':
        console.log('Transaction completed successfully');
        // Update your database, notify user, etc.
        break;
      case 'FAILED':
        console.log('Transaction failed');
        // Handle failure, notify user, etc.
        break;
      case 'PENDING':
        console.log('Transaction pending');
        // Update status, continue monitoring
        break;
      default:
        console.log(\`Unknown state: \${state}\`);
    }
    
    res.status(200).json({ received: true });
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Callback server running on port \${PORT}\`);
});`
};

export const paasTemplateFiles = {
  'paas-integration.ts': `// PaaS Flow Integration Template
${agentIntegrationTemplates.openaiTemplate.replace('ras', 'paas').replace('RaaS', 'PaaS')}`,
  
  'paas-agent.py': agentIntegrationTemplates.langchainTemplate.replace('ras', 'paas'),
  
  '.env.example': agentIntegrationTemplates.envTemplate,
  
  'callback-handler.ts': agentIntegrationTemplates.callbackTemplate,
  
  'package.json': `{
  "name": "digit9-paas-agent",
  "version": "1.0.0",
  "description": "Digit9 PaaS Agent Integration Template",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "test": "jest"
  },
  "dependencies": {
    "openai": "^4.0.0",
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "jest": "^29.0.0"
  }
}`
};

export const mcpTemplateFiles = {
  'mcp-config.json': agentIntegrationTemplates.mcpConfigTemplate,
  
  'mcp-client.ts': `// MCP Client Integration Template
import { MCPClient } from '@modelcontextprotocol/client';

export class Digit9MCPClient {
  private client: MCPClient;
  
  constructor() {
    this.client = new MCPClient({
      serverUrl: 'http://worldapi.block9.ai:8000/sse',
      capabilities: {
        tools: {
          listChanged: true
        }
      }
    });
  }
  
  async initialize() {
    await this.client.setEnvironment({
      PARTNER_ID: process.env.PARTNER_ID
    });
    
    await this.client.connect();
    console.log('Connected to Digit9 MCP server');
  }
  
  async searchAPI(query: string, category?: string) {
    return await this.client.callTool({
      name: 'worldapi_search',
      arguments: { query, category }
    });
  }
  
  async listEndpoints(service: string = 'all') {
    return await this.client.callTool({
      name: 'digit9_endpoints',
      arguments: { service }
    });
  }
}`,
  
  'langchain-mcp.py': `# LangChain MCP Integration
from mcp import MCPClient
import asyncio

class Digit9MCPTool:
    def __init__(self):
        self.client = MCPClient("http://worldapi.block9.ai:8000/sse")
    
    async def setup(self):
        await self.client.connect()
        await self.client.set_environment({
            "PARTNER_ID": os.environ.get("PARTNER_ID")
        })
    
    async def search_api(self, query: str) -> str:
        result = await self.client.call_tool({
            "name": "worldapi_search",
            "arguments": {"query": query}
        })
        return str(result)
    
    async def list_endpoints(self, service: str = "all") -> str:
        result = await self.client.call_tool({
            "name": "digit9_endpoints", 
            "arguments": {"service": service}
        })
        return str(result)`
};

export const llmTemplateFiles = {
  'openai-agent.ts': agentIntegrationTemplates.openaiTemplate,
  'langchain-agent.py': agentIntegrationTemplates.langchainTemplate,
  'anthropic-agent.ts': `// Anthropic Claude Integration Template
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function runWithClaude(userMessage: string) {
  const tools = [
    {
      name: "d9_create_quote",
      description: "Create a remittance quote using Digit9 RaaS API",
      input_schema: {
        type: "object",
        properties: {
          receiving_country_code: { type: "string" },
          sending_amount: { type: "number" },
          sending_currency: { type: "string" }
        },
        required: ["receiving_country_code", "sending_amount", "sending_currency"]
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
        const token = await getToken();
        const result = await d9Post('/amr/ras/api/v1_0/ras/quote', input, token);
        console.log('Quote created:', result);
      }
    }
  }
}`,
  'bedrock-agent.ts': `// Amazon Bedrock Integration Template
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

export async function runWithBedrock(userMessage: string) {
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
      }
    ]
  };

  const command = new ConverseCommand({
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
    messages: [{ role: 'user', content: [{ text: userMessage }] }],
    toolConfig
  });

  const response = await client.send(command);
  
  // Process tool use requests
  if (response.output?.message?.content) {
    for (const content of response.output.message.content) {
      if (content.toolUse) {
        const { name, input } = content.toolUse;
        
        if (name === 'd9_create_quote') {
          const token = await getToken();
          const result = await d9Post('/amr/ras/api/v1_0/ras/quote', input, token);
          console.log('Quote created:', result);
        }
      }
    }
  }
}`
};

export const apiReferenceJSON = {
  "digit9_agent_tools": {
    "version": "1.0.0",
    "base_url": "https://your-digit9-base-url",
    "authentication": {
      "type": "oauth2",
      "token_endpoint": "/auth/realms/cdp/protocol/openid-connect/token",
      "grant_type": "password"
    },
    "common_headers": {
      "Authorization": "Bearer <TOKEN>",
      "Content-Type": "application/json",
      "sender": "<SENDER>",
      "channel": "<CHANNEL>",
      "company": "<COMPANY>",
      "branch": "<BRANCH>"
    },
    "endpoints": {
      "authentication": [
        {
          "name": "get_token",
          "method": "POST",
          "path": "/auth/realms/cdp/protocol/openid-connect/token",
          "description": "Obtain authentication token",
          "required_headers": ["Content-Type"],
          "parameters": {
            "grant_type": "password",
            "client_id": "string",
            "client_secret": "string",
            "username": "string",
            "password": "string"
          }
        }
      ],
      "raas": [
        {
          "name": "create_quote",
          "method": "POST",
          "path": "/amr/ras/api/v1_0/ras/quote",
          "description": "Create remittance quote",
          "required_headers": ["Authorization", "sender", "channel", "company", "branch"],
          "parameters": {
            "receiving_country_code": "string",
            "sending_amount": "number",
            "sending_currency": "string"
          }
        },
        {
          "name": "confirm_transaction",
          "method": "POST", 
          "path": "/amr/ras/api/v1_0/ras/confirmtransaction",
          "description": "Confirm transaction using quote ID",
          "required_headers": ["Authorization", "sender", "channel", "company", "branch"],
          "parameters": {
            "quote_id": "string"
          }
        }
      ],
      "paas": [
        {
          "name": "authorize_clearance",
          "method": "POST",
          "path": "/amr/paas/api/v1_0/paas/authorize-clearance",
          "description": "Authorize payment clearance",
          "required_headers": ["Authorization", "sender", "channel", "company", "branch"]
        },
        {
          "name": "enquire_transaction",
          "method": "GET",
          "path": "/amr/paas/api/v1_0/paas/enquire-transaction",
          "description": "Check transaction status",
          "required_headers": ["Authorization"],
          "parameters": {
            "transaction_ref_number": "string (query param)"
          }
        }
      ]
    }
  }
};

export const integrationPatterns = {
  'token-manager.ts': `// Production Token Manager Pattern
export class TokenManager {
  private token: string | null = null;
  private expiresAt: number = 0;
  private refreshPromise: Promise<string> | null = null;
  
  async getValidToken(): Promise<string> {
    const now = Date.now();
    const buffer = 5 * 60 * 1000; // 5 minutes buffer
    
    if (this.token && now < (this.expiresAt - buffer)) {
      return this.token;
    }
    
    // Prevent multiple concurrent refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    
    this.refreshPromise = this.refreshToken();
    try {
      const token = await this.refreshPromise;
      this.refreshPromise = null;
      return token;
    } catch (error) {
      this.refreshPromise = null;
      throw error;
    }
  }
  
  private async refreshToken(): Promise<string> {
    // Implementation here
    return 'token';
  }
}`,
  
  'retry-handler.ts': `// Production Retry Handler Pattern
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry client errors
      if (error instanceof Error && error.message.includes('4')) {
        throw error;
      }
      
      if (attempt === maxRetries) break;
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}`,
  
  'callback-verifier.ts': agentIntegrationTemplates.callbackTemplate
};

export const promptTemplates = {
  'structured-agent-prompt.txt': `You are a financial services AI agent that helps users with cross-border payments and remittances using the Digit9 worldAPI.

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

Current user request: [USER_INPUT]`,

  'error-handling-prompt.txt': `## Error Handling Instructions:

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

Never guess about transaction completion - always verify through proper channels.`,

  'validation-prompt.txt': `## Input Validation Protocol:

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
