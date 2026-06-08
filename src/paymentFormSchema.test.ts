import { describe, expect, it } from "vitest";
import { PAYER_ACCOUNTS, paymentFormSchema } from "./paymentFormSchema";

const VALID_PAYMENT_INPUT = {
	payerAccount: PAYER_ACCOUNTS[0].iban,
	payee: "Jane Doe",
	payeeAccount: "LT307300010172619164",
	amount: "10.25",
	purpose: "Invoice payment",
};

function expectValidationIssue(
	overrides: Partial<typeof VALID_PAYMENT_INPUT>,
	expectedPath: keyof typeof VALID_PAYMENT_INPUT,
	expectedMessage: string,
) {
	const result = paymentFormSchema.safeParse({ ...VALID_PAYMENT_INPUT, ...overrides });

	expect(result.success).toBe(false);
	// Guard for type safety going forward
	if (result.success) {
		return;
	}

	expect(result.error.issues).toContainEqual(
		expect.objectContaining({
			path: [expectedPath],
			message: expectedMessage,
		}),
	);
}

describe("paymentFormSchema", () => {
	it("accepts a valid payment and converts the amount to a number", () => {
		const result = paymentFormSchema.parse(VALID_PAYMENT_INPUT);

		expect(result.amount).toBe(10.25);
	});

	it.each([
		["payerAccount", "Payer account is required"],
		["payee", "Payee is required"],
		["payeeAccount", "Payee account is required"],
		["amount", "Amount is required"],
		["purpose", "Payment purpose is required"],
	] as const)("requires %s", (field, message) => {
		expectValidationIssue({ [field]: "" }, field, message);
	});

	it.each([
		["payee longer than 70 characters", { payee: "a".repeat(71) }, "payee", "Payee cannot exceed 70 characters"],
		["purpose shorter than 3 characters", { purpose: "ab" }, "purpose", "Purpose must contain at least 3 characters"],
		[
			"purpose longer than 135 characters",
			{ purpose: "a".repeat(136) },
			"purpose",
			"Purpose cannot exceed 135 characters",
		],
		["amount below 0.01", { amount: "0" }, "amount", "Minimum amount is 0.01"],
		["amount with more than 2 decimal places", { amount: "1.234" }, "amount", "Enter a valid amount"],
		["non-numeric amount", { amount: "abc" }, "amount", "Enter a valid amount"],
	] as const)("rejects %s", (_name, overrides, field, message) => {
		expectValidationIssue(overrides, field, message);
	});

	it.each([
		["payee with 70 characters", { payee: "a".repeat(70) }],
		["purpose with 3 characters", { purpose: "a".repeat(3) }],
		["purpose with 135 characters", { purpose: "a".repeat(135) }],
		["minimum amount of 0.01", { amount: "0.01" }],
	] as const)("accepts %s", (_name, overrides) => {
		expect(paymentFormSchema.safeParse({ ...VALID_PAYMENT_INPUT, ...overrides }).success).toBe(true);
	});

	it("accepts a comma decimal separator and converts the amount to a number", () => {
		const result = paymentFormSchema.parse({ ...VALID_PAYMENT_INPUT, amount: "10,25" });

		expect(result.amount).toBe(10.25);
	});

	it("rejects an unknown payer account", () => {
		expectValidationIssue({ payerAccount: "LT000000000000000000" }, "payerAccount", "Select a valid payer account");
	});

	it("rejects an amount above the selected account balance", () => {
		expectValidationIssue({ payerAccount: PAYER_ACCOUNTS[1].iban, amount: "2.44" }, "amount", "Not enough funds");
	});

	it("accepts an amount equal to the selected account balance", () => {
		const result = paymentFormSchema.safeParse({
			...VALID_PAYMENT_INPUT,
			payerAccount: PAYER_ACCOUNTS[1].iban,
			amount: "2.43",
		});

		expect(result.success).toBe(true);
	});

	it("rejects a payer account with a negative balance", () => {
		expectValidationIssue({ payerAccount: PAYER_ACCOUNTS[2].iban }, "payerAccount", "No funds available for payment");
	});
});
