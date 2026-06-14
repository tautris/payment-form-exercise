import { CssBaseline, createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";

async function enableMocking() {
	if (!import.meta.env.DEV) {
		return;
	}

	const { worker } = await import("./mocks/browser");

	// `worker.start()` returns a Promise that resolves
	// once the Service Worker is up and ready to intercept requests.
	return worker.start();
}

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element not found");
}

let theme = createTheme({
	palette: {
		mode: "light",
	},
	typography: {
		fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
	},
});

theme = responsiveFontSizes(theme);

enableMocking().then(() => {
	createRoot(rootElement).render(
		<StrictMode>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<App />
			</ThemeProvider>
		</StrictMode>,
	);
});
