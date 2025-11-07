import { Theme, APIEndpoint } from '../types';
import ScrollRevealContainer from '../components/ScrollRevealContainer';
import ApiEndpointCard from '../components/ApiEndpointCard';

interface BeneficiaryPageProps {
  theme: Theme;
}

const BeneficiaryPage = ({ theme }: BeneficiaryPageProps) => {

  // Handler for Try It Now button - uses proxy server pattern like APIReferencePage
  const handleTryIt = async (
    endpoint: APIEndpoint,
    requestBody: string,
    headers: Record<string, string>,
    queryParams?: Record<string, string>,
    pathParams?: Record<string, string>
  ): Promise<string> => {
    try {
      // Use the proxy server at /api (proxied by Vite to localhost:3001)
      const baseUrl = '/api';
      
      // Construct the full URL
      let url = `${baseUrl}${endpoint.path}`;
      
      // Replace path parameters if provided
      if (pathParams && Object.keys(pathParams).length > 0) {
        Object.entries(pathParams).forEach(([key, value]) => {
          const placeholder = `{${key}}`;
          if (url.includes(placeholder)) {
            url = url.replace(placeholder, value || '');
          }
        });
      }
      
      // Add query parameters if provided
      if (queryParams && Object.keys(queryParams).length > 0) {
        const urlParams = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value && value.trim() !== '') {
            urlParams.append(key, value);
          }
        });
        if (urlParams.toString()) {
          url += `?${urlParams.toString()}`;
        }
      }
      
      console.log(`🚀 Making API call to: ${url}`);
      console.log('📝 Request body:', requestBody);
      console.log('📋 Headers:', headers);
      
      // Make the API call
      const response = await fetch(url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: endpoint.method !== 'GET' ? requestBody : undefined,
      });
      
      // Get response text
      const responseText = await response.text();
      
      // Try to parse as JSON for better formatting
      try {
        const responseJson = JSON.parse(responseText);
        return JSON.stringify(responseJson, null, 2);
      } catch {
        return responseText || `Status: ${response.status} ${response.statusText}`;
      }
    } catch (error) {
      console.error('❌ API Error:', error);
      return JSON.stringify({
        error: 'API Request Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Please check your network connection and ensure the proxy server is running'
      }, null, 2);
    }
  };

  const beneficiaryEndpoints: APIEndpoint[] = [
    {
      id: 'beneficiary-onboarding',
      title: 'Beneficiary Onboarding',
      method: 'POST',
      path: '/caas-lcm/api/v1/CAAS/onBoarding/beneficiary',
      description: 'Create a new beneficiary profile for remittance transactions',
      requestHeaders: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {access_token}'
      },
      requestBody: `{
  "customer_ecrn": "CUST123456",
  "first_name": "John",
  "middle_name": "David",
  "last_name": "Smith",
  "date_of_birth": "1990-05-15",
  "nationality": "PK",
  "gender": "M",
  "relationship_code": "32",
  "mobile_number": "+923001234567",
  "email": "john.smith@example.com",
  "address": {
    "address_type": "PRESENT",
    "address_line": "House 123, Street 45",
    "town_name": "Karachi",
    "district": "Karachi",
    "state": "Sindh",
    "country_code": "PK",
    "post_code": "75500"
  },
  "bank_details": {
    "account_type_code": "1",
    "account_number": "1234567890",
    "routing_code": "ABCD0001234",
    "bank_name": "Example Bank",
    "bank_branch": "Main Branch",
    "bank_country": "PK"
  },
  "id_details": [{
    "id_type": "4",
    "id_number": "12345-6789012-3",
    "issued_on": "2020-01-01",
    "expiry_date": "2030-01-01",
    "issuing_country": "PK"
  }]
}`,
      responseBody: `{
  "status": "success",
  "message": "Beneficiary created successfully",
  "data": {
    "beneficiary_profile_id": "BEN123456",
    "ecrn": "CUST123456",
    "status": "ACTIVE",
    "created_date": "2024-01-01T00:00:00Z"
  }
}`,
      codeExamples: [
        {
          language: 'curl',
          label: 'cURL',
          code: `curl -X POST "http://localhost:3001/api/caas-lcm/api/v1/CAAS/onBoarding/beneficiary" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
-d '{
  "customer_ecrn": "CUST123456",
  "first_name": "John",
  "last_name": "Smith",
  "date_of_birth": "1990-05-15",
  "nationality": "PK",
  "mobile_number": "+923001234567",
  "relationship_code": "32"
}'`
        },
        {
          language: 'javascript',
          label: 'JavaScript',
          code: `const response = await fetch('http://localhost:3001/api/caas-lcm/api/v1/CAAS/onBoarding/beneficiary', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${accessToken}\`
  },
  body: JSON.stringify({
    customer_ecrn: 'CUST123456',
    first_name: 'John',
    last_name: 'Smith',
    date_of_birth: '1990-05-15',
    nationality: 'PK',
    mobile_number: '+923001234567',
    relationship_code: '32'
  })
});

const data = await response.json();
console.log(data);`
        },
        {
          language: 'python',
          label: 'Python',
          code: `import requests
import json

url = "http://localhost:3001/api/caas-lcm/api/v1/CAAS/onBoarding/beneficiary"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {access_token}"
}
payload = {
    "customer_ecrn": "CUST123456",
    "first_name": "John",
    "last_name": "Smith",
    "date_of_birth": "1990-05-15",
    "nationality": "PK",
    "mobile_number": "+923001234567",
    "relationship_code": "32"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
data = response.json()
print(data)`
        }
      ],
      responses: [{
        status: 200,
        description: 'Successful beneficiary onboarding',
        example: {
          status: 'success',
          message: 'Beneficiary created successfully',
          data: {
            beneficiary_profile_id: 'BEN123456',
            status: 'ACTIVE'
          }
        }
      }],
      guidelines: `
<h5>Beneficiary Onboarding Guidelines</h5>
<ul>
  <li>Customer ECRN must be a valid existing customer reference</li>
  <li>All mandatory KYC fields must be provided</li>
  <li>Bank details are required for bank transfer remittances</li>
  <li>Relationship code defines the relationship between customer and beneficiary</li>
  <li>ID details must include at least one valid identification document</li>
</ul>`
    },
    {
      id: 'get-beneficiary-by-ecrn',
      title: 'Get Beneficiary By Ecrn',
      method: 'GET',
      path: '/caas-lcm/api/v1/CAAS/beneficiary/{ecrn}/{beneficiary_profile_id}',
      description: 'Retrieve detailed information about a specific beneficiary using customer ECRN and beneficiary profile ID',
      requestHeaders: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {access_token}'
      },
      pathParams: [
        { name: 'ecrn', description: 'Customer Entity Reference Number', required: true },
        { name: 'beneficiary_profile_id', description: 'Beneficiary Profile ID', required: true }
      ],
      requestBody: '',
      responseBody: `{
  "status": "success",
  "data": {
    "beneficiary_profile_id": "BEN123456",
    "customer_ecrn": "CUST123456",
    "first_name": "John",
    "middle_name": "David",
    "last_name": "Smith",
    "date_of_birth": "1990-05-15",
    "nationality": "PK",
    "gender": "M",
    "relationship_code": "32",
    "mobile_number": "+923001234567",
    "email": "john.smith@example.com",
    "address": {
      "address_line": "House 123, Street 45",
      "town_name": "Karachi",
      "country_code": "PK"
    },
    "bank_details": {
      "account_number": "****7890",
      "bank_name": "Example Bank"
    },
    "status": "ACTIVE",
    "created_date": "2024-01-01T00:00:00Z",
    "updated_date": "2024-01-15T00:00:00Z"
  }
}`,
      codeExamples: [
        {
          language: 'curl',
          label: 'cURL',
          code: `curl -X GET "http://localhost:3001/api/caas-lcm/api/v1/CAAS/beneficiary/CUST123456/BEN123456" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"`
        },
        {
          language: 'javascript',
          label: 'JavaScript',
          code: `const ecrn = 'CUST123456';
const beneficiaryId = 'BEN123456';

const response = await fetch(\`http://localhost:3001/api/caas-lcm/api/v1/CAAS/beneficiary/\${ecrn}/\${beneficiaryId}\`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${accessToken}\`
  }
});

const data = await response.json();
console.log(data);`
        },
        {
          language: 'python',
          label: 'Python',
          code: `import requests

ecrn = "CUST123456"
beneficiary_id = "BEN123456"
url = f"http://localhost:3001/api/caas-lcm/api/v1/CAAS/beneficiary/{ecrn}/{beneficiary_id}"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {access_token}"
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`
        }
      ],
      responses: [{
        status: 200,
        description: 'Successful retrieval',
        example: {
          status: 'success',
          data: {
            beneficiary_profile_id: 'BEN123456',
            first_name: 'John',
            last_name: 'Smith',
            status: 'ACTIVE'
          }
        }
      }],
      guidelines: `
<h5>Retrieval Guidelines</h5>
<ul>
  <li>Both customer ECRN and beneficiary profile ID are required</li>
  <li>Returns complete beneficiary profile with KYC details</li>
  <li>Sensitive information like full account numbers may be masked</li>
  <li>Only active beneficiaries can be used for transactions</li>
</ul>`
    },
    {
      id: 'get-beneficiaries-list',
      title: 'Get Beneficiaries List',
      method: 'GET',
      path: '/caas-lcm/api/v1/CAAS/beneficiaries',
      description: 'Retrieve a list of all beneficiaries for a specific customer',
      requestHeaders: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {access_token}'
      },
      queryParams: [
        { name: 'customer_ecrn', description: 'Customer Entity Reference Number', required: false, defaultValue: '' },
        { name: 'page', description: 'Page number', required: false, defaultValue: '1' },
        { name: 'size', description: 'Page size', required: false, defaultValue: '10' },
        { name: 'status', description: 'Filter by status (ACTIVE, INACTIVE, BLOCKED)', required: false, defaultValue: '' }
      ],
      requestBody: '',
      responseBody: `{
  "status": "success",
  "data": {
    "content": [
      {
        "beneficiary_profile_id": "BEN123456",
        "first_name": "John",
        "last_name": "Smith",
        "mobile_number": "+923001234567",
        "nationality": "PK",
        "relationship_code": "32",
        "status": "ACTIVE",
        "created_date": "2024-01-01T00:00:00Z"
      },
      {
        "beneficiary_profile_id": "BEN123457",
        "first_name": "Jane",
        "last_name": "Doe",
        "mobile_number": "+923007654321",
        "nationality": "IN",
        "relationship_code": "41",
        "status": "ACTIVE",
        "created_date": "2024-01-05T00:00:00Z"
      }
    ],
    "page": 1,
    "size": 10,
    "total_elements": 2,
    "total_pages": 1
  }
}`,
      codeExamples: [
        {
          language: 'curl',
          label: 'cURL',
          code: `curl -X GET "http://localhost:3001/api/caas-lcm/api/v1/CAAS/beneficiaries?customer_ecrn=CUST123456&page=1&size=10" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"`
        },
        {
          language: 'javascript',
          label: 'JavaScript',
          code: `const customerEcrn = 'CUST123456';
const page = 1;
const size = 10;

const response = await fetch(\`http://localhost:3001/api/caas-lcm/api/v1/CAAS/beneficiaries?customer_ecrn=\${customerEcrn}&page=\${page}&size=\${size}\`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${accessToken}\`
  }
});

const data = await response.json();
console.log(data);`
        },
        {
          language: 'python',
          label: 'Python',
          code: `import requests

url = "http://localhost:3001/api/caas-lcm/api/v1/CAAS/beneficiaries"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {access_token}"
}
params = {
    "customer_ecrn": "CUST123456",
    "page": 1,
    "size": 10
}

response = requests.get(url, headers=headers, params=params)
data = response.json()
print(data)`
        }
      ],
      responses: [{
        status: 200,
        description: 'Successful list retrieval',
        example: {
          status: 'success',
          data: {
            content: [
              {
                beneficiary_profile_id: 'BEN123456',
                first_name: 'John',
                last_name: 'Smith',
                status: 'ACTIVE'
              }
            ],
            total_elements: 1
          }
        }
      }],
      guidelines: `
<h5>List Retrieval Guidelines</h5>
<ul>
  <li>Customer ECRN is required to filter beneficiaries</li>
  <li>Results are paginated with default size of 10</li>
  <li>Use status filter to get only active beneficiaries for transactions</li>
  <li>List includes summary information only; use Get Beneficiary By ECRN for full details</li>
</ul>`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ScrollRevealContainer>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Beneficiary Onboarding
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            APIs for managing beneficiary profiles and information. These endpoints allow you to create, retrieve, and list beneficiaries for remittance transactions.
          </p>
        </div>
      </ScrollRevealContainer>

      <div className="space-y-6">
        {beneficiaryEndpoints.map(endpoint => (
          <ScrollRevealContainer key={endpoint.id}>
            <ApiEndpointCard
              method={endpoint.method}
              path={endpoint.path}
              title={endpoint.title}
              description={endpoint.description}
              requestBody={endpoint.requestBody}
              requestHeaders={endpoint.requestHeaders}
              responseBody={endpoint.responseBody}
              pathParams={endpoint.pathParams}
              queryParams={endpoint.queryParams}
              codeExamples={endpoint.codeExamples}
              theme={theme}
              onTryIt={(requestBody, headers, queryParams, pathParams) => 
                handleTryIt(endpoint, requestBody, headers, queryParams, pathParams)
              }
            />
          </ScrollRevealContainer>
        ))}
      </div>
    </div>
  );
};

export default BeneficiaryPage;

