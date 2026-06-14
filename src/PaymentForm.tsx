import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, InputAdornment, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { type ChangeEvent, type FocusEvent, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { AccountBalanceLabel } from "./components/AccountBalanceLabel";
import { PaymentSubmittedDialog } from "./components/PaymentSubmittedDialog";
import { PAYER_ACCOUNTS, type PaymentFormInput, type PaymentFormOutput, paymentFormSchema } from "./paymentFormSchema";
import { validateIban } from "./services/validateIban";

export function PaymentForm() {
	const [submittedPayment, setSubmittedPayment] = useState<PaymentFormOutput | null>(null);
	const {
		control,
		getFieldState,
		getValues,
		handleSubmit,
		register,
		reset,
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
	const purposeValue = useWatch({ control, name: "purpose" });

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

			setSubmittedPayment(values);
		} catch {
			setError("payeeAccount", {
				type: "server",
				message: "Unable to validate IBAN. Please try again.",
			});
		}
	};
	const createNewPayment = () => {
		reset();
		setSubmittedPayment(null);
	};

	return (
		<Stack component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off" spacing={{ xs: 3, sm: 4 }}>
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
								const { invalid: amountInvalid } = getFieldState("amount");
								const amountValue = getValues("amount");

								field.onChange(event);

								if (submitCount === 0 && payerAccountHadError) {
									await trigger("payerAccount");
								}

								if (amountValue.trim() !== "" || amountInvalid) {
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
					input: {
						endAdornment: <InputAdornment position="end">EUR</InputAdornment>,
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
				multiline
				minRows={2}
				error={Boolean(errors.purpose)}
				helperText={
					<Box component="span" sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
						<Typography component="span" variant="caption">
							{errors.purpose?.message}
						</Typography>
						<Typography component="span" variant="caption" sx={{ color: "text.disabled", whiteSpace: "nowrap" }}>
							{purposeValue.length}/135
						</Typography>
					</Box>
				}
			/>

			<Button type="submit" variant="contained" size="large" loading={isSubmitting} disabled={isSubmitting}>
				Submit payment
			</Button>
			<PaymentSubmittedDialog payment={submittedPayment} onCreateNewPayment={createNewPayment} />
		</Stack>
	);
}
