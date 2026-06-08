import "./App.css";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { PaymentForm } from "./PaymentForm";

function App() {
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
					<Box>
						<Typography component="h1" variant="h4" gutterBottom>
							New payment
						</Typography>
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
						<PaymentForm />
					</Paper>
				</Stack>
			</Container>
		</Box>
	);
}

export default App;
