import { APIEndpoint } from '../types';

interface APISection {
  id: string;
  name: string;
  description: string;
  endpoints: APIEndpoint[];
}

// UPaaS (Utility Payments as a Service) API sections
export const billPaymentsApiSections: Record<string, APISection[]> = {
  masters: [
    {
      id: 'masters',
      name: 'Master APIs',
      description: 'Retrieve master data including rates, categories, providers, billers, and service parameters',
      endpoints: [
        {
          id: 'get-rates',
          title: 'Get Rates',
          method: 'GET',
          path: '/upaas/masters/v1/rates',
          description: 'Retrieve current exchange rates for bill payment transactions. This endpoint provides real-time currency conversion rates for international utility payments.',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          queryParams: [
            {
              name: 'source_currency',
              type: 'string',
              required: false,
              description: 'Source currency code (e.g., USD, EUR)',
              defaultValue: 'USD'
            },
            {
              name: 'target_currency',
              type: 'string',
              required: false,
              description: 'Target currency code (e.g., INR)',
              defaultValue: 'INR'
            }
          ],
          responseBody: `{
  "status": "success",
  "data": {
    "rates": [
      {
        "source_currency": "USD",
        "target_currency": "INR",
        "rate": 83.25,
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}`,
          responses: [],
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://api.digitnine.com/upaas/masters/v1/rates?source_currency=USD&target_currency=INR" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const response = await fetch('https://api.digitnine.com/upaas/masters/v1/rates?source_currency=USD&target_currency=INR', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  }
});

const data = await response.json();
console.log('Exchange Rates:', data);`
            }
          ]
        },
        {
          id: 'get-categories',
          title: 'Get Categories',
          method: 'GET',
          path: '/upaas/masters/v1/categories',
          description: 'Retrieve available bill payment categories such as Electricity, Water, Gas, Telecom, DTH, and more. Categories help organize billers and service providers.',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          responseBody: `{
  "status": "success",
  "data": {
    "categories": [
      {
        "category_id": "ELECTRICITY",
        "category_name": "Electricity",
        "description": "Electricity bill payments",
        "icon_url": "https://cdn.digitnine.com/icons/electricity.png",
        "is_active": true
      },
      {
        "category_id": "WATER",
        "category_name": "Water",
        "description": "Water bill payments",
        "icon_url": "https://cdn.digitnine.com/icons/water.png",
        "is_active": true
      },
      {
        "category_id": "GAS",
        "category_name": "Gas",
        "description": "Gas bill payments",
        "icon_url": "https://cdn.digitnine.com/icons/gas.png",
        "is_active": true
      }
    ]
  }
}`,
          responses: [],
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://api.digitnine.com/upaas/masters/v1/categories" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const response = await fetch('https://api.digitnine.com/upaas/masters/v1/categories', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  }
});

const data = await response.json();
console.log('Categories:', data);`
            }
          ]
        },
        {
          id: 'get-providers',
          title: 'Get Providers',
          method: 'GET',
          path: '/upaas/masters/v1/providers',
          description: 'Retrieve all service providers integrated with the BBPS system. Providers can be filtered by category.',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          queryParams: [
            {
              name: 'category_id',
              type: 'string',
              required: false,
              description: 'Filter providers by category ID',
              defaultValue: ''
            }
          ],
          responseBody: `{
  "status": "success",
  "data": {
    "providers": [
      {
        "provider_id": "PROV001",
        "provider_name": "State Electricity Board",
        "category_id": "ELECTRICITY",
        "supported_regions": ["Maharashtra", "Gujarat"],
        "is_active": true
      }
    ]
  }
}`,
          responses: [],
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://api.digitnine.com/upaas/masters/v1/providers?category_id=ELECTRICITY" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const response = await fetch('https://api.digitnine.com/upaas/masters/v1/providers?category_id=ELECTRICITY', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  }
});

