import { useRef, useState } from "react";

import { useFrame } from "@react-three/fiber";
import { Quaternion, Vector3 } from "three";

import * as random from "maath/random";
import * as buffer from "maath/buffer";
import * as misc from "maath/misc";

import { Points } from "@react-three/drei";

const rotationAxis = new Vector3( 0, 1, 0 ).normalize();
const q = new Quaternion();

export default function PointsDemo( props ) {

	const pointsRef = useRef( null );
	const [ { box, sphere, final } ] = useState( () => {

		const box = random.inBox( new Float32Array( 10_000 ), { sides: [ 2, 2, 2 ] } );
		const sphere = random.inSphere( box.slice( 0 ), { radius: 0.1 } );
		const final = box.slice( 0 ); // final buffer that will be used for the points mesh

		return { box, sphere, final };

	} );

	useFrame( ( { clock } ) => {

		const et = clock.getElapsedTime();
		const t = misc.remap( Math.sin( et ), [ - 1, 1 ], [ 0, 1 ] );
		const t2 = misc.remap( Math.cos( et * 3 ), [ - 1, 1 ], [ 0, 1 ] );

		buffer.rotate( box, {
			q: q.setFromAxisAngle( rotationAxis, t2 * 0.1 ),
		} );

		buffer.lerp( box, sphere, final, t );

	} );

	return (
		<Points positions={final} stride={3} ref={pointsRef} {...props}>
			<pointsMaterial size={0.005}/>
		</Points>
	);

}
