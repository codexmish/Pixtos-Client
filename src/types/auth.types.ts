export interface ISignIn {
	email: string;
	password: string;
}

export interface ISignup {
	name: string;
	email: string;
	password: string;
}

export interface IOtpVerify {
	email: string;
	otp: string;
}

export interface IResetPassword {
	email: string;
	otp: string;
	newPassword: string;
}