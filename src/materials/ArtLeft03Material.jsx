import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import artLeft03VertexShader from "../shaders/artLeft03/vertex.glsl";
import artLeft03FragmentShader from "../shaders/artLeft03/fragment.glsl";

export const ArtLeft03Material = shaderMaterial(
  {
    uColor: new THREE.Color("pink"),
    uTime: 0,
    uResolution: new THREE.Vector2(1, 2),
  },
  artLeft03VertexShader,
  artLeft03FragmentShader
);
