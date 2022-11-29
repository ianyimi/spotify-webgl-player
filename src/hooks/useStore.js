import create from "zustand";
import * as THREE from "three";

export const useClientStore = create( ( set, get ) => {

	// const renderTarget = new THREE.WebGLRenderTarget( 512, 512, { samples: 4, encoding: gl.encoding } );
	// renderTarget.depthTexture = new THREE.DepthTexture();

	return {
		activeScene: 1,
		past: { gl: null, scene: null, camera: null, rig: null },
		present: { gl: null, scene: null, camera: null, rig: null },
		future: { gl: null, scene: null, camera: null, rig: null },
		paneSettings: { scale: 0.0, distortion: 0.0 },
		// setPresentScene: ( scene ) => {
		//
		// 	set( { pastScene: get().presentScene, presentScene: scene, futureScene: null } );
		//
		// },
		setPast: ( gl, scene, camera, rig ) => set( { past: { gl: gl, scene: scene, camera: camera, rig: rig } } ),
		setPresent: ( gl, scene, camera, rig ) => set( { present: { gl: gl, scene: scene, camera: camera, rig: rig } } ),
		setFuture: ( gl, scene, camera, rig ) => set( { future: { gl: gl, scene: scene, camera: camera, rig: rig } } ),
		setActiveScene: ( scene ) => set( { activeScene: scene } ),


		// forward: () => set( { past: get()?.present, present: get()?.future, future: null } ),
		// back: () => set( { future: get()?.present, present: get()?.past, past: null } )

	};

} );
