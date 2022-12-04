import { MeshReflectorMaterial } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Vector3, Object3D } from "three";
import { useEffect, useMemo, useRef } from "react";
import usePostProcess from "@/templates/hooks/usePostprocess";
import { useClientStore } from "@/hooks/useStore";

export default function Environment( props ) {

  const { CameraRig } = props;
  const { scene, camera, gl } = useThree();
  const [ present, setPast, setPresent, setFuture, setActiveScene ] = useClientStore( state => [ state.present, state.setPast, state.setPresent, state.setFuture, state.setActiveScene ] );
  const pastRig = useRef( new CameraRig() );
  const presentRig = useRef( new CameraRig( camera, scene ) );
  const futureRig = useRef( new CameraRig() );

  usePostProcess();
  useEffect( () => {

    camera && camera.lookAt( camera.position.x, 0, 0 );

    const { position, quaternion } = presentRig.current.getWorldCoordinates();
    presentRig.current.flyTo( new Vector3( 0, 1, 20 ), quaternion, 0 );

    setPast( null, null, null, pastRig );
    setPresent( gl, scene, camera, presentRig.current );
    setFuture( null, null, null, futureRig );

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
