import { shaderMaterial } from "@react-three/drei";
import { Color } from "three";
import artRear01VertexShader from "../shaders/artRear01/vertex.glsl";
import artRear01FragmentShader from "../shaders/artRear01/fragment.glsl";
import * as THREE from "three";

export const ArtRear01Material = shaderMaterial(
  {
    uColor: new Color("pink"),
    uTime: 0,
    uResolution: new THREE.Vector2(1, 1),
  },
  artRear01VertexShader,
  artRear01FragmentShader
);
