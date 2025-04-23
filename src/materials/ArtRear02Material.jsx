import { shaderMaterial } from "@react-three/drei";
import artRear02VertexShader from "../shaders/artRear02/vertex.glsl";
import artRear02FragmentShader from "../shaders/artRear02/fragment.glsl";
import * as THREE from "three";
export const ArtRear02Material = shaderMaterial(
  {
    uColor: new THREE.Color("pink"),
    uTime: 0,
  },
  artRear02VertexShader,
  artRear02FragmentShader
);
