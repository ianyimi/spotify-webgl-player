import { MeshReflectorMaterial } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useEffect, useMemo } from "react";
import usePostProcess from "@/templates/hooks/usePostprocess";
import { useClientStore } from "@/hooks/useStore";
import { CameraRig } from "three-story-controls";

export default function Environment( props ) {

	const { scene, camera, gl } = useThree();
	const [ present, setPresent, setActiveScene ] = useClientStore( state => [ state.present, state.setPresent, state.setActiveScene ] );
	const rig = useMemo( () => {

		return new CameraRig( camera, scene );

	}, [ scene, camera ] );

	usePostProcess();
	useEffect( () => {

		camera && camera.lookAt( 0, 0, 0 );

		const { position, quaternion } = rig.getWorldCoordinates();
		rig.flyTo( new Vector3( 0, 5, 20 ), quaternion, 0 );
		setPresent( gl, scene, camera, rig );

	}, [] );

	// const { quaternion } = rig.getWorldCoordinates();
	// rig.flyTo( new Vector3( 0, 1, 20 ), quaternion, 0 );

	return (
		<group {...props}>
			<ambientLight intensity={1}/>
			<directionalLight position={[ 0, 5, - 5 ]} intensity={2}/>
			<mesh rotation={[ - Math.PI / 2, 0, 0 ]}>
				<planeGeometry args={[ 100, 100 ]}/>
				<MeshReflectorMaterial
					blur={[ 300, 100 ]}
					resolution={2048} // Lower value if too slow on mobile
					mixBlur={1}
					mixStrength={60}
					roughness={1}
					depthScale={1.2}
					minDepthThreshold={0.4}
					maxDepthThreshold={1.4}
					color="#151515"
					metalness={0.5}
				/>
			</mesh>
		</group>
	);

}
