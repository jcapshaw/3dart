import { shaderMaterial } from "@react-three/drei";
import { extend, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import imageVertexShader from "../shaders/image/vertex.glsl";
import imageFragmentShader from "../shaders/image/fragment.glsl";

// Create the shader material with texture support
export const ImageShaderMaterial = shaderMaterial(
  {
    uTexture: null, // Will be set to the loaded texture
    uTime: 0,
  },
  imageVertexShader,
  imageFragmentShader
);

// Extend the material to make it available in JSX
extend({ ImageShaderMaterial });

// Helper component to load and use the image texture
export const ImageMaterial = ({ imageUrl = "https://picsum.photos/512/512", ...props }) => {
  // Load the texture
  const texture = useLoader(TextureLoader, imageUrl);
  
  return (
    <imageShaderMaterial 
      uTexture={texture} 
      {...props} 
    />
  );
};