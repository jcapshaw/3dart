import { Gltf } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { degToRad } from "three/src/math/MathUtils";
import { Frame } from "./Frame";
import { ArtworkInteraction } from "./ArtworkInteraction";
import * as THREE from "three";

export const Gallery = ({ ...props }) => {
  const frameRefs = useRef([]);
  const artworkRefs = useRef({});
  const [hoveredArtwork, setHoveredArtwork] = useState(null);

  // Create a highlight material for hover effect
  const highlightMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
    side: THREE.FrontSide,
  });

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    for (const key in frameRefs.current) {
      frameRefs.current[key].uTime = elapsedTime;
    }
  });

  // Helper function to create artwork with interaction capabilities
  const createArtwork = (id, geometry, material, props = {}) => {
    return (
      <mesh 
        {...props}
        userData={{ isArtwork: true, artworkId: id }}
        ref={(ref) => {
          if (ref) {
            artworkRefs.current[id] = ref;
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredArtwork(id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredArtwork(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {geometry}
        {material}
      </mesh>
    );
  };

  return (
    <group {...props}>
      <Gltf
        src="/models/vr_gallery.glb"
        receiveShadow
        castShadow
        // "VR Gallery" (https://skfb.ly/ooRLp) by Maxim Mavrichev is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
      />
      
      {/* FRONT FRAMES */}
      <group position-z={-5}>
        <Frame
          position-x={-3}
          position-y={1.3}
          width={1}
          height={1}
          borderSize={0.05}
          color="#555555"
          receiveShadow
          castShadow
        >
          {createArtwork(
            "front01",
            <planeGeometry args={[0.8, 0.8]} />,
            <artFront01Material
              uColor="#00897B"
              ref={(ref) => (frameRefs.current["front01"] = ref)}
            />
          )}
        </Frame>
        <Frame
          position-x={0}
          position-y={1.3}
          width={1.2}
          height={1.6}
          color="black"
          receiveShadow
          castShadow
        >
          {createArtwork(
            "front02",
            <planeGeometry args={[1, 1.4]} />,
            <artFront02Material
              uColor="mediumpurple"
              ref={(ref) => (frameRefs.current["front02"] = ref)}
            />
          )}
        </Frame>
        <Frame
          borderSize={0.05}
          position-x={3}
          position-y={1.3}
          width={1.4}
          height={0.8}
          color="#555555"
          receiveShadow
          castShadow
        >
          {createArtwork(
            "front03",
            <planeGeometry args={[1.2, 0.6]} />,
            <artFront03Material
              uColorStart="#6A0DAD"
              uColorEnd="#4B0082"
              ref={(ref) => (frameRefs.current["front03"] = ref)}
            />
          )}
        </Frame>
      </group>

      {/* RIGHT WALL */}
      <group rotation-y={degToRad(-90)} position-x={5}>
        <Frame 
          position-y={1.5} 
          width={5} 
          height={2} 
          borderSize={0.2}
          receiveShadow
          castShadow
        >
          {createArtwork(
            "right01",
            <planeGeometry args={[5, 2, 1]} />,
            <artRight01Material
              uColor="black"
              ref={(ref) => (frameRefs.current["right01"] = ref)}
            />
          )}
        </Frame>
      </group>

      {/* LEFT WALL */}
      <group position-x={-5} rotation-y={degToRad(90)}>
        <Frame
          borderSize={0.05}
          position-x={-3.2}
          position-y={1.5}
          width={1}
          height={2}
          receiveShadow
          castShadow
        >
          {createArtwork(
            "left01",
            <planeGeometry args={[1, 2]} />,
            <artLeft01Material
              uColor="black"
              ref={(ref) => (frameRefs.current["left01"] = ref)}
            />
          )}
        </Frame>
        <Frame 
          position-y={1.5} 
          width={3.6} 
          height={2}
          receiveShadow
          castShadow
        >
          {createArtwork(
            "left02",
            <planeGeometry args={[3.4, 1.8, 1]} />,
            <artLeft02Material
              uColor="black"
              ref={(ref) => (frameRefs.current["left02"] = ref)}
            />
          )}
        </Frame>

        <Frame
          borderSize={0.05}
          position-x={3.2}
          position-y={1.5}
          width={1}
          height={2}
          receiveShadow
          castShadow
        >
          {createArtwork(
            "left03",
            <planeGeometry args={[1, 2]} />,
            <artLeft03Material
              uColor="black"
              ref={(ref) => (frameRefs.current["left03"] = ref)}
              uResolution={[1, 2]}
            />
          )}
        </Frame>
      </group>

      {/* REAR WALL */}
      <group position-z={5} rotation-y={degToRad(180)}>
        <Frame
          position-x={-2.5}
          position-y={1.5}
          width={1}
          height={1}
          borderSize={0.2}
          receiveShadow
          castShadow
        >
          {createArtwork(
            "rear01",
            <planeGeometry args={[1, 1]} />,
            <artRear01Material
              uColor="purple"
              ref={(ref) => (frameRefs.current["rear01"] = ref)}
              uResolution={[1, 0.5]}
            />
          )}
        </Frame>
        <Frame
          position-x={2.75}
          position-y={2.2}
          width={0.5}
          height={0.5}
          borderSize={0.025}
          receiveShadow
          castShadow
        >
          {createArtwork(
            "rear02",
            <planeGeometry args={[0.4, 0.4]} />,
            <artRear02Material
              uColor="purple"
              ref={(ref) => (frameRefs.current["rear02"] = ref)}
            />
          )}
        </Frame>
        <Frame
          position-x={2.75}
          position-y={1.5}
          width={0.5}
          height={0.5}
          borderSize={0.025}
          receiveShadow
          castShadow
        >
          {createArtwork(
            "rear03",
            <planeGeometry args={[0.4, 0.4]} />,
            <artRear03Material
              uColor="black"
              ref={(ref) => (frameRefs.current["rear03"] = ref)}
            />
          )}
        </Frame>
        <Frame
          position-x={2.75}
          position-y={0.8}
          width={0.5}
          height={0.5}
          borderSize={0.025}
          receiveShadow
          castShadow
        >
          {createArtwork(
            "rear04",
            <planeGeometry args={[0.4, 0.4]} />,
            <artRear04Material
              uColor="black"
              ref={(ref) => (frameRefs.current["rear04"] = ref)}
            />
          )}
        </Frame>
      </group>

      {/* Artwork interaction component */}
      <ArtworkInteraction frameRefs={frameRefs} />
    </group>
  );
};
