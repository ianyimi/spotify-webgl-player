import VintageTelevision from "@/models/VintageTelevision";
// import { ScrollState } from "@/templates/Scroll";
import { useRef, useState, Suspense, ReactElement } from "react";
import { Group } from "three";
import { useFrame, GroupProps } from "@react-three/fiber";
import PortalScene from "./PortalScene/index";
import { CameraAnimationStatus } from "types/common";

const ERROR_IMAGE_URL = "https://dqeczc7c9n9n1.cloudfront.net/images/404.png";

const DELTA = 0.003;

type PlaylistsProps = {
	playlists: SpotifyApi.PlaylistObjectSimplified[],
	total: number,
	rowLength?: number
} & GroupProps

export default function Playlists( props: PlaylistsProps ) {

	const group = useRef<Group>( null );
	const { playlists, total, rowLength = 5 } = props;
	const screens: ReactElement[] = [];
	const [ focusedPlaylist, setFocusPlaylistID ] = useState( "" );
	const [ cameraAnimationStatus, setCameraAnimationStatus ] = useState( CameraAnimationStatus.idle );
	const totalRows = Math.floor( total / rowLength );
	const xOffset = useRef( 0 );

	for ( let z = 0, i = 0; z < totalRows; z ++ ) {

		if ( 2 * z >= totalRows ) xOffset.current = z;

		for ( let x = 0; x < rowLength; x ++ ) {

			if ( i < playlists.length ) {

				const playlist = playlists[ i ];
				screens.push(
					<VintageTelevision
						key={playlist.id}
						playlistID={playlist.id}
						cameraAnimationStatus={cameraAnimationStatus}
						setCameraAnimationStatus={setCameraAnimationStatus}
						route={`/playlist/${playlist.id}`}
						position-x={5 * x}
						position-z={7 * z}
						url={playlist?.images[ 0 ]?.url ?? ERROR_IMAGE_URL}
						intensity={100}
						focusedPlaylist={focusedPlaylist}
						setFocusPlaylistID={setFocusPlaylistID}
					>
						{/* @ts-ignore */}
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

	return <group>
		<Suspense fallback={null}>
			<group ref={group}>
				{screens}
			</group>
		</Suspense>
	</group>;

}
