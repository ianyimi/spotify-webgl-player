import { SpotifyApi, config, handleError } from "./index";

export type PlaylistData = {
  imageUrl: string,
  items: SpotifyApi.PlaylistTrackObject[]
}

const PLAYLIST_TRACK_FIELDS = "items(is_local,track(album(name,artists,href),popularity,is_local,artists,duration_ms,explicit,href,id,is_playable,restrictions,name,track_number,type,uri))";

export async function fetchPlaylistData( api: SpotifyApi, id: string ): Promise<PlaylistData> {

	try {

		const { body, body: { tracks } } = await api.getPlaylist( id );

		const totalTracks = tracks.items;
		for ( let i = 50; i < tracks.total; i += 50 ) {

			const { body: { items: nextTracks } } = await api.getPlaylistTracks( id, { fields: PLAYLIST_TRACK_FIELDS, offset: i * 50, ...config } );
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
