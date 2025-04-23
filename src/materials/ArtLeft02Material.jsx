import { shaderMaterial } from "@react-three/drei";
import { Color } from "three";
import artLeft02VertexShader from "../shaders/artLeft02/vertex.glsl";
import artLeft02FragmentShader from "../shaders/artLeft02/fragment.glsl";

export const ArtLeft02Material = shaderMaterial(
  {
    uColor: new Color("pink"),
    uTime: 0,
  },
  artLeft02VertexShader,
  artLeft02FragmentShader
);
