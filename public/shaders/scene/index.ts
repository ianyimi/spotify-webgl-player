import * as THREE from "three";
import { DoubleSide, ShaderMaterial, Uniform, Vector2 } from "three";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useTexture } from "@react-three/drei";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vert from "./glsl/shader.vert";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import frag from "./glsl/shader.frag";

type VintageScreenProps = {
  url: string,
  count?: number,
  intensity?: number,
  fbo?: any
}

export const useSceneMaterial = ( props: VintageScreenProps ) => {

	const { url, count = 0, intensity = 200, fbo } = props;
	const imageTex = useTexture( url );

	const mat = useMemo(
		() =>
			new ShaderMaterial( {
				uniforms: {
					fogColor: new Uniform( new Vector3( 0., 0., 0. ) ),
					count: new Uniform( count ),
					time: new Uniform( 0 ),
					intensity: new Uniform( intensity ),
					resolution: new Uniform( new THREE.Vector2( window.innerWidth, window.innerHeight ) ),
					backgroundImage: new Uniform( fbo ? fbo : imageTex ),
				},
				vertexShader: vert,
				fragmentShader: frag,
				side: DoubleSide,
				fog: true
			} ),
		[ frag, vert, url, imageTex, count, intensity, fbo ]
	);

	return mat;

};
