import { APIEndpoint } from '../types';

interface APISection {
  id: string;
  name: string;
  description: string;
  endpoints: APIEndpoint[];
}

// PaaS API sections based on the PaaS Postman collection for LFIs
export const paasApiSections: Record<string, APISection[]> = {
  auth: [
    {
      id: 'auth',
      name: 'Authentication',
      description: 'Endpoints for obtaining access tokens to use the PaaS API',
      endpoints: [
        {
          id: 'auth-keycloak',
          title: 'Get Access Token',
          method: 'POST',
          path: '/auth/realms/cdp/protocol/openid-connect/token',
          description: 'Authenticate and get an access token for API access',
          requestHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
          requestBody: `{
  "username": "testpaasagentae",
  "password": "TestPaaSAgentAE098",
  "grant_type": "password",
  "client_id": "cdp_app",
  "client_secret": "mSh18BPiMZeQqFfOvWhgv8wzvnNVbj3Y"
}`,
          responseBody: `{
"access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
"expires_in": 300,
"refresh_expires_in": 1800,
"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"token_type": "bearer",
"not-before-policy": 0,
"session_state": "a2fa1d03-36eb-4a75-a142-dc1dd7c1a7a2"
}`,
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X POST "https://drap-sandbox.digitnine.com/auth/realms/cdp/protocol/openid-connect/token" \\
-H "Content-Type: application/x-www-form-urlencoded" \\
-d "username=testpaasagentae&password=TestPaaSAgentAE098&grant_type=password&client_id=cdp_app&client_secret=mSh18BPiMZeQqFfOvWhgv8wzvnNVbj3Y"`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const params = new URLSearchParams();
params.append('username', 'testpaasagentae');
params.append('password', 'TestPaaSAgentAE098');
params.append('grant_type', 'password');
params.append('client_id', 'cdp_app');
params.append('client_secret', 'mSh18BPiMZeQqFfOvWhgv8wzvnNVbj3Y');

const response = await fetch('http://localhost:3001/api/auth/realms/cdp/protocol/openid-connect/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: params.toString()
});

const data = await response.json();
console.log('Access Token:', data.access_token);`
            }
          ]
        }
      ]
    }
  ],
  masters: [
    {
      id: 'masters',
      name: 'Codes and Master Data',
      description: 'Endpoints for retrieving reference codes, rates, and bank information',
      endpoints: [
        {
          id: 'get-codes',
          title: 'Get Codes',
          method: 'GET',
          path: '/amr/paas/api/v1_0/paas/codes',
          description: 'Retrieve reference codes for the system',
          requestHeaders: {
            'Content-Type': 'application/json',
            'sender': 'testpaasagentae',
            'channel': 'Direct',
            'company': '784835',
            'branch': '784836',
            'Authorization': 'Bearer {{access_token}}'
          },
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://drap-sandbox.digitnine.com/amr/paas/api/v1_0/paas/codes" \\
-H "Content-Type: application/json" \\
-H "sender: testpaasagentae" \\
-H "channel: Direct" \\
-H "company: 784835" \\
-H "branch: 784836" \\
-H "Authorization: Bearer {{access_token}}"`
            }
          ]
        },
        {
          id: 'get-service-corridor',
          title: 'Get Service Corridor',
          method: 'GET',
          path: '/amr/paas/api/v1_0/paas/service-corridor',
          description: 'Retrieve available service corridors for remittance',
          requestHeaders: {
            'Content-Type': 'application/json',
            'sender': 'testpaasagentae',
            'channel': 'Direct',
            'company': '784835',
            'branch': '784836',
            'Authorization': 'Bearer {{access_token}}'
          },
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://drap-sandbox.digitnine.com/amr/paas/api/v1_0/paas/service-corridor" \\
-H "Content-Type: application/json" \\
-H "sender: testpaasagentae" \\
-H "channel: Direct" \\
-H "company: 784835" \\
-H "branch: 784836" \\
-H "Authorization: Bearer {{access_token}}"`
            }
          ]
        },
        {
          id: 'get-rates',
          title: 'Get Rates',
          method: 'GET',
          path: '/amr/paas/api/v1_0/paas/rates',
          description: 'Retrieve current exchange rates',
          queryParams: [
            {
              name: 'receiving_currency_code',
              type: 'string',
              required: false,
              description: 'Filter by receiving currency code',
              defaultValue: 'PKR'
            },
            {
              name: 'receiving_country_code',
              type: 'string',
              required: false,
              description: 'Filter by receiving country code',
              defaultValue: 'PK'
            }
          ],
          requestHeaders: {
            'Content-Type': 'application/json',
            'sender': 'testpaasagentae',
            'channel': 'Direct',
            'company': '784835',
            'branch': '784836',
            'Authorization': 'Bearer {{access_token}}'
          },
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://drap-sandbox.digitnine.com/amr/paas/api/v1_0/paas/rates?receiving_currency_code=PKR&receiving_country_code=PK" \\
-H "Content-Type: application/json" \\
-H "sender: testpaasagentae" \\
-H "channel: Direct" \\
-H "company: 784835" \\
-H "branch: 784836" \\
-H "Authorization: Bearer {{access_token}}"`
            }
          ]
        },
        {
          id: 'get-banks',
          title: 'Master Banks',
          method: 'GET',
          path: '/amr/paas/api/v1_0/paas/master/banks',
          description: 'Retrieve list of available banks for a specific country and receiving mode',
          queryParams: [
            {
              name: 'receiving_country_code',
              type: 'string',
              required: true,
              description: 'ISO country code (e.g., PK, IN, BD)',
              defaultValue: 'PK'
            },
            {
              name: 'receiving_mode',
              type: 'string',
              required: true,
              description: 'Payment mode: BANK, CASHPICKUP, WALLET',
              defaultValue: 'CASHPICKUP'
            },
            {
              name: 'correspondent',
              type: 'string',
              required: false,
              description: 'Filter by correspondent code',
              defaultValue: 'RR'
            }
          ],
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://drap-sandbox.digitnine.com/amr/paas/api/v1_0/paas/master/banks?receiving_country_code=PK&receiving_mode=CASHPICKUP" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer {{access_token}}"`
            }
          ]
        },
        {
          id: 'get-bank-by-id',
          title: 'Master Banks - ID',
          method: 'GET',
          path: '/amr/paas/api/v1_0/paas/master/banks/{bank_id}',
          description: 'Retrieve bank details by ID',
          pathParams: [
            {
              name: 'bank_id',
              description: 'Unique bank identifier',
              required: true
            }
          ],
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://drap-sandbox.digitnine.com/amr/paas/api/v1_0/paas/master/banks/11232" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer {{access_token}}"`
            }
          ]
        },
        {
          id: 'get-bank-branches',
          title: 'Get Bank Branches',
          method: 'GET',
          path: '/amr/paas/api/v1_0/paas/master/banks/{bank_id}/branches',
          description: 'Retrieve branches for a specific bank',
          pathParams: [
            {
              name: 'bank_id',
              description: 'Unique bank identifier',
              required: true
            }
          ],
          queryParams: [
            {
              name: 'receiving_country_code',
              type: 'string',
              required: true,
              description: 'ISO country code (e.g., PK)',
              defaultValue: 'PK'
            },
            {
              name: 'receiving_mode',
              type: 'string',
              required: true,
              description: 'Payment mode: BANK, CASHPICKUP',
              defaultValue: 'CASHPICKUP'
            },
            {
              name: 'correspondent',
              type: 'string',
              required: false,
              description: 'Filter by correspondent code'
            }
          ],
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://drap-sandbox.digitnine.com/amr/paas/api/v1_0/paas/master/banks/11232/branches?receiving_country_code=PK&receiving_mode=CASHPICKUP" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer {{access_token}}"`
            }
          ]
        },
        {
          id: 'get-specific-branch',
          title: 'Get Specific Branch',
          method: 'GET',
          path: '/amr/paas/api/v1_0/paas/master/banks/{bank_id}/branches/{branch_id}',
          description: 'Get details of a specific branch by ID',
          pathParams: [
            {
              name: 'bank_id',
              description: 'Unique bank identifier',
              required: true
            },
            {
              name: 'branch_id',
              description: 'Unique branch identifier',
              required: true
            }
          ],
          queryParams: [
            {
              name: 'correspondent',
              type: 'string',
              required: false,
              description: 'Filter by correspondent code'
            }
          ],
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://drap-sandbox.digitnine.com/amr/paas/api/v1_0/paas/master/banks/105854511/branches/127968311?correspondent=RR" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer {{access_token}}"`
            }
          ]
        }
      ]
    }
  ],
  remittance: [
    {
      id: 'remittance',
      name: 'Remittance Transactions',
      description: 'Create and manage remittance transactions',
      endpoints: [
        {
          id: 'create-quote',
          title: 'Create Quote',
          method: 'POST',
          path: '/amr/paas/api/v1_0/paas/quote',
          description: 'Create a quote for a remittance transaction',
          requestHeaders: {
            'Content-Type': 'application/json',
            'sender': 'testpaasagentae',
            'channel': 'Direct',
            'company': '784835',
            'branch': '784836',
            'Authorization': 'Bearer {{access_token}}'
          },
          requestBody: `{
  "sending_country_code": "AE",
  "sending_currency_code": "AED",
  "receiving_country_code": "IN",
  "receiving_currency_code": "INR",
  "sending_amount": 100,
  "receiving_mode": "BANK",
  "type": "SEND",
  "instrument": "REMITTANCE"
}`,
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X POST "https://drap-sandbox.digitnine.com/amr/paas/api/v1_0/paas/quote" \\
-H "Content-Type: application/json" \\
-H "sender: testpaasagentae" \\
-H "channel: Direct" \\
-H "company: 784835" \\
-H "branch: 784836" \\
-H "Authorization: Bearer {{access_token}}" \\
-d '{
  "sending_country_code": "AE",
  "sending_currency_code": "AED",
  "receiving_country_code": "IN",
  "receiving_currency_code": "INR",
  "sending_amount": 100,
  "receiving_mode": "BANK",
  "type": "SEND",
  "instrument": "REMITTANCE"
}'`
            }
          ]
        },
        {
          id: 'create-transaction',
          title: 'Create Transaction',
          method: 'POST',
          path: '/amr/paas/api/v1_0/paas/createtransaction',
          description: 'Create a remittance transaction with full KYC details',
          requestHeaders: {
            'Content-Type': 'application/json',
            'sender': 'testpaasagentae',
            'channel': 'Direct',
            'company': '784835',
            'branch': '784836',
            'Authorization': 'Bearer {{access_token}}'
          },
          requestBody: `{
  "type": "SEND",
  "source_of_income": "SLRY",
  "purpose_of_txn": "SAVG",
  "instrument": "REMITTANCE",
  "message": "Agency transaction",
  "sender": {
    "agent_customer_number": "987612349876",
    "mobile_number": "+971508359468",
    "first_name": "George",
    "last_name": "Micheal",
    "sender_id": [
      {
        "id_code": "4",
        "id": "784199191427626",
        "issued_on": "2022-10-31",
        "valid_through": "2025-11-01"
      }
    ],
    "date_of_birth": "1995-08-22",
    "country_of_birth": "IN",
    "nationality": "IN",
    "sender_address": [
      {
        "address_type": "PRESENT",
        "address_line": "TCRTESTESTETSTETSTDTST, 221b",
        "post_code": "710",
        "town_name": "DUBAI",
        "country_code": "AE"
      }
    ]
  },
  "receiver": {
    "mobile_number": "+919586741500",
    "first_name": "Anija FirstName",
    "last_name": "Anija Lastname",
    "date_of_birth": "1990-08-22",
    "gender": "F",
    "receiver_address": [
      {
        "address_type": "PRESENT",
        "address_line": "TCR",
        "town_name": "THRISSUR",
        "country_code": "IN"
      }
    ],
    "nationality": "IN",
    "relation_code": "32",
    "bank_details": {
      "account_type_code": "1",
      "routing_code": "FDRL0001033",
      "account_number": "99345724439934"
    }
  },
  "transaction": {
    "quote_id": "{{quote_id}}"
  }
}`,
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X POST "https://drap-sandbox.digitnine.com/amr/paas/api/v1_0/paas/createtransaction" \\
-H "Content-Type: application/json" \\
-H "sender: testpaasagentae" \\
-H "channel: Direct" \\
-H "company: 784835" \\
-H "branch: 784836" \\
-H "Authorization: Bearer {{access_token}}" \\
-d @transaction_body.json`
            }
          ]
        },
        {
          id: 'confirm-transaction',
          title: 'Confirm Transaction',
          method: 'POST',
          path: '/amr/paas/api/v1_0/paas/confirmtransaction',
          description: 'Confirm a created transaction',
          requestHeaders: {
            'Content-Type': 'application/json',
            'sender': 'testpaasagentae',
            'channel': 'Direct',
            'company': '784835',
            'branch': '784836',
            'Authorization': 'Bearer {{access_token}}'
          },
          requestBody: `{
  "transaction_ref_number": "{{transaction_ref_number}}"
}`,
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X POST "https://drap-sandbox.digitnine.com/amr/paas/api/v1_0/paas/confirmtransaction" \\
-H "Content-Type: application/json" \\
-H "sender: testpaasagentae" \\
-H "channel: Direct" \\
-H "company: 784835" \\
-H "branch: 784836" \\
-H "Authorization: Bearer {{access_token}}" \\
-d '{
  "transaction_ref_number": "{{transaction_ref_number}}"
}'`
            }
          ]
        },
        {
          id: 'enquire-transaction',
          title: 'Enquire Transaction',
          method: 'GET',
          path: '/amr/paas/api/v1_0/paas/enquire-transaction',
          description: 'Get details of a transaction',
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
            'sender': 'testpaasagentae',
            'channel': 'Direct',
            'company': '784835',
            'branch': '784836',
            'Authorization': 'Bearer {{access_token}}'
          },
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://drap-sandbox.digitnine.com/amr/paas/api/v1_0/paas/enquire-transaction?transaction_ref_number={{transaction_ref_number}}" \\
-H "Content-Type: application/json" \\
-H "sender: testpaasagentae" \\
-H "channel: Direct" \\
-H "company: 784835" \\
-H "branch: 784836" \\
-H "Authorization: Bearer {{access_token}}"`
            }
          ]
        },
        {
          id: 'cancel-transaction',
          title: 'Cancel Transaction',
          method: 'POST',
          path: '/amr/paas/api/v1_0/paas/canceltransaction',
          description: 'Cancel an existing transaction',
          requestHeaders: {
            'Content-Type': 'application/json',
            'sender': 'testpaasagentae',
            'channel': 'Direct',
            'company': '784835',
            'branch': '784836',
            'Authorization': 'Bearer {{access_token}}'
          },
          requestBody: `{
  "transaction_ref_number": "{{transaction_ref_number}}",
  "cancel_reason": "R6",
  "remarks": "Account of the payment is incorrect"
}`,
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X POST "https://drap-sandbox.digitnine.com/amr/paas/api/v1_0/paas/canceltransaction" \\
-H "Content-Type: application/json" \\
-H "sender: testpaasagentae" \\
-H "channel: Direct" \\
-H "company: 784835" \\
-H "branch: 784836" \\
-H "Authorization: Bearer {{access_token}}" \\
-d '{
  "transaction_ref_number": "{{transaction_ref_number}}",
  "cancel_reason": "R6",
  "remarks": "Account of the payment is incorrect"
}'`
            }
          ]
        }
      ]
    }
  ]
};

