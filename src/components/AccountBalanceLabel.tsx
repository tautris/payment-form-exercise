import { Box } from "@mui/material";

type AccountBalanceLabelProps = {
	iban: string;
	balance: number;
};

export function AccountBalanceLabel({ iban, balance }: AccountBalanceLabelProps) {
	return (
		<Box component="span" sx={{ display: "flex", justifyContent: "space-between", gap: 2, minWidth: 0, width: "100%" }}>
			<Box component="span" sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
				{iban}
			</Box>
			<Box
				component="span"
				sx={{ color: balance < 0 ? "text.disabled" : "text.secondary", flexShrink: 0, whiteSpace: "nowrap" }}
			>
				{balance.toFixed(2)} EUR
			</Box>
		</Box>
	);
}
