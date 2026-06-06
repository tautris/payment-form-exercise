import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";

const PAYER_ACCOUNTS = [
	{
		iban: "LT307300010172619160",
		id: "1",
		balance: 1000.12,
	},
	{
		iban: "LT307300010172619161",
		id: "2",
		balance: 2.43,
	},
	{
		iban: "LT307300010172619162",
		id: "3",
		balance: -5.87,
	},
];

export function PaymentForm() {
	return (
		<Stack component="form" noValidate autoComplete="off" spacing={4}>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<TextField required variant="outlined" fullWidth label="Payer Account" type="text" select>
					{PAYER_ACCOUNTS.map(({ iban, id, balance }) => (
						<MenuItem key={id} value={iban}>
							{iban} <Box sx={{ display: "inline", ml: 3 }}>{balance} EUR</Box>
						</MenuItem>
					))}
				</TextField>
			</Box>
			<TextField required variant="outlined" fullWidth label="Payee" type="text" />
			<TextField required variant="outlined" fullWidth label="Payee Account" type="text" />
			<TextField required variant="outlined" fullWidth label="Amount" type="text" />
			<TextField required variant="outlined" fullWidth label="Purpose" type="text" />

			<Button type="submit" variant="contained" size="large">
				Submit payment
			</Button>
		</Stack>
	);
}
