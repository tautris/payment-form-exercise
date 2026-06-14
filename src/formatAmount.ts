export type AmountLocale = "en-US" | "lt-LT";

const AMOUNT_PATTERN = /^\d+(?:[.,]\d{1,2})?$/;

export function formatAmount(amount: number, locale: AmountLocale) {
	return new Intl.NumberFormat(locale, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
}

export function parseAmount(value: string) {
	const trimmedValue = value.trim();

	if (!AMOUNT_PATTERN.test(trimmedValue)) {
		return null;
	}

	return Number(trimmedValue.replace(",", "."));
}

export function getAmountDisplayValue(value: string, locale: AmountLocale, focused: boolean) {
	if (focused) {
		return value;
	}

	const amount = parseAmount(value);

	return amount === null ? value : formatAmount(amount, locale);
}
