import create from "zustand";
import * as THREE from "three";

export const useSceneStore = create( ( set, get ) => {

	// const renderTarget = new THREE.WebGLRenderTarget( 512, 512, { samples: 4, encoding: gl.encoding } );
	// renderTarget.depthTexture = new THREE.DepthTexture();

	return {
		past: { gl: null, scene: null, camera: null },
		present: { gl: null, scene: null, camera: null },
		future: { gl: null, scene: null, camera: null },
		// setPresentScene: ( scene ) => {
		//
		// 	set( { pastScene: get().presentScene, presentScene: scene, futureScene: null } );
		//
		// },
		addContext: ( gl, scene, camera ) => {

			set( { futureScene: { gl: gl, scene: scene, camera: camera } } );

		},
		forward: () => set( { past: get()?.present, present: get()?.future, future: null } ),
		back: () => set( { future: get()?.present, present: get()?.past, past: null } )

	};

} );
