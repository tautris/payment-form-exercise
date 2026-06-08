import { delay, http } from "msw";
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

const browserDelayHandler = http.all("*", async () => {
	await delay(1500);
});

export const worker = setupWorker(browserDelayHandler, ...handlers);
