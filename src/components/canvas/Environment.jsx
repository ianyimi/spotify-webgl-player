import { MeshReflectorMaterial } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Object3D } from "three";
import { useEffect } from "react";

export default function Environment( props ) {

	const { camera } = useThree();

	useEffect( () => {

		camera && camera.lookAt( camera.position.x, 0, 0 );

	}, [] );

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
