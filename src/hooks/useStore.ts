import type { WebGLRenderTarget, Scene, PerspectiveCamera } from "three";
import type { CameraRig } from "three-story-controls";

import { Vector3 } from "three";
import create from "zustand";
import { gsap } from "gsap";
import { AnimationDuration, AnimationEase, CameraAnimationStatus } from "types/common";
import { Dispatch, SetStateAction, useState } from "react";

export type CustomScene = {
	gl: WebGLRenderTarget,
	scene: Scene,
	camera: PerspectiveCamera,
	rig: CameraRig
}

type SetCustomScene = ( gl: WebGLRenderTarget, scene: Scene, camera: PerspectiveCamera, rig: CameraRig ) => void;

type ClientStore = {
	activeScene: number,
	// cameraAnimationStatus: CameraAnimationStatus,
	// setCameraAnimationStatus: Dispatch<SetStateAction<CameraAnimationStatus>>
	setActiveScene: ( scene: number ) => void,
	past?: CustomScene,
	present?: CustomScene,
	future?: CustomScene,
	setPast: SetCustomScene,
	setPresent: SetCustomScene,
	setFuture: SetCustomScene,
	paneSettings: { scale: number, distortion: number },
	sceneImmersion: () => void,
	sceneReversion: () => void
}

export const useClientStore = create<ClientStore>()( ( set, get ) => {

	// const renderTarget = new THREE.WebGLRenderTarget( 512, 512, { samples: 4, encoding: gl.encoding } );
	// renderTarget.depthTexture = new THREE.DepthTexture();
	// const [ cameraAnimationStatus, setCameraAnimationStatus ] = useState<CameraAnimationStatus>( CameraAnimationStatus.idle );

	return {
		// This value gets animated in Postprocessing shader
		activeScene: 1,
		// cameraAnimationStatus: cameraAnimationStatus,
		// setCameraAnimationStatus: setCameraAnimationStatus,
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
		sceneImmersion: () => {

			if ( ! get().present || ! get().future || get().activeScene === 2 ) return;

			const { position: p1, quaternion: q1 } = get().present!.rig.getWorldCoordinates();
			const { position: p2, quaternion: q2 } = get().future!.rig.getWorldCoordinates();
			get().present!.rig.flyTo( new Vector3( p1.x, p1.y, p1.z - 4 ), q1, AnimationDuration.SceneImmersion, AnimationEase.CubicBezier );
			get().future!.rig.flyTo( new Vector3( p2.x, p2.y, p2.z - 4 ), q2, AnimationDuration.SceneImmersion, AnimationEase.CubicBezier );
			setTimeout( () => {

				set( { activeScene: 2 } );
				gsap.to( get().paneSettings, { scale: 3, distortion: 1, duration: AnimationDuration.SceneReversion, ease: AnimationEase.CubicBezier } );
				get().future!.camera.aspect = get().present!.camera.aspect;
				get().future!.camera.updateProjectionMatrix();

			}, 1000 );

		},
		sceneReversion: () => {

			if ( ! get().present || ! get().future || get().activeScene === 1 ) return;

			const { position: p2, quaternion: q2 } = get().future!.rig.getWorldCoordinates();
			get().future!.rig.flyTo( new Vector3( p2.x, p2.y, p2.z + 4 ), q2, 2, AnimationEase.CubicBezier );
			gsap.to( get().paneSettings, { scale: 0, distortion: 0, duration: 0.5, ease: AnimationEase.CubicBezier } );
			const { position: p1, quaternion: q1 } = get().present!.rig.getWorldCoordinates();
			get().present!.rig.flyTo( new Vector3( p1.x, p1.y, p1.z + 4 ), q1, 2, AnimationEase.CubicBezier );
			setTimeout( () => {

				set( { activeScene: 1 } );
				get().future!.camera.aspect = 0.5 / 0.42;
				get().future!.camera.updateProjectionMatrix();

			}, 1000 );

		}
	};

} );
