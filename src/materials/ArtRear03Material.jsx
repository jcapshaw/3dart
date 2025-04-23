import { shaderMaterial } from "@react-three/drei";
import { Color } from "three";
import artRear03VertexShader from "../shaders/artRear03/vertex.glsl";
import artRear03FragmentShader from "../shaders/artRear03/fragment.glsl";

export const ArtRear03Material = shaderMaterial(
  {
    uColor: new Color("pink"),
    uTime: 0,
  },
  artRear03VertexShader,
  artRear03FragmentShader
);
