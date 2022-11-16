import VintageTelevision from "public/models/VintageTelevision";
import { useRouter } from "next/router";
import { useSpotifyStore } from "@/hooks/useSpotifyStore";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

interface PlaylistProps {
  id: string,
  index: number
}

export default function Playlist( { id } ) {

	const playlists = useSpotifyStore( state => state.playlists.filter( p => p.id === id ) );

	// console.log( playlists[ 0 ].name );

	return <h1>`Hi `</h1>;

}

Playlist.canvas = ( { index } ) => {

	const hostUrl = "https://dqeczc7c9n9n1.cloudfront.net/images";

	// const playlists = useSpotifyStore( state => state.playlists.filter( p => p.id === id ) );

	return <VintageTelevision index={index} route={"/"}/>;

};

Playlist.getInitialProps = async ( { req, res, query } ) => {

	console.log( query );
	const session = await unstable_getServerSession( req, res, authOptions );
	if ( query.length < 2 ) return {
		redirect: {
			destination: "login",
			permanent: false
		},
	};

	return {
		id: query[ 0 ],
		index: parseInt( query[ 1 ] )
	};

};
