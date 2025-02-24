import { registerAs } from '@nestjs/config';

interface payOSConfig {
	baseURL: string | undefined;
	clientId: string | undefined;
	apiKey: string | undefined;
	checksumKey: string | undefined;
}

export default registerAs(
	'payos-config',
	(): payOSConfig => ({
		baseURL: process.env.PAYOS_BASE_URL,
		clientId: process.env.PAYOS_CLIENT_ID,
		apiKey: process.env.PAYOS_API_KEY,
		checksumKey: process.env.PAYOS_CHECKSUM_KEY,
	}),
);
