import { signIn } from "next-auth/react";
import { middleware } from "../trpc";

export const isAuthorized = middleware( ( { next, ctx } ) => {

	// REFRESH ACCESS TOKEN HERE
	if ( ctx?.session?.error === "ResfreshAccessTokenError" ) {

		console.log( "expired token" );
		// signIn( "spotify", { callbackUrl: "/" } );

	}

	return next( {
		ctx: {
			session: ctx.session
		}
	} );

} );

export type AppMiddleware = typeof isAuthorized
