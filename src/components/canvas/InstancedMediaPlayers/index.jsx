import { useRef } from "react";
import * as THREE from "three";
import { useSpotifyStore } from "@/hooks/useSpotifyStore";
import VintageTelevision from "/public/models/VintageTelevision";
import { useTexture } from "@react-three/drei";
import { useVintageScreenMaterial } from "@/components/canvas/InstancedMediaPlayers/Screen";

export default function InstancedMediaPlayers() {

	const screens = [];

	const playlists = useSpotifyStore( state => state.playlists );

	for ( let i = 0; i < playlists.length; i ++ ) {

		const playlist = playlists[ i ];
		screens.push(
			<VintageTelevision key={playlist.id} position-y={- 3 * i} index={playlists.indexOf( playlist )} intensity={100}/>
		);

	}


	return <group>
		{screens}
	</group>;

}
