import { shaderMaterial } from "@react-three/drei";
import { Color } from "three";
import artRight01VertexShader from "../shaders/artRight01/vertex.glsl";
import artRight01FragmentShader from "../shaders/artRight01/fragment.glsl";
import * as THREE from "three";

export const ArtRight01Material = shaderMaterial(
  {
    uColor: new Color("pink"),
    uResolution: new THREE.Vector2(1, 1),
    uTime: 0,
  },
  artRight01VertexShader,
  artRight01FragmentShader
);
