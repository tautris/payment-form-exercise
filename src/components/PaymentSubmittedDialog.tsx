import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { type AmountLocale, formatAmount } from "../formatAmount";
import type { PaymentFormOutput } from "../paymentFormSchema";

type PaymentSubmittedDialogProps = {
	payment: PaymentFormOutput | null;
	locale: AmountLocale;
	onCreateNewPayment: () => void;
};

export function PaymentSubmittedDialog({ payment, locale, onCreateNewPayment }: PaymentSubmittedDialogProps) {
	const summary = payment
		? [
				{ label: "Amount", value: `${formatAmount(payment.amount, locale)} EUR` },
				{ label: "Payee", value: payment.payee },
				{ label: "Payee account", value: payment.payeeAccount },
				{ label: "Payer account", value: payment.payerAccount },
				{ label: "Purpose", value: payment.purpose },
			]
		: [];

	return (
		<Dialog open={payment !== null} fullWidth maxWidth="sm" aria-labelledby="payment-submitted-title">
			<DialogTitle id="payment-submitted-title">Payment submitted for review</DialogTitle>
			<DialogContent dividers>
				<Stack component="dl" spacing={2.5} sx={{ m: 0 }}>
					{summary.map(({ label, value }) => (
						<Box key={label}>
							<Typography component="dt" variant="body2" color="text.secondary">
								{label}
							</Typography>
							<Typography component="dd" variant="body1" sx={{ m: 0, overflowWrap: "anywhere" }}>
								{value}
							</Typography>
						</Box>
					))}
				</Stack>
			</DialogContent>
			<DialogActions sx={{ p: 3 }}>
				<Button onClick={onCreateNewPayment} variant="contained" autoFocus>
					Create new payment
				</Button>
			</DialogActions>
		</Dialog>
	);
}
