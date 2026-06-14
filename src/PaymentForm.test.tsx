import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PaymentForm } from "./PaymentForm";
import { PAYER_ACCOUNTS } from "./paymentFormSchema";
import { observeIbanValidationRequest } from "./test/configure-mock-server";

describe("PaymentForm", () => {
	it("submits a valid payment and displays it for review", async () => {
		const user = userEvent.setup();
		let validatedIban: string | null = null;
		observeIbanValidationRequest((iban) => {
			validatedIban = iban;
		});
		render(<PaymentForm amountLocale="en-US" />);

		await user.click(screen.getByRole("combobox", { name: /payer account/i }));
		await user.click(screen.getByRole("option", { name: new RegExp(PAYER_ACCOUNTS[0].iban) }));
		await user.type(screen.getByRole("textbox", { name: /^payee$/i }), "Jane Doe");
		await user.type(screen.getByRole("textbox", { name: /payee account/i }), "LT307300010172619164");
		await user.type(screen.getByRole("textbox", { name: /amount/i }), "10.25");
		await user.type(screen.getByRole("textbox", { name: /purpose/i }), "Invoice payment");
		await user.click(screen.getByRole("button", { name: /submit payment/i }));

		const dialog = await screen.findByRole("dialog", { name: /payment submitted for review/i });

		expect(validatedIban).toBe("LT307300010172619164");
		expect(dialog).toHaveTextContent("10.25 EUR");
		expect(dialog).toHaveTextContent("Jane Doe");
		expect(dialog).toHaveTextContent("LT307300010172619164");
		expect(dialog).toHaveTextContent(PAYER_ACCOUNTS[0].iban);
		expect(dialog).toHaveTextContent("Invoice payment");
	});

	it("displays required-field feedback when an empty form is submitted", async () => {
		const user = userEvent.setup();
		render(<PaymentForm amountLocale="en-US" />);

		await user.click(screen.getByRole("button", { name: /submit payment/i }));

		expect(await screen.findByText("Payer account is required")).toBeVisible();
		expect(screen.getByText("Payee is required")).toBeVisible();
		expect(screen.getByText("Payee account is required")).toBeVisible();
		expect(screen.getByText("Amount is required")).toBeVisible();
		expect(screen.getByText("Payment purpose is required")).toBeVisible();
	});

	it("displays an error when the amount exceeds the selected account balance", async () => {
		const user = userEvent.setup();
		render(<PaymentForm amountLocale="en-US" />);

		await user.click(screen.getByRole("combobox", { name: /payer account/i }));
		await user.click(screen.getByRole("option", { name: new RegExp(PAYER_ACCOUNTS[1].iban) }));
		await user.type(screen.getByRole("textbox", { name: /amount/i }), "2.44");
		await user.tab();

		expect(await screen.findByText("Not enough funds")).toBeVisible();
	});
});
