import { signOut } from "next-auth/react";
import Image from "next/image";

export default function Dashboard( { playlists, ...restProps } ) {

	const topPlaylists = [];
	if ( ( Boolean( playlists ) ) && playlists.length > 0 ) {

		playlists.forEach( playlist => {

			topPlaylists.push(
				<div key={playlist.id}>
					{( Boolean( playlist.images ) ) && playlist.images.length > 0 &&
            <Image
            	alt={playlist.description}
            	src={playlist?.images[ 0 ].url}
            	width={240}
            	height={240}
            />
					}
					{playlist.name}
				</div>
			);

		} );

	}

	return (
		<div {...restProps}>
			<button onClick={() => signOut()}>Logout</button>
			{topPlaylists}
		</div>
	);

}
