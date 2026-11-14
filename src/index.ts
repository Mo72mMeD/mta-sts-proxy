
// Proxies the Cloudflare Email Service MTA-STS policy
// and overrides enforcement mode to testing.

const POLICY_URL =
	"https://mta-sts.mx.cloudflare.net/.well-known/mta-sts.txt";

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const upstream = await fetch(POLICY_URL);

		if (!upstream.ok) {
			return new Response("Unable to fetch MTA-STS policy", {
				status: 502,
			});
		}

		const policy = await upstream.text();

		const testingPolicy = policy.replace(
			/^mode:\s*enforce\s*$/im,
			"mode: testing",
		);

		return new Response(testingPolicy, {
			status: 200,
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Cache-Control": "public, max-age=3600",
			},
		});
	},
} satisfies ExportedHandler<Env>;
