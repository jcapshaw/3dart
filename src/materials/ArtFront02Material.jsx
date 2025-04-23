import { shaderMaterial } from "@react-three/drei";
import { Color } from "three";
import artFront02VertexShader from "../shaders/artFront02/vertex.glsl";
import artFront02FragmentShader from "../shaders/artFront02/fragment.glsl";

export const ArtFront02Material = shaderMaterial(
  {
    uColor: new Color("pink"),
    uTime: 0,
  },
  artFront02VertexShader,
  artFront02FragmentShader
);
