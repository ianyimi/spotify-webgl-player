import { SpotifyApi, handleError, config } from "./index";

export async function fetchUserLikedPlaylists( api: SpotifyApi ) {

	try {

		const { body: { id } } = await api.getMe();
		const { body, body: { items } } = await api.getUserPlaylists( id, config );

		const userCreatedPlaylists = items.filter( p => p.collaborative === false );
		if ( body.total < 50 ) {

			return {
				playlists: userCreatedPlaylists,
				total: body.total
			};

		}

		for ( let i = 50; i < body.total; i += 50 ) {

			const { body: { items: nextPagePlaylists } } = await api.getUserPlaylists( id, { ...config, offset: i } );
			nextPagePlaylists.forEach( p => {

				if ( p.collaborative === false ) {

					userCreatedPlaylists.push( p );

				}

			} );

		}

		return {
			playlists: userCreatedPlaylists,
			total: body.total
		};

	} catch ( err ) {

		return handleError( err );

	}

}
