import type { WebGLRenderer, Scene, PerspectiveCamera } from "three";
import type { CameraRig } from "three-story-controls";

import { Vector3 } from "three";
import create from "zustand";
import { gsap } from "gsap";

export type CustomScene = {
	gl: WebGLRenderer,
	scene: Scene,
	camera: PerspectiveCamera,
	rig: typeof CameraRig
}

type SetCustomScene = ( gl: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, rig: typeof CameraRig ) => void;

type ClientStore = {
	activeScene: number,
	setActiveScene: ( scene: number ) => void,
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

const DURATION = 2;
const EASE = "power3.inOut";

export const useClientStore = create<ClientStore>()( ( set, get ) => {

	// const renderTarget = new THREE.WebGLRenderTarget( 512, 512, { samples: 4, encoding: gl.encoding } );
	// renderTarget.depthTexture = new THREE.DepthTexture();

	return {
		// This value gets animated in Postprocessing shader
		activeScene: 1,
		past: undefined,
		present: undefined,
		future: undefined,
		paneSettings: { scale: 0.0, distortion: 0.0 },
		setPast: ( gl, scene, camera, rig ) => set( { past: { gl: gl, scene: scene, camera: camera, rig: rig } } ),
		setPresent: ( gl, scene, camera, rig ) => set( { present: { gl: gl, scene: scene, camera: camera, rig: rig } } ),
		setFuture: ( gl, scene, camera, rig ) => {

			set( { future: { gl: gl, scene: scene, camera: camera, rig: rig } } );

		},
		setActiveScene: ( scene ) => set( { activeScene: scene } ),
		incept: () => {

			if ( ! get().present || ! get().future || get().activeScene === 2 ) return;
			console.log( "inception" );

			const { position: p1, quaternion: q1 } = get().present!.rig.getWorldCoordinates();
			const { position: p2, quaternion: q2 } = get().future!.rig.getWorldCoordinates();
			get().present!.rig.flyTo( new Vector3( p1.x, p1.y, p1.z - 5 ), q1, 2, EASE );
			get().future!.rig.flyTo( new Vector3( p2.x, p2.y, p2.z - 5 ), q2, 2, EASE );
			setTimeout( () => {

				set( { activeScene: 2 } );
				gsap.to( get().paneSettings, { scale: 3, distortion: 1, duration: 0.5, ease: EASE } );
				get().future!.camera.aspect = get().present!.camera.aspect;
				get().future!.camera.updateProjectionMatrix();

			}, 1000 );

		},
		regress: () => {

			if ( ! get().present || ! get().future || get().activeScene === 1 ) return;
			console.log( "regression" );

			const { position: p2, quaternion: q2 } = get().future!.rig.getWorldCoordinates();
			get().future!.rig.flyTo( new Vector3( p2.x, p2.y, p2.z + 5 ), q2, 2, EASE );
			gsap.to( get().paneSettings, { scale: 0, distortion: 0, duration: 0.5, ease: EASE } );
			const { position: p1, quaternion: q1 } = get().present!.rig.getWorldCoordinates();
			get().present!.rig.flyTo( new Vector3( p1.x, p1.y, p1.z + 5 ), q1, 2, EASE );
			setTimeout( () => {

				set( { activeScene: 1 } );

			}, 1000 );

		}
	};

} );
