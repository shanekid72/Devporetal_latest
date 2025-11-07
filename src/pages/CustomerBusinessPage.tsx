import { Theme, APIEndpoint } from '../types';
import ScrollRevealContainer from '../components/ScrollRevealContainer';
import ApiEndpointCard from '../components/ApiEndpointCard';

interface CustomerBusinessPageProps {
  theme: Theme;
}

const CustomerBusinessPage = ({ theme }: CustomerBusinessPageProps) => {
  
  // API Base URL - Update this to your sandbox or production URL
  const API_BASE_URL = 'https://drap-sandbox.digitnine.com';

  // Handler for Try It Now button - creates a closure for each endpoint
  const createHandleTryIt = (endpoint: APIEndpoint) => async (
    requestBody: string,
    headers: Record<string, string>,
    queryParams?: Record<string, string>,
    pathParams?: Record<string, string>
  ): Promise<string> => {
    try {
      // Build the full URL
      let apiPath = endpoint.path;
      
      // Replace path parameters if any
      if (pathParams) {
        Object.entries(pathParams).forEach(([key, value]) => {
          apiPath = apiPath.replace(`{${key}}`, value);
        });
      }

      // Add query parameters
      const queryString = queryParams && Object.keys(queryParams).length > 0
        ? '?' + new URLSearchParams(queryParams).toString()
        : '';

      const fullUrl = `${API_BASE_URL}${apiPath}${queryString}`;

      console.log('🚀 Making API request to:', fullUrl);
      console.log('📝 Request body:', requestBody);
      console.log('📋 Headers:', headers);

      // Make the API call
      const response = await fetch(fullUrl, {
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
        // If not JSON, return as-is
        return responseText || `Status: ${response.status} ${response.statusText}`;
      }
    } catch (error) {
      console.error('❌ API Error:', error);
      return JSON.stringify({
        error: 'API Request Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Please check your network connection and API credentials'
      }, null, 2);
    }
  };

  const corporateCustomerEndpoints: APIEndpoint[] = [
    {
      id: 'corporate-customer-onboarding',
      title: 'Corporate Customer Onboarding',
      method: 'POST',
      path: '/caas-lcm/api/v1/CAAS/onBoarding/corporatecustomer',
      description: 'Create a new corporate customer profile with complete KYC information',
      requestHeaders: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {access_token}'
      },
      requestBody: `{
  "agent_location_id": "string",
  "updated_by": "string",
  "fax_no": "string",
  "referred_by": "string",
  "referred_by_type": "string",
  "corporate_category": 0,
  "nature_of_corporate": 0,
  "channel": "Direct",
  "ecrn": "string",
  "legal_name": "Example Corporation Ltd",
  "country": "AE",
  "state": "Dubai",
  "district": "Dubai",
  "city": "Dubai",
  "office_bldg_number": "123",
  "building_name": "Business Tower",
  "street_name": "Sheikh Zayed Road",
  "po_box": 12345,
  "zip_code": 0,
  "post_code": 12345,
  "landmark": "Near Mall",
  "primary_mobile_number": "+971501234567",
  "phone_number": "+97143001234",
  "company_code": "string",
  "email": "info@example.com",
  "website": "https://www.example.com",
  "number_of_employees": 50,
  "inception_date": "2020-01-01",
  "company_logo": {
    "base64_data": "string",
    "content_type": "image/png",
    "document_id": "string",
    "issued_on": "2024-01-01",
    "date_of_expiry": "2025-01-01"
  },
  "risk_category": "LOW",
  "profile_status": "ACTIVE",
  "industry_type": "IT",
  "type_of_business": "Services",
  "credit_limit": "100000",
  "credit_period": "30",
  "pan": "string",
  "business_functions": "Software Development",
  "trn": "123456789012345",
  "trn_issued_country": "AE",
  "preferred_services": "Remittance",
  "is_fatca": false,
  "is_pep": false,
  "company_address": "Business Tower, Sheikh Zayed Road, Dubai",
  "ubo_details": [{
    "ubo_detail": {},
    "designation_id": "string"
  }],
  "executive_details": [{
    "executive_ecrn": "string",
    "designation_id": "string",
    "active_status": "ACTIVE",
    "executive_id": {
      "base64_data": "string",
      "content_type": "string",
      "document_id": "string",
      "issued_on": "2024-01-01",
      "date_of_expiry": "2025-01-01"
    }
  }],
  "account_details": {}
}`,
      responseBody: `{
  "status": "success",
  "message": "Corporate customer created successfully",
  "data": {
    "ecrn": "CORP123456",
    "customer_id": "12345",
    "status": "ACTIVE"
  }
}`,
      codeExamples: [
        {
          language: 'curl',
          label: 'cURL',
          code: `curl -X POST "http://localhost:3001/api/caas-lcm/api/v1/CAAS/onBoarding/corporatecustomer" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
-d '{
  "legal_name": "Example Corporation Ltd",
  "country": "AE",
  "city": "Dubai",
  "primary_mobile_number": "+971501234567",
  "email": "info@example.com",
  "trn": "123456789012345",
  "channel": "Direct"
}'`
        },
        {
          language: 'javascript',
          label: 'JavaScript',
          code: `const response = await fetch('http://localhost:3001/api/caas-lcm/api/v1/CAAS/onBoarding/corporatecustomer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${accessToken}\`
  },
  body: JSON.stringify({
    legal_name: 'Example Corporation Ltd',
    country: 'AE',
    city: 'Dubai',
    primary_mobile_number: '+971501234567',
    email: 'info@example.com',
    trn: '123456789012345',
    channel: 'Direct'
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

url = "http://localhost:3001/api/caas-lcm/api/v1/CAAS/onBoarding/corporatecustomer"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {access_token}"
}
payload = {
    "legal_name": "Example Corporation Ltd",
    "country": "AE",
    "city": "Dubai",
    "primary_mobile_number": "+971501234567",
    "email": "info@example.com",
    "trn": "123456789012345",
    "channel": "Direct"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
data = response.json()
print(data)`
        }
      ],
      responses: [{
        status: 200,
        description: 'Successful corporate customer onboarding',
        example: {
          status: 'success',
          message: 'Corporate customer created successfully',
          data: {
            ecrn: 'CORP123456',
            customer_id: '12345',
            status: 'ACTIVE'
          }
        }
      }],
      guidelines: `
<h5>Corporate Customer Onboarding Guidelines</h5>
<ul>
  <li>All mandatory fields must be provided</li>
  <li>TRN must be a valid 15-digit Tax Registration Number</li>
  <li>Company logo should be base64 encoded</li>
  <li>UBO (Ultimate Beneficial Owner) details are required for compliance</li>
  <li>Executive details must include at least one authorized signatory</li>
</ul>`
    },
    {
      id: 'corporate-search',
      title: 'Corporate Search API',
      method: 'GET',
      path: '/caas-lcm/api/v1/CAAS/search/corporatecustomer',
      description: 'Search for corporate customers by various criteria',
      requestHeaders: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {access_token}'
      },
      queryParams: [
        { name: 'search_term', description: 'Search term (company name, TRN, email, etc.)', required: false, defaultValue: '' },
        { name: 'page', description: 'Page number', required: false, defaultValue: '1' },
        { name: 'size', description: 'Page size', required: false, defaultValue: '10' }
      ],
      requestBody: '',
      responseBody: `{
  "status": "success",
  "data": {
    "content": [
      {
        "ecrn": "CORP123456",
        "legal_name": "Example Corporation Ltd",
        "email": "info@example.com",
        "phone_number": "+97143001234",
        "trn": "123456789012345",
        "status": "ACTIVE",
        "created_date": "2024-01-01T00:00:00Z"
      }
    ],
    "page": 1,
    "size": 10,
    "total_elements": 1,
    "total_pages": 1
  }
}`,
      codeExamples: [
        {
          language: 'curl',
          label: 'cURL',
          code: `curl -X GET "http://localhost:3001/api/caas-lcm/api/v1/CAAS/search/corporatecustomer?search_term=Example&page=1&size=10" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"`
        },
        {
          language: 'javascript',
          label: 'JavaScript',
          code: `const searchTerm = 'Example';
const page = 1;
const size = 10;

const response = await fetch(\`http://localhost:3001/api/caas-lcm/api/v1/CAAS/search/corporatecustomer?search_term=\${searchTerm}&page=\${page}&size=\${size}\`, {
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

url = "http://localhost:3001/api/caas-lcm/api/v1/CAAS/search/corporatecustomer"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {access_token}"
}
params = {
    "search_term": "Example",
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
        description: 'Successful search',
        example: {
          status: 'success',
          data: {
            content: [
              {
                ecrn: 'CORP123456',
                legal_name: 'Example Corporation Ltd',
                email: 'info@example.com',
                status: 'ACTIVE'
              }
            ],
            page: 1,
            size: 10,
            total_elements: 1
          }
        }
      }],
      guidelines: `
<h5>Search Guidelines</h5>
<ul>
  <li>Search term can be company name, TRN, email, or ECRN</li>
  <li>Results are paginated with default size of 10</li>
  <li>Use wildcard matching for partial searches</li>
</ul>`
    },
    {
      id: 'get-corporate-customer',
      title: 'Get Corporate Customer API',
      method: 'GET',
      path: '/caas-lcm/api/v1/CAAS/corporatecustomer/{ecrn}',
      description: 'Retrieve detailed information about a specific corporate customer by ECRN',
      requestHeaders: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {access_token}'
      },
      pathParams: [
        { name: 'ecrn', description: 'Entity Customer Reference Number', required: true }
      ],
      requestBody: '',
      responseBody: `{
  "status": "success",
  "data": {
    "ecrn": "CORP123456",
    "legal_name": "Example Corporation Ltd",
    "country": "AE",
    "city": "Dubai",
    "primary_mobile_number": "+971501234567",
    "email": "info@example.com",
    "website": "https://www.example.com",
    "trn": "123456789012345",
    "status": "ACTIVE",
    "company_logo": {
      "document_id": "DOC123",
      "content_type": "image/png"
    },
    "executive_details": [],
    "ubo_details": [],
    "created_date": "2024-01-01T00:00:00Z",
    "updated_date": "2024-01-15T00:00:00Z"
  }
}`,
      codeExamples: [
        {
          language: 'curl',
          label: 'cURL',
          code: `curl -X GET "http://localhost:3001/api/caas-lcm/api/v1/CAAS/corporatecustomer/CORP123456" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"`
        },
        {
          language: 'javascript',
          label: 'JavaScript',
          code: `const ecrn = 'CORP123456';

const response = await fetch(\`http://localhost:3001/api/caas-lcm/api/v1/CAAS/corporatecustomer/\${ecrn}\`, {
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

ecrn = "CORP123456"
url = f"http://localhost:3001/api/caas-lcm/api/v1/CAAS/corporatecustomer/{ecrn}"
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
            ecrn: 'CORP123456',
            legal_name: 'Example Corporation Ltd',
            status: 'ACTIVE'
          }
        }
      }],
      guidelines: `
<h5>Retrieval Guidelines</h5>
<ul>
  <li>ECRN must be a valid corporate customer reference number</li>
  <li>Returns complete customer profile including KYC documents</li>
  <li>Sensitive data may be masked based on user permissions</li>
</ul>`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ScrollRevealContainer>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Customer Onboarding - Business
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            APIs for managing corporate customer profiles, onboarding, and KYC verification. These endpoints allow you to create, search, and retrieve corporate customer information.
          </p>
        </div>
      </ScrollRevealContainer>

      <div className="space-y-6">
        {corporateCustomerEndpoints.map(endpoint => (
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
              onTryIt={createHandleTryIt(endpoint)}
            />
          </ScrollRevealContainer>
        ))}
      </div>
    </div>
  );
};

export default CustomerBusinessPage;

