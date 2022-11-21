import { useThree } from "@react-three/fiber";

export default function PortalScene( props ) {

	const { camera } = useThree();
	// console.log( camera.position );
	camera.position.set( 0, 1, 5 );
	camera.lookAt( 0, 1, 0 );

	return (
		<group {...props}>
			<mesh>
				<boxGeometry args={[ 1, 1 ]}/>
				<meshBasicMaterial color="green"/>
			</mesh>
		</group>
	);

}
