import dynamic from 'next/dynamic';
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { SpotifyApi } from "../server/context";
import { fetchUserLikedPlaylists } from "lib/api";
import { trpc } from "../utils/trpc";
// import Dashboard from '@/components/dom/Dashboard';

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Playlists = dynamic( () => import( '@/components/canvas/Playlists' ), { ssr: false } );
const Environment = dynamic( () => import( '@/components/canvas/Environment' ), { ssr: false } );
// const Pane = dynamic( () => import( '@/components/dom/Pane' ), { ssr: false } );
// const CameraRig = dynamic( () => import( "three-story-controls" ).then( c => c.CameraRig ), { ssr: false } );

// Dom components go here
export default function Page( { playlists } ) {

	const hello = trpc.fetchCreatedPlaylists.useQuery();
	if ( ! hello.data ) {

		return <div>Loading...</div>;

	}

	console.log( hello.data );

	return (
		<div>
			<p>Loaded</p>
			{/* <Pane/> */}
			{/*<Dashboard playlists={playlists}/>*/}
		</div>
	);

}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
Page.canvas = ( { playlists, login } ) => {

	return (
		<group>
			<Environment/>
			{( Boolean( playlists ) ) && <Playlists playlists={playlists} rowLength={5} position-y={- 1}/>}
			<mesh position-z={2.5}>
				<boxGeometry args={[ 1, 1 ]}/>
				<meshStandardMaterial color="green"/>
			</mesh>
		</group>
	);

};

export async function getServerSideProps( { req, res } ) {

	const session = await unstable_getServerSession( req, res, authOptions );

	if ( ! session ) return {
		redirect: {
			destination: "login",
			permanent: false
		},
	};

	res.setHeader(
		'Cache-Control',
		'public, s-maxage=10, stale-while-revalidate=59'
	);

	SpotifyApi.setAccessToken( session.user.accessToken );
	const { total, playlists, error } = await fetchUserLikedPlaylists( SpotifyApi );

	if ( error ) return {
		redirect: {
			destination: "login",
			permanent: false
		}
	};

	return {
		props: {
			title: "Spotify WebGl Player",
			session: session,
			total: await total ?? null,
			playlists: await playlists ?? null,
		}
	};

}
