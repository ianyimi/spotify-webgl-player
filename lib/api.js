import { spotifyApiNode } from "@/hooks/useSpotify";

const config = { limit: 50 };

export async function fetchPlaylistData( api, id ) {

	try {

		const { body, body: { tracks } } = await api.getPlaylist( id );
		if ( tracks.total < 50 ) {

			return {
				data: body,
				items: tracks.items
			};

		}

		const totalTracks = tracks.items;
		for ( let i = 1; i < Math.floor( tracks.total / 50 ) + 1; i ++ ) {

			const { body: { items: nextTracks } } = await api.getPlaylistTracks( id, { ...config, offset: i * 50 } );
			nextTracks.forEach( t => totalTracks.push( t ) );

		}

		return {
			data: body,
			items: totalTracks
		};


	} catch ( err ) {

		console.error( "Error fetching Playlist Tracks: ", err.body );

	}

}
