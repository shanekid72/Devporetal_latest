import { motion } from 'framer-motion';
import { Key, Globe, CheckCircle2 } from 'lucide-react';
import ScrollRevealContainer from '../../../components/ScrollRevealContainer';
import ApiEndpointCard from '../../../components/ApiEndpointCard';
import AskPageSection from '../../../components/AskPageSection';
import Alert from '../../../components/Alert';
import { ewaApiEndpoints } from '../../../data/ewaApiEndpoints';
import { createApiTryItHandler } from '../../../utils/apiTryItHandler';
import { Theme } from '../../../types';

interface EWAAuthenticationPageProps {
  theme?: Theme;
}

const EWAAuthenticationPage: React.FC<EWAAuthenticationPageProps> = ({ theme = { mode: 'light' } }) => {
  const endpoint = ewaApiEndpoints.find(e => e.id === 'ewa-authentication');
  const handleTryIt = createApiTryItHandler();

  if (!endpoint) {
    return <div>Endpoint not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <ScrollRevealContainer>
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <Key className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              EWA Authentication
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            The EWA (Employee Wage Access) API uses OAuth 2.0 with JWT tokens for authentication. All API requests must be made over HTTPS and include a valid access token.
          </p>
        </div>
      </ScrollRevealContainer>

      {/* AskPage Section */}
      <ScrollRevealContainer>
        <AskPageSection showButtons={false} notebookUrl="https://notebooklm.google.com/notebook/09146d42-6d68-45e6-9f33-5a9587f9a2ad?authuser=5" />
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6" />
            BASE URL
          </h2>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <code className="text-lg font-mono text-gray-900 dark:text-gray-100">
              https://&#123;&#123;baseUrl&#125;&#125;/auth/realms/cdp/protocol/openid-connect/token
            </code>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Overview
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-4">
            <p>
              The EWA API uses OAuth 2.0 for authentication. An access token is the key to accessing any EWA API endpoint. 
              The authentication API returns an access token if the user is successfully authenticated and authorized. 
              Every access token is tagged with a validity period, and the expiry duration is returned in the response for 
              your application to manage accordingly.
            </p>
          </div>
          
          <Alert variant="warning" title="Keep your credentials secure">
            Do not share your client credentials or access tokens in publicly accessible areas such as GitHub, client-side code, or any public repositories.
          </Alert>

          <div className="mt-6 prose prose-lg dark:prose-invert max-w-none">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All API requests must be made over HTTPS. Calls made over plain HTTP will fail. A token that is used after its validity period will restrict access to any services.
            </p>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Authentication Endpoint
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <p>
              To obtain an access token, make a POST request to the authentication endpoint with your credentials. 
              The endpoint returns a JSON object containing the access token, refresh token, and expiration details.
            </p>
          </div>

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
            Token Lifecycle
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <p>
              Access tokens expire after a specified period (returned in the <code>expires_in</code> field, typically measured in seconds). 
              When an access token expires, you can use the refresh token to obtain a new access token without requiring 
              the user to re-authenticate.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Token Expiration Details</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="font-mono text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded mr-2">expires_in</span>
                <span>Access token expiry time in seconds (e.g., 7199 seconds = ~2 hours)</span>
              </li>
              <li className="flex items-start">
                <span className="font-mono text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded mr-2">refresh_expires_in</span>
                <span>Refresh token expiry time in seconds (e.g., 7199 seconds = ~2 hours)</span>
              </li>
            </ul>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              The response includes both an access token and a refresh token. Refresh tokens have a longer lifetime 
              but also expire eventually. When a refresh token expires, the user will need to re-authenticate using 
              their credentials.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              <strong>Best Practice:</strong> Implement automatic token refresh logic in your application to maintain 
              seamless user sessions. Monitor the <code>expires_in</code> value and refresh tokens proactively before expiration.
            </p>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3 p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Keep credentials secure</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Never expose your client_id, client_secret, or user credentials in client-side code or public repositories
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Secure token storage</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Store access tokens securely in memory or encrypted storage, never in plain text files
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Implement token refresh</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use refresh tokens to maintain sessions and avoid repeated authentication requests
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Handle errors gracefully</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Implement proper error handling for 401 (Unauthorized) responses and retry logic
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Use HTTPS always</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All EWA API requests must be made over HTTPS for security compliance
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Monitor token expiry</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track expires_in values and refresh tokens proactively before they expire
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Using the Access Token
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <p>
              After obtaining an access token, include it in the Authorization header of all subsequent EWA API requests 
              using the Bearer token format:
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <pre className="text-sm font-mono text-gray-900 dark:text-gray-100 overflow-x-auto">
{`Authorization: Bearer <your_access_token>
Content-Type: application/json`}
            </pre>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Example:</strong> When making a request to check EWA eligibility, include the Bearer token 
              in the Authorization header along with Content-Type set to application/json.
            </p>
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
              The EWA Authentication API uses standard HTTP response codes to indicate success or failure:
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
                  Authentication successful. Access token and refresh token returned.
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
                  Invalid credentials provided or credentials do not match any registered user.
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
                  Missing or invalid parameters in the authentication request.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealContainer>
    </div>
  );
};

export default EWAAuthenticationPage;
