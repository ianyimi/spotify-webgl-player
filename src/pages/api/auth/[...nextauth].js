import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { LOGIN_URL } from "lib/spotify";
import { spotifyApi, spotifyApiNode } from "@/hooks/useSpotify";

async function refreshAccessToken( token ) {

	try {

		spotifyApi.setAccessToken( token.accessToken );
		spotifyApiNode.setAccessToken( token.accessToken );
		spotifyApiNode.setRefreshToken( token.refreshToken );
		spotifyApiNode.refreshAccessToken().then( ( data ) => {

			const refreshedToken = data.body[ "access_token" ];
			console.log( "REFRESHED TOKEN IS", refreshedToken );
			spotifyApiNode.setAccessToken( refreshedToken );
			return {
				...token,
				accessToken: refreshedToken,
				accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
				refreshToken: refreshedToken.refreshToken ?? token.refreshToken,
			};

		} );

	} catch ( error ) {

		console.error( error.message );
		return {
			...token,
			error: "RefreshAccessTokenError"
		};

	}

}

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

				console.log( "valid token" );
				return token;

			}

			// expired token
			console.log( "expired token is", token );
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
