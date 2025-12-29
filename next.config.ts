import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "api.dicebear.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "8080",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "127.0.0.1",
				port: "8080",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
