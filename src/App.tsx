import "./App.css";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { PaymentForm } from "./PaymentForm.tsx";

function App() {
	return (
		<Box
			component="main"
			sx={{
				minHeight: "100vh",
				bgcolor: "background.default",
				color: "text.primary",
				py: 4,
			}}
		>
			<Container maxWidth="sm">
				<Stack spacing={3}>
					<Box>
						<Typography component="h1" variant="h4" gutterBottom>
							New payment
						</Typography>
					</Box>

					<Paper
						elevation={0}
						sx={{
							p: { xs: 4, sm: 5 },
							border: 1,
							borderColor: "divider",
							borderRadius: 2,
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
