import { SpotifyApi, config, handleError } from "./index";

export async function fetchPlaylistData( api: SpotifyApi, id: string ) {

	try {

		const { body, body: { tracks } } = await api.getPlaylist( id );

		const totalTracks = tracks.items;
		for ( let i = 50; i < tracks.total; i += 50 ) {

			const { body: { items: nextTracks } } = await api.getPlaylistTracks( id, { ...config, offset: i * 50 } );
			nextTracks.forEach( t => totalTracks.push( t ) );

		}

		return {
			url: body.images[ 0 ].url,
			items: totalTracks
		};


	} catch ( err ) {

		return handleError( err );

	}

}
