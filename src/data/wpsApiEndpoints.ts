import { APIEndpoint } from '../types';

// Helper function to generate guidelines HTML (reused from EWA pattern)
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
        description += `<br/><span class="text-xs text-blue-600 dark:text-blue-400">Values: ${field.enumValues}</span>`;
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
      description += `<br/><span class="text-xs text-blue-600 dark:text-blue-400">Values: ${field.enumValues}</span>`;
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

export const wpsApiEndpoints: APIEndpoint[] = [
  // 1. Authorization API
  {
    id: 'wps-authorization',
    title: 'Get Authorization Token',
    method: 'POST',
    path: 'https://orvillestaging.luluone.com:8443/hbapi/v1_0/auth/token',
    description: 'The Authorization API is used to get access tokens. Access Tokens are used in token-based authentication to allow an application to access an API. The API will return the access token after a user successfully authenticates and authorizes access. This token can be passed as an authorization for other API calls.',
    requestHeaders: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    requestBody: `grant_type=password&scope=<<scope>>&client_id=<<client_id>>&client_secret=<<secret>>&username=<<username>>&password=<<password>>`,
    responseBody: `{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`,
    responses: [
      { status: 200, description: 'Success - Token generated successfully' },
      { status: 401, description: 'Unauthorized - Invalid credentials' },
      { status: 400, description: 'Bad Request - Missing or invalid parameters' }
    ],
    codeExamples: [
      {
        language: 'curl',
        label: 'cURL',
        code: `curl -X POST 'https://orvillestaging.luluone.com:8443/hbapi/v1_0/auth/token' \\
-H 'Content-Type: application/x-www-form-urlencoded' \\
-d 'grant_type=password' \\
-d 'scope=<<scope>>' \\
-d 'client_id=<<client_id>>' \\
-d 'client_secret=<<secret>>' \\
-d 'username=<<username>>' \\
-d 'password=<<password>>'`
      },
      {
        language: 'javascript',
        label: 'JavaScript',
        code: `const params = new URLSearchParams();
params.append('grant_type', 'password');
params.append('scope', 'your_scope');
params.append('client_id', 'your_client_id');
params.append('client_secret', 'your_client_secret');
params.append('username', 'your_username');
params.append('password', 'your_password');

const response = await fetch('https://orvillestaging.luluone.com:8443/hbapi/v1_0/auth/token', {
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

url = "https://orvillestaging.luluone.com:8443/hbapi/v1_0/auth/token"

headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}

data = {
    "grant_type": "password",
    "scope": "your_scope",
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "username": "your_username",
    "password": "your_password"
}

response = requests.post(url, headers=headers, data=data)
result = response.json()
print("Access Token:", result["access_token"])`
      }
    ],
    guidelines: generateGuidelinesHTML(
      [
        { name: 'Content-Type', dataType: 'String', maxLength: 36, mandatory: 'MANDATORY', description: 'Content type (application/x-www-form-urlencoded)' }
      ],
      [
        { name: 'grant_type', dataType: 'String', maxLength: 10, mandatory: 'MANDATORY', description: 'Grant type. Value should be "password"' },
        { name: 'scope', dataType: 'String', maxLength: 100, mandatory: 'MANDATORY', description: 'Scope name. Will be provided' },
        { name: 'client_id', dataType: 'String', maxLength: 100, mandatory: 'MANDATORY', description: 'Client ID. Will be provided' },
        { name: 'client_secret', dataType: 'String', maxLength: 100, mandatory: 'MANDATORY', description: 'Client secret. Will be provided' },
        { name: 'username', dataType: 'String', maxLength: 100, mandatory: 'MANDATORY', description: 'User name' },
        { name: 'password', dataType: 'String', maxLength: 100, mandatory: 'MANDATORY', description: 'User password' }
      ],
      [
        { name: 'access_token', dataType: 'String', maxLength: 1000, description: 'Access token to use for API authentication' },
        { name: 'token_type', dataType: 'String', description: 'Token type (usually "bearer")' },
        { name: 'expires_in', dataType: 'Integer', description: 'Token expiry time in seconds' },
        { name: 'refresh_token', dataType: 'String', maxLength: 1000, description: 'Refresh token to obtain new access token' }
      ]
    )
  },

  // 2. Upload Salary Information
  {
    id: 'wps-upload-salary',
    title: 'Upload Salary Information',
    method: 'POST',
    path: 'https://orvillestaging.luluone.com:8443/hbapi/v1_0/wps/uploadsalaryfile',
    description: 'Uploads the NU file to the server, parses the file and returns the MPN number and SIF FILENAME. Supports two processing types: NU (Normal Upload) for SIF/XLS/XLSX files (processingtype: 1) and NW (Non WPS) for CSV files (processingtype: 4).',
    requestHeaders: {
      'sender': '<will_be_provided>',
      'company': '<will_be_provided>'
    },
    requestBody: `{
  "file": "<file>",
  "userid": "<userid>",
  "establishmentid": "0000000435435",
  "processingtype": 1
}`,
    responseBody: `{
  "mpn_number": "MPN123456789",
  "sif_filename": "0000000165112200518122319.SIF",
  "status": "success",
  "message": "File uploaded and processed successfully"
}`,
    responses: [
      { status: 200, description: 'Success - File uploaded and processed successfully' },
      { status: 400, description: 'Bad Request - Invalid file format or missing parameters' },
      { status: 401, description: 'Unauthorized - Missing or invalid authorization token' },
      { status: 500, description: 'Internal Server Error - File processing failed' }
    ],
    codeExamples: [
      {
        language: 'curl',
        label: 'cURL',
        code: `curl -X POST 'https://orvillestaging.luluone.com:8443/hbapi/v1_0/wps/uploadsalaryfile' \\
-H 'sender: your_sender' \\
-H 'company: your_company' \\
-F 'file=@/path/to/salary_file.sif' \\
-F 'userid=your_userid' \\
-F 'establishmentid=0000000435435' \\
-F 'processingtype=1'`
      },
      {
        language: 'javascript',
        label: 'JavaScript',
        code: `const formData = new FormData();
const fileInput = document.querySelector('input[type="file"]');
formData.append('file', fileInput.files[0]);
formData.append('userid', 'your_userid');
formData.append('establishmentid', '0000000435435');
formData.append('processingtype', '1'); // 1 for NU (SIF/XLS/XLSX), 4 for NW (CSV)

const response = await fetch('https://orvillestaging.luluone.com:8443/hbapi/v1_0/wps/uploadsalaryfile', {
  method: 'POST',
  headers: {
    'sender': 'your_sender',
    'company': 'your_company'
  },
  body: formData
});

const data = await response.json();
console.log('Upload Result:', data);`
      },
      {
        language: 'python',
        label: 'Python',
        code: `import requests

url = "https://orvillestaging.luluone.com:8443/hbapi/v1_0/wps/uploadsalaryfile"

headers = {
    'sender': 'your_sender',
    'company': 'your_company'
}

files = {
    'file': ('salary_file.sif', open('salary_file.sif', 'rb'), 'application/octet-stream')
}

data = {
    'userid': 'your_userid',
    'establishmentid': '0000000435435',
    'processingtype': 1  # 1 for NU (SIF/XLS/XLSX), 4 for NW (CSV)
}

response = requests.post(url, headers=headers, files=files, data=data)
result = response.json()
print("Upload Result:", result)`
      }
    ],
    guidelines: generateGuidelinesHTML(
      [
        { name: 'sender', dataType: 'String', mandatory: 'MANDATORY', description: 'Sender identifier. Will be provided' },
        { name: 'company', dataType: 'String', mandatory: 'MANDATORY', description: 'Company identifier. Will be provided' }
      ],
      [
        { name: 'file', dataType: 'Binary', mandatory: 'MANDATORY', description: 'File to upload. For NU: SIF/XLS/XLSX formats. For NW: CSV format' },
        { name: 'userid', dataType: 'String', maxLength: 16, mandatory: 'MANDATORY', description: 'User who is uploading the file' },
        { name: 'establishmentid', dataType: 'String', maxLength: 30, mandatory: 'MANDATORY', description: 'Company code / MOLID' },
        { name: 'processingtype', dataType: 'Integer', maxLength: 1, mandatory: 'MANDATORY', description: 'Processing type: 1 for NU (Normal Upload - SIF/XLS/XLSX), 4 for NW (Non WPS - CSV)', enumValues: '1 (NU), 4 (NW)' }
      ],
      [
        { name: 'mpn_number', dataType: 'String', description: 'MPN (Master Payment Number) generated for the uploaded file' },
        { name: 'sif_filename', dataType: 'String', description: 'SIF filename generated/returned by the system' },
        { name: 'status', dataType: 'String', description: 'Upload status' },
        { name: 'message', dataType: 'String', description: 'Status message' }
      ],
      [
        'For NU (Normal Upload): Use processingtype=1. Supports SIF, XLS, and XLSX file formats.',
        'For NW (Non WPS): Use processingtype=4. Supports CSV (Comma Separated Values) format for freezone corporates salary upload.',
        'The file format must match the processing type specified.'
      ]
    )
  },

  // 3. Get File Status
  {
    id: 'wps-get-file-status',
    title: 'Get File Status',
    method: 'POST',
    path: 'https://orvillestaging.luluone.com:8443/hbapi/v1_0/wps/mypayfilestatus',
    description: 'To get the current status of salary files uploaded and processed. This endpoint allows you to query file statuses based on various filters including date range, establishment ID, SIF filename, salary month, file format, search type, and status code.',
    requestHeaders: {
      'Content-Type': 'application/json',
      'sender': '<will_be_provided>',
      'company': '<will_be_provided>'
    },
    requestBody: `{
  "userid": "<userid>",
  "aFromDate": "2020-05-18 00:00:00.000",
  "aToDate": "2020-05-18 00:00:00.000",
  "aEstablishmentId": "0000000165112",
  "aSifFileName": "",
  "aSalaryMonth": "",
  "aMyPayFileFormat": "SIF",
  "aSearchTypeDate": "UD",
  "aStatus": 0
}`,
    responseBody: `{
  "files": [
    {
      "sif_filename": "0000000165112200518122319.SIF",
      "mpn_number": "MPN123456789",
      "status": 4,
      "status_description": "MPN Generated",
      "upload_date": "2020-05-18 10:30:00",
      "salary_month": "2020-05"
    }
  ],
  "total_count": 1
}`,
    responses: [
      { status: 200, description: 'Success - File statuses retrieved successfully' },
      { status: 400, description: 'Bad Request - Invalid parameters' },
      { status: 401, description: 'Unauthorized - Missing or invalid authorization token' },
      { status: 404, description: 'Not Found - No files found matching criteria' }
    ],
    codeExamples: [
      {
        language: 'curl',
        label: 'cURL',
        code: `curl -X POST 'https://orvillestaging.luluone.com:8443/hbapi/v1_0/wps/mypayfilestatus' \\
-H 'Content-Type: application/json' \\
-H 'sender: your_sender' \\
-H 'company: your_company' \\
-d '{
  "userid": "your_userid",
  "aFromDate": "2020-05-18 00:00:00.000",
  "aToDate": "2020-05-18 00:00:00.000",
  "aEstablishmentId": "0000000165112",
  "aSifFileName": "",
  "aSalaryMonth": "",
  "aMyPayFileFormat": "SIF",
  "aSearchTypeDate": "UD",
  "aStatus": 0
}'`
      },
      {
        language: 'javascript',
        label: 'JavaScript',
        code: `const response = await fetch('https://orvillestaging.luluone.com:8443/hbapi/v1_0/wps/mypayfilestatus', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'sender': 'your_sender',
    'company': 'your_company'
  },
  body: JSON.stringify({
    userid: 'your_userid',
    aFromDate: '2020-05-18 00:00:00.000',
    aToDate: '2020-05-18 00:00:00.000',
    aEstablishmentId: '0000000165112',
    aSifFileName: '',
    aSalaryMonth: '',
    aMyPayFileFormat: 'SIF',
    aSearchTypeDate: 'UD',
    aStatus: 0
  })
});

const data = await response.json();
console.log('File Statuses:', data);`
      },
      {
        language: 'python',
        label: 'Python',
        code: `import requests
import json

url = "https://orvillestaging.luluone.com:8443/hbapi/v1_0/wps/mypayfilestatus"

headers = {
    'Content-Type': 'application/json',
    'sender': 'your_sender',
    'company': 'your_company'
}

payload = {
    "userid": "your_userid",
    "aFromDate": "2020-05-18 00:00:00.000",
    "aToDate": "2020-05-18 00:00:00.000",
    "aEstablishmentId": "0000000165112",
    "aSifFileName": "",
    "aSalaryMonth": "",
    "aMyPayFileFormat": "SIF",
    "aSearchTypeDate": "UD",
    "aStatus": 0
}

response = requests.post(url, headers=headers, json=payload)
result = response.json()
print("File Statuses:", result)`
      }
    ],
    guidelines: generateGuidelinesHTML(
      [
        { name: 'Content-Type', dataType: 'String', maxLength: 36, mandatory: 'MANDATORY', description: 'Content type (application/json)' },
        { name: 'sender', dataType: 'String', mandatory: 'MANDATORY', description: 'Sender identifier. Will be provided' },
        { name: 'company', dataType: 'String', mandatory: 'MANDATORY', description: 'Company identifier. Will be provided' }
      ],
      [
        { name: 'userid', dataType: 'String', maxLength: 16, mandatory: 'MANDATORY', description: 'User ID' },
        { name: 'aFromDate', dataType: 'Date', maxLength: 30, mandatory: 'MANDATORY', description: 'From date (format: YYYY-MM-DD HH:mm:ss.SSS)' },
        { name: 'aToDate', dataType: 'Date', maxLength: 6, mandatory: 'MANDATORY', description: 'To date (format: YYYY-MM-DD HH:mm:ss.SSS)' },
        { name: 'aEstablishmentId', dataType: 'String', maxLength: 30, mandatory: 'MANDATORY', description: 'Company code / MOLID' },
        { name: 'aSifFileName', dataType: 'String', maxLength: 30, mandatory: 'OPTIONAL', description: 'SIF file name (e.g., 0000000165112200518122319.SIF). Leave empty to search all files.' },
        { name: 'aSalaryMonth', dataType: 'String', maxLength: 6, mandatory: 'OPTIONAL', description: 'Month of which salary processed (format: YYYY-MM, e.g., 2020-01). Leave empty to search all months.' },
        { name: 'aMyPayFileFormat', dataType: 'String', maxLength: 3, mandatory: 'MANDATORY', description: 'File format. Default: "SIF"' },
        { name: 'aSearchTypeDate', dataType: 'String', maxLength: 2, mandatory: 'MANDATORY', description: 'Search based on uploaded date. Default: "UD" (Upload Date)' },
        { name: 'aStatus', dataType: 'Integer', maxLength: 1, mandatory: 'MANDATORY', description: 'Status filter. 0 = All (No Status filter)', enumValues: '0 (All), 1 (New/SIF Generated), 4 (MPN Generated), 8 (MPN Received), 16 (MPN Paid), 2048 (Sent to CB), 8192 (SIF - ACK), 16384 (SIF - NAK), 1073741824 (Rejected)' }
      ],
      [
        { name: 'files', dataType: 'Array', description: 'Array of file status objects' },
        { name: 'sif_filename', dataType: 'String', description: 'SIF filename' },
        { name: 'mpn_number', dataType: 'String', description: 'MPN (Master Payment Number)' },
        { name: 'status', dataType: 'Integer', description: 'Status code', enumValues: '0, 1, 4, 8, 16, 2048, 8192, 16384, 1073741824' },
        { name: 'status_description', dataType: 'String', description: 'Human-readable status description' },
        { name: 'upload_date', dataType: 'String', description: 'File upload date and time' },
        { name: 'salary_month', dataType: 'String', description: 'Salary month (YYYY-MM format)' },
        { name: 'total_count', dataType: 'Integer', description: 'Total number of files matching the criteria' }
      ],
      [
        'Status Code Meanings: 0 = All (No Status filter), 1 = New/SIF Generated, 4 = MPN Generated, 8 = MPN Received (for Cheque/Bank transfers), 16 = MPN Paid, 2048 = Sent to CB, 8192 = SIF - ACK, 16384 = SIF - NAK, 1073741824 = Rejected',
        'Use aStatus=0 to retrieve all files regardless of status',
        'aSearchTypeDate="UD" means search by Upload Date',
        'Leave optional fields (aSifFileName, aSalaryMonth) empty to search all files'
      ]
    )
  }
];

