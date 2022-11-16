import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import usePostprocess from "@/templates/hooks/usePostprocess";
import useSpotify from "@/hooks/useSpotify";
import { useSpotifyStore } from "@/hooks/useSpotifyStore";
import shallow from "zustand/shallow";
import { useEffect } from "react";

export default function Scene( { children, ...props } ) {

	const spotifyApi = useSpotify();
	const { fetchPlaybackData, fetchPlaylistData, fetchLikedTracks } = useSpotifyStore( state => ( {
		fetchPlaybackData: state.fetchPlaybackData,
		fetchPlaylistData: state.fetchPlaylistData,
		fetchLikedTracks: state.fetchLikedTracks,
	} ), shallow );

	useEffect( () => {

		if ( Boolean( spotifyApi.getAccessToken() ) ) {

			fetchPlaybackData( spotifyApi );
			fetchPlaylistData( spotifyApi );
			fetchLikedTracks( spotifyApi );

		}

	}, [ spotifyApi ] );

	// Everything defined in here will persist between route changes, only children are swapped
	return (
		<Canvas {...props}>
			<directionalLight position={[ 0, 2, - 3 ]} intensity={0.75}/>
			{/*<ambientLight intensity={0.75}/>*/}
			{children}
			<Preload all/>
			{/*<OrbitControls/>*/}
		</Canvas>
	);

}
