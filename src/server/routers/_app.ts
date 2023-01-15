import { z } from 'zod';
import { procedure, router } from '../trpc';
import { SpotifyApi } from '../context';
import { fetchUserCreatedPlaylists } from 'api';
import { isAuthorized } from './_middleware';

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
		.use( isAuthorized )
		.query( async () => {

			const data = await fetchUserCreatedPlaylists( SpotifyApi );
			return {
				playlists: data.playlists,
				total: data.total
			};

		} )
} );

// export type definition of API
export type AppRouter = typeof appRouter;
