import { Box } from "@mui/material";

type AccountBalanceLabelProps = {
	iban: string;
	balance: number;
};

export function AccountBalanceLabel({ iban, balance }: AccountBalanceLabelProps) {
	const hasInsufficientFunds = balance < 0;

	return (
		<Box component="span" sx={{ display: "flex", justifyContent: "space-between", gap: 2, minWidth: 0, width: "100%" }}>
			<Box component="span" sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
				{iban}
			</Box>
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
				<Box component="span">{balance.toFixed(2)} EUR</Box>
				{hasInsufficientFunds && (
					<Box component="span" sx={{ fontSize: "0.75rem", fontWeight: 500 }}>
						Insufficient funds
					</Box>
				)}
			</Box>
		</Box>
	);
}
