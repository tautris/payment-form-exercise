import { z } from "zod";

const ibanValidationResponseSchema = z.object({
	iban: z.string(),
	valid: z.boolean(),
});

export async function validateIban(iban: string): Promise<boolean> {
	const url = new URL("https://matavi.eu/validate/");
	url.searchParams.set("iban", iban);

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`IBAN validation failed: ${response.status}`);
	}

	const data: unknown = await response.json();
	const result = ibanValidationResponseSchema.parse(data);

	return result.valid;
}
