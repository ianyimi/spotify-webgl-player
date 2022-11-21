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

	const [ past, present, future, addScene, forward ] = useSceneStore( state => [ state.past, state.present, state.future, state.addContext, state.forward ] );
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

		addScene( renderTarget );

		// use ShaderMaterial for linearToOutputTexel
		screen.material = new THREE.RawShaderMaterial( {
			uniforms: {
				// 0 - past; 1 - present; 2 - future
				active_scene: new Uniform( 1 ),
				diffuse: new Uniform( null ),
				past_scene: new Uniform( null ),
				present_scene: new Uniform( null ),
				future_scene: new Uniform( null ),
				time: new Uniform( 0 ),
			},
			vertexShader: vert,
			fragmentShader: frag,
			glslVersion: THREE.GLSL3,
		} );
		screen.material.uniforms.diffuse.value = renderTarget.texture;
		// screen.material.uniforms.past_scene.value = pastScene.texture;
		// screen.material.uniforms.present_scene.value = present.texture;
		// screen.material.uniforms.future_scene.value = futureScene.texture;

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

		// if ( ! present ) return;
		// console.log( present?.gl );
		gl.setRenderTarget( renderTarget );
		gl.render( scene, camera );

		gl.setRenderTarget( null );
		if ( Boolean( screen ) ) screen.material.uniforms.time.value += DELTA;

		gl.render( screenScene, screenCamera );

		if ( past && past.gl && past.scene && past.camera ) {

			past.gl.render( past.scene, past.camera );
			past.gl.render( screenScene, screenCamera );

		}

		if ( future && future.gl && future.scene && future.camera ) {

			future.gl.render( future.scene, future.camera );
			future.gl.render( screenScene, screenCamera );

		}

	}, 1 );
	return null;

};

export default usePostProcess;
