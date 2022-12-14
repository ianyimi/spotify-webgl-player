import { useThree } from "@react-three/fiber";
import Points from "../Points";
import { useState } from "react";
import { useClientStore } from "/src/templates/hooks/useStore";
import { OrbitControls } from "@react-three/drei";

export default function PortalScene( props ) {

  return (
    <group {...props}>
      <Points/>
    </group>
  );

}