const data = await response.json();
console.log('Providers:', data);`
            }
          ]
        },
        {
          id: 'get-billers',
          title: 'Get Billers',
          method: 'GET',
          path: '/upaas/masters/v1/billers',
          description: 'Retrieve all registered billers under specific providers. Billers are the actual entities that receive bill payments (e.g., specific electricity boards, water authorities).',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          queryParams: [
            {
              name: 'provider_id',
              type: 'string',
              required: false,
              description: 'Filter billers by provider ID'
            },
            {
              name: 'category_id',
              type: 'string',
              required: false,
              description: 'Filter billers by category ID'
            }
          ],
          responseBody: `{
  "status": "success",
  "data": {
    "billers": [
      {
        "biller_id": "BILL001",
        "biller_name": "Mumbai Electricity Board",
        "provider_id": "PROV001",
        "category_id": "ELECTRICITY",
        "bbps_id": "BBPS12345",
        "supports_fetch_bill": true,
        "payment_modes": ["DEBIT", "CREDIT", "UPI"],
        "is_active": true
      }
    ]
  }
}`,
          responses: [],
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://api.digitnine.com/upaas/masters/v1/billers?provider_id=PROV001&category_id=ELECTRICITY" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const response = await fetch('https://api.digitnine.com/upaas/masters/v1/billers?provider_id=PROV001&category_id=ELECTRICITY', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  }
});

const data = await response.json();
console.log('Billers:', data);`
            }
          ]
        },
        {
          id: 'get-biller-custom-params',
          title: 'Get Biller Custom Params',
          method: 'GET',
          path: '/upaas/masters/v1/biller-service-custom-params',
          description: 'Retrieve biller-specific custom parameters required for bill payments. Each biller may require different input fields (e.g., consumer number, meter number, account ID).',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          queryParams: [
            {
              name: 'biller_id',
              type: 'string',
              required: true,
              description: 'Biller ID to fetch custom parameters for'
            }
          ],
          responseBody: `{
  "status": "success",
  "data": {
    "biller_id": "BILL001",
    "custom_params": [
      {
        "param_name": "consumer_number",
        "param_label": "Consumer Number",
        "param_type": "text",
        "is_mandatory": true,
        "validation_regex": "^[0-9]{10}$",
        "max_length": 10,
        "placeholder": "Enter 10-digit consumer number"
      },
      {
        "param_name": "billing_unit",
        "param_label": "Billing Unit",
        "param_type": "dropdown",
        "is_mandatory": false,
        "options": ["Residential", "Commercial", "Industrial"]
      }
    ]
  }
}`,
          responses: [],
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://api.digitnine.com/upaas/masters/v1/biller-service-custom-params?biller_id=BILL001" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const response = await fetch('https://api.digitnine.com/upaas/masters/v1/biller-service-custom-params?biller_id=BILL001', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  }
});

const data = await response.json();
console.log('Custom Parameters:', data);`
            }
          ]
        },
        {
          id: 'get-biller-plans',
          title: 'Get Biller Plans',
          method: 'GET',
          path: '/upaas/masters/v1/billers-plans-by-serviceid',
          description: 'Retrieve available billing plans for a specific service. Plans may include postpaid, prepaid, or subscription-based options.',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          queryParams: [
            {
              name: 'service_id',
              type: 'string',
              required: true,
              description: 'Service ID to fetch plans for'
            }
          ],
          responseBody: `{
  "status": "success",
  "data": {
    "service_id": "SRV001",
    "plans": [
      {
        "plan_id": "PLAN001",
        "plan_name": "Standard Postpaid",
        "plan_type": "POSTPAID",
        "description": "Standard postpaid billing plan",
        "is_active": true
      },
      {
        "plan_id": "PLAN002",
        "plan_name": "Prepaid Top-up",
        "plan_type": "PREPAID",
        "description": "Prepaid meter recharge plan",
        "is_active": true
      }
    ]
  }
}`,
          responses: [],
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://api.digitnine.com/upaas/masters/v1/billers-plans-by-serviceid?service_id=SRV001" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const response = await fetch('https://api.digitnine.com/upaas/masters/v1/billers-plans-by-serviceid?service_id=SRV001', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  }
});

const data = await response.json();
console.log('Plans:', data);`
            }
          ]
        }
      ]
    }
  ],
  transactions: [
    {
      id: 'transactions',
      name: 'Transaction APIs',
      description: 'Complete bill payment transaction lifecycle including quote generation, transaction creation, confirmation, and enquiry',
      endpoints: [
        {
          id: 'create-quote',
          title: 'Create Quote',
          method: 'POST',
          path: '/upaas/transactions/v1/quote',
          description: 'Generate a quote for a bill payment. This endpoint validates the bill details and provides an estimated amount including all charges and fees.',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          requestBody: `{
  "biller_id": "BILL001",
  "consumer_number": "1234567890",
  "amount": 1500.00,
  "currency": "INR",
  "additional_params": {
    "billing_unit": "Residential"
  }
}`,
          responseBody: `{
  "status": "success",
  "data": {
    "quote_id": "QT123456789",
    "biller_id": "BILL001",
    "biller_name": "Mumbai Electricity Board",
    "consumer_number": "1234567890",
    "base_amount": 1500.00,
    "service_charge": 15.00,
    "total_amount": 1515.00,
    "currency": "INR",
    "valid_until": "2024-01-15T18:00:00Z",
    "created_at": "2024-01-15T12:00:00Z"
  }
}`,
          responses: [],
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X POST "https://api.digitnine.com/upaas/transactions/v1/quote" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
-d '{
  "biller_id": "BILL001",
  "consumer_number": "1234567890",
  "amount": 1500.00,
  "currency": "INR"
}'`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const response = await fetch('https://api.digitnine.com/upaas/transactions/v1/quote', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  },
  body: JSON.stringify({
    biller_id: 'BILL001',
    consumer_number: '1234567890',
    amount: 1500.00,
    currency: 'INR'
  })
});

const data = await response.json();
console.log('Quote:', data);`
            }
          ]
        },
        {
          id: 'create-transaction',
          title: 'Create Transaction',
          method: 'POST',
          path: '/upaas/transactions/v1/transaction',
          description: 'Create a bill payment transaction. This initiates the payment process with the biller through BBPS. The transaction will be in pending status until confirmed.',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          requestBody: `{
  "quote_id": "QT123456789",
  "payment_method": "UPI",
  "payment_details": {
    "upi_id": "customer@upi"
  },
  "customer_details": {
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+919876543210"
  }
}`,
          responseBody: `{
  "status": "success",
  "data": {
    "transaction_id": "TXN987654321",
    "quote_id": "QT123456789",
    "status": "PENDING",
    "amount": 1515.00,
    "currency": "INR",
    "payment_method": "UPI",
    "bbps_reference": "BBPS123456",
    "created_at": "2024-01-15T12:05:00Z",
    "expires_at": "2024-01-15T12:35:00Z"
  }
}`,
          responses: [],
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X POST "https://api.digitnine.com/upaas/transactions/v1/transaction" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
-d '{
  "quote_id": "QT123456789",
  "payment_method": "UPI",
  "customer_details": {
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+919876543210"
  }
}'`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const response = await fetch('https://api.digitnine.com/upaas/transactions/v1/transaction', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  },
  body: JSON.stringify({
    quote_id: 'QT123456789',
    payment_method: 'UPI',
    customer_details: {
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '+919876543210'
    }
  })
});

