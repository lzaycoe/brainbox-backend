export interface JwtRefreshPayload {
	sub: string;
	role: string;
	iat: number;
	exp: number;
}
