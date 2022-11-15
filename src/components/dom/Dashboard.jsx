import { useSession, signOut } from "next-auth/react";
import useSpotify from "@/hooks/useSpotify";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
// import { useSpotifyStore } from "@/hooks/useSpotifyStore";
import { useSpotifyStore, useStore } from "@/context/SpotifyProvider";
import shallow from "zustand/shallow";

export default function Dashboard( props ) {

	const spotifyApi = useSpotify();
	const { data: session } = useSession();

	const { playlists, tracks, fetchPlaylistData, fetchLikedTracks } = useSpotifyStore( state => ( {
		playlists: state.playlists,
		tracks: state.tracks,
		fetchPlaylistData: state.fetchPlaylistData,
		fetchLikedTracks: state.fetchLikedTracks,
	} ), shallow );

	useEffect( () => {

		if ( Boolean( spotifyApi.getAccessToken() ) ) {

			console.log( "true" );
			// fetchPlaylistData();
			// fetchLikedTracks();

		}

		console.log( "false" );

	}, [ spotifyApi ] );

	const topPlaylists = [];
	if ( ( Boolean( playlists ) ) && playlists.length > 0 ) {

		playlists.forEach( playlist => {

			topPlaylists.push(
				<div key={playlist.id}>
					{( Boolean( playlist.images ) ) && playlist.images.length > 0 &&
            <Image
            	alt={playlist.description}
            	src={playlist?.images[ 1 ].url}
            	width={playlist.images[ 1 ].width}
            	height={playlist.images[ 1 ].height}
            />
					}
					{playlist.name}
				</div>
			);

		} );

	}

	console.log( "playlists are: ", playlists );
	console.log( "tracks are: ", tracks );

	return (
		<div {...props}>
			<button onClick={() => signOut()}>Logout</button>
			{topPlaylists}
		</div>
	);

}
