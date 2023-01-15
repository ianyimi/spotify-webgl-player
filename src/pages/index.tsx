import dynamic from 'next/dynamic';
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
export default function Page() {

	const { data } = trpc.fetchUserCreatedPlaylists.useQuery();
	if ( ! data ) {

		return <div>Loading...</div>;

	}

	console.log( data.playlists[ 2 ].id );

	return (
		<div>
			{data.playlists.map( ( p, i ) => <p key={i}>{p.name}</p> )}
			{/* <Pane/> */}
			{/*<Dashboard playlists={playlists}/>*/}
		</div>
	);

}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
Page.canvas = () => {

	const { data } = trpc.fetchUserCreatedPlaylists.useQuery();
	if ( ! data ) {

		return <group>
			<mesh>
				<boxBufferGeometry args={[ 0.5, 0.5, 0.5 ]} />
				<meshBasicMaterial color="yellow" />
			</mesh>
		</group>;

	}

	return (
		<group>
			<Environment/>
			{/* @ts-ignore */}
			{data && <Playlists playlists={data.playlists} rowLength={5} position-y={- 1}/>}
			<mesh position-z={2.5}>
				<boxGeometry args={[ 1, 1 ]}/>
				<meshStandardMaterial color="green"/>
			</mesh>
		</group>
	);

};
