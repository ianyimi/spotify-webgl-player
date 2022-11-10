import { GroupProps } from "@react-three/fiber";
import { useSession, signOut } from "next-auth/react";
import useSpotify from "@/hooks/useSpotify";
import { useEffect, useState } from "react";

export default function Dashboard( props: GroupProps ) {

	const spotifyApi = useSpotify();
	const { data: session, status } = useSession();
	const [ playlists, setPlaylists ] = useState( [] );

	useEffect( () => {

		if ( spotifyApi.getAccessToken() ) {

			spotifyApi.getUserPlaylists().then( ( data ) => {

				setPlaylists( data.body.items );

			} );

		}

	}, [ session, spotifyApi ] );

	// console.log();
	console.log( playlists );

	return (
		<group {...props}>
			<button onClick={() => signOut()}>Logout</button>
		</group>
	);

}
