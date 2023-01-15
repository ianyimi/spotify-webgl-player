import { SpotifyApi, config, handleError } from "./index";

export type PlaylistData = {
  imageUrl: string,
  items: SpotifyApi.PlaylistTrackObject[]
}

const PLAYLIST_TRACK_FIELDS = "track(album,popularity,is_local,artists,duration_ms,explicit,href,id,is_playable,restrictions,name,track_number,type,uri)";

export async function fetchPlaylistData( api: SpotifyApi, id: string ): Promise<PlaylistData> {

	try {

		const { body, body: { tracks } } = await api.getPlaylist( id );

		const totalTracks = tracks.items;
		for ( let i = 50; i < tracks.total; i += 50 ) {

			const { body: { items: nextTracks } } = await api.getPlaylistTracks( id, { ...config, fields: PLAYLIST_TRACK_FIELDS, offset: i * 50 } );
			nextTracks.forEach( t => totalTracks.push( t ) );

		}

		return {
			imageUrl: body.images[ 0 ].url,
			items: totalTracks
		};


	} catch ( err ) {

		return handleError( err );

	}

}
