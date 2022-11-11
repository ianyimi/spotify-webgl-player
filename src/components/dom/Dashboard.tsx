import { GroupProps } from "@react-three/fiber";
import { useSession, signOut } from "next-auth/react";
import useSpotify from "@/hooks/useSpotify";
import { useEffect, useState } from "react";
import Image from "next/image";

type Playlist = {
  id: string,
  name: string,
  description: string,
  images?: { height: number, width: number, url: string }[],
  owner: { id: string }
}

export default function Dashboard( props: GroupProps ) {

	const spotifyApi = useSpotify();
	const { data: session, status } = useSession();
	const [ playlists, setPlaylists ] = useState<Playlist[]>( [] );

	useEffect( () => {

		if ( Boolean( spotifyApi.getAccessToken() ) ) {

			spotifyApi.getMe().then( ( currentUser ) => {

				spotifyApi.getUserPlaylists( currentUser.body.id, { limit: 50 } ).then( ( newerPlaylists ) => {

					spotifyApi.getUserPlaylists( currentUser.body.id, { limit: 50, offset: 50 } ).then( ( olderPlaylists ) => {

						const newerUserCreatedPlaylists = newerPlaylists.body.items.filter( p => p.owner.id === currentUser.body.id );
						const olderUserCreatedPlaylists = olderPlaylists.body.items.filter( p => p.owner.id === currentUser.body.id );
						setPlaylists( newerUserCreatedPlaylists.concat( olderUserCreatedPlaylists ) );

					} );

				} );

			} );


		}

	}, [ session, spotifyApi ] );

	const topPlaylists = playlists.map( playlist => {

		return (
			<div key={playlist.id}>
				{playlist.images && playlist.images.length > 0 &&
          <Image alt={playlist.description} src={playlist?.images[ 1 ].url} width={playlist.images[ 1 ].width}
          	height={playlist.images[ 1 ].height}/>}
				{playlist.name}
			</div>
		);

	} );

	console.log( playlists );

	return (
		<group {...props}>
			<button onClick={() => signOut()}>Logout</button>
			{topPlaylists}
		</group>
	);

}
