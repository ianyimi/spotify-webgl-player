import { SpotifyApi, config, handleError } from "./index";

export async function fetchUserCreatedPlaylists( api: SpotifyApi ) {

	try {

		const { body: { id } } = await api.getMe();
		const { body, body: { items } } = await api.getUserPlaylists( id, config );

		const userCreatedPlaylists = items.filter( p => p.owner.id === id );
		if ( body.total < 50 ) {

			return {
				playlists: userCreatedPlaylists
			};

		}

		for ( let i = 50; i < body.total; i += 50 ) {

			const { body: { items: nextPagePlaylists } } = await api.getUserPlaylists( id, { ...config, offset: i * 50 } );
			nextPagePlaylists.forEach( p => {

				if ( p.owner.id === id ) {

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
