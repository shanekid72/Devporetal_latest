import { Lock, CheckCircle2, Globe, ArrowDown } from 'lucide-react';
import ScrollRevealContainer from '../components/ScrollRevealContainer';
import CodeBlock from '../components/CodeBlock';
import Alert from '../components/Alert';
import AskPageSection from '../components/AskPageSection';
import { Theme } from '../types';

interface AuthenticationPageProps {
  theme: Theme;
}

const AuthenticationPage: React.FC<AuthenticationPageProps> = ({ theme }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <ScrollRevealContainer>
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Authentication
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            The Digit9 worldAPI uses OAuth 2.0 with JWT tokens for authentication. All API requests must be made over HTTPS and include a valid access token.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition"
            >
              Get Started
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
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
              https://drap-sandbox.digitnine.com
            </code>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            API Keys
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-4">
            <p>
              The Digit9 worldAPI uses OAuth 2.0 for authentication. You authenticate to our API by providing one of your
              API keys in the request. You can manage your API keys from your account dashboard. Your API keys carry
              many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible
              areas such as GitHub, client-side code, and so forth.
            </p>
          </div>
          
          <Alert variant="warning" title="Keep your keys secure">
            Do not share your API keys in publicly accessible areas such as GitHub, client-side code, or so forth.
          </Alert>

          <div className="mt-6 prose prose-lg dark:prose-invert max-w-none">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All API requests must be made over HTTPS. Calls made over plain HTTP will fail.
            </p>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Obtaining an Access Token
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <p>
              To get an access token, you need to make a POST request to the authentication endpoint with your
              credentials. The endpoint returns a JSON object containing your credentials, which includes the
              access token and refresh token.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Request</h3>
            <CodeBlock
              theme={theme}
              examples={[
                {
                  language: 'bash',
                  label: 'cURL',
                  code: `curl -X POST 'https://drap-sandbox.digitnine.com/auth/realms/cdp/protocol/openid-connect/token' \\
  -H 'Content-Type: application/x-www-form-urlencoded' \\
  -d 'username=testagentae&password=******&grant_type=password&client_id=cdp_app&client_secret=******'`
                },
                {
                  language: 'javascript',
                  label: 'JavaScript',
                  code: `const response = await fetch('https://drap-sandbox.digitnine.com/auth/realms/cdp/protocol/openid-connect/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    username: 'testagentae',
    password: '******',
    grant_type: 'password',
    client_id: 'cdp_app',
    client_secret: '******'
  })
});

const data = await response.json();`
                },
                {
                  language: 'python',
                  label: 'Python',
                  code: `import requests

url = 'https://drap-sandbox.digitnine.com/auth/realms/cdp/protocol/openid-connect/token'
headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
}
data = {
    'username': 'testagentae',
    'password': '******',
    'grant_type': 'password',
    'client_id': 'cdp_app',
    'client_secret': '******'
}

response = requests.post(url, headers=headers, data=data)
result = response.json()`
                }
              ]}
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Response</h3>
            <CodeBlock
              theme={theme}
              language="json"
              code={`{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "not-before-policy": 0,
  "session_state": "a2fa1d03-36eb-4a75-a142-dc1dd7c1a7a2"
}`}
            />
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
              Include the access token in the Authorization header of all API requests using the Bearer token format:
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Authenticated Request</h3>
            <CodeBlock
              theme={theme}
              examples={[
                {
                  language: 'bash',
                  label: 'cURL',
                  code: `curl 'https://drap-sandbox.digitnine.com/api/v1/remittance/calculate' \\
  -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...' \\
  -H 'Content-Type: application/json' \\
  -H 'sender: testagentae' \\
  -H 'channel: RAAS' \\
  -H 'company: TN2450' \\
  -H 'branch: TN2450'`
                },
                {
                  language: 'javascript',
                  label: 'JavaScript',
                  code: `const response = await fetch('https://drap-sandbox.digitnine.com/api/v1/remittance/calculate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    'Content-Type': 'application/json',
    'sender': 'testagentae',
    'channel': 'RAAS',
    'company': 'TN2450',
    'branch': 'TN2450'
  }
});`
                }
              ]}
            />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Required Headers</h3>
            <p>
              In addition to the Authorization header, most API endpoints require the following headers:
            </p>
            
            <ul className="space-y-2 mb-4">
              <li><code className="text-sm">Content-Type</code>: application/json</li>
              <li><code className="text-sm">sender</code>: Your agent code (e.g., testagentae)</li>
              <li><code className="text-sm">channel</code>: The channel code (e.g., RAAS)</li>
              <li><code className="text-sm">company</code>: Your company ID</li>
              <li><code className="text-sm">branch</code>: Your branch ID</li>
            </ul>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Token Lifecycle
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <p>
              Access tokens expire after a short period (typically 5 minutes / 300 seconds). When an access token expires,
              you can use the refresh token to obtain a new access token without requiring the user to re-authenticate.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Refresh Token Request</h3>
            <CodeBlock
              theme={theme}
              language="bash"
              code={`curl -X POST 'https://drap-sandbox.digitnine.com/auth/realms/cdp/protocol/openid-connect/token' \\
  -H 'Content-Type: application/x-www-form-urlencoded' \\
  -d 'grant_type=refresh_token&client_id=cdp_app&client_secret=******&refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'`}
            />
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              The response will contain a new access token and refresh token. Refresh tokens have a longer lifetime
              (typically 30 minutes / 1800 seconds) but also expire eventually. When a refresh token expires, the user
              will need to re-authenticate.
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
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Keep secrets secure</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Never expose your client secret or user credentials in client-side code
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
                  Store tokens securely, preferably in memory or secure storage
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
                  Set up token refresh logic to maintain user sessions seamlessly
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
                  Set up proper error handling for authentication failures
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
                  All API requests must be made over HTTPS for security
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
                  Track token expiration times to proactively refresh before expiry
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Error Handling
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <p>
              The Digit9 worldAPI uses conventional HTTP response codes to indicate the success or failure of an API request.
              Codes in the 2xx range indicate success, codes in the 4xx range indicate an error that failed given the
              information provided.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">HTTP Status Code Summary</h3>
            
            <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                200
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">OK</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Everything worked as expected.
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
                  No valid API key provided or invalid credentials.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                403
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Forbidden</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The API key doesn't have permissions to perform the request.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                429
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Too Many Requests</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Too many requests hit the API too quickly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealContainer>
    </div>
  );
};

export default AuthenticationPage;