import { useState, useEffect } from 'react';
import { Theme } from '../types';
import { APIEndpoint } from '../types';
import ScrollRevealContainer from '../components/ScrollRevealContainer';
import ApiEndpointCard from '../components/ApiEndpointCard';
import { paasApiSections } from './paasApiSections';

// Quote and transaction management
const getQuoteId = () => localStorage.getItem('raas_quote_id') || '';
const setQuoteId = (id: string) => {
  localStorage.setItem('raas_quote_id', id);
  console.log('💾 Quote ID saved:', id);
};

const getTransactionRefNumber = () => localStorage.getItem('raas_transaction_ref_number') || '';
const setTransactionRefNumber = (refNumber: string) => {
  localStorage.setItem('raas_transaction_ref_number', refNumber);
  console.log('💾 Transaction ref number saved:', refNumber);
};

interface RemittanceBusinessPageProps {
  theme?: Theme;
}

const RemittanceBusinessPage = ({ theme = 'light' }: RemittanceBusinessPageProps) => {
  const [portalType, setPortalType] = useState<string | null>(null);

  useEffect(() => {
    // Get portal type from localStorage
    const savedPortalType = localStorage.getItem('selected_portal_type');
    setPortalType(savedPortalType);

    // Listen for portal type changes
    const handlePortalTypeChange = () => {
      const newPortalType = localStorage.getItem('selected_portal_type');
      setPortalType(newPortalType);
    };

    window.addEventListener('portalTypeChanged', handlePortalTypeChange);
    return () => window.removeEventListener('portalTypeChanged', handlePortalTypeChange);
  }, []);

  const isPaaS = portalType === 'lfi';

  // RaaS Business Remittance APIs (White-labelled)
  const raasBusinessEndpoints: APIEndpoint[] = [
    {
      id: 'business-create-quote',
      title: 'Create Quote',
      method: 'POST',
      path: '/amr/ras/api/v1_0/ras/quote',
      description: 'Create a quote for a business remittance transaction',
      requestHeaders: {
        'Content-Type': 'application/json',
        'sender': 'testagentae',
        'channel': 'Direct',
        'company': '784825',
        'branch': '784826',
        'Authorization': 'Bearer {{access_token}}'
      },
      requestBody: `{
"sending_country_code": "AE",
"sending_currency_code": "AED",
"receiving_country_code": "PK",
"receiving_currency_code": "PKR",
"sending_amount": 300,
"receiving_mode": "BANK",
"type": "SEND",
"instrument": "REMITTANCE"
}`,
      responseBody: `{
"status": "success",
"status_code": "200",
"status_message": "Success",
"data": {
  "quote_id": "Q123456789",
  "sending_country_code": "AE",
  "sending_currency_code": "AED",
  "receiving_country_code": "IN",
  "receiving_currency_code": "INR",
  "sending_amount": 300,
  "receiving_amount": 14250.00,
  "total_payin_amount": 315.00,
  "fx_rates": [
    {
      "rate": 47.50,
      "base_currency_code": "AED",
      "counter_currency_code": "INR",
      "type": "SELL"
    }
  ],
  "fee_details": [
    {
      "type": "COMMISSION",
      "model": "OUR",
      "currency_code": "AED",
      "amount": 15.00,
      "description": "Commission"
    }
  ]
}
}`,
      codeExamples: [
        {
          language: 'curl',
          label: 'cURL',
          code: `curl -X POST "https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/quote" \\
-H "Content-Type: application/json" \\
-H "sender: testagentae" \\
-H "channel: Direct" \\
-H "company: 784825" \\
-H "branch: 784826" \\
-H "Authorization: Bearer {{access_token}}" \\
-d '{
  "sending_country_code": "AE",
  "sending_currency_code": "AED",
  "receiving_country_code": "PK",
  "receiving_currency_code": "PKR",
  "sending_amount": 300,
  "receiving_mode": "BANK",
  "type": "SEND",
  "instrument": "REMITTANCE"
}'`
        },
        {
          language: 'javascript',
          label: 'JavaScript',
          code: `const response = await fetch('http://localhost:3001/api/amr/ras/api/v1_0/ras/quote', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'sender': 'testagentae',
    'channel': 'Direct',
    'company': '784825',
    'branch': '784826',
    'Authorization': 'Bearer ' + accessToken
  },
  body: JSON.stringify({
    sending_country_code: "AE",
    sending_currency_code: "AED",
    receiving_country_code: "PK",
    receiving_currency_code: "PKR",
    sending_amount: 300,
    receiving_mode: "BANK",
    type: "SEND",
    instrument: "REMITTANCE"
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

url = "https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/quote"
headers = {
    "Content-Type": "application/json",
    "sender": "testagentae",
    "channel": "Direct",
    "company": "784825",
    "branch": "784826",
    "Authorization": f"Bearer {access_token}"
}
payload = {
    "sending_country_code": "AE",
    "sending_currency_code": "AED",
    "receiving_country_code": "PK",
    "receiving_currency_code": "PKR",
    "sending_amount": 300,
    "receiving_mode": "BANK",
    "type": "SEND",
    "instrument": "REMITTANCE"
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())`
        }
      ]
    },
    {
      id: 'business-create-transaction',
      title: 'Create Transaction',
      method: 'POST',
      path: '/amr/ras/api/v1_0/ras/createtransaction',
      description: 'Create a business remittance transaction',
      requestHeaders: {
        'Content-Type': 'application/json',
        'sender': 'testagentae',
        'channel': 'Direct',
        'company': '784825',
        'branch': '784826',
        'Authorization': 'Bearer {{access_token}}'
      },
      requestBody: `{
"type": "SEND",
"source_of_income": "SLRY",
"purpose_of_txn": "SAVG",
"instrument": "REMITTANCE",
"message": "Agency transaction",
"sender": {
  "customer_number": "7841003246699058"
},
"receiver": {
  "mobile_number": "+919586741508",
  "first_name": "Anija FirstName",
  "last_name": "Anija Lastname",
  "nationality": "IN",
  "relation_code": "32",
  "bank_details": {
    "account_type_code": "1",
    "iso_code": "BKIPPKKA",
    "iban": "PK12ABCD1234567891234567"
  }
},
"transaction": {
  "quote_id": "{{quote_id}}",
  "agent_transaction_ref_number": "{{quote_id}}"
}
}`,
      responseBody: `{
"status": "success",
"status_code": "200",
"status_message": "Success",
"data": {
  "transaction_ref_number": "T987654321",
  "transaction_status": "PENDING_CONFIRMATION"
}
}`,
      codeExamples: [
        {
          language: 'curl',
          label: 'cURL',
          code: `curl -X POST "https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/createtransaction" \\
-H "Content-Type: application/json" \\
-H "sender: testagentae" \\
-H "channel: Direct" \\
-H "company: 784825" \\
-H "branch: 784826" \\
-H "Authorization: Bearer {{access_token}}" \\
-d '{
  "type": "SEND",
  "source_of_income": "SLRY",
  "purpose_of_txn": "SAVG",
  "instrument": "REMITTANCE",
  "message": "Agency transaction",
  "sender": {
    "customer_number": "7841003246699058"
  },
  "receiver": {
    "mobile_number": "+919586741508",
    "first_name": "Anija FirstName",
    "last_name": "Anija Lastname",
    "nationality": "IN",
    "relation_code": "32",
    "bank_details": {
      "account_type_code": "1",
      "iso_code": "BKIPPKKA",
      "iban": "PK12ABCD1234567891234567"
    }
  },
  "transaction": {
    "quote_id": "{{quote_id}}",
    "agent_transaction_ref_number": "{{quote_id}}"
  }
}'`
        }
      ]
    },
    {
      id: 'business-confirm-transaction',
      title: 'Confirm Transaction',
      method: 'POST',
      path: '/amr/ras/api/v1_0/ras/confirmtransaction',
      description: 'Confirm a created business transaction',
      requestHeaders: {
        'Content-Type': 'application/json',
        'sender': 'testagentae',
        'channel': 'Direct',
        'company': '784825',
        'branch': '784826',
        'Authorization': 'Bearer {{access_token}}'
      },
      requestBody: `{
"transaction_ref_number": "{{transaction_ref_number}}"
}`,
      responseBody: `{
"status": "success",
"status_code": "200",
"status_message": "Success",
"data": {
  "transaction_ref_number": "T987654321",
  "transaction_status": "CONFIRMED"
}
}`,
      codeExamples: [
        {
          language: 'curl',
          label: 'cURL',
          code: `curl -X POST "https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/confirmtransaction" \\
-H "Content-Type: application/json" \\
-H "sender: testagentae" \\
-H "channel: Direct" \\
-H "company: 784825" \\
-H "branch: 784826" \\
-H "Authorization: Bearer {{access_token}}" \\
-d '{
  "transaction_ref_number": "{{transaction_ref_number}}"
}'`
        }
      ]
    },
    {
      id: 'business-enquire-transaction',
      title: 'Enquire Transaction',
      method: 'GET',
      path: '/amr/ras/api/v1_0/ras/enquire-transaction',
      description: 'Get details of a business transaction',
      queryParams: [
        {
          name: 'transaction_ref_number',
          type: 'string',
          required: true,
          description: 'Transaction reference number'
        }
      ],
      requestHeaders: {
        'Content-Type': 'application/json',
        'sender': 'testagentae',
        'channel': 'Direct',
        'company': '784825',
        'branch': '784826',
        'Authorization': 'Bearer {{access_token}}'
      },
      codeExamples: [
        {
          language: 'curl',
          label: 'cURL',
          code: `curl -X GET "https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/enquire-transaction?transaction_ref_number={{transaction_ref_number}}" \\
-H "Content-Type: application/json" \\
-H "sender: testagentae" \\
-H "channel: Direct" \\
-H "company: 784825" \\
-H "branch: 784826" \\
-H "Authorization: Bearer {{access_token}}"`
        }
      ]
    }
  ];

  // PaaS Business Remittance APIs (LFI) - Reference from paasApiSections
  const paasBusinessEndpoints: APIEndpoint[] = paasApiSections.remittance[0].endpoints.map(endpoint => ({
    ...endpoint,
    id: `lfi-business-${endpoint.id}`
  }));

  // Select endpoints based on portal type
  const endpoints = isPaaS ? paasBusinessEndpoints : raasBusinessEndpoints;

  // handleTryIt function
  const handleTryIt = async (
    endpoint: APIEndpoint,
    requestBody: string,
    headers: Record<string, string>,
    queryParams?: Record<string, string>,
    pathParams?: Record<string, string>
  ) => {
    try {
      const baseUrl = '/api';
      let url = `${baseUrl}${endpoint.path}`;

      // Add query parameters
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

      // Prepare headers
      const requestHeaders = new Headers();
      Object.entries(headers).forEach(([key, value]) => {
        if (value && !value.includes('{{')) {
          requestHeaders.append(key, value);
        }
      });

      // Add Authorization header if not present
      if (!endpoint.path.includes('/auth/realms/cdp/protocol/openid-connect/token')) {
        const token = localStorage.getItem('raas_access_token');
        if (token && !requestHeaders.has('Authorization')) {
          requestHeaders.append('Authorization', `Bearer ${token}`);
        }
      }

      // Replace placeholders in request body
      let finalRequestBody = requestBody;
      
      // Replace quote_id placeholder
      const quoteId = getQuoteId();
      if (quoteId && finalRequestBody.includes('{{quote_id}}')) {
        finalRequestBody = finalRequestBody.replace(/\{\{quote_id\}\}/g, quoteId);
        console.log('✅ Replaced {{quote_id}} with:', quoteId);
      }

      // Replace transaction_ref_number placeholder
      const transactionRefNumber = getTransactionRefNumber();
      if (transactionRefNumber && finalRequestBody.includes('{{transaction_ref_number}}')) {
        finalRequestBody = finalRequestBody.replace(/\{\{transaction_ref_number\}\}/g, transactionRefNumber);
        console.log('✅ Replaced {{transaction_ref_number}} with:', transactionRefNumber);
      }

      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method: endpoint.method,
        headers: requestHeaders
      };

      if (endpoint.method !== 'GET' && finalRequestBody.trim()) {
        fetchOptions.body = finalRequestBody;
      }

      console.log('🚀 Making request to:', url);
      console.log('📋 Request method:', endpoint.method);
      console.log('📋 Request headers:', Object.fromEntries(requestHeaders.entries()));
      if (fetchOptions.body) {
        console.log('📋 Request body:', fetchOptions.body);
      }

      const response = await fetch(url, fetchOptions);
      const responseText = await response.text();

      console.log('📩 Response status:', response.status);
      console.log('📩 Response body:', responseText);

      // Save quote ID if this is a Create Quote response
      if (endpoint.path.includes('/quote') && response.ok) {
        try {
          const jsonResponse = JSON.parse(responseText);
          if (jsonResponse.data && jsonResponse.data.quote_id) {
            setQuoteId(jsonResponse.data.quote_id);
          }
        } catch (e) {
          console.error('Error parsing quote response:', e);
        }
      }

      // Save transaction ref number if this is a Create Transaction response
      if (endpoint.path.includes('/createtransaction') && response.ok) {
        try {
          const jsonResponse = JSON.parse(responseText);
          if (jsonResponse.data && jsonResponse.data.transaction_ref_number) {
            setTransactionRefNumber(jsonResponse.data.transaction_ref_number);
          }
        } catch (e) {
          console.error('Error parsing transaction response:', e);
        }
      }

      return responseText;
    } catch (error) {
      console.error('❌ Error making request:', error);
      return JSON.stringify({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }, null, 2);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ScrollRevealContainer>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Remittance - Business
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {isPaaS 
              ? 'Business remittance APIs for Licensed Financial Institutions (LFI) using the PaaS model. These APIs support full KYC data submission with each transaction without requiring pre-registered customers.'
              : 'Business remittance APIs for the white-labelled integration model. These APIs use the RaaS model with pre-registered customer references.'}
          </p>
        </div>

        <div className="space-y-6">
          {endpoints.map((endpoint) => (
            <ApiEndpointCard
              key={endpoint.id}
              method={endpoint.method}
              path={endpoint.path}
              title={endpoint.title}
              description={endpoint.description || ''}
              requestBody={endpoint.requestBody}
              requestHeaders={endpoint.requestHeaders}
              responseBody={endpoint.responseBody}
              pathParams={endpoint.pathParams}
              queryParams={endpoint.queryParams}
              codeExamples={endpoint.codeExamples}
              guidelines={endpoint.guidelines}
              errorCodes={endpoint.errorCodes}
              theme={theme}
              onTryIt={async (editableBody, editableHeaders, editableQueryParams, editablePathParams) => {
                return await handleTryIt(endpoint, editableBody, editableHeaders, editableQueryParams, editablePathParams);
              }}
            />
          ))}
        </div>
      </ScrollRevealContainer>
    </div>
  );
};

export default RemittanceBusinessPage;
