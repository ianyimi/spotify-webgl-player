import create from "zustand";
import type { WebGLRenderer, Scene, PerspectiveCamera } from "three";
import type { CameraRig } from "three-story-controls";

export type CustomScene = {
	gl: WebGLRenderer,
	scene: Scene,
	camera: PerspectiveCamera,
	rig: CameraRig
}

type SetCustomScene = ( gl: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, rig: CameraRig ) => void;

type ClientStore = {
	activeScene: number,
	past?: CustomScene,
	present?: CustomScene,
	future?: CustomScene,
	setPast: SetCustomScene,
	setPresent: SetCustomScene,
	setFuture: SetCustomScene,
	paneSettings: { scale: number, distortion: number },
	incept: () => void,
	regress: () => void
}

export const useClientStore = create<ClientStore>()( ( set, get ) => {

	// const renderTarget = new THREE.WebGLRenderTarget( 512, 512, { samples: 4, encoding: gl.encoding } );
	// renderTarget.depthTexture = new THREE.DepthTexture();

	return {
		activeScene: 1,
		past: undefined,
		present: undefined,
		future: undefined,
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
		incept: () => {

			if ( get().activeScene === 2 ) return;
			console.log( "inception" );
			return;

		},
		regress: () => {

			if ( get().activeScene === 1 ) return;
			console.log( "regression" );
			return;

		}
	};

} );
