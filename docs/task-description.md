# Payment Form — Task Description

## Goal

Create an interactive and user-friendly payment form using React and TypeScript, choosing the most suitable frontend tooling setup, such as Vite.js or Next.js.

Use either Ant Design (`antd`) or Material UI (`MUI`) for the form UI components.

For form handling, it is recommended to use Formik or React Hook Form together with appropriate validation libraries.

## Form Requirements

The form must contain the following fields.

### Amount

- Required field.
- Type: number.
- Validation:
  - Minimum value: `0.01`.
  - Maximum value: the selected payer account balance.

### Payee Account

- Required field.
- Type: text.
- Validation must be performed through the IBAN validation endpoint:

```txt
https://matavi.eu/validate/?iban=LT307300010172619164
```

### Purpose

- Required field.
- Type: text.
- Validation:
  - Minimum length: `3` characters.
  - Maximum length: `135` characters.

### Payer Account

- Required field.
- Type: text.
- The account balance must be displayed next to the account, for example:

```txt
1000.12 EUR
```

### Payee

- Required field.
- Type: text.
- Validation:
  - Maximum length: `70` characters.

## Account Data

```ts
const payerAccounts = [
  {
    iban: 'LT307300010172619160',
    id: '1',
    balance: 1000.12,
  },
  {
    iban: 'LT307300010172619161',
    id: '2',
    balance: 2.43,
  },
  {
    iban: 'LT307300010172619162',
    id: '3',
    balance: -5.87,
  },
];
```

## Additional Functionality

### Amount Formatting by Selected Language

The amount should be formatted according to the selected language: English or Lithuanian.

Examples:

```txt
EN: 1,000.01
LT: 1 000,01
```

### Unit Tests

Writing unit tests is optional.

Suggested test coverage:

- Form validation rules.
- Interaction with external endpoints.
- Important form logic.

Recommended tools:

- Jest.
- React Testing Library.

## Recommended Technologies and Libraries

### UI Component Libraries

- Ant Design (`antd`).
- Material UI (`MUI`).

### Form Handling Tools

- Formik.
- React Hook Form.

### Validation

- Yup.
- Zod.

### Testing Tools

- Jest.
- React Testing Library.

## Implementation Goals

1. Create a functional and aesthetically pleasing payment form with all required fields.
2. Ensure all form field validation rules are implemented.
3. Integrate payee account IBAN validation using the provided endpoint.
4. Display the payer account balance in the form and highlight negative balances.
5. Implement amount formatting according to the selected language rules.
6. Write basic tests covering the most important logic.
