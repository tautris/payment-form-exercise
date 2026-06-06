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

const amountSchema = z
	.string()
	.trim()
	.min(1, "Amount is required")
	.regex(/^\d+(?:[.,]\d{1,2})?$/, "Enter a valid amount")
	.transform((value) => Number(value.replace(",", ".")))
	.pipe(z.number().min(0.01, "Minimum amount is 0.01"));

const paymentFormSchema = z
	.object({
		payerAccount: z.string().min(1, "Payer account is required"),
		payee: z.string().trim().min(1, "Payee is required").max(70, "Payee cannot exceed 70 characters"),
		payeeAccount: z.string().trim().min(1, "Payee account is required"), // have to validate using an endpoint
		amount: amountSchema,
		purpose: z
			.string()
			.min(3, "Purpose must contain at least 3 characters")
			.max(135, "Purpose cannot exceed 135 characters"),
	})
	.superRefine((values, context) => {
		const payerAccount = PAYER_ACCOUNTS.find((account) => account.iban === values.payerAccount);

		if (!payerAccount) {
			return;
		}

		if (values.amount > payerAccount.balance) {
			context.addIssue({
				code: "custom",
				path: ["amount"],
				message: `Not enough funds`,
			});
		}
	});

type PaymentFormInput = z.input<typeof paymentFormSchema>;
type PaymentFormOutput = z.output<typeof paymentFormSchema>;

export function PaymentForm() {
	const {
		control,
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<PaymentFormInput, undefined, PaymentFormOutput>({
		defaultValues: {
			payerAccount: "",
			payee: "",
			payeeAccount: "",
			amount: "",
			purpose: "",
		},
		resolver: zodResolver(paymentFormSchema),
	});

	const onSubmit = (values: PaymentFormOutput) => {
		console.log(values);
	};

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
							error={Boolean(errors.payerAccount)}
							helperText={errors.payerAccount?.message}
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
			<TextField
				required
				variant="outlined"
				fullWidth
				label="Payee"
				type="text"
				{...register("payee")}
				error={Boolean(errors.payee)}
				helperText={errors.payee?.message}
			/>
			<TextField
				required
				variant="outlined"
				fullWidth
				label="Payee Account"
				type="text"
				{...register("payeeAccount")}
				error={Boolean(errors.payeeAccount)}
				helperText={errors.payeeAccount?.message}
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
				error={Boolean(errors.amount)}
				helperText={errors.amount?.message}
			/>
			<TextField
				required
				variant="outlined"
				fullWidth
				label="Purpose"
				type="text"
				{...register("purpose")}
				error={Boolean(errors.purpose)}
				helperText={errors.purpose?.message}
			/>

			<Button type="submit" variant="contained" size="large">
				Submit payment
			</Button>
		</Stack>
	);
}
