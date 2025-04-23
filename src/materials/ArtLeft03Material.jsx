import { shaderMaterial } from "@react-three/drei";
import { Color } from "three";
import artLeft03VertexShader from "../shaders/artLeft03/vertex.glsl";
import artLeft03FragmentShader from "../shaders/artLeft03/fragment.glsl";

export const ArtLeft03Material = shaderMaterial(
  {
    uColor: new Color("pink"),
    uTime: 0,
  },
  artLeft03VertexShader,
  artLeft03FragmentShader
);
