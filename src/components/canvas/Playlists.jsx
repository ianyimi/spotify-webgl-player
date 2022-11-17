import VintageTelevision from "public/models/VintageTelevision";
import { ScrollTicker } from "@/templates/Scroll";

export default function InstancedMediaPlayers( props ) {

	const { playlists } = props;
	const screens = [];

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
