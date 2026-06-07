import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import type { ChangeEvent, FocusEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { AccountBalanceLabel } from "./components/AccountBalanceLabel";
import { validateIban } from "./services/validateIban";

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
		payerAccount: z
			.string()
			.min(1, "Payer account is required")
			.refine((iban) => PAYER_ACCOUNTS.some((account) => account.iban === iban), "Select a valid payer account"),
		payee: z.string().trim().min(1, "Payee is required").max(70, "Payee cannot exceed 70 characters"),
		payeeAccount: z.string().trim().min(1, "Payee account is required"),
		amount: amountSchema,
		purpose: z
			.string()
			.trim()
			.min(1, "Payment purpose is required")
			.min(3, "Purpose must contain at least 3 characters")
			.max(135, "Purpose cannot exceed 135 characters"),
	})
	.superRefine((values, context) => {
		const payerAccount = PAYER_ACCOUNTS.find((account) => account.iban === values.payerAccount);

		if (!payerAccount) {
			return;
		}

		if (payerAccount.balance < 0) {
			context.addIssue({
				code: "custom",
				path: ["payerAccount"],
				message: "No funds available for payment",
			});

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
		getFieldState,
		handleSubmit,
		register,
		trigger,
		setError,
		formState: { errors, isSubmitting, submitCount },
	} = useForm<PaymentFormInput, undefined, PaymentFormOutput>({
		defaultValues: {
			payerAccount: "",
			payee: "",
			payeeAccount: "",
			amount: "",
			purpose: "",
		},
		resolver: zodResolver(paymentFormSchema),
		mode: "onSubmit",
		reValidateMode: "onChange",
	});

	const validateOnBlur =
		(
			fieldName: "payee" | "payeeAccount" | "amount" | "purpose",
			onBlur: (event: FocusEvent<HTMLInputElement>) => void,
		) =>
		async (event: FocusEvent<HTMLInputElement>) => {
			onBlur(event);

			if (submitCount === 0 && event.target.value.trim() !== "") {
				await trigger(fieldName);
			}
		};
	const revalidateErrorOnChange =
		(
			fieldName: "payee" | "payeeAccount" | "amount" | "purpose",
			onChange: (event: ChangeEvent<HTMLInputElement>) => void,
		) =>
		async (event: ChangeEvent<HTMLInputElement>) => {
			const hadError = getFieldState(fieldName).invalid;

			onChange(event);

			if (submitCount === 0 && hadError) {
				await trigger(fieldName);
			}
		};

	const payeeField = register("payee");
	const payeeAccountField = register("payeeAccount");
	const amountField = register("amount");
	const purposeField = register("purpose");

	const onSubmit = async (values: PaymentFormOutput) => {
		try {
			const valid = await validateIban(values.payeeAccount);

			if (!valid) {
				setError("payeeAccount", {
					type: "server",
					message: "Invalid IBAN",
				});
				return;
			}

			console.log(values);
		} catch {
			setError("payeeAccount", {
				type: "server",
				message: "Unable to validate IBAN. Please try again.",
			});
		}
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
							onBlur={async () => {
								field.onBlur();

								if (submitCount === 0 && field.value !== "") {
									await trigger("payerAccount");
								}
							}}
							onChange={async (event) => {
								const payerAccountHadError = getFieldState("payerAccount").invalid;
								const { isTouched: amountTouched, invalid: amountInvalid } = getFieldState("amount");

								field.onChange(event);

								if (submitCount === 0 && payerAccountHadError) {
									await trigger("payerAccount");
								}

								if (amountTouched || amountInvalid) {
									await trigger("amount");
								}
							}}
						>
							{PAYER_ACCOUNTS.map(({ iban, id, balance }) => (
								<MenuItem key={id} value={iban}>
									<AccountBalanceLabel iban={iban} balance={balance} />
								</MenuItem>
							))}
						</TextField>
					)}
				/>
			</Box>
			<TextField
				{...payeeField}
				onBlur={validateOnBlur("payee", payeeField.onBlur)}
				onChange={revalidateErrorOnChange("payee", payeeField.onChange)}
				required
				variant="outlined"
				fullWidth
				label="Payee"
				type="text"
				error={Boolean(errors.payee)}
				helperText={errors.payee?.message}
			/>
			<TextField
				{...payeeAccountField}
				onBlur={validateOnBlur("payeeAccount", payeeAccountField.onBlur)}
				onChange={revalidateErrorOnChange("payeeAccount", payeeAccountField.onChange)}
				required
				variant="outlined"
				fullWidth
				label="Payee Account"
				type="text"
				error={Boolean(errors.payeeAccount)}
				helperText={errors.payeeAccount?.message}
			/>
			<TextField
				{...amountField}
				onBlur={validateOnBlur("amount", amountField.onBlur)}
				onChange={revalidateErrorOnChange("amount", amountField.onChange)}
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
				error={Boolean(errors.amount)}
				helperText={errors.amount?.message}
			/>
			<TextField
				{...purposeField}
				onBlur={validateOnBlur("purpose", purposeField.onBlur)}
				onChange={revalidateErrorOnChange("purpose", purposeField.onChange)}
				required
				variant="outlined"
				fullWidth
				label="Purpose"
				type="text"
				error={Boolean(errors.purpose)}
				helperText={errors.purpose?.message}
			/>

			<Button type="submit" variant="contained" size="large" loading={isSubmitting} disabled={isSubmitting}>
				Submit payment
			</Button>
		</Stack>
	);
}
