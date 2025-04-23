import { shaderMaterial } from "@react-three/drei";
import { Color } from "three";
import artRear04VertexShader from "../shaders/artRear04/vertex.glsl";
import artRear04FragmentShader from "../shaders/artRear04/fragment.glsl";

export const ArtRear04Material = shaderMaterial(
  {
    uColor: new Color("pink"),
    uTime: 0,
  },
  artRear04VertexShader,
  artRear04FragmentShader
);
