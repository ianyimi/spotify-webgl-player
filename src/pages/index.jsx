import dynamic from 'next/dynamic';
import Instructions from '@/components/dom/Instructions';
import Dashboard from '@/components/dom/Dashboard';
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Logo = dynamic( () => import( '@/components/canvas/Logo' ), { ssr: false } );

// Dom components go here
export default function Page( props ) {

	return (
		<Instructions>
      This is a minimal starter for Nextjs + React-three-fiber and Threejs. Click on the{' '}
			<span className='text-cyan-200'>atoms nucleus</span> to navigate to the{' '}
			<span className='text-green-200'>/blob</span> page. OrbitControls are enabled by default.
			<Dashboard/>
		</Instructions>
	);

}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
Page.canvas = ( props ) => <Logo scale={0.5} route='/blob' position-y={- 1}/>;

export async function getServerSideProps( { req, res } ) {

	return {
		props: {
			title: "Spotify WebGl Player",
			session: await unstable_getServerSession( req, res, authOptions )
		}
	};

}
