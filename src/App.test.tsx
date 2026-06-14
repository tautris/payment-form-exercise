import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";
import { PAYER_ACCOUNTS } from "./paymentFormSchema";

describe("App", () => {
	it("formats amounts using the selected language", async () => {
		const user = userEvent.setup();
		render(<App />);
		const amount = screen.getByRole("textbox", { name: /amount/i });

		await user.type(amount, "1000.01");
		await user.tab();
		expect(amount).toHaveValue("1,000.01");

		await user.click(screen.getByRole("combobox", { name: /amount format/i }));
		await user.click(screen.getByRole("option", { name: "Lithuanian" }));
		expect(amount).toHaveValue("1\u00a0000,01");

		await user.click(screen.getByRole("combobox", { name: /payer account/i }));
		expect(screen.getByRole("option", { name: new RegExp(PAYER_ACCOUNTS[0].iban) })).toHaveTextContent("1 000,12 EUR");
	});
});
