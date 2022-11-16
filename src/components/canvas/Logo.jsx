import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useFrame } from '@react-three/fiber';
import { Line, useCursor } from '@react-three/drei';
import { ScrollTicker } from "@/templates/Scroll";
import { useSpotifyStore } from "@/hooks/useSpotifyStore";
import InstancedMediaPlayers from "@/components/canvas/InstancedMediaPlayers";

export default function Logo( { route, ...props } ) {

	const router = useRouter();
	const mesh = useRef( null );
	const [ hovered, hover ] = useState( false );
	const points = useMemo( () => new THREE.EllipseCurve( 0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0 ).getPoints( 100 ), [] );
	const queue = useSpotifyStore( state => state.queue );

	// console.log( queue );

	useCursor( hovered );
	useFrame( ( state, delta ) => {

		const t = state.clock.getElapsedTime();
		// mesh.current.rotation.y = Math.sin( t ) * ( Math.PI / 8 );
		// mesh.current.rotation.x = Math.cos( t ) * ( Math.PI / 8 );
		// mesh.current.rotation.z -= delta / 4;

	} );

	return (
		<group ref={mesh} {...props}>
			<InstancedMediaPlayers/>
			<ScrollTicker axis="x" reverse/>
		</group>
	);

}
