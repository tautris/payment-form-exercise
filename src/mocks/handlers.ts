import { delay, HttpResponse, http } from "msw";

export const handlers = [
	http.all("*", async () => {
		await delay(1500);
	}),

	http.get("https://matavi.eu/validate/", ({ request }) => {
		const url = new URL(request.url);
		const iban = url.searchParams.get("iban");

		if (!iban) {
			return new HttpResponse('Please provide an "iban" parameter.', { status: 400 });
		}

		return HttpResponse.json({ iban, valid: true });
	}),
];
