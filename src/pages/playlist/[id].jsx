import VintageTelevision from "public/models/VintageTelevision";
import { useSpotifyStore } from "@/hooks/useSpotifyStore";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { spotifyApiNode } from "@/hooks/useSpotify";
import { fetchPlaylistData } from "lib/api";
import { ReactElement } from "react";


export default function Playlist( { items } ) {

	const trackNames = [];

	items.forEach( item => {

		const track = item.track;
		trackNames.push(
			<div key={track.id}>{track.name}</div>
		);

	} );


	return <div>{trackNames}</div>;

}

Playlist.canvas = ( { data } ) => {

	return <group>
		<VintageTelevision url={data.images[ 0 ].url} route={"/"}/>
	</group>;

};

export async function getServerSideProps( { req, res, query, token } ) {

	const session = await unstable_getServerSession( req, res, authOptions );

	if ( ! session || ! ( Boolean( query.id ) ) ) return {
		redirect: {
			destination: "/login",
			permanent: false
		},
	};

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	spotifyApiNode.setAccessToken( session.user.accessToken );
	const playlistData = await fetchPlaylistData( spotifyApiNode, query.id );

	return {
		props: {
			data: playlistData?.data ?? null,
			items: playlistData?.items ?? null
		}
	};

}
