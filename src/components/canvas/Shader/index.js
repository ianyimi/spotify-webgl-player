import * as THREE from "three";
import { DoubleSide, ShaderMaterial, Uniform } from "three";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

import vert from "./glsl/shader.vert";
import frag from "./glsl/shader.frag";
import { useTexture } from "@react-three/drei";
import { useSpotifyStore } from "@/hooks/useSpotifyStore";

export const useShaderMaterial = () => {

	const tracks = useSpotifyStore( state => state.tracks );
	const imageTex = useTexture( tracks[ 89 ].album.images[ 0 ].url );

	const mat = useMemo(
		() =>
			new ShaderMaterial( {
				uniforms: {
					color: new Uniform( new Vector3( 1., 1., 1. ) ),
					fogColor: new Uniform( new Vector3( 0., 0., 0. ) ),
					count: new Uniform( ( ( Boolean( tracks ) ) && tracks.length ) || 0 ),
					time: new Uniform( 0 ),
					resolution: new Uniform( new THREE.Vector2( window.innerWidth, window.innerHeight ) ),
					intensity: new Uniform( 1.0 ),
					backgroundImage: new Uniform( imageTex )
				},
				vertexShader: vert,
				fragmentShader: frag,
				side: DoubleSide,
				fog: true
			} ),
		[ frag, vert, tracks, imageTex ]
	);

	useFrame( ( { clock } ) => {

		if ( mat ) {

			mat.uniforms.time.value = clock.getElapsedTime() / 2;
			// mat.uniforms.intensity.value = 0.5*Math.cos(clock.getElapsedTime()*(2*Math.PI/(100/60))) + 0.5

		}

	} );

	return mat;

};
