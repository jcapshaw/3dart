import { shaderMaterial } from "@react-three/drei";
import { Color } from "three";
import artFront01VertexShader from "../shaders/artFront01/vertex.glsl";
import artFront01FragmentShader from "../shaders/artFront01/fragment.glsl";

export const ArtFront01Material = shaderMaterial(
  {
    uColor: new Color("pink"),
    uTime: 0,
  },
  artFront01VertexShader,
  artFront01FragmentShader
);
