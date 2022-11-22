import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import vert from "./glsl/shader.vert";
import frag from "./glsl/shader.frag";
import { Uniform } from "three";
import { useSceneStore } from "@/hooks/useStore";

function getFullscreenTriangle() {

	const geometry = new THREE.BufferGeometry();
	const vertices = new Float32Array( [ - 1, - 1, 3, - 1, - 1, 3 ] );
	const uvs = new Float32Array( [ 0, 0, 2, 0, 0, 2 ] );

	geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 2 ) );
	geometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

	return geometry;

}

const DELTA = 0.003;

// Basic shader postprocess based on the template https://gist.github.com/RenaudRohlinger/bd5d15316a04d04380e93f10401c40e7
// USAGE: Simply call usePostprocess hook in your r3f component to apply the shader to the canvas as a postprocess effect
const usePostProcess = () => {

	const [ past, present, future, setPast, activeScene ] = useSceneStore( state => [ state.past, state.present, state.future, state.setPast, state.activeScene ] );
	const [ { dpr }, size, gl ] = useThree( ( s ) => [ s.viewport, s.size, s.gl ] );

	// console.log( present );
	const [ screenCamera, screenScene, screen, renderTarget ] = useMemo( () => {

		let screenScene = new THREE.Scene();
		const screenCamera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
		const screen = new THREE.Mesh( getFullscreenTriangle() );
		screen.frustumCulled = false;
		screenScene.add( screen );

		const renderTarget = new THREE.WebGLRenderTarget( 512, 512, { samples: 4, encoding: gl.encoding } );
		renderTarget.depthTexture = new THREE.DepthTexture(); // fix depth issues

		// use ShaderMaterial for linearToOutputTexel
		screen.material = new THREE.RawShaderMaterial( {
			uniforms: {
				// 0 - past; 1 - present; 2 - future
				active_scene: new Uniform( activeScene ),
				diffuse: new Uniform( null ),
				past: new Uniform( null ),
				present: new Uniform( null ),
				future: new Uniform( null ),
				time: new Uniform( 0 ),
			},
			vertexShader: vert,
			fragmentShader: frag,
			glslVersion: THREE.GLSL3,
		} );
		screen.material.uniforms.diffuse.value = renderTarget.texture;

		return [ screenCamera, screenScene, screen, renderTarget ];

	}, [] );
	useEffect( () => {

		const { width, height } = size;
		const { w, h } = {
			w: width * dpr,
			h: height * dpr,
		};
		renderTarget.setSize( w, h );

	}, [ dpr, size, renderTarget ] );

	useFrame( ( { scene, camera, gl } ) => {

		screen.material.uniforms.active_scene.value = activeScene;
		gl.setRenderTarget( renderTarget );
		gl.render( scene, camera );
		gl.setRenderTarget( null );
		if ( Boolean( screen ) ) screen.material.uniforms.time.value += DELTA;
		gl.render( screenScene, screenCamera );

		if ( past && past.gl && past.scene && past.camera ) {

			screen.material.uniforms.past.value = past.gl.texture;

		}

		if ( present && present.gl && present.scene && present.camera ) {

			screen.material.uniforms.present.value = present.gl.texture;

		}

		if ( future && future.gl && future.scene && future.camera ) {

			screen.material.uniforms.future.value = future.gl.texture;

		}

	}, 1 );
	return null;

};

export default usePostProcess;
