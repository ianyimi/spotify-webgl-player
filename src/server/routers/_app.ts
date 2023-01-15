import { z } from 'zod';
import { procedure, router } from '../trpc';
import { SpotifyApi } from '../context';
import { fetchUserCreatedPlaylists } from 'lib/api';

export const appRouter = router( {
	hello: procedure
		.input(
			z.object( {
				text: z.string(),
			} ),
		)
		.query( ( { input } ) => {

			return {
				greeting: `hello ${input.text}`,
			};

		} ),
	fetchCreatedPlaylists: procedure
		.query( async () => {

			const data = await fetchUserCreatedPlaylists( SpotifyApi );
			console.log( "🚀 ~ file: _app.ts:24 ~ .query ~ SpotifyApi", SpotifyApi );
			console.log( "🚀 ~ file: _app.ts:29 ~ .query ~ data", await data );
			return {
				playlists: await data
			};

		} )
} );

// export type definition of API
export type AppRouter = typeof appRouter;
