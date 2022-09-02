import { SESSION_MAXAGE_HOURS } from "$env/static/private";
import { decodeB64URL } from "$lib/util";
import { error, type RequestHandler } from "@sveltejs/kit";
import cookie from "cookie";
import { z } from "zod";
import { loginOrCreateAccount } from "./common";
import { getIdentityFromURL, getEncoder, getDecoder } from "../common";
import { identMethods } from "../identMethods";

export const PassedSignInState = z.object({
	state: z.string(),
	rememberMe: z.boolean(),
	referer: z.string(),
	method: identMethods,
});
export type PassedSignInState = z.infer<typeof PassedSignInState>;

export const GET: RequestHandler = async ({ url, locals: { state } }) => {
	const options = getDecoder(PassedSignInState).parse(url.searchParams.get("state"));
	if (options.state !== state) throw error(400, "invalid state");

	const acd = await getIdentityFromURL(url, options.method);
	const { userID, newSessionToken } = await loginOrCreateAccount(acd);

	const cookieOpts: cookie.CookieSerializeOptions = {
		maxAge: options.rememberMe ? +SESSION_MAXAGE_HOURS * 60 * 60 : undefined,
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: true,
	};

	const headers = new Headers({
		location: new URL(options.referer, url).href,
	});
	headers.append("set-cookie", cookie.serialize("userID", userID, cookieOpts));
	headers.append("set-cookie", cookie.serialize("sessionToken", newSessionToken, cookieOpts));
	headers.append("set-cookie", cookie.serialize("state", "", { maxAge: 0 }));

	return new Response(null, {
		status: 303,
		headers,
	});
};
