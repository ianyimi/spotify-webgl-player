import { GroupProps } from "@react-three/fiber";
import { useSession, signOut } from "next-auth/react";
import useSpotify from "@/hooks/useSpotify";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Dashboard( props: GroupProps ) {

	const spotifyApi = useSpotify();
	const { data: session, status } = useSession();
	const [ playlists, setPlaylists ] = useState<any[]>( [] );
	const [ tracks, setTracks ] = useState<any[]>( [] );

	useEffect( () => {

		if ( Boolean( spotifyApi.getAccessToken() ) ) {

			spotifyApi.getMe().then( ( currentUser ) => {

				const id = currentUser.id;
				spotifyApi.getUserPlaylists( id, { limit: 50 } ).then( ( newPlaylists ) => {

					const newItems = newPlaylists.items;
					const newUserCreatedPlaylists = newItems.filter( p => p.owner.id === id );
					if ( newItems.length <= 50 ) {

						setPlaylists( newUserCreatedPlaylists );

					} else {

						spotifyApi.getUserPlaylists( id, { limit: 50, offset: 50 } ).then( ( midPlaylists ) => {

							const midItems = midPlaylists.items;
							const midUserCreatedPlaylists = midItems.filter( p => p.owner.id === id );
							const tempArr = newUserCreatedPlaylists.concat( midUserCreatedPlaylists );
							if ( midItems.length <= 50 ) {

								setPlaylists( tempArr );

							} else {

								spotifyApi.getUserPlaylists( id, { limit: 50, offset: 100 } ).then( ( oldPlaylists ) => {

									const oldItems = oldPlaylists.items;
									const oldUserCreatedPlaylists = oldItems.filter( p => p.owner.id === id );
									setPlaylists( tempArr.concat( oldUserCreatedPlaylists ) );

								} );

							}

						} );

					}

				} );

			} );

			spotifyApi.getMySavedTracks( { limit: 50 } ).then( firstTracks => {

				if ( firstTracks.total <= 50 ) {

					setTracks( firstTracks.items );

				} else {

					let tempTracks: any[] = [];
					for ( let i = 1; i < Math.min( ( firstTracks.total / 50 + 1 ), 5 ); i ++ ) {

						spotifyApi.getMySavedTracks( { limit: 50, offset: i * 50 } ).then( olderTracks => {

							console.log( tempTracks );
							tempTracks = i === 1 ? firstTracks.items.concat( olderTracks.items ) : tempTracks.concat( olderTracks.items );
							// setTracks( tempTracks );

						} );

					}

					console.log( tempTracks );
					setTracks( tempTracks );

				}

			} );

		}

	}, [ session, spotifyApi ] );

	const topPlaylists = playlists.map( playlist => {

		return (
			<div key={playlist.id}>
				{( Boolean( playlist.images ) ) && playlist.images.length > 0 &&
          <Image
          	alt={playlist.description}
          	src={playlist?.images[ 1 ].url}
          	width={playlist.images[ 1 ].width}
          	height={playlist.images[ 1 ].height}
          />
				}
				{playlist.name}
			</div>
		);

	} );

	// console.log( tracks );

	return (
		<group {...props}>
			<button onClick={() => signOut()}>Logout</button>
			{topPlaylists}
		</group>
	);

}
