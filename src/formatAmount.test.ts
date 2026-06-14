import { describe, expect, it } from "vitest";
import { formatAmount, getAmountDisplayValue, parseAmount } from "./formatAmount";

describe("formatAmount", () => {
	it("formats an amount using English separators", () => {
		expect(formatAmount(1000.01, "en-US")).toBe("1,000.01");
	});

	it("formats an amount using Lithuanian separators", () => {
		expect(formatAmount(1000.01, "lt-LT")).toBe("1\u00a0000,01");
	});

	it.each([
		["en-US", "1,000.00", "1,000.50"],
		["lt-LT", "1\u00a0000,00", "1\u00a0000,50"],
	] as const)("keeps exactly two fraction digits for %s", (locale, wholeAmount, oneDecimalAmount) => {
		expect(formatAmount(1000, locale)).toBe(wholeAmount);
		expect(formatAmount(1000.5, locale)).toBe(oneDecimalAmount);
	});
});

describe("parseAmount", () => {
	it.each([
		["10.25", 10.25],
		["10,25", 10.25],
	] as const)("parses the ungrouped value %s", (value, expected) => {
		expect(parseAmount(value)).toBe(expected);
	});

	it.each(["", "abc", "1.234", "1,00,0", "1,000.01", "1\u00a0000,01"])("returns null for invalid value %s", (value) => {
		expect(parseAmount(value)).toBeNull();
	});
});

describe("getAmountDisplayValue", () => {
	it("keeps the editable value while focused", () => {
		expect(getAmountDisplayValue("1000,01", "en-US", true)).toBe("1000,01");
	});

	it.each([
		["en-US", "1,000.01"],
		["lt-LT", "1\u00a0000,01"],
	] as const)("formats a valid blurred value for %s", (locale, expected) => {
		expect(getAmountDisplayValue("1000.01", locale, false)).toBe(expected);
	});

	it("preserves invalid text while blurred", () => {
		expect(getAmountDisplayValue("invalid", "en-US", false)).toBe("invalid");
	});
});
