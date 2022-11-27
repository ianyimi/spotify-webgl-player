import create from "zustand";
import * as THREE from "three";

export const useClientStore = create( ( set, get ) => {

	// const renderTarget = new THREE.WebGLRenderTarget( 512, 512, { samples: 4, encoding: gl.encoding } );
	// renderTarget.depthTexture = new THREE.DepthTexture();

	return {
		activeScene: 1,
		past: { gl: null, scene: null, camera: null },
		present: { gl: null, scene: null, camera: null },
		future: { gl: null, scene: null, camera: null },
		paneSettings: { scale: 0.0 },
		// setPresentScene: ( scene ) => {
		//
		// 	set( { pastScene: get().presentScene, presentScene: scene, futureScene: null } );
		//
		// },
		setPast: ( gl, scene, camera ) => set( { past: { gl: gl, scene: scene, camera: camera } } ),
		setPresent: ( gl, scene, camera ) => set( { present: { gl: gl, scene: scene, camera: camera } } ),
		setFuture: ( gl, scene, camera ) => set( { future: { gl: gl, scene: scene, camera: camera } } ),
		setActiveScene: ( scene ) => set( { activeScene: scene } ),

		// forward: () => set( { past: get()?.present, present: get()?.future, future: null } ),
		// back: () => set( { future: get()?.present, present: get()?.past, past: null } )

	};

} );
