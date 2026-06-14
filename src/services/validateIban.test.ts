import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import {
	configureIbanValidationHttpError,
	configureIbanValidationResult,
	configureMalformedIbanValidationResponse,
	configurePendingIbanValidationRequest,
	observeIbanValidationRequest,
} from "../test/configure-mock-server";
import { IbanValidationTimeoutError, validateIban } from "./validateIban";

describe("validateIban", () => {
	it("returns true when the endpoint validates the IBAN", async () => {
		await expect(validateIban("LT307300010172619164")).resolves.toBe(true);
	});

	it("returns false when the endpoint rejects the IBAN", async () => {
		configureIbanValidationResult(false);

		await expect(validateIban("LT307300010172619164")).resolves.toBe(false);
	});

	it("sends the supplied IBAN as a query parameter", async () => {
		const suppliedIban = "LT30 7300+test";
		let receivedIban: string | null = null;

		observeIbanValidationRequest((iban) => {
			receivedIban = iban;
		});

		await validateIban(suppliedIban);

		expect(receivedIban).toBe(suppliedIban);
	});

	it("rejects a non-success HTTP response", async () => {
		configureIbanValidationHttpError(503);

		await expect(validateIban("LT307300010172619164")).rejects.toThrow("IBAN validation failed: 503");
	});

	it("rejects a malformed response payload", async () => {
		configureMalformedIbanValidationResponse();

		await expect(validateIban("LT307300010172619164")).rejects.toBeInstanceOf(ZodError);
	});

	it("aborts validation when the endpoint exceeds the timeout", async () => {
		configurePendingIbanValidationRequest();

		await expect(validateIban("LT307300010172619164", { timeoutMs: 10 })).rejects.toBeInstanceOf(
			IbanValidationTimeoutError,
		);
	});
});
