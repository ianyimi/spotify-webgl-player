import { z } from 'zod';
import { procedure, router } from '../trpc';
import { SpotifyApi } from '../context';
import { fetchPlaylistData, fetchUserCreatedPlaylists, fetchUserLikedPlaylists } from 'api';
import { isAuthorized } from './_middleware';

const authorizedProcedure = procedure.use( isAuthorized );

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
	fetchUserLikedPlaylists: authorizedProcedure
		.query( async () => {

			const data = await fetchUserLikedPlaylists( SpotifyApi );
			return {
				playlists: data.playlists,
				total: data.total
			};

		} ),
	fetchUserCreatedPlaylists: authorizedProcedure
		.query( async () => {

			const data = await fetchUserCreatedPlaylists( SpotifyApi );
			return {
				playlists: data.playlists,
				total: data.total
			};

		} ),
	fetchPlaylistData: authorizedProcedure
		.input(
			z.object( {
				id: z.string()
			} )
		)
		.query( async ( { input } ) => {

			const data = await fetchPlaylistData( SpotifyApi, input.id );
			return {
				imageUrl: data.imageUrl,
				items: data.items
			};

		} ),
} );

// export type definition of API
export type AppRouter = typeof appRouter;
