import { useSpotifyStore } from "@/hooks/useSpotifyStore";
import VintageTelevision from "public/models/VintageTelevision";
import { ReactElement } from "react";
import { ScrollTicker } from "@/templates/Scroll";

export default function InstancedMediaPlayers() {

	const screens: ReactElement[] = [];

	const playlists = useSpotifyStore( state => state.playlists );

	for ( let i = 0; i < playlists.length; i ++ ) {

		const playlist = playlists[ i ];
		screens.push(
			<VintageTelevision
				key={playlist.id}
				route={`/playlist/${playlist.id}`}
				position-y={- 3 * i}
				// position-x={5 * i}
				index={playlists.indexOf( playlist )}
				intensity={100}
			/>
		);

	}


	return <group>
		{screens}
		<ScrollTicker axis="y"/>
	</group>;

}
