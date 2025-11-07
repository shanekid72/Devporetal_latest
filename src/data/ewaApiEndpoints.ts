import { APIEndpoint } from '../types';

// Helper function to generate guidelines HTML
const generateGuidelinesHTML = (
  headers: Array<{ name: string; dataType: string; maxLength?: string | number; mandatory: string; description: string }>,
  requestFields: Array<{ name: string; dataType: string; maxLength?: string | number; mandatory: string; description: string; enumValues?: string }>,
  responseFields: Array<{ name: string; dataType: string; maxLength?: string | number; mandatory?: string; description: string; enumValues?: string }>,
  notes?: string[]
): string => {
  let html = '<div class="space-y-6">';
  
  // Headers Table
  html += '<div><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Headers</h3>';
  html += '<div class="overflow-x-auto"><table class="w-full text-sm border-collapse">';
  html += '<thead><tr class="border-b-2 border-gray-300 dark:border-gray-600">';
  html += '<th class="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">Name</th>';
  html += '<th class="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">Data Type</th>';
  html += '<th class="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">Max Length</th>';
  html += '<th class="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">Mandatory</th>';
  html += '<th class="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">Description</th>';
  html += '</tr></thead><tbody>';
  
  headers.forEach(field => {
    html += '<tr class="border-b border-gray-200 dark:border-gray-700">';
    html += `<td class="py-2 px-3 font-mono text-xs text-gray-900 dark:text-white">${field.name}</td>`;
    html += `<td class="py-2 px-3 text-gray-600 dark:text-gray-400">${field.dataType}</td>`;
    html += `<td class="py-2 px-3 text-gray-600 dark:text-gray-400">${field.maxLength || '-'}</td>`;
    const mandatoryClass = field.mandatory === 'MANDATORY' 
      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    html += `<td class="py-2 px-3"><span class="px-2 py-1 rounded text-xs font-semibold ${mandatoryClass}">${field.mandatory}</span></td>`;
    html += `<td class="py-2 px-3 text-gray-600 dark:text-gray-400">${field.description}</td>`;
    html += '</tr>';
  });
  html += '</tbody></table></div></div>';

  // Request Payload Table
  if (requestFields.length > 0) {
    html += '<div><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Request Payload</h3>';
    html += '<div class="overflow-x-auto"><table class="w-full text-sm border-collapse">';
    html += '<thead><tr class="border-b-2 border-gray-300 dark:border-gray-600">';
    html += '<th class="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">Field</th>';
    html += '<th class="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">Data Type</th>';
    html += '<th class="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">Max Length</th>';
    html += '<th class="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">Mandatory</th>';
    html += '<th class="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">Description</th>';
    html += '</tr></thead><tbody>';
    
    requestFields.forEach(field => {
      html += '<tr class="border-b border-gray-200 dark:border-gray-700">';
      html += `<td class="py-2 px-3 font-mono text-xs text-gray-900 dark:text-white">${field.name}</td>`;
      html += `<td class="py-2 px-3 text-gray-600 dark:text-gray-400">${field.dataType}</td>`;
      html += `<td class="py-2 px-3 text-gray-600 dark:text-gray-400">${field.maxLength || '-'}</td>`;
      const mandatoryClass = field.mandatory === 'MANDATORY' 
        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
        : field.mandatory === 'CONDITIONAL'
        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      html += `<td class="py-2 px-3"><span class="px-2 py-1 rounded text-xs font-semibold ${mandatoryClass}">${field.mandatory}</span></td>`;
      let description = field.description;
      if (field.enumValues) {
        description += `<br/><span class="text-xs text-teal-600 dark:text-teal-400">Values: ${field.enumValues}</span>`;
      }
      html += `<td class="py-2 px-3 text-gray-600 dark:text-gray-400">${description}</td>`;
      html += '</tr>';
    });
    html += '</tbody></table></div></div>';
  }

  // Response Fields Table
  html += '<div><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Response Fields</h3>';
  html += '<div class="overflow-x-auto"><table class="w-full text-sm border-collapse">';
  html += '<thead><tr class="border-b-2 border-gray-300 dark:border-gray-600">';
  html += '<th class="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">Field</th>';
  html += '<th class="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">Data Type</th>';
  html += '<th class="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">Max Length</th>';
  html += '<th class="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">Description</th>';
  html += '</tr></thead><tbody>';
  
  responseFields.forEach(field => {
    html += '<tr class="border-b border-gray-200 dark:border-gray-700">';
    html += `<td class="py-2 px-3 font-mono text-xs text-gray-900 dark:text-white">${field.name}</td>`;
    html += `<td class="py-2 px-3 text-gray-600 dark:text-gray-400">${field.dataType}</td>`;
    html += `<td class="py-2 px-3 text-gray-600 dark:text-gray-400">${field.maxLength || '-'}</td>`;
    let description = field.description;
    if (field.enumValues) {
      description += `<br/><span class="text-xs text-teal-600 dark:text-teal-400">Values: ${field.enumValues}</span>`;
    }
    html += `<td class="py-2 px-3 text-gray-600 dark:text-gray-400">${description}</td>`;
    html += '</tr>';
  });
  html += '</tbody></table></div></div>';

  // Important Notes
  if (notes && notes.length > 0) {
    html += '<div><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Important Notes</h3>';
    html += '<ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">';
    notes.forEach(note => {
      html += `<li>${note}</li>`;
    });
    html += '</ul></div>';
  }

  html += '</div>';
  return html;
};

