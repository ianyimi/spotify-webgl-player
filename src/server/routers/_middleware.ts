import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";

export const isAuthorized = middleware( ( { next, ctx } ) => {

	if ( ! ctx.session ) {

		throw new TRPCError( {
			code: 'UNAUTHORIZED',
			message: 'You are not authorized',
		} );

	}

	return next( {
		ctx: {
			session: ctx.session
		}
	} );

} );

export type AppMiddleware = typeof isAuthorized
