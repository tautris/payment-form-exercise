import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

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

const paymentFormSchema = z.object({
	payerAccount: z.string(),
	payee: z.string().max(70),
	payeeAccount: z.string(), // have to validate using an endpoint
	amount: z.string(), // min 0.01, max should be balance for a selected payee account
	purpose: z.string().min(3).max(135),
});

type PaymentFormValues = {
	payerAccount: string;
	payee: string;
	payeeAccount: string;
	amount: string;
	purpose: string;
};

export function PaymentForm() {
	const {
		control,
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<PaymentFormValues>({
		defaultValues: {
			payerAccount: "",
			payee: "",
			payeeAccount: "",
			amount: "",
			purpose: "",
		},
		resolver: zodResolver(paymentFormSchema),
	});

	const onSubmit = (values: PaymentFormValues) => console.log(values);

	console.log("errors", errors);

	return (
		<Stack component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off" spacing={4}>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Controller
					name="payerAccount"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							required
							variant="outlined"
							fullWidth
							label="Payer Account"
							select
							value={field.value ?? ""}
						>
							{PAYER_ACCOUNTS.map(({ iban, id, balance }) => (
								<MenuItem key={id} value={iban}>
									{iban} <Box sx={{ display: "inline", ml: 3 }}>{balance} EUR</Box>
								</MenuItem>
							))}
						</TextField>
					)}
				/>
			</Box>
			<TextField required variant="outlined" fullWidth label="Payee" type="text" {...register("payee")} />
			<TextField
				required
				variant="outlined"
				fullWidth
				label="Payee Account"
				type="text"
				{...register("payeeAccount")}
			/>
			<TextField
				required
				variant="outlined"
				fullWidth
				label="Amount"
				type="text"
				slotProps={{
					htmlInput: {
						inputMode: "decimal",
					},
				}}
				{...register("amount")}
			/>
			<TextField required variant="outlined" fullWidth label="Purpose" type="text" {...register("purpose")} />

			<Button type="submit" variant="contained" size="large">
				Submit payment
			</Button>
		</Stack>
	);
}
