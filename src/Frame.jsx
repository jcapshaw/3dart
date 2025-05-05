import { useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Frame = ({
  width = 1,
  height = 1,
  borderSize = 0.1,
  color = "#ececec",
  children,
  materialType = "wood", // Options: "wood", "metal", "painted"
  ...props
}) => {
  // Load textures for PBR materials
  const woodTextures = useTexture({
    map: "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/fine_wood/fine_wood_diff_1k.jpg",
    normalMap: "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/fine_wood/fine_wood_nor_gl_1k.jpg",
    roughnessMap: "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/fine_wood/fine_wood_rough_1k.jpg",
    aoMap: "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/fine_wood/fine_wood_ao_1k.jpg",
  });
  
  const metalTextures = useTexture({
    map: "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/brushed_metal/brushed_metal_diff_1k.jpg",
    normalMap: "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/brushed_metal/brushed_metal_nor_gl_1k.jpg",
    roughnessMap: "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/brushed_metal/brushed_metal_rough_1k.jpg",
    metalnessMap: "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/brushed_metal/brushed_metal_metal_1k.jpg",
  });

  // Configure texture settings
  const configureTextures = (textures) => {
    Object.values(textures).forEach((texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    });
    return textures;
  };

  // Set up material based on type
  const getMaterial = () => {
    let material;
    
    switch (materialType) {
      case "wood":
        const woodTexturesConfig = configureTextures(woodTextures);
        material = new THREE.MeshStandardMaterial({
          map: woodTexturesConfig.map,
          normalMap: woodTexturesConfig.normalMap,
          roughnessMap: woodTexturesConfig.roughnessMap,
          aoMap: woodTexturesConfig.aoMap,
          normalScale: new THREE.Vector2(0.5, 0.5),
          roughness: 0.8,
          metalness: 0.1,
          envMapIntensity: 1,
          color: new THREE.Color(color),
        });
        break;
        
      case "metal":
        const metalTexturesConfig = configureTextures(metalTextures);
        material = new THREE.MeshStandardMaterial({
          map: metalTexturesConfig.map,
          normalMap: metalTexturesConfig.normalMap,
          roughnessMap: metalTexturesConfig.roughnessMap,
          metalnessMap: metalTexturesConfig.metalnessMap,
          normalScale: new THREE.Vector2(0.5, 0.5),
          roughness: 0.3,
          metalness: 0.9,
          envMapIntensity: 1.5,
          color: new THREE.Color(color),
        });
        break;
        
      case "painted":
      default:
        material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          roughness: 0.2,
          metalness: 0.1,
          envMapIntensity: 0.8,
        });
        break;
    }
    
    return material;
  };

  // Create material
  const frameMaterial = getMaterial();
  
  // Set up texture repeat based on frame dimensions
  useEffect(() => {
    if (materialType === "wood" || materialType === "metal") {
      const textures = materialType === "wood" ? woodTextures : metalTextures;
      
      // Set texture repeat based on frame dimensions
      Object.values(textures).forEach((texture) => {
        texture.repeat.set(1, height);
      });
    }
  }, [width, height, materialType]);

  // Create frame geometry with beveled edges for more realism
  const frameGeometry = (w, h, d) => {
    const shape = new THREE.Shape();
    const bevel = borderSize * 0.2; // Bevel size as a percentage of border size
    
    // Outer rectangle
    shape.moveTo(-w/2, -h/2);
    shape.lineTo(w/2, -h/2);
    shape.lineTo(w/2, h/2);
    shape.lineTo(-w/2, h/2);
    shape.lineTo(-w/2, -h/2);
    
    // Inner rectangle (with bevel)
    const hole = new THREE.Path();
    hole.moveTo(-w/2 + borderSize - bevel, -h/2 + borderSize - bevel);
    hole.lineTo(w/2 - borderSize + bevel, -h/2 + borderSize - bevel);
    hole.lineTo(w/2 - borderSize + bevel, h/2 - borderSize + bevel);
    hole.lineTo(-w/2 + borderSize - bevel, h/2 - borderSize + bevel);
    hole.lineTo(-w/2 + borderSize - bevel, -h/2 + borderSize - bevel);
    
    shape.holes.push(hole);
    
    const extrudeSettings = {
      steps: 1,
      depth: d,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 3
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };

  return (
    <group {...props}>
      {/* Frame with beveled edges */}
      <mesh 
        geometry={frameGeometry(width + borderSize * 2, height + borderSize * 2, 0.1)}
        material={frameMaterial}
        castShadow
        receiveShadow
      />
      
      {/* Background plane */}
      <mesh position-z={-0.05}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          color="white" 
          roughness={0.9}
          metalness={0}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Artwork content */}
      <group position-z={0.01}>{children}</group>
    </group>
  );
};
