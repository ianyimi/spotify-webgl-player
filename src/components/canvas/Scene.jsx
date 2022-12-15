import { Canvas, extend } from '@react-three/fiber';
import { Effects, OrbitControls, Preload } from '@react-three/drei';
import { HalfFloatType, LinearEncoding, Vector2 } from "three";
import { AdaptiveToneMappingPass } from "three/examples/jsm/postprocessing/AdaptiveToneMappingPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader";

extend( { UnrealBloomPass, AdaptiveToneMappingPass, ShaderPass } );

const RenderPipeline = () => (
	<Effects disableGamma encoding={LinearEncoding} type={HalfFloatType}>
		<unrealBloomPass args={[ new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.0, 0.8 ]}/>
		<adaptiveToneMappingPass args={[ true, 256 ]}/>
		<shaderPass args={[ VignetteShader ]}/>
	</Effects>
);

export default function Scene( { children, ...props } ) {

	// Everything defined in here will persist between route changes, only children are swapped
	return (
		<Canvas flat {...props}>
			<RenderPipeline/>
			{children}
			<Preload all/>
			{/*<OrbitControls/>*/}
		</Canvas>
	);

}
