import Points from "../Points";

export default function PortalScene( props ) {

	return (
		<group {...props}>
			{/* <Points/> */}
			<mesh position-z={- 2.5}>
				<boxGeometry args={[ 1, 1 ]}/>
				<meshBasicMaterial color="green"/>
			</mesh>
		</group>
	);

}
