import fs from "node:fs";
import * as path from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default ({ mode, command }: { mode: string; command: string }) => {
	const httpsOption = () => {
		if (
			(command !== "build" || mode === "development") &&
			process.env.CERT_NAME
		) {
			return {
				https: {
					key: fs.readFileSync(
						path.resolve(__dirname, `../certs/${process.env.CERT_NAME}.key`),
					),
					cert: fs.readFileSync(
						path.resolve(__dirname, `../certs/${process.env.CERT_NAME}.crt`),
					),
				},
			};
		}
	};

	return defineConfig({
		plugins: [reactRouter(), tsconfigPaths(), tailwindcss()],
		server: {
			strictPort: true,
			host: true,
			port: Number(process.env.VIRTUAL_PORT) || 3000,
			proxy: {},
			hmr: {
				port: Number(process.env.HMR_PORT) || 3001,
			},
			// // NOTE: 開発環境のみ設定のため、本番環境では別で設定する
			// headers: {
			//   'content-security-policy': `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' ; style-src 'unsafe-inline' ; connect-src 'self' ${process.env.VITE_BACKEND_BASE_URL} ;`,
			//   'x-frame-options': 'DENY',
			// },
			...httpsOption(),
		},
		preview: {
			port: Number(process.env.VIRTUAL_PORT),
		},
		resolve: {
			alias: {
				"~": path.resolve(__dirname, "app"),
			},
		},
	});
};
