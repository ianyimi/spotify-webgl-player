import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { LOGIN_URL } from "lib/spotify";
import { refreshAccessToken } from "@/server/context";

export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		SpotifyProvider( {
			clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
			clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
			authorization: LOGIN_URL,
		} )
		// ...add more providers here
	],
	// secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/login"
	},
	callbacks: {
		async jwt( { token, account, user } ) {

			// init signin
			if ( ( Boolean( account ) ) && ( Boolean( user ) ) ) {

				return {
					...token,
					accessToken: account.access_token,
					refreshToken: account.refresh_token,
					username: account.providerAccountId,
					accessTokenExpires: account.expires_at * 1000
				};

			}

			// active token
			if ( Date.now() < token.accessTokenExpires ) {

				return token;

			}

			// expired token
			return await refreshAccessToken( token );

		},
		async session( { session, token } ) {

			session.user.accessToken = token.accessToken;
			session.user.refreshToken = token.refreshToken;
			session.user.username = token.username;

			return session;

		}
	}
};
export default NextAuth( authOptions );
