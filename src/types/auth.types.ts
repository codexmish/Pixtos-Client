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