const data = await response.json();
console.log('Transaction:', data);`
            }
          ]
        },
        {
          id: 'confirm-transaction',
          title: 'Confirm Transaction',
          method: 'POST',
          path: '/upaas/transactions/v1/confirm',
          description: 'Confirm and finalize a pending transaction. This completes the payment process and submits it to the biller for processing.',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          requestBody: `{
  "transaction_id": "TXN987654321",
  "payment_reference": "PAY123456",
  "confirmation_code": "CONF789"
}`,
          responseBody: `{
  "status": "success",
  "data": {
    "transaction_id": "TXN987654321",
    "status": "CONFIRMED",
    "bbps_reference": "BBPS123456",
    "confirmation_number": "CONF789",
    "receipt_url": "https://api.digitnine.com/receipts/TXN987654321",
    "confirmed_at": "2024-01-15T12:10:00Z"
  }
}`,
          responses: [],
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X POST "https://api.digitnine.com/upaas/transactions/v1/confirm" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
-d '{
  "transaction_id": "TXN987654321",
  "payment_reference": "PAY123456",
  "confirmation_code": "CONF789"
}'`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const response = await fetch('https://api.digitnine.com/upaas/transactions/v1/confirm', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  },
  body: JSON.stringify({
    transaction_id: 'TXN987654321',
    payment_reference: 'PAY123456',
    confirmation_code: 'CONF789'
  })
});

const data = await response.json();
console.log('Confirmation:', data);`
            }
          ]
        },
        {
          id: 'enquire-transaction',
          title: 'Enquire Transaction',
          method: 'GET',
          path: '/upaas/transactions/v1/enquire',
          description: 'Query the status of a transaction. Use this endpoint to check the current status, payment details, and any updates from the biller.',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          queryParams: [
            {
              name: 'transaction_id',
              type: 'string',
              required: true,
              description: 'Transaction ID to enquire about'
            }
          ],
          responseBody: `{
  "status": "success",
  "data": {
    "transaction_id": "TXN987654321",
    "quote_id": "QT123456789",
    "status": "SUCCESS",
    "biller_status": "PAID",
    "amount": 1515.00,
    "currency": "INR",
    "payment_method": "UPI",
    "bbps_reference": "BBPS123456",
    "receipt_url": "https://api.digitnine.com/receipts/TXN987654321",
    "created_at": "2024-01-15T12:05:00Z",
    "confirmed_at": "2024-01-15T12:10:00Z",
    "completed_at": "2024-01-15T12:15:00Z"
  }
}`,
          responses: [],
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://api.digitnine.com/upaas/transactions/v1/enquire?transaction_id=TXN987654321" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const response = await fetch('https://api.digitnine.com/upaas/transactions/v1/enquire?transaction_id=TXN987654321', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  }
});

const data = await response.json();
console.log('Transaction Status:', data);`
            }
          ]
        }
      ]
    }
  ]
};

