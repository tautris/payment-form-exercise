import { delay, HttpResponse, http } from "msw";
import { server } from "../mocks/server";

const VALIDATE_IBAN_URL = "https://matavi.eu/validate/";

export function configureIbanValidationResult(valid: boolean) {
	server.use(
		http.get(VALIDATE_IBAN_URL, ({ request }) => {
			const iban = new URL(request.url).searchParams.get("iban");

			return HttpResponse.json({ iban, valid });
		}),
	);
}

export function observeIbanValidationRequest(onRequest: (iban: string | null) => void) {
	server.use(
		http.get(VALIDATE_IBAN_URL, ({ request }) => {
			const iban = new URL(request.url).searchParams.get("iban");
			onRequest(iban);

			return HttpResponse.json({ iban, valid: true });
		}),
	);
}

export function configureIbanValidationHttpError(status: number) {
	server.use(http.get(VALIDATE_IBAN_URL, () => new HttpResponse(null, { status })));
}

export function configureMalformedIbanValidationResponse() {
	server.use(http.get(VALIDATE_IBAN_URL, () => HttpResponse.json({ valid: "yes" })));
}

export function configurePendingIbanValidationRequest() {
	server.use(
		http.get(VALIDATE_IBAN_URL, async () => {
			await delay("infinite");

			return new HttpResponse();
		}),
	);
}
