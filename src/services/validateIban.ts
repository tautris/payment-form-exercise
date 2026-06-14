import { z } from "zod";

const ibanValidationResponseSchema = z.object({
	iban: z.string(),
	valid: z.boolean(),
});

export const IBAN_VALIDATION_TIMEOUT_MS = 10_000;

type ValidateIbanOptions = {
	timeoutMs?: number;
};

export class IbanValidationTimeoutError extends Error {
	constructor() {
		super("IBAN validation timed out");
		this.name = "IbanValidationTimeoutError";
	}
}

export async function validateIban(
	iban: string,
	{ timeoutMs = IBAN_VALIDATION_TIMEOUT_MS }: ValidateIbanOptions = {},
): Promise<boolean> {
	const url = new URL("https://matavi.eu/validate/");
	url.searchParams.set("iban", iban);
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const response = await fetch(url, { signal: controller.signal });

		if (!response.ok) {
			throw new Error(`IBAN validation failed: ${response.status}`);
		}

		const data: unknown = await response.json();
		const result = ibanValidationResponseSchema.parse(data);

		return result.valid;
	} catch (error) {
		if (controller.signal.aborted) {
			throw new IbanValidationTimeoutError();
		}

		throw error;
	} finally {
		clearTimeout(timeoutId);
	}
}
