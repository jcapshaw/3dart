import { shaderMaterial } from "@react-three/drei";
import { Color } from "three";
import simpleVertexShader from "../shaders/simple/vertex.glsl";
import simpleFragmentShader from "../shaders/simple/fragment.glsl";

export const SimpleShaderMaterial = shaderMaterial(
  {
    uColor: new Color("pink"),
    uTime: 0,
  },
  simpleVertexShader,
  simpleFragmentShader
);
