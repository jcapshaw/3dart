import { CameraControls, Environment, AccumulativeShadows, RandomizedLight, BakeShadows, SpotLight, useHelper } from "@react-three/drei";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Gallery } from "./Gallery";

export const Experience = () => {
  const spotLightRef = useRef();
  const spotLightRef2 = useRef();
  
  // Optional: Uncomment to visualize the spotlights during development
  // useHelper(spotLightRef, THREE.SpotLightHelper, "red");
  // useHelper(spotLightRef2, THREE.SpotLightHelper, "blue");
  
  // Animate the spotlight to create subtle light movement
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (spotLightRef.current) {
      spotLightRef.current.position.x = Math.sin(time * 0.2) * 2;
      spotLightRef.current.intensity = 1.5 + Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <>
      <CameraControls
        minZoom={0.6}
        maxZoom={2}
        polarRotateSpeed={-0.3} // REVERSE FOR NATURAL EFFECT
        azimuthRotateSpeed={-0.3} // REVERSE FOR NATURAL EFFECT
        mouseButtons={{
          left: 1, //ACTION.ROTATE
          wheel: 16, //ACTION.ZOOM
        }}
        touches={{
          one: 32, //ACTION.TOUCH_ROTATE
          two: 512, //ACTION.TOUCH_ZOOM
        }}
      />
      
      {/* Environment map for reflections and ambient lighting */}
      <Environment preset="sunset" background blur={0.3} />
      
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.2} />
      
      {/* Main spotlight for dramatic lighting */}
      <SpotLight
        ref={spotLightRef}
        position={[4, 5, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={1.5}
        distance={10}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      
      {/* Secondary spotlight for fill lighting */}
      <SpotLight
        ref={spotLightRef2}
        position={[-4, 3, 2]}
        angle={0.7}
        penumbra={0.5}
        intensity={0.8}
        distance={8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      
      {/* Accumulative shadows for soft, realistic shadow rendering */}
      <AccumulativeShadows
        temporal
        frames={100}
        color="#301934"
        colorBlend={0.5}
        opacity={0.8}
        scale={10}
        position={[0, -1.49, 0]}
      >
        <RandomizedLight
          amount={8}
          radius={4}
          ambient={0.5}
          intensity={1}
          position={[5, 5, -10]}
          bias={0.001}
        />
      </AccumulativeShadows>
      
      {/* Bake shadows for performance */}
      <BakeShadows />
      
      {/* Gallery component with shadows enabled */}
      <Gallery position-y={-1.5} receiveShadow castShadow />
    </>
  );
};
