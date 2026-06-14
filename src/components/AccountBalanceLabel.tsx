import { Box, Typography } from "@mui/material";
import { type AmountLocale, formatAmount } from "../formatAmount";

type AccountBalanceLabelProps = {
	iban: string;
	balance: number;
	locale: AmountLocale;
};

export function AccountBalanceLabel({ iban, balance, locale }: AccountBalanceLabelProps) {
	const hasInsufficientFunds = balance < 0;

	return (
		<Box component="span" sx={{ display: "flex", justifyContent: "space-between", gap: 2, minWidth: 0, width: "100%" }}>
			<Typography
				component="span"
				variant="body1"
				sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
			>
				{iban}
			</Typography>
			<Box
				component="span"
				sx={{
					alignItems: "flex-end",
					color: hasInsufficientFunds ? "error.main" : "text.primary",
					display: "flex",
					flexDirection: "column",
					flexShrink: 0,
					lineHeight: 1.25,
					whiteSpace: "nowrap",
				}}
			>
				<Typography component="span" variant="body1">
					{formatAmount(balance, locale)} EUR
				</Typography>
				{hasInsufficientFunds && (
					<Typography component="span" variant="caption" sx={{ fontWeight: 500 }}>
						Insufficient funds
					</Typography>
				)}
			</Box>
		</Box>
	);
}
