/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.2 public/staging/vintageTelevision/vintageTelevision.glb C:/Program Files/Git/src/models/vintageTelevision.tsx -d -t -v -p 4
*/

import { Group, Mesh, MeshStandardMaterial, MeshPhysicalMaterial, Scene, PerspectiveCamera, Vector3 } from 'three';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useCursor, useFBO, useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

import { gsap } from "gsap";
import { useSceneMaterial } from "../../public/shaders/scene/index";
import { useRouter } from "next/router";
import { useFrame, useThree, createPortal } from "@react-three/fiber";
import { useClientStore } from "@/hooks/useStore";
import { CameraRig } from "three-story-controls";

type GLTFResult = GLTF & {
  nodes: {
    TV: Mesh
    TVSCREEN: Mesh
    TVSCREENBEZEL: Mesh
  }
  materials: {
    ['TV_Chayka-206']: MeshStandardMaterial
  }
}

type VintageTelevisionProps = {
  intensity?: number,
  route?: string,
  url?: string,
  index?: number,
  children?: ReactElement[]
} & JSX.IntrinsicElements['group']

const glassMat = new MeshPhysicalMaterial( { roughness: 0, transmission: 1 } );
const FILE_URL = "https://dqeczc7c9n9n1.cloudfront.net/models/vintageTelevision-1672798597/vintageTelevision.glb.gz";
const URL_NOT_FOUND = "https://dqeczc7c9n9n1.cloudfront.net/images/404.png";

export default function Model( props: VintageTelevisionProps ) {

	const router = useRouter();
	const group = useRef<Group>( null );
	const [ hovered, hover ] = useState( false );
	const { url = URL_NOT_FOUND, route, index = 0, intensity = 200, children, ...restProps } = props;
	const { nodes, materials } = useGLTF( FILE_URL ) as unknown as GLTFResult;

	useCursor( hovered );

	const screen = useRef( null );
	const fbo = useRef( useFBO() );
	const { events, gl, scene: originScene, camera: originCamera } = useThree();
	const cameraInit = useRef( false );
	const [ activeScene, present, setFuture, setActiveScene, paneSettings, incept, regress ] = useClientStore( state => [ state.activeScene, state.present, state.setFuture, state.setActiveScene, state.paneSettings, state.incept, state.regress ] );
	// The portal will render into this scene
	const [ scene ] = useState( () => new Scene() );
	// We have our own camera in here, separate from the default
	const [ camera ] = useState( () => new PerspectiveCamera( 50, 1, 0.1, 1000 ) );
	const cameraRig = useRef( new CameraRig( camera, scene ) );
	const tvMat = useSceneMaterial( {
		url: url,
		intensity: intensity,
		renderedScene: children ? fbo.current.texture : undefined
	} );

	useEffect( () => {

		camera.aspect = 0.5 / 0.42;
		camera.updateProjectionMatrix();

	}, [] );

	useFrame( ( state ) => {

		// Copy the default cameras whereabouts
		if ( ! cameraInit.current ) {

			camera.position.copy( state.camera.position );
			camera.rotation.copy( state.camera.rotation );
			camera.scale.copy( state.camera.scale );
			cameraInit.current = true;

		}

		if ( hovered ) {

			tvMat.uniforms.altScene.value = 1;

		} else {

			tvMat.uniforms.altScene.value = 0;

		}

		state.gl.setRenderTarget( fbo.current );
		state.gl.render( scene, camera );
		state.gl.setRenderTarget( null );

		tvMat.uniforms.time.value = state.clock.getElapsedTime() / 2;
		tvMat.uniforms.intensity.value = intensity + ( intensity / 4 * Math.sin( state.clock.getElapsedTime() ) );

	} );

	// This is a custom raycast-compute function, it controls how the raycaster functions.
	const compute = useCallback( ( event, state, previous ) => {

		// First we call the previous state-onion-layers compute, this is what makes it possible to nest portals
		if ( ! previous.raycaster.camera ) previous.events.compute( event, previous, previous.previousRoot?.getState() );
		// We run a quick check against the textured plane itself, if it isn't hit there's no need to raycast at all
		const [ intersection ] = previous.raycaster.intersectObject( screen.current );
		if ( ! intersection ) return false;
		// We take that hits uv coords, set up this layers raycaster, et voilà, we have raycasting with perspective shift
		const uv = intersection.uv;
		state.raycaster.setFromCamera( state.pointer.set( uv.x * 2 - 1, uv.y * 2 - 1 ), camera );

	}, [] );

	const handleClick = ( e ) => {

		// e.preventDefault();
		if ( ! present || activeScene === 2 ) return;
		setFuture( fbo.current, scene, camera, cameraRig.current );
		incept();
		setTimeout( () => {

			regress();

		}, 3000 );

	};

	return (
		<group ref={group} {...restProps} dispose={null}>
			<group
				name="Scene"
				onClick={( e ) => handleClick( e )}
				onPointerOver={() => hover( true )}
				onPointerOut={() => hover( false )}
			>
				<mesh
					geometry={nodes.TV.geometry}
					material={materials[ 'TV_Chayka-206' ]}
					position={[ - 0.0011, 0.0054, - 0.0071 ]}
					scale={5.0041}
				/>
				<mesh
					geometry={nodes.TVSCREEN.geometry}
					args={[ nodes.TVSCREEN.geometry, glassMat ]}
					position={[ - 0.0011, 0.0054, - 0.0071 ]}
					scale={5.0809}
				>
					<mesh ref={screen} material={tvMat} position={[ - 0.085, 0.2525, 0.15 ]}>
						<planeGeometry args={[ 0.5, 0.42 ]}/>
					</mesh>
					{children && createPortal( children, scene, {
						camera,
						scene,
						gl,
						events: { compute, priority: events.priority - 1 }
					} )}
				</mesh>
				<mesh
					geometry={nodes.TVSCREENBEZEL.geometry}
					material={materials[ 'TV_Chayka-206' ]}
					position={[ - 0.4388, 1.2966, 0.8396 ]}
					scale={[ 5.1008, 5.1032, 4.9647 ]}
				/>
			</group>
		</group>
	);

}

useGLTF.preload( FILE_URL );
