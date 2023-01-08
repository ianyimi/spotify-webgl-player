import { useState } from "react";

export default function PortalScene( props ) {

	const [ hover, setHover ] = useState( false );

	return (
		<group {...props}>
			<mesh
				position-z={- 2.5}
				onPointerOver={() => setHover( true )}
				onPointerOut={() => setHover( false )}
			>
				<boxGeometry args={[ 1, 1 ]}/>
				<meshBasicMaterial color={hover ? "pink" : "green"}/>
			</mesh>
		</group>
	);

}