export const ewaApiEndpoints: APIEndpoint[] = [
  // 1. Authentication API
  {
    id: 'ewa-authentication',
    title: 'Authentication API',
    method: 'POST',
    path: 'https://{{baseUrl}}/auth/realms/cdp/protocol/openid-connect/token',
    description: 'An access token is the key to the gateway to access any other API. The API will return the access token if the user is successfully authenticated and has authorization to access these services. Every access token is tagged with validity, and the expiry duration is echoed in the response for the calling application to manage the state accordingly. A token that is used after its validity period will restrict access to any services, and a new token will be generated in this case.',
    requestHeaders: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    requestBody: `--data-urlencode 'grant_type=password' \\
--data-urlencode 'scope=api://3a3f52a1-1b64-4c27-81f0-50a6ca01324d/customer' \\
--data-urlencode 'client_id=<<client_id>>' \\
--data-urlencode 'client_secret=<<secret>>' \\
--data-urlencode 'username=<<username>>' \\
--data-urlencode 'password=<<password>>'`,
    responseBody: `{
  "token_type": "bearer",
  "access_token": "<<access_token_value>>",
  "expires_in": 7199,
  "refresh_expires_in": 7199,
  "refresh_token": "<<refresh_token_value>>",
  "scope": "-----",
  "not-before-policy": 0,
  "session_state": "<<session_state>>"
}`,
    responses: [
      { status: 200, description: 'Success - Token generated successfully' },
      { status: 401, description: 'Unauthorized - Invalid user credentials' }
    ],
    codeExamples: [
      {
        language: 'curl',
        label: 'cURL',
        code: `curl -X POST 'https://{{baseUrl}}/auth/realms/cdp/protocol/openid-connect/token' \\
-H 'Content-Type: application/x-www-form-urlencoded' \\
--data-urlencode 'grant_type=password' \\
--data-urlencode 'scope=api://3a3f52a1-1b64-4c27-81f0-50a6ca01324d/customer' \\
--data-urlencode 'client_id=your_client_id' \\
--data-urlencode 'client_secret=your_client_secret' \\
--data-urlencode 'username=admin_username' \\
--data-urlencode 'password=admin_password'`
      },
      {
        language: 'javascript',
        label: 'JavaScript',
        code: `const params = new URLSearchParams();
params.append('grant_type', 'password');
params.append('scope', 'api://3a3f52a1-1b64-4c27-81f0-50a6ca01324d/customer');
params.append('client_id', 'your_client_id');
params.append('client_secret', 'your_client_secret');
params.append('username', 'admin_username');
params.append('password', 'admin_password');

const response = await fetch('https://{{baseUrl}}/auth/realms/cdp/protocol/openid-connect/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: params
});

const data = await response.json();
console.log('Access Token:', data.access_token);`
      },
      {
        language: 'python',
        label: 'Python',
        code: `import requests

url = "https://{{baseUrl}}/auth/realms/cdp/protocol/openid-connect/token"

headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}

data = {
    "grant_type": "password",
    "scope": "api://3a3f52a1-1b64-4c27-81f0-50a6ca01324d/customer",
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "username": "admin_username",
    "password": "admin_password"
}

response = requests.post(url, headers=headers, data=data)
result = response.json()
print("Access Token:", result["access_token"])`
      }
    ],
    guidelines: generateGuidelinesHTML(
      [
        { name: 'Content-Type', dataType: 'String', maxLength: 36, mandatory: 'MANDATORY', description: 'Content type' }
      ],
      [
        { name: 'grant_type', dataType: 'String', maxLength: 10, mandatory: 'MANDATORY', description: 'Grant type. Will up provided' },
        { name: 'scope', dataType: 'String', maxLength: 60, mandatory: 'CONDITIONAL', description: 'Scope name. Will be provided' },
        { name: 'client_id', dataType: 'String', maxLength: 60, mandatory: 'MANDATORY', description: 'Client Id. Will be provided' },
        { name: 'client_secret', dataType: 'String', maxLength: 60, mandatory: 'MANDATORY', description: 'Client secret. Will be provided' },
        { name: 'username', dataType: 'String', maxLength: 60, mandatory: 'MANDATORY', description: 'Admin user name' },
        { name: 'password', dataType: 'String', maxLength: 60, mandatory: 'MANDATORY', description: 'Admin password' }
      ],
      [
        { name: 'token_type', dataType: 'String', description: 'Token type' },
        { name: 'scope', dataType: 'String', description: 'Scope details' },
        { name: 'access_token', dataType: 'String', maxLength: 600, description: 'Access token to access the APIs' },
        { name: 'refresh_token', dataType: 'String', maxLength: 600, description: 'refresh token to refresh the Token.' },
        { name: 'expires_in', dataType: 'Integer', description: 'Token expiry time in seconds' },
        { name: 'refresh_expires_in', dataType: 'Integer', description: 'Refresh Token expiry time in seconds' }
      ]
    )
  },

  // 2. Check EWA Eligibility
  {
    id: 'check-eligibility',
    title: 'Check EWA Eligibility',
    method: 'POST',
    path: 'https://{{baseUrl}}/ewa/api/v1/salary/advance/eligibility',
    description: 'Check if an employee is eligible for salary advance and get eligibility details including pricing information.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer {JWT_TOKEN}'
    },
    requestBody: `{
  "employeeEcrn": "7842420732744673",
  "disbursementType": "REMITTANCE"
}`,
    responseBody: `{
  "isEligible": true,
  "pendingRecoveryAmount": 300.00,
  "consentRequired": false,
  "eligibleMinAmount": 100,
  "eligibleMaxAmount": 2436,
  "totalCharges": 121.8,
  "totalTax": 6.09,
  "currencyCode": "AED",
  "ewaProvider": "ABHI",
  "notEligibleTitle": null,
  "notEligibleDetail": null
}`,
    responses: [
      { status: 200, description: 'Success - Employee eligibility retrieved' },
      { status: 400, description: 'Bad Request - Invalid parameters' },
      { status: 401, description: 'Unauthorized - Missing or invalid authorization token' }
    ],
    codeExamples: [
      {
        language: 'curl',
        label: 'cURL',
        code: `curl -X POST 'https://{{baseUrl}}/ewa/api/v1/salary/advance/eligibility' \\
-H 'Content-Type: application/json' \\
-H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
-d '{
  "employeeEcrn": "7842420732744673",
  "disbursementType": "REMITTANCE"
}'`
      },
      {
        language: 'javascript',
        label: 'JavaScript',
        code: `const response = await fetch('https://{{baseUrl}}/ewa/api/v1/salary/advance/eligibility', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    employeeEcrn: "7842420732744673",
    disbursementType: "REMITTANCE"
  })
});

const data = await response.json();
console.log('Eligibility:', data);`
      },
      {
        language: 'python',
        label: 'Python',
        code: `import requests
import json

url = "https://{{baseUrl}}/ewa/api/v1/salary/advance/eligibility"

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_JWT_TOKEN"
}

payload = {
    "employeeEcrn": "7842420732744673",
    "disbursementType": "REMITTANCE"
}

response = requests.post(url, headers=headers, json=payload)
result = response.json()
print("Eligibility:", result)`
      }
    ],
    guidelines: generateGuidelinesHTML(
      [
        { name: 'Content-Type', dataType: 'String', maxLength: 36, mandatory: 'MANDATORY', description: 'Content type' },
        { name: 'Authorization', dataType: 'String', mandatory: 'MANDATORY', description: 'Authorization Bearer Token' }
      ],
      [
        { name: 'employeeEcrn', dataType: 'String', maxLength: 50, mandatory: 'MANDATORY', description: 'Employee Customer Reference Number' },
        { name: 'disbursementType', dataType: 'Enum', mandatory: 'MANDATORY', description: 'Disbursement method type', enumValues: 'SALARY, REMITTANCE, CASH, BILL_PAYMENT' }
      ],
      [
        { name: 'isEligible', dataType: 'Boolean', mandatory: 'MANDATORY', description: 'Indicates if the employee is eligible for salary advance' },
        { name: 'notEligibleTitle', dataType: 'String', maxLength: 300, description: 'Title of ineligibility reason (if not eligible)' },
        { name: 'notEligibleDetail', dataType: 'String', maxLength: 600, description: 'Detailed explanation of ineligibility (if not eligible)' },
        { name: 'pendingRecoveryAmount', dataType: 'BigDecimal', description: 'Amount pending recovery from previous advances' },
        { name: 'consentRequired', dataType: 'Boolean', description: 'Indicates whether employee consent is required' },
        { name: 'eligibleMinAmount', dataType: 'BigDecimal', description: 'Minimum eligible advance amount' },
        { name: 'eligibleMaxAmount', dataType: 'BigDecimal', description: 'Maximum eligible advance amount' },
        { name: 'totalCharges', dataType: 'BigDecimal', description: 'Total charges applicable for the advance' },
        { name: 'totalTax', dataType: 'BigDecimal', description: 'Total tax applicable on charges' },
        { name: 'currencyCode', dataType: 'String', maxLength: 3, description: 'Currency code' },
        { name: 'ewaProvider', dataType: 'Enum', description: 'EWA provider', enumValues: 'INNFINN, ABHI' }
      ],
      ['When consentRequired is true, the employee must provide consent before creating a salary advance application. Use the Record Consent endpoint to record the consent.']
    )
  },

  // 3. Fetch Price
  {
    id: 'fetch-price',
    title: 'Fetch Price',
    method: 'POST',
    path: 'https://{{baseUrl}}/ewa/api/v1/price/fetch',
    description: 'Get detailed pricing information for a specific salary advance amount.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer {JWT_TOKEN}'
    },
    requestBody: `{
  "advanceSalary": "1000",
  "agentLocationId": "784101",
  "ewaProvider": "ABHI"
}`,
    responseBody: `{
  "totalCharges": 50.0,
  "totalTax": 2.5,
  "ewaProviderCharge": 30.0,
  "luluCharge": 20.0,
  "bankCharge": 0,
  "riskFund": 0
}`,
    responses: [
      { status: 200, description: 'Success - Pricing information retrieved' },
      { status: 400, description: 'Bad Request - Invalid parameters' },
      { status: 401, description: 'Unauthorized - Missing or invalid authorization token' }
    ],
    codeExamples: [
      {
        language: 'curl',
        label: 'cURL',
        code: `curl -X POST 'https://{{baseUrl}}/ewa/api/v1/price/fetch' \\
-H 'Content-Type: application/json' \\
-H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
-d '{
  "advanceSalary": "1000",
  "agentLocationId": "784101",
  "ewaProvider": "ABHI"
}'`
      },
      {
        language: 'javascript',
        label: 'JavaScript',
        code: `const response = await fetch('https://{{baseUrl}}/ewa/api/v1/price/fetch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    advanceSalary: "1000",
    agentLocationId: "784101",
    ewaProvider: "ABHI"
  })
});

const data = await response.json();
console.log('Pricing:', data);`
      },
      {
        language: 'python',
        label: 'Python',
        code: `import requests
import json

url = "https://{{baseUrl}}/ewa/api/v1/price/fetch"

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_JWT_TOKEN"
}

payload = {
    "advanceSalary": "1000",
    "agentLocationId": "784101",
    "ewaProvider": "ABHI"
}

response = requests.post(url, headers=headers, json=payload)
result = response.json()
print("Pricing:", result)`
      }
    ],
    guidelines: generateGuidelinesHTML(
      [
        { name: 'Content-Type', dataType: 'String', maxLength: 36, mandatory: 'MANDATORY', description: 'Content type' },
        { name: 'Authorization', dataType: 'String', mandatory: 'MANDATORY', description: 'Authorization Bearer Token' }
      ],
      [
        { name: 'advanceSalary', dataType: 'BigDecimal', mandatory: 'MANDATORY', description: 'Salary advance amount | Must be >= 0' },
        { name: 'agentLocationId', dataType: 'String', maxLength: 50, mandatory: 'MANDATORY', description: 'Agent location ID' },
        { name: 'ewaProvider', dataType: 'Enum', mandatory: 'MANDATORY', description: 'EWA provider', enumValues: 'INNFINN, ABHI' }
      ],
      [
        { name: 'totalCharges', dataType: 'BigDecimal', description: 'Total charges including all fees' },
        { name: 'totalTax', dataType: 'BigDecimal', description: 'Total tax applicable' },
        { name: 'ewaProviderCharge', dataType: 'BigDecimal', description: 'Charge from EWA provider' },
        { name: 'luluCharge', dataType: 'BigDecimal', description: 'LuLu platform charge' },
        { name: 'bankCharge', dataType: 'BigDecimal', description: 'Bank processing charge' },
        { name: 'riskFund', dataType: 'BigDecimal', description: 'Risk fund contribution' }
      ]
    )
  },

  // 4. Record Consent
  {
    id: 'record-consent',
    title: 'Record Consent',
    method: 'POST',
    path: 'https://{{baseUrl}}/ewa/api/v1/employee-ewa-program/record-consent',
    description: 'Record employee consent for EWA program participation.',
    requestHeaders: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer {JWT_TOKEN}'
    },
    requestBody: `{
  "employeeEcrn": "7842420732744673",
  "ewaProvider": "ABHI",
  "disbursementType": "REMITTANCE",
  "consentGiven": true
}`,
    responseBody: `{
  "employeeEcrn": "7842420721421164",
  "ewaProvider": "ABHI",
  "disbursementType": "REMITTANCE",
  "consentGiven": true,
  "consentDate": "2025-11-03T18:23:33.61251276Z",
  "consentDocumentFileName": null,
  "message": "Consent recorded successfully"
}`,
    responses: [
      { status: 200, description: 'Success - Consent recorded successfully' },
      { status: 400, description: 'Bad Request - Invalid request parameters' },
      { status: 404, description: 'Not Found - Employee not found in the system' },
      { status: 401, description: 'Unauthorized - Missing or invalid authorization token' }
    ],
    codeExamples: [
      {
        language: 'curl',
        label: 'cURL',
        code: `curl -X POST 'https://{{baseUrl}}/ewa/api/v1/employee-ewa-program/record-consent' \\
-H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
-F 'request={"employeeEcrn":"7842420732744673","ewaProvider":"ABHI","disbursementType":"REMITTANCE","consentGiven":true}' \\
-F 'file=@/path/to/consent-document.pdf'`
      },
      {
        language: 'javascript',
        label: 'JavaScript',
        code: `const formData = new FormData();
formData.append('request', JSON.stringify({
  employeeEcrn: "7842420732744673",
  ewaProvider: "ABHI",
  disbursementType: "REMITTANCE",
  consentGiven: true
}));

// Optional: Add file if available
const fileInput = document.querySelector('input[type="file"]');
if (fileInput.files[0]) {
  formData.append('file', fileInput.files[0]);
}

const response = await fetch('https://{{baseUrl}}/ewa/api/v1/employee-ewa-program/record-consent', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: formData
});

const data = await response.json();
console.log('Consent:', data);`
      },
      {
        language: 'python',
        label: 'Python',
        code: `import requests
import json

url = "https://{{baseUrl}}/ewa/api/v1/employee-ewa-program/record-consent"

headers = {
    "Authorization": "Bearer YOUR_JWT_TOKEN"
}

# Prepare the request JSON
request_data = {
    "employeeEcrn": "7842420732744673",
    "ewaProvider": "ABHI",
    "disbursementType": "REMITTANCE",
    "consentGiven": True
}

# Prepare files (optional)
files = {
    'request': (None, json.dumps(request_data), 'application/json'),
    # 'file': ('consent.pdf', open('consent.pdf', 'rb'), 'application/pdf')
}

response = requests.post(url, headers=headers, files=files)
result = response.json()
print("Consent:", result)`
      }
    ],
    guidelines: generateGuidelinesHTML(
      [
        { name: 'Content-Type', dataType: 'String', maxLength: 36, mandatory: 'MANDATORY', description: 'Content type (multipart/form-data)' },
        { name: 'Authorization', dataType: 'String', mandatory: 'MANDATORY', description: 'Authorization Bearer Token' }
      ],
      [
        { name: 'request', dataType: 'String', mandatory: 'MANDATORY', description: 'JSON string containing consent details | Must be valid JSON' },
        { name: 'employeeEcrn', dataType: 'String', maxLength: 50, mandatory: 'MANDATORY', description: 'Employee Customer Reference Number' },
        { name: 'ewaProvider', dataType: 'Enum', mandatory: 'MANDATORY', description: 'EWA provider', enumValues: 'INNFINN, ABHI' },
        { name: 'disbursementType', dataType: 'Enum', mandatory: 'MANDATORY', description: 'Disbursement type', enumValues: 'SALARY, REMITTANCE, CASH, BILL_PAYMENT' },
        { name: 'consentGiven', dataType: 'Boolean', mandatory: 'MANDATORY', description: 'Whether consent is given' },
        { name: 'file', dataType: 'MultipartFile', mandatory: 'OPTIONAL', description: 'Consent document file | Optional PDF/image file' }
      ],
      [
        { name: 'employeeEcrn', dataType: 'String', maxLength: 50, description: 'Employee Customer Reference Number' },
        { name: 'ewaProvider', dataType: 'Enum', description: 'EWA provider' },
        { name: 'disbursementType', dataType: 'Enum', description: 'Disbursement type' },
        { name: 'consentGiven', dataType: 'Boolean', description: 'Whether consent was given' },
        { name: 'consentDate', dataType: 'OffsetDateTime', description: 'Timestamp when consent was recorded' },
        { name: 'consentDocumentFileName', dataType: 'String', maxLength: 255, description: 'Filename of uploaded consent document (if provided)' },
        { name: 'message', dataType: 'String', maxLength: 255, description: 'Success message' }
      ],
      ['When consentRequired is true from the eligibility check, the employee must provide consent before creating a salary advance application.']
    )
  },

  // 5. Create Salary Advance
  {
    id: 'create-salary-advance',
    title: 'Create Salary Advance',
    method: 'POST',
    path: 'https://{{baseUrl}}/ewa/api/v1/salary/advance/create',
    description: 'Create a new salary advance application.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer {JWT_TOKEN}'
    },
    requestBody: `{
  "employeeEcrn": "7842420732744673",
  "advanceSalary": 300,
  "disbursementType": "REMITTANCE",
  "disbursementApplicationId": "LR12345678"
}`,
    responseBody: `{
  "applicationId": "EW784253072200001",
  "salaryAdvanceStatus": "APPROVED",
  "salaryAdvance": 200,
  "totalCharges": 10.0,
  "totalTax": 0.5,
  "totalAmount": 210.5
}`,
    responses: [
      { status: 200, description: 'Success - Salary advance application created' },
      { status: 400, description: 'Bad Request - Invalid parameters' },
      { status: 404, description: 'Not Found - Employee not found in the system' },
      { status: 401, description: 'Unauthorized - Missing or invalid authorization token' }
    ],
    codeExamples: [
      {
        language: 'curl',
        label: 'cURL',
        code: `curl -X POST 'https://{{baseUrl}}/ewa/api/v1/salary/advance/create' \\
-H 'Content-Type: application/json' \\
-H 'Authorization: Bearer YOUR_JWT_TOKEN' \\
-d '{
  "employeeEcrn": "7842420732744673",
  "advanceSalary": 300,
  "disbursementType": "REMITTANCE",
  "disbursementApplicationId": "LR12345678"
}'`
      },
      {
        language: 'javascript',
        label: 'JavaScript',
        code: `const response = await fetch('https://{{baseUrl}}/ewa/api/v1/salary/advance/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    employeeEcrn: "7842420732744673",
    advanceSalary: 300,
    disbursementType: "REMITTANCE",
    disbursementApplicationId: "LR12345678"
  })
});

const data = await response.json();
console.log('Application:', data);`
      },
      {
        language: 'python',
        label: 'Python',
        code: `import requests
import json

url = "https://{{baseUrl}}/ewa/api/v1/salary/advance/create"

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_JWT_TOKEN"
}

payload = {
    "employeeEcrn": "7842420732744673",
    "advanceSalary": 300,
    "disbursementType": "REMITTANCE",
    "disbursementApplicationId": "LR12345678"
}

response = requests.post(url, headers=headers, json=payload)
result = response.json()
print("Application:", result)`
      }
    ],
    guidelines: generateGuidelinesHTML(
      [
        { name: 'Content-Type', dataType: 'String', maxLength: 36, mandatory: 'MANDATORY', description: 'Content type' },
        { name: 'Authorization', dataType: 'String', mandatory: 'MANDATORY', description: 'Authorization Bearer Token' }
      ],
      [
        { name: 'employeeEcrn', dataType: 'String', maxLength: 50, mandatory: 'MANDATORY', description: 'Employee Customer Reference Number' },
        { name: 'disbursementType', dataType: 'Enum', mandatory: 'MANDATORY', description: 'Disbursement method type', enumValues: 'SALARY, REMITTANCE, CASH, BILL_PAYMENT' },
        { name: 'advanceSalary', dataType: 'BigDecimal', mandatory: 'MANDATORY', description: 'Salary advance amount' },
        { name: 'disbursementApplicationId', dataType: 'String', maxLength: 255, mandatory: 'OPTIONAL', description: 'Disbursement application ID' }
      ],
      [
        { name: 'applicationId', dataType: 'String', maxLength: 20, description: 'Unique EWA application ID' },
        { name: 'salaryAdvanceStatus', dataType: 'Enum', description: 'Application status', enumValues: 'REQUESTED, APPROVED, REJECTED, DISBURSED, RECOVERED, CANCELLED' },
        { name: 'salaryAdvance', dataType: 'BigDecimal', description: 'Requested salary advance amount' },
        { name: 'totalCharges', dataType: 'BigDecimal', description: 'Total charges applicable' },
        { name: 'totalTax', dataType: 'BigDecimal', description: 'Total tax applicable' },
        { name: 'totalAmount', dataType: 'BigDecimal', description: 'Total amount (salaryAdvance + totalCharges + totalTax)' }
      ]
    )
  },

  // 6. Get Salary Advance
  {
    id: 'get-salary-advance',
    title: 'Get Salary Advance',
    method: 'GET',
    path: 'https://{{baseUrl}}/ewa/api/v1/salary/advance/{applicationId}/details',
    description: 'Retrieve details of a specific salary advance application.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer {JWT_TOKEN}'
    },
    pathParams: [
      { name: 'applicationId', description: 'EWA Application ID', required: true }
    ],
    responseBody: `{
  "applicationId": "EW784251281400001",
  "employeeEcrn": "123456789123456789",
  "disbursementType": "SALARY",
  "recoveryType": "SALARY_CARD",
  "ewaProvider": "ABHI",
  "ewaProviderApplicationId": "ABHI_APP_12345",
  "disbursementApplicationId": "DISF123456",
  "recoveryApplicationId": "REC123456",
  "salaryAdvanceStatus": "APPROVED",
  "disbursementStatus": "DISBURSED",
  "recoveryStatus": "RECOVERED",
  "currencyCode": "AED",
  "salaryAdvance": 1000.00,
  "ewaProviderCharge": 20.00,
  "luluCharge": 3.00,
  "bankCharge": 2.00,
  "riskFund": 0.00,
  "totalCharges": 25.00,
  "totalTax": 1.25,
  "totalAmount": 1026.25,
  "recoveredAmount": 1026.25,
  "createdAt": "2025-01-15T10:30:00Z",
  "approvedAt": "2025-01-15T10:31:00Z",
  "disbursedAt": "2025-01-15T10:32:00Z",
  "recoveredAt": "2025-02-01T10:00:00Z",
  "cancelledAt": null,
  "createdBy": "LuluMoney",
  "cancelledBy": null
}`,
    responses: [
      { status: 200, description: 'Success - Salary advance details retrieved' },
      { status: 401, description: 'Unauthorized - Missing or invalid authorization token' },
      { status: 404, description: 'Not Found - Application not found' }
    ],
    codeExamples: [
      {
        language: 'curl',
        label: 'cURL',
        code: `curl -X GET 'https://{{baseUrl}}/ewa/api/v1/salary/advance/EW784251281400001/details' \\
-H 'Content-Type: application/json' \\
-H 'Authorization: Bearer YOUR_JWT_TOKEN'`
      },
      {
        language: 'javascript',
        label: 'JavaScript',
        code: `const applicationId = "EW784251281400001";

const response = await fetch(\`https://{{baseUrl}}/ewa/api/v1/salary/advance/\${applicationId}/details\`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

const data = await response.json();
console.log('Application Details:', data);`
      },
      {
        language: 'python',
        label: 'Python',
        code: `import requests

application_id = "EW784251281400001"
url = f"https://{{{{baseUrl}}}}/ewa/api/v1/salary/advance/{application_id}/details"

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_JWT_TOKEN"
}

response = requests.get(url, headers=headers)
result = response.json()
print("Application Details:", result)`
      }
    ],
    guidelines: generateGuidelinesHTML(
      [
        { name: 'Content-Type', dataType: 'String', maxLength: 36, mandatory: 'MANDATORY', description: 'Content type' },
        { name: 'Authorization', dataType: 'String', mandatory: 'MANDATORY', description: 'Authorization Bearer Token' }
      ],
      [],
      [
        { name: 'applicationId', dataType: 'String', maxLength: 20, description: 'Unique EWA application ID' },
        { name: 'employeeEcrn', dataType: 'String', maxLength: 20, description: 'Employee Customer Reference Number' },
        { name: 'disbursementType', dataType: 'Enum', description: 'Method of fund disbursement', enumValues: 'SALARY, REMITTANCE, CASH, BILL_PAYMENT' },
        { name: 'recoveryType', dataType: 'Enum', description: 'Method of amount recovery', enumValues: 'SALARY, SALARY_CARD' },
        { name: 'ewaProvider', dataType: 'Enum', description: 'EWA provider handling this transaction', enumValues: 'ABHI, INNFINN' },
        { name: 'ewaProviderApplicationId', dataType: 'String', maxLength: 50, description: 'Application ID assigned by the EWA provider' },
        { name: 'disbursementApplicationId', dataType: 'String', maxLength: 50, description: 'Reference to the disbursement application (null until disbursement is initiated)' },
        { name: 'recoveryApplicationId', dataType: 'String', maxLength: 50, description: 'Reference to the recovery application (null until recovery is initiated)' },
        { name: 'salaryAdvanceStatus', dataType: 'Enum', description: 'Current overall status of the application', enumValues: 'REQUESTED, APPROVED, REJECTED, DISBURSED, RECOVERED, CANCELLED' },
        { name: 'disbursementStatus', dataType: 'Enum', description: 'Status of the disbursement process', enumValues: 'NOT_INITIATED, INITIATED, COMPLETED, FAILED' },
        { name: 'recoveryStatus', dataType: 'Enum', description: 'Status of the recovery process', enumValues: 'NOT_INITIATED, INITIATED, COMPLETED, FAILED' },
        { name: 'currencyCode', dataType: 'String', maxLength: 3, description: 'Currency code for all amounts' },
        { name: 'salaryAdvance', dataType: 'BigDecimal', description: 'Principal salary advance amount requested by employee' },
        { name: 'ewaProviderCharge', dataType: 'BigDecimal', description: 'Charge applied by the EWA provider' },
        { name: 'luluCharge', dataType: 'BigDecimal', description: 'Platform fee charged by LuLu' },
        { name: 'bankCharge', dataType: 'BigDecimal', description: 'Bank processing fee' },
        { name: 'riskFund', dataType: 'BigDecimal', description: 'Risk fund contribution amount' },
        { name: 'totalCharges', dataType: 'BigDecimal', description: 'Sum of all charges (ewaProviderCharge + luluCharge + bankCharge + riskFund)' },
        { name: 'totalTax', dataType: 'BigDecimal', description: 'Total tax applicable on the charges' },
        { name: 'totalAmount', dataType: 'BigDecimal', description: 'Total amount = salaryAdvance + totalCharges + totalTax' },
        { name: 'recoveredAmount', dataType: 'BigDecimal', description: 'Amount recovered so far (0 if not recovered)' },
        { name: 'createdAt', dataType: 'OffsetDateTime', description: 'Timestamp when application was created (ISO 8601 format)' },
        { name: 'approvedAt', dataType: 'OffsetDateTime', description: 'Timestamp when application was approved (null if not approved)' },
        { name: 'disbursedAt', dataType: 'OffsetDateTime', description: 'Timestamp when funds were disbursed (null if not disbursed)' },
        { name: 'recoveredAt', dataType: 'OffsetDateTime', description: 'Timestamp when amount was recovered (null if not recovered)' },
        { name: 'cancelledAt', dataType: 'OffsetDateTime', description: 'Timestamp when application was cancelled (null if not cancelled)' },
        { name: 'createdBy', dataType: 'String', maxLength: 30, description: 'User ID of the person who created the application' },
        { name: 'cancelledBy', dataType: 'String', maxLength: 30, description: 'User ID of the person who cancelled the application (null if not cancelled)' }
      ]
    )
  },

  // 7. Cancel Application
  {
    id: 'cancel-application',
    title: 'Cancel Application',
    method: 'POST',
    path: 'https://{{baseUrl}}/ewa/api/v1/salary/advance/cancel/{applicationId}',
    description: 'Cancel a salary advance application. This endpoint allows you to cancel an application before funds are disbursed.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer {JWT_TOKEN}'
    },
    pathParams: [
      { name: 'applicationId', description: 'EWA Application ID', required: true }
    ],
    responseBody: `{
  "message": "salary advance application cancelled successfully",
  "id": "EW784251281400001"
}`,
    responses: [
      { status: 200, description: 'Success - Application cancelled successfully' },
      { status: 400, description: 'Bad Request - Invalid application ID' },
      { status: 404, description: 'Not Found - Salary advance transaction not found' },
      { status: 401, description: 'Unauthorized - Missing or invalid authorization token' }
    ],
    codeExamples: [
      {
        language: 'curl',
        label: 'cURL',
        code: `curl -X POST 'https://{{baseUrl}}/ewa/api/v1/salary/advance/cancel/EW784251281400001' \\
-H 'Content-Type: application/json' \\
-H 'Authorization: Bearer YOUR_JWT_TOKEN'`
      },
      {
        language: 'javascript',
        label: 'JavaScript',
        code: `const applicationId = "EW784251281400001";

const response = await fetch(\`https://{{baseUrl}}/ewa/api/v1/salary/advance/cancel/\${applicationId}\`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

const data = await response.json();
console.log('Cancellation:', data);`
      },
      {
        language: 'python',
        label: 'Python',
        code: `import requests

application_id = "EW784251281400001"
url = f"https://{{{{baseUrl}}}}/ewa/api/v1/salary/advance/cancel/{application_id}"

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_JWT_TOKEN"
}

response = requests.post(url, headers=headers)
result = response.json()
print("Cancellation:", result)`
      }
    ],
    guidelines: generateGuidelinesHTML(
      [
        { name: 'Content-Type', dataType: 'String', maxLength: 36, mandatory: 'MANDATORY', description: 'Content type' },
        { name: 'Authorization', dataType: 'String', mandatory: 'MANDATORY', description: 'Authorization Bearer Token' }
      ],
      [],
      [
        { name: 'message', dataType: 'String', maxLength: 255, description: 'Success message confirming cancellation' },
        { name: 'id', dataType: 'String', maxLength: 20, description: 'Cancelled application ID' }
      ]
    )
  }
];

