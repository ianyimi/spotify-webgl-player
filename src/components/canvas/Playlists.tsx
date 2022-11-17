import VintageTelevision from "public/models/VintageTelevision";
import { ReactElement } from "react";
import { ScrollTicker } from "@/templates/Scroll";

interface InstancedMediaProps {
  playlists: any[];
}

export default function InstancedMediaPlayers( props: InstancedMediaProps ) {

	const { playlists } = props;
	const screens: ReactElement[] = [];

	for ( let i = 0; i < playlists.length; i ++ ) {

		const playlist = playlists[ i ];
		screens.push(
			<VintageTelevision
				key={playlist.id}
				route={`/playlist/${playlist.id}`}
				position-y={- 3 * i}
				// position-x={5 * i}
				url={playlist.images[ 0 ].url}
				intensity={100}
			/>
		);

	}


	return <group>
		{screens}
		<ScrollTicker axis="y"/>
	</group>;

}
