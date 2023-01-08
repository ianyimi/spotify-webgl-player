export default function PortalScene( props ) {

	return (
		<group {...props}>
			<mesh position-z={- 2.5}>
				<boxGeometry args={[ 1, 1 ]}/>
				<meshBasicMaterial color="green"/>
			</mesh>
		</group>
	);

}
