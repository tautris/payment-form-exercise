import { Box } from "@mui/material";

type AccountBalanceLabelProps = {
	iban: string;
	balance: number;
};

export function AccountBalanceLabel({ iban, balance }: AccountBalanceLabelProps) {
	return (
		<Box component="span" sx={{ display: "flex", justifyContent: "space-between", gap: 2, width: "100%" }}>
			<Box component="span">{iban}</Box>
			<Box component="span" sx={{ color: balance < 0 ? "text.disabled" : "text.secondary", whiteSpace: "nowrap" }}>
				{balance.toFixed(2)} EUR
			</Box>
		</Box>
	);
}
