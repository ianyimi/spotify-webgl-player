import dynamic from 'next/dynamic';
import Dashboard from '@/components/dom/Dashboard';
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { spotifyApi } from "@/hooks/useSpotify";
import { redirect } from "next/navigation";

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Playlists = dynamic( () => import( '@/components/canvas/Playlists' ), { ssr: false } );

// Dom components go here
export default function Page( props ) {

	const { session } = props;

	return (
		<div>
			<Dashboard/>
		</div>
	);

}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
Page.canvas = ( props ) => <Playlists route="/blob" position-y={- 1}/>;

export async function getServerSideProps( { req, res } ) {

	const session = await unstable_getServerSession( req, res, authOptions );

	if ( ! session ) return {
		redirect: {
			destination: "login",
			permanent: false
		},
	};

	return {
		props: {
			title: "Spotify WebGl Player",
			session: session,
		}
	};

}
