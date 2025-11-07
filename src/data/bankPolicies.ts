export interface BankPolicyValidation {
  field: string;
  requirement: string;
}

export interface BankPolicy {
  country: string;
  countryCode: string;
  accountNumber: string;
  iban: string;
  routingCode: string;
  isoCode: string;
  sortCode: string;
  comments: string;
  validations: BankPolicyValidation[];
}

export const bankPolicies: BankPolicy[] = [
  {
    country: 'Bangladesh',
    countryCode: 'BD',
    accountNumber: 'Mandatory',
    iban: 'Not Required',
    routingCode: 'ACH routing code/Branch code',
    isoCode: '11 digit BIC (or) Swift code',
    sortCode: '-',
    comments: 'Pass either ACH routing code/Branch code (or) iso_code',
    validations: [
      {
        field: 'receiver.first_name',
        requirement: '(mandatory) should not exceed 40 characters'
      },
      {
        field: 'receiver.last_name',
        requirement: '(mandatory) should not exceed 40 characters'
      },
      {
        field: 'receiver.receiver_address.address_line',
        requirement: '(mandatory)'
      },
      {
        field: 'receiver.receiver_address.town_name',
        requirement: '(mandatory)'
      },
      {
        field: 'Note',
        requirement: 'DUTCH BANGLA BANK'
      }
    ]
  },
  {
    country: 'Egypt',
    countryCode: 'EG',
    accountNumber: 'Not Required',
    iban: 'Mandatory',
    routingCode: '-',
    isoCode: '11 digit BIC (or) Swift code',
    sortCode: '-',
    comments: '-',
    validations: [
      {
        field: 'receiver.mobile_number',
        requirement: '(mandatory) should start with +20 followed by 10 digits'
      },
      {
        field: 'receiver.receiver_address.address_line',
        requirement: '(mandatory)'
      },
      {
        field: 'receiver.middle_name',
        requirement: '(mandatory)'
      }
    ]
  },
  {
    country: 'Indonesia',
    countryCode: 'ID',
    accountNumber: 'Mandatory',
    iban: 'Not Required',
    routingCode: 'Not Required',
    isoCode: '11 digit BIC (or) Swift code',
    sortCode: '-',
    comments: 'BIC/Swift',
    validations: [
      {
        field: 'receiver.mobile_number',
        requirement: '(mandatory)'
      },
      {
        field: 'receiver.receiver_address.address_line',
        requirement: '(mandatory)'
      }
    ]
  },
  {
    country: 'India',
    countryCode: 'IN',
    accountNumber: 'Mandatory',
    iban: 'Not Required',
    routingCode: 'IFSC code',
    isoCode: '11 digit BIC (or) Swift code',
    sortCode: '-',
    comments: 'Pass either IFSC code',
    validations: [
      {
        field: 'receiver.receiver_address.address_line',
        requirement: '(mandatory) a-z A-Z 0-9, should not exceed 35 characters'
      },
      {
        field: 'receiver.receiver_address.street_name',
        requirement: '(if passed) a-z A-Z 0-9, should not exceed 35 characters'
      },
      {
        field: 'receiver.receiver_address.town_name',
        requirement: '(mandatory) a-z A-Z 0-9'
      },
      {
        field: 'Note',
        requirement: 'State Bank of India'
      },
      {
        field: 'receiver.receiver_address.town_name',
        requirement: '(mandatory) a-z A-Z 0-9'
      }
    ]
  },
  {
    country: 'Sri Lanka',
    countryCode: 'LK',
    accountNumber: 'Mandatory',
    iban: 'Not Required',
    routingCode: 'Branch Ref Number',
    isoCode: '11 digit BIC (or) Swift code',
    sortCode: '-',
    comments: 'Pass either Branch Ref',
    validations: [
      {
        field: 'receiver.receiver_address.address_line',
        requirement: '(mandatory)'
      }
    ]
  },
  {
    country: 'Nepal',
    countryCode: 'NP',
    accountNumber: 'Mandatory',
    iban: 'Not Required',
    routingCode: '-',
    isoCode: '11 digit BIC (or) Swift code',
    sortCode: '-',
    comments: '-',
    validations: [
      {
        field: 'receiver.first_name',
        requirement: '(mandatory) should not exceed 40 characters'
      },
      {
        field: 'receiver.last_name',
        requirement: '(mandatory) should not exceed 40 characters'
      },
      {
        field: 'receiver.receiver_address.town_name',
        requirement: '(mandatory) should not exceed 20 characters'
      }
    ]
  },
  {
    country: 'Philippines',
    countryCode: 'PH',
    accountNumber: 'Mandatory',
    iban: 'Not Required',
    routingCode: 'ACH routing code',
    isoCode: 'Swift code',
    sortCode: '-',
    comments: 'Pass either ACH routing code',
    validations: [
      {
        field: 'receiver.mobile_number',
        requirement: '(mandatory) should start with 0 and be 11 digits long for the receiving country - PH'
      },
      {
        field: 'receiver.receiver_address.address_line',
        requirement: '(mandatory) should not exceed 40 characters'
      },
      {
        field: 'receiver.receiver_address.street_name',
        requirement: '(if passed) should not exceed 60 characters'
      },
      {
        field: 'receiver.first_name',
        requirement: '(mandatory) should not exceed 40 characters'
      },
      {
        field: 'receiver.last_name',
        requirement: '(mandatory) should not exceed 40 characters'
      }
    ]
  },
  {
    country: 'Pakistan',
    countryCode: 'PK',
    accountNumber: 'Not Required',
    iban: 'Mandatory (Example: PK1...)',
    routingCode: 'Not Required',
    isoCode: '11 digit BIC (or) Swift code',
    sortCode: '-',
    comments: '-',
    validations: [
      {
        field: 'receiver.receiver_address.address_line',
        requirement: '(mandatory)'
      },
      {
        field: 'receiver.nationality',
        requirement: '(mandatory)'
      },
      {
        field: 'Combined length',
        requirement: 'receiver.first_name, receiver.middle_name, receiver.last_name cannot be more than 100 characters'
      },
      {
        field: 'Note',
        requirement: 'HABIB BANK LTD'
      },
      {
        field: 'sender.nationality',
        requirement: '(mandatory) and cannot be IN, IL, UA, SY, SD, RU, MM, KP, IR, CU'
      },
      {
        field: 'receiver.nationality',
        requirement: 'cannot be other than PK'
      }
    ]
  },
  {
    country: 'United Kingdom',
    countryCode: 'UK',
    accountNumber: 'Not Required',
    iban: 'Mandatory',
    routingCode: '-',
    isoCode: '11 digit BIC (or) Swift code',
    sortCode: '-',
    comments: 'Pass IBAN & Swift code',
    validations: []
  },
  {
    country: 'United Arab Emirates',
    countryCode: 'AE',
    accountNumber: 'Not Required',
    iban: 'Mandatory',
    routingCode: '-',
    isoCode: '11 digit BIC (or) Swift code',
    sortCode: '-',
    comments: 'Pass IBAN & Swift code',
    validations: [
      {
        field: 'receiver.receiver_id',
        requirement: '(mandatory) - Emirates ID or Passport'
      },
      {
        field: 'Required fields',
        requirement: '[id_code, id, issued_on, valid_through]'
      }
    ]
  },
  {
    country: 'Others',
    countryCode: 'OT',
    accountNumber: 'Required',
    iban: 'Required',
    routingCode: '-',
    isoCode: '11 digit BIC (or) Swift code',
    sortCode: '-',
    comments: 'Pass either account_number or IBAN',
    validations: []
  }
];

export const accountTypeNote = "Account type code is mandatory for all countries. Must be passed with default value as 1 which is 'SAVINGS'. If not, get from customer and pass it.";

export const generalNote = "For the receiving mode BANK. The mandatory data in bank details object depends on the receiving country. The bank/branch lookup is supported in three cases by iso_code, routing_code, or sort_code.";

