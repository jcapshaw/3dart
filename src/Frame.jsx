import { useRef } from "react";
import * as THREE from "three";

export const Frame = ({
  width = 1,
  height = 1,
  borderSize = 0.1,
  color = "#ececec",
  children,
  materialType = "painted", // Only using painted now to avoid CORS issues
  ...props
}) => {
  // Create a simple material without external textures
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: materialType === "metal" ? 0.3 : 0.8,
    metalness: materialType === "metal" ? 0.9 : 0.1,
    envMapIntensity: materialType === "metal" ? 1.5 : 0.8,
  });

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
