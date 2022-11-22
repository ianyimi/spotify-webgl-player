import VintageTelevision from "public/models/VintageTelevision";
import { ScrollState } from "@/templates/Scroll";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import PortalScene from "./PortalScene";

const ERROR_IMAGE_URL = "https://dqeczc7c9n9n1.cloudfront.net/images/404.png";

const DELTA = 0.003;

export default function Playlists( props ) {

	const group = useRef( null );
	const { playlists, rowLength } = props;
	const screens = [];

	// for ( let z = 0, i = 0; z < Math.floor( playlists.length / rowLength ); z ++ ) {

	for ( let z = 0, i = 0; z < 1; z ++ ) {

		// for ( let x = 0; x < rowLength; x ++ ) {

		for ( let x = 0; x < 1; x ++ ) {

			if ( i < playlists.length ) {

				const playlist = playlists[ i ];
				screens.push(
					<VintageTelevision
						key={playlist.id}
						route={`/playlist/${playlist.id}`}
						position-x={5 * x}
						position-z={7 * z}
						url={playlist?.images[ 0 ]?.url ?? ERROR_IMAGE_URL}
						intensity={100}
					>
						<PortalScene/>
					</VintageTelevision>
				);

			}

			i ++;

		}

	}

	useFrame( ( { clock } ) => {

		if ( group.current && playlists ) {

			// group.current.position.x = ScrollState.progress * - 4.95 * playlists.length;
			// group.current.position.x = ScrollState.progress * - 8.95;
			// group.current.position.z = ScrollState.progress * - 14.95;
			// group.current.position.z -= DELTA * 5;

			if ( group.current.position.z < - playlists.length ) {

				group.current.position.z = 0;

			}

		}

	} );


	return <group ref={group}>
		{screens}
	</group>;

}
