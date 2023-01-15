import { z } from 'zod';
import { procedure, router } from '../trpc';
import { SpotifyApi } from '../context';
import { fetchPlaylistData, fetchUserCreatedPlaylists } from 'api';
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
	fetchUserCreatedPlaylists: procedure
		.use( isAuthorized )
		.query( async () => {

			const data = await fetchUserCreatedPlaylists( SpotifyApi );
			return {
				playlists: data.playlists,
				total: data.total
			};

		} ),
	fetchPlaylistData: procedure
		.use( isAuthorized )
		.input(
			z.object( {
				id: z.string()
			} )
		)
		.query( async ( { input } ) => {

			const data = await fetchPlaylistData( SpotifyApi, input.id );
			return {
				url: data.url,
				items: data.items
			};

		} ),
} );

// export type definition of API
export type AppRouter = typeof appRouter;
