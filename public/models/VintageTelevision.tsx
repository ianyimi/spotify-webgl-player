/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { useCursor, useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { useVintageScreenMaterial } from "../shaders/vintageScreen";
import { useSpotifyStore } from "@/hooks/useSpotifyStore";
import { useRouter } from "next/router";

type GLTFResult = GLTF & {
  nodes: {
    TV: THREE.Mesh
    TVSCREEN: THREE.Mesh
    TVSCREENBEZEL: THREE.Mesh
  }
  materials: {
    ['TV_Chayka-206']: THREE.MeshStandardMaterial
  }
}

type VintageTelevisionProps = {
  intensity?: number,
  route?: string,
  url?: string,
  index?: number
} & JSX.IntrinsicElements['group']

const glassMat = new THREE.MeshPhysicalMaterial( { roughness: 0, transmission: 1, thickness: 0.01 } );
const FILE_URL = "https://dqeczc7c9n9n1.cloudfront.net/models/vintageTelevision-1668539957/vintageTelevision.glb.gz";

export default function Model( props: VintageTelevisionProps ) {

	const router = useRouter();
	const [ hovered, hover ] = useState( false );
	const { url, route, index = 0, intensity = 200, ...restProps } = props;
	const group = useRef<THREE.Group>();
	const { nodes, materials } = useGLTF( FILE_URL ) as GLTFResult;
	const tvMat = useVintageScreenMaterial( { index: index, url: url, intensity: intensity } );

	useCursor( hovered );

	return (
		<group ref={group} {...restProps} dispose={null}>
			<group
				name="Scene"
				onClick={() => ( route != null ) && router.push( route )}
				onPointerOver={() => hover( true )}
				onPointerOut={() => hover( false )}
			>
				<mesh
					name="TV"
					args={[ nodes.TV.geometry, nodes.TV.material ]}
					position={[ - 0.0011, 0.0054, - 0.0071 ]}
					scale={5.0041}
				/>
				<mesh
					name="TVSCREEN"
					args={[ nodes.TVSCREEN.geometry, glassMat ]}
					position={[ - 0.0011, 0.0054, - 0.0071 ]}
					scale={5.0809}
				>
					<mesh material={tvMat} position={[ - 0.085, 0.2525, 0.15 ]}>
						<planeGeometry args={[ 0.49, 0.42 ]}/>
					</mesh>
				</mesh>
				<mesh
					name="TVSCREENBEZEL"
					geometry={nodes.TVSCREENBEZEL.geometry}
					material={nodes.TVSCREENBEZEL.material}
					position={[ - 0.4388, 1.2966, 0.8396 ]}
					scale={[ 5.1008, 5.1032, 4.9647 ]}
				/>
			</group>
		</group>
	);

}

useGLTF.preload( FILE_URL );
