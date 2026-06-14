# Payment Form Exercise

[Live demo](https://tautris.github.io/payment-form-exercise/)

A React and TypeScript payment form implementing account selection, balance-aware validation, and remote IBAN validation.

## Features

- Payer account selection with available balances
- Explicit English and Lithuanian amount formatting
- Required-field and length validation
- Amount validation against the selected account balance
- Support for decimal comma and decimal point input
- Remote payee IBAN validation
- Submission summary dialog
- Error handling for failed IBAN validation requests
- Unit tests for form rules and the IBAN service

## Tech Stack

- React 19
- TypeScript
- Vite
- Material UI
- React Hook Form
- Zod
- Vitest
- Mock Service Worker
- Biome

## Getting Started

Requires Node.js and pnpm.

```bash 
pnpm install
pnpm dev
```

Check for other common commands available in [`package.json`](./package.json).

## Task Description

The translated task description is available in [`docs/task-description.md`](./docs/task-description.md).
