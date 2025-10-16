import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, ArrowDown, CheckCircle, Download, Shield, AlertTriangle, Zap, Clock, Database } from 'lucide-react';
import { Theme } from '../../../types';
import CodeBlock from '../../../components/CodeBlock';
import AskPageSection from '../../../components/AskPageSection';
import { downloadZip } from '../../../utils/downloadUtils';
import { integrationPatterns } from '../../../data/agentTemplates';

interface IntegrationBestPracticesPageProps {
  theme?: Theme;
}

const IntegrationBestPracticesPage = ({ theme }: IntegrationBestPracticesPageProps) => {
  // Handle download of integration patterns library
  const handleDownloadPatterns = () => {
    const files = Object.entries(integrationPatterns).map(([name, content]) => ({
      name,
      content
    }));
    
    downloadZip(files, 'integration-patterns-library');
  };

  // Code examples for best practices
  const authExample = {
    language: 'typescript',
    label: 'Token Management',
    code: `class TokenManager {
  private token: string | null = null;
  private expiresAt: number = 0;
  
  async getValidToken(): Promise<string> {
    // Check if token is still valid (with 5-minute buffer)
    const now = Date.now();
    const buffer = 5 * 60 * 1000; // 5 minutes
    
    if (this.token && now < (this.expiresAt - buffer)) {
      return this.token;
    }
    
    // Fetch new token
    await this.refreshToken();
    return this.token!;
  }
  
  private async refreshToken(): Promise<void> {
    const response = await fetch(\`\${BASE_URL}/auth/realms/cdp/protocol/openid-connect/token\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: process.env.CLIENT_ID!,
        client_secret: process.env.CLIENT_SECRET!,
        username: process.env.USERNAME!,
        password: process.env.PASSWORD!,
      }),
    });
    
    if (!response.ok) {
      throw new Error(\`Token refresh failed: \${response.status}\`);
    }
    
    const data = await response.json();
    this.token = data.access_token;
    this.expiresAt = Date.now() + (data.expires_in * 1000);
  }
}`
  };

  const retryExample = {
    language: 'typescript',
    label: 'Retry Logic with Backoff',
    code: `async function apiCallWithRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof Error && error.message.includes('4')) {
        throw error;
      }
      
      // Don't retry on final attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      console.log(\`Attempt \${attempt + 1} failed, retrying in \${delay}ms...\`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// Usage
const result = await apiCallWithRetry(async () => {
  return await d9Post('/amr/ras/api/v1_0/ras/quote', payload, token);
});`
  };

  const callbackExample = {
    language: 'typescript',
    label: 'Callback Verification',
    code: `import crypto from 'crypto';

export function verifyCallbackIntegrity(
  rawPayload: string,
  preSharedSecret: string,
  receivedHash: string
): boolean {
  // Compute expected hash
  const expectedHash = crypto
    .createHash('sha512')
    .update(rawPayload + preSharedSecret)
    .digest('hex');
  
  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(expectedHash, 'hex'),
    Buffer.from(receivedHash, 'hex')
  );
}

// Express.js middleware for callback verification
export function callbackVerificationMiddleware(secret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
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

// Usage in route handler
app.post('/webhook/transaction-status', 
  callbackVerificationMiddleware(process.env.CALLBACK_SECRET!),
  (req, res) => {
    const { state, sub_state, transaction_ref_number } = req.body;
    
    // Process verified callback
    console.log(\`Transaction \${transaction_ref_number} is now \${state}/\${sub_state}\`);
    
    res.status(200).json({ received: true });
  }
);`
  };

  const masterDataExample = {
    language: 'python',
    label: 'Master Data Caching',
    code: `import time
from typing import Dict, Any, Optional
from dataclasses import dataclass

@dataclass
class CachedData:
    data: Any
    expires_at: float

class MasterDataManager:
    def __init__(self):
        self.cache: Dict[str, CachedData] = {}
        self.default_ttl = 3600  # 1 hour
    
    async def get_codes(self, force_refresh: bool = False) -> Dict[str, Any]:
        """Get system codes with caching"""
        cache_key = "codes"
        
        if not force_refresh and self._is_cached_valid(cache_key):
            return self.cache[cache_key].data
        
        # Fetch from API
        codes = await self._fetch_codes()
        self._cache_data(cache_key, codes)
        return codes
    
    async def get_corridors(self, force_refresh: bool = False) -> Dict[str, Any]:
        """Get service corridors with caching"""
        cache_key = "corridors"
        
        if not force_refresh and self._is_cached_valid(cache_key):
            return self.cache[cache_key].data
        
        corridors = await self._fetch_corridors()
        self._cache_data(cache_key, corridors)
        return corridors
    
    async def get_banks(self, country_code: str, force_refresh: bool = False) -> Dict[str, Any]:
        """Get banks by country with caching"""
        cache_key = f"banks_{country_code}"
        
        if not force_refresh and self._is_cached_valid(cache_key):
            return self.cache[cache_key].data
        
        banks = await self._fetch_banks(country_code)
        self._cache_data(cache_key, banks)
        return banks
    
    def _is_cached_valid(self, key: str) -> bool:
        """Check if cached data is still valid"""
        if key not in self.cache:
            return False
        return time.time() < self.cache[key].expires_at
    
    def _cache_data(self, key: str, data: Any, ttl: Optional[int] = None):
        """Cache data with TTL"""
        expires_at = time.time() + (ttl or self.default_ttl)
        self.cache[key] = CachedData(data=data, expires_at=expires_at)
    
    async def _fetch_codes(self) -> Dict[str, Any]:
        # Implementation to fetch codes from API
        pass
    
    async def _fetch_corridors(self) -> Dict[str, Any]:
        # Implementation to fetch corridors from API  
        pass
    
    async def _fetch_banks(self, country_code: str) -> Dict[str, Any]:
        # Implementation to fetch banks from API
        pass

# Usage
master_data = MasterDataManager()

# Get cached codes (or fetch if not cached)
codes = await master_data.get_codes()

# Force refresh
fresh_codes = await master_data.get_codes(force_refresh=True)`
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
          <li className="text-gray-900 dark:text-white">Integration</li>
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
            <Target className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Integration Best Practices
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Production-ready patterns for reliable Digit9 API integration
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
        <AskPageSection showButtons={false} notebookUrl="https://notebooklm.google.com/notebook/4a643500-a88f-4480-83ab-1ae4734c9d79?authuser=5" />
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
            This guide provides production-ready best practices for integrating with Digit9 APIs. 
            These patterns ensure reliability, security, and optimal performance for your agent implementations.
          </p>
        </div>
      </motion.section>

      {/* Authentication & Access */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-4">
            <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Authentication & Access</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Requirements</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Use HTTPS (TLS ≥ 1.2) for all communications</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Ensure IP/domain whitelisting for inbound/outbound traffic</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Store credentials securely using environment variables</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Implement proper token management and refresh logic</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Token Management</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Implement automatic token refresh with proper caching and expiry handling:
            </p>
            <CodeBlock theme={theme} examples={[authExample]} />
          </div>
        </div>
      </motion.section>

      {/* Master-Driven Design */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
            <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Master-Driven Design</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Principles</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Resolve Codes, Corridors, Banks/Branches before composing requests</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Never hard-code reason codes or enumerations</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Refresh master data on a scheduled basis</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Cache master data with appropriate TTL</span>
              </li>
            </ul>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Important</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Master data changes frequently. Always validate against current data rather than using static values.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Caching Strategy</h3>
            <CodeBlock theme={theme} examples={[masterDataExample]} />
          </div>
        </div>
      </motion.section>

      {/* Reliability & Retries */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-4">
            <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Reliability & Retries</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Retry Strategy</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Treat <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm">state/sub_state</code> as authoritative</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Poll with enquire or rely on callbacks</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Implement backoff for transient 5xx/504 errors</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Add app-level idempotency when re-issuing operations</span>
              </li>
            </ul>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Don't Retry</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Never retry 4xx errors (client errors). These indicate invalid requests that won't succeed on retry.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Implementation</h3>
            <CodeBlock theme={theme} examples={[retryExample]} />
          </div>
        </div>
      </motion.section>

      {/* Callbacks */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Callbacks</h2>
        </div>

        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Always verify callback integrity using SHA‑512 to ensure the data comes from Digit9 and hasn't been tampered with:
          </p>
          <CodeBlock theme={theme} examples={[callbackExample]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">✅ Callback Best Practices</h4>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>• Verify SHA-512 signature on every callback</li>
              <li>• Use timing-safe comparison for security</li>
              <li>• Ensure callback endpoints are reachable</li>
              <li>• Respond with 200 status for successful processing</li>
              <li>• Log callback deliveries (without secrets)</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">❌ Common Mistakes</h4>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>• Skipping signature verification</li>
              <li>• Using simple string comparison</li>
              <li>• Blocking callback endpoint with firewall</li>
              <li>• Not handling callback retries properly</li>
              <li>• Logging sensitive callback data</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Error Handling */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Error Handling</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-red-500 text-white rounded text-sm flex items-center justify-center mr-3">
                401
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Auth Errors</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Refresh token; ensure Authorization header is present</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded text-sm flex items-center justify-center mr-3">
                404
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Not Found</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Check endpoint URL and path parameters</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-yellow-500 text-white rounded text-sm flex items-center justify-center mr-3">
                422
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Validation</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Verify corridor/bank/branch/rate data from masters</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-orange-500 text-white rounded text-sm flex items-center justify-center mr-3">
                5xx
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Server Errors</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Retry with exponential backoff</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Business Error Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Configuration Issues</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Missing corridor/bank/branch</li>
                <li>• Invalid rate/charge</li>
                <li>• Limits/markup issues</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Processing Issues</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• AML pending</li>
                <li>• Already processed</li>
                <li>• Already cancelled</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">System Issues</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Network timeouts</li>
                <li>• Service unavailable</li>
                <li>• Rate limiting</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Observability */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
            <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Observability</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Logging Best Practices</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Log request/response identifiers (transaction_ref_number, quote_id)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Capture callback deliveries and hash verification results</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Track API response times and error rates</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Avoid logging sensitive fields unnecessarily</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monitoring Metrics</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Metrics</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• API response times (p50, p95, p99)</li>
                  <li>• Error rates by endpoint</li>
                  <li>• Token refresh frequency</li>
                  <li>• Callback verification success rate</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Alerts</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• High error rates (&gt; 5%)</li>
                  <li>• Authentication failures</li>
                  <li>• Callback verification failures</li>
                  <li>• Response time degradation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Operational Readiness */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Operational Readiness</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pre-Production Checklist</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Share expected traffic profiles with Digit9
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Configure required headers centrally
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Set up callback endpoint monitoring
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Test all error scenarios
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Implement proper secret management
                </li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configuration Management</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Environment-specific endpoints
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Separate credentials per environment
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Configurable retry policies
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Timeout configurations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Master data cache TTL settings
                </li>
              </ul>
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
              to="/agent-toolkit/best-practices/prompting"
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Prompting & Agents</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Learn best practices for agent prompting and design</p>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Link
              to="/agent-toolkit/reference/agent-tools"
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <ArrowDown className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Agent Tools Reference</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Complete API reference for all agent tools</p>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Integration Patterns Library</h3>
              <p className="text-gray-600 dark:text-gray-300">Production-ready code patterns and configuration templates</p>
            </div>
            <motion.button
              onClick={handleDownloadPatterns}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
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

export default IntegrationBestPracticesPage;
