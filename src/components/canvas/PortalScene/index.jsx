import { useThree } from "@react-three/fiber";
import Points from "../Points";
import { useState } from "react";
import { useClientStore } from "@/hooks/useStore";
import { OrbitControls } from "@react-three/drei";

export default function PortalScene( props ) {

	const { camera, scene } = useThree();
	const [ hovered, hover ] = useState( false );
	const activeScene = useClientStore( state => state.activeScene );
	// console.log( "active Scene: ", activeScene );
	// camera.position.set( 0, 1, 5 );
	// camera.lookAt( 0, 1, 0 );

	// console.log( "hover: ", hovered );

	return (
		<group {...props}>
			<Points/>
			{/*<mesh onMouseOver={() => hover( true )} onMouseOut={() => hover( false )}>*/}
			{/*	<boxGeometry args={[ 1, 1 ]}/>*/}
			{/*	<meshBasicMaterial color={hovered ? "pink" : "green"}/>*/}
			{/*</mesh>*/}
			{activeScene === 2 && <OrbitControls/>}
		</group>
	);

}
