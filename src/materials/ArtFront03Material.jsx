import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import artFront03VertexShader from "../shaders/artFront03/vertex.glsl";
import artFront03FragmentShader from "../shaders/artFront03/fragment.glsl";

export const ArtFront03Material = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("#6A0DAD"),
    uColorEnd: new THREE.Color("#4B0082"), //'#0A0A5C'
  },
  artFront03VertexShader,
  artFront03FragmentShader
);
