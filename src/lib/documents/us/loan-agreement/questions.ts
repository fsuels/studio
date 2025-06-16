import type { Question } from '../../types';

export const loanAgreementQuestions: Question[] = [
  {
    "id": "name",
    "label": "Name",
    "type": "text",
    "required": true,
    "placeholder": "Enter name..."
  },
  {
    "id": "email",
    "label": "Email",
    "type": "text",
    "required": false,
    "placeholder": "Enter email..."
  },
  {
    "id": "address",
    "label": "Address",
    "type": "address",
    "required": true,
    "placeholder": "Enter address..."
  },
  {
    "id": "city",
    "label": "City",
    "type": "text",
    "required": true,
    "placeholder": "Enter city..."
  },
  {
    "id": "state",
    "label": "State",
    "type": "text",
    "required": true,
    "placeholder": "Enter state..."
  },
  {
    "id": "zipCode",
    "label": "Zip Code",
    "type": "text",
    "required": true,
    "placeholder": "Enter zip code..."
  },
  {
    "id": "date",
    "label": "Date",
    "type": "date",
    "required": true,
    "placeholder": "Enter date..."
  },
  {
    "id": "amount",
    "label": "Amount",
    "type": "number",
    "required": true,
    "placeholder": "Enter amount..."
  },
  {
    "id": "interestRate",
    "label": "Interest Rate",
    "type": "number",
    "required": true,
    "placeholder": "Enter interest rate..."
  },
  {
    "id": "paymentTerms",
    "label": "Payment Terms",
    "type": "text",
    "required": true,
    "placeholder": "Enter payment terms..."
  },
  {
    "id": "dueDate",
    "label": "Due Date",
    "type": "date",
    "required": true,
    "placeholder": "Enter due date..."
  }
];
