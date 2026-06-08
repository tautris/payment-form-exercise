import z from "zod";

export const PAYER_ACCOUNTS = [
	{
		iban: "LT307300010172619160",
		id: "1",
		balance: 1000.12,
	},
	{
		iban: "LT307300010172619161",
		id: "2",
		balance: 2.43,
	},
	{
		iban: "LT307300010172619162",
		id: "3",
		balance: -5.87,
	},
];

const amountSchema = z
	.string()
	.trim()
	.min(1, "Amount is required")
	.regex(/^\d+(?:[.,]\d{1,2})?$/, "Enter a valid amount")
	.transform((value) => Number(value.replace(",", ".")))
	.pipe(z.number().min(0.01, "Minimum amount is 0.01"));

export const paymentFormSchema = z
	.object({
		payerAccount: z
			.string()
			.min(1, "Payer account is required")
			.refine((iban) => PAYER_ACCOUNTS.some((account) => account.iban === iban), "Select a valid payer account"),
		payee: z.string().trim().min(1, "Payee is required").max(70, "Payee cannot exceed 70 characters"),
		payeeAccount: z.string().trim().min(1, "Payee account is required"),
		amount: amountSchema,
		purpose: z
			.string()
			.trim()
			.min(1, "Payment purpose is required")
			.min(3, "Purpose must contain at least 3 characters")
			.max(135, "Purpose cannot exceed 135 characters"),
	})
	.superRefine((values, context) => {
		const payerAccount = PAYER_ACCOUNTS.find((account) => account.iban === values.payerAccount);

		if (!payerAccount) {
			return;
		}

		if (payerAccount.balance < 0) {
			context.addIssue({
				code: "custom",
				path: ["payerAccount"],
				message: "No funds available for payment",
			});

			return;
		}

		if (values.amount > payerAccount.balance) {
			context.addIssue({
				code: "custom",
				path: ["amount"],
				message: "Not enough funds",
			});
		}
	});

export type PaymentFormInput = z.input<typeof paymentFormSchema>;
export type PaymentFormOutput = z.output<typeof paymentFormSchema>;
