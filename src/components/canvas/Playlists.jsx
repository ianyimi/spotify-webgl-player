import VintageTelevision from "public/models/VintageTelevision";
import { ScrollTicker } from "@/templates/Scroll";
import { ScrollState } from "@/templates/Scroll";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const ERROR_IMAGE_URL = "https://dqeczc7c9n9n1.cloudfront.net/images/404.png";

export default function Playlists( props ) {

	const group = useRef( null );
	const { playlists } = props;
	const screens = [];

	for ( let i = 0; i < playlists.length; i ++ ) {

		const playlist = playlists[ i ];
		screens.push(
			<VintageTelevision
				key={playlist.id}
				route={`/playlist/${playlist.id}`}
				// position-y={- 3 * i}
				position-x={5 * i}
				url={playlist?.images[ 0 ]?.url ?? ERROR_IMAGE_URL}
				intensity={100}
			/>
		);

	}

	useFrame( ( { clock } ) => {

		if ( ! group.current ) return;

		group.current.position.x = ScrollState.progress * - 4.95 * playlists.length;

	} );


	return <group ref={group}>
		{screens}
		{/*<ScrollTicker axis="y"/>*/}
	</group>;

}
