import { shaderMaterial } from "@react-three/drei";
import { Color } from "three";
import artLeft01VertexShader from "../shaders/artLeft01/vertex.glsl";
import artLeft01FragmentShader from "../shaders/artLeft01/fragment.glsl";

export const ArtLeft01Material = shaderMaterial(
  {
    uColor: new Color("pink"),
    uTime: 0,
  },
  artLeft01VertexShader,
  artLeft01FragmentShader
);
