import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { spotifyApi } from "@/hooks/useSpotify";
import { fetchPlaylistData } from "lib/api";
import dynamic from "next/dynamic";

const VintageTelevision = dynamic( () => import( "@/models/VintageTelevision.tsx" ), { ssr: false } );

export default function Playlist( { items } ) {

	const trackNames = [];

	items.forEach( item => {

		if ( item.track === null ) return;
		const track = item.track;
		trackNames.push(
			<div key={track.id}>{track.name} - {track.artists[ 0 ].name}</div>
		);

	} );


	return <div>{trackNames}</div>;

}

Playlist.canvas = ( { url } ) => {

	return <group>
		<VintageTelevision url={url} route={"/"}/>
	</group>;

};

export async function getServerSideProps( { req, res, query } ) {

	const session = await unstable_getServerSession( req, res, authOptions );

	if ( ! session || ! ( Boolean( query.id ) ) ) return {
		redirect: {
			destination: "/login",
			permanent: false
		},
	};

	res.setHeader(
		'Cache-Control',
		'public, s-maxage=10, stale-while-revalidate=59'
	);

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	spotifyApi.setAccessToken( session.user.accessToken );
	const { url, items, error } = await fetchPlaylistData( spotifyApi, query.id );

	if ( error ) return {

		redirect: {
			destination: "/login",
			permanent: false
		}

	};

	return {
		props: {
			url: await url ?? null,
			items: await items ?? null
		}
	};

}
