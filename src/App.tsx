import "./App.css";
import { Box, Container, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import type { AmountLocale } from "./formatAmount";
import { PaymentForm } from "./PaymentForm";

function App() {
	const [amountLocale, setAmountLocale] = useState<AmountLocale>("en-US");

	return (
		<Box
			component="main"
			sx={{
				minHeight: "100vh",
				bgcolor: "background.default",
				color: "text.primary",
				py: { xs: 2, sm: 4 },
			}}
		>
			<Container maxWidth="sm" sx={{ px: { xs: 2 } }}>
				<Stack spacing={3}>
					<Box
						sx={{
							display: "flex",
							flexDirection: { xs: "column", sm: "row" },
							alignItems: { xs: "stretch", sm: "center" },
							justifyContent: "space-between",
							gap: 2,
						}}
					>
						<Typography component="h1" variant="h4">
							New payment
						</Typography>
						<TextField
							select
							size="small"
							label="Amount format"
							value={amountLocale}
							onChange={(event) => setAmountLocale(event.target.value as AmountLocale)}
							sx={{ alignSelf: { xs: "flex-end", sm: "center" }, width: 160 }}
						>
							<MenuItem value="en-US">English</MenuItem>
							<MenuItem value="lt-LT">Lithuanian</MenuItem>
						</TextField>
					</Box>

					<Paper
						elevation={0}
						sx={{
							p: { xs: 0, sm: 5 },
							border: { xs: 0, sm: 1 },
							borderColor: "divider",
							borderRadius: { xs: 0, sm: 2 },
						}}
					>
						<PaymentForm amountLocale={amountLocale} />
					</Paper>
				</Stack>
			</Container>
		</Box>
	);
}

export default App;
