import { useSession, signOut } from "next-auth/react";
import useSpotify from "@/hooks/useSpotify";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useSpotifyStore } from "@/hooks/useSpotifyStore";
import shallow from "zustand/shallow";

export default function Dashboard( { playlists, ...restProps } ) {

	const topPlaylists = [];
	if ( ( Boolean( playlists ) ) && playlists.length > 0 ) {

		playlists.forEach( playlist => {

			topPlaylists.push(
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

	}

	return (
		<div {...restProps}>
			<button onClick={() => signOut()}>Logout</button>
			{topPlaylists}
		</div>
	);

}
