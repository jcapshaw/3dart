import { Gltf } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, Suspense } from "react";
import { degToRad } from "three/src/math/MathUtils";
import { Frame } from "./Frame";
import { ArtworkInteraction } from "./ArtworkInteraction";
import * as THREE from "three";
import { ImageMaterial } from "./materials/ImageMaterial";

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

  // Create a red brick material for the walls
  const createRedBrickMaterial = () => {
    // Create procedural brick textures
    const textureSize = 1024; // Increased for better detail
    
    // Create diffuse (color) texture
    const diffuseCanvas = document.createElement('canvas');
    diffuseCanvas.width = textureSize;
    diffuseCanvas.height = textureSize;
    const diffuseCtx = diffuseCanvas.getContext('2d');
    
    // Create normal map texture
    const normalCanvas = document.createElement('canvas');
    normalCanvas.width = textureSize;
    normalCanvas.height = textureSize;
    const normalCtx = normalCanvas.getContext('2d');
    
    // Create roughness texture
    const roughnessCanvas = document.createElement('canvas');
    roughnessCanvas.width = textureSize;
    roughnessCanvas.height = textureSize;
    const roughnessCtx = roughnessCanvas.getContext('2d');
    
    // Function to draw brick pattern
    const drawBrickPattern = (ctx, colorFunc, rowCount = 16) => { // Fewer rows for larger bricks
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      
      // Clear canvas
      ctx.fillStyle = '#222'; // Darker mortar color
      ctx.fillRect(0, 0, width, height);
      
      const brickHeight = height / rowCount;
      const brickWidth = brickHeight * 2;
      const mortarSize = brickHeight / 6; // Slightly thicker mortar
      
      // Draw bricks - starting from the bottom of the canvas
      // This ensures proper alignment with Three.js UV coordinates (0,0 at bottom-left)
      for (let row = 0; row < rowCount; row++) {
        const offsetX = (row % 2) * (brickWidth / 2); // Offset every other row
        
        for (let col = -1; col < width / brickWidth + 1; col++) {
          const x = col * brickWidth + offsetX;
          const y = row * brickHeight;
          
          // Get color for this brick
          const color = colorFunc(row, col);
          
          // Draw brick
          ctx.fillStyle = color;
          ctx.fillRect(
            x + mortarSize / 2,
            y + mortarSize / 2,
            brickWidth - mortarSize,
            brickHeight - mortarSize
          );
          
          // Add some texture/noise to the brick
          const brickWidth2 = brickWidth - mortarSize;
          const brickHeight2 = brickHeight - mortarSize;
          for (let i = 0; i < 20; i++) {
            const noiseX = x + mortarSize / 2 + Math.random() * brickWidth2;
            const noiseY = y + mortarSize / 2 + Math.random() * brickHeight2;
            const noiseSize = 1 + Math.random() * 3;
            ctx.fillStyle = `rgba(0,0,0,0.1)`;
            ctx.beginPath();
            ctx.arc(noiseX, noiseY, noiseSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };
    
    // Generate diffuse (color) map - red bricks with more variation
    drawBrickPattern(diffuseCtx, (row, col) => {
      // Random variation in brick color (red)
      const r = 140 + Math.floor(Math.random() * 60); // Red component (stronger)
      const g = 30 + Math.floor(Math.random() * 30); // Green component (minimal)
      const b = 30 + Math.floor(Math.random() * 30); // Blue component (minimal)
      return `rgb(${r}, ${g}, ${b})`;
    });
    
    // Generate normal map - blue with variations
    drawBrickPattern(normalCtx, () => 'rgb(127, 127, 255)');
    
    // Generate roughness map - grayscale
    drawBrickPattern(roughnessCtx, () => {
      const roughness = 150 + Math.floor(Math.random() * 70); // Fairly rough
      return `rgb(${roughness}, ${roughness}, ${roughness})`;
    });
    
    // Create textures from canvases
    const diffuseTexture = new THREE.CanvasTexture(diffuseCanvas);
    diffuseTexture.wrapS = THREE.RepeatWrapping;
    diffuseTexture.wrapT = THREE.RepeatWrapping;
    diffuseTexture.repeat.set(2, 2); // Further reduced repetition for better visibility
    
    const normalTexture = new THREE.CanvasTexture(normalCanvas);
    normalTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapT = THREE.RepeatWrapping;
    normalTexture.repeat.set(2, 2);
    
    const roughnessTexture = new THREE.CanvasTexture(roughnessCanvas);
    roughnessTexture.wrapS = THREE.RepeatWrapping;
    roughnessTexture.wrapT = THREE.RepeatWrapping;
    roughnessTexture.repeat.set(2, 2);
    
    // Create the red brick material
    return new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      normalMap: normalTexture,
      roughnessMap: roughnessTexture,
      roughness: 0.9,
      metalness: 0.1,
      bumpScale: 0.05, // Increased bump for more texture
    });
  };
  
  // Create a reusable red brick wall component
  const RedBrickWall = ({ width, height, position, rotation }) => {
    const redBrickMaterial = createRedBrickMaterial();
    
    // Create a custom plane geometry with proper UV mapping
    const createCustomPlaneGeometry = (width, height) => {
      // Create a standard plane geometry with more segments for better texture mapping
      const geometry = new THREE.PlaneGeometry(width, height, 4, 4);
      
      // Get the UV attribute
      const uvAttribute = geometry.attributes.uv;
      
      // Modify UV coordinates to ensure proper texture alignment
      // Standard UV mapping: (0,0) bottom-left, (1,1) top-right
      // We'll ensure this is consistent for all walls regardless of rotation
      for (let i = 0; i < uvAttribute.count; i++) {
        const u = uvAttribute.getX(i);
        const v = uvAttribute.getY(i);
        
        // Ensure v coordinate starts from 0 at the bottom and goes to 1 at the top
        // This ensures the brick pattern starts from the bottom of each wall
        uvAttribute.setXY(i, u, v);
      }
      
      return geometry;
    };
    
    // Clone the material to avoid sharing across different walls
    // This allows for potential per-wall customization if needed
    const wallMaterial = redBrickMaterial.clone();
    
    return (
      <mesh position={position} rotation={rotation} receiveShadow castShadow>
        <primitive object={createCustomPlaneGeometry(width, height)} attach="geometry" />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
    );
  };

  return (
    <group {...props}>
      {/* Add red brick walls to cover the existing white walls */}
      {/* Front wall */}
      <RedBrickWall
        width={14}
        height={5}
        position={[0, 1.5, -5.02]}
        rotation={[0, 0, 0]}
      />
      
      {/* Back wall */}
      <RedBrickWall
        width={14}
        height={5}
        position={[0, 1.5, 5.02]}
        rotation={[0, Math.PI, 0]}
      />
      
      {/* Left wall */}
      <RedBrickWall
        width={12}
        height={5}
        position={[-5.02, 1.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      
      {/* Right wall */}
      <RedBrickWall
        width={12}
        height={5}
        position={[5.02, 1.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      
      <Gltf
        src="/models/vr_gallery.glb"
        receiveShadow
        castShadow
        onLoad={(gltf) => {
          console.log("Model loaded:", gltf);
          
          // Debug: Log all meshes in the model to help identify walls
          console.log("All meshes in the model:");
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              console.log("Mesh:", child.name, "Material:", child.material, "Position:", child.position);
            }
          });
          
          // Create procedural brick textures
          const textureSize = 512;
          
          // Create diffuse (color) texture
          const diffuseCanvas = document.createElement('canvas');
          diffuseCanvas.width = textureSize;
          diffuseCanvas.height = textureSize;
          const diffuseCtx = diffuseCanvas.getContext('2d');
          
          // Create normal map texture
          const normalCanvas = document.createElement('canvas');
          normalCanvas.width = textureSize;
          normalCanvas.height = textureSize;
          const normalCtx = normalCanvas.getContext('2d');
          
          // Create roughness texture
          const roughnessCanvas = document.createElement('canvas');
          roughnessCanvas.width = textureSize;
          roughnessCanvas.height = textureSize;
          const roughnessCtx = roughnessCanvas.getContext('2d');
          
          // Function to draw brick pattern
          const drawBrickPattern = (ctx, colorFunc, rowCount = 16) => {
            const width = ctx.canvas.width;
            const height = ctx.canvas.height;
            
            // Clear canvas
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, width, height);
            
            const brickHeight = height / rowCount;
            const brickWidth = brickHeight * 2;
            const mortarSize = brickHeight / 8;
            
            // Draw bricks
            for (let row = 0; row < rowCount; row++) {
              const offsetX = (row % 2) * (brickWidth / 2); // Offset every other row
              
              for (let col = -1; col < width / brickWidth + 1; col++) {
                const x = col * brickWidth + offsetX;
                const y = row * brickHeight;
                
                // Get color for this brick
                const color = colorFunc(row, col);
                
                // Draw brick
                ctx.fillStyle = color;
                ctx.fillRect(
                  x + mortarSize / 2, 
                  y + mortarSize / 2, 
                  brickWidth - mortarSize, 
                  brickHeight - mortarSize
                );
              }
            }
          };
          
          // Generate diffuse (color) map - red bricks
          drawBrickPattern(diffuseCtx, (row, col) => {
            // Random variation in brick color (red)
            const r = 120 + Math.floor(Math.random() * 40); // Red component (stronger)
            const g = 20 + Math.floor(Math.random() * 20); // Green component (minimal)
            const b = 20 + Math.floor(Math.random() * 20); // Blue component (minimal)
            return `rgb(${r}, ${g}, ${b})`;
          });
          
          // Generate normal map - blue with variations
          drawBrickPattern(normalCtx, () => 'rgb(127, 127, 255)');
          
          // Generate roughness map - grayscale
          drawBrickPattern(roughnessCtx, () => {
            const roughness = 150 + Math.floor(Math.random() * 70); // Fairly rough
            return `rgb(${roughness}, ${roughness}, ${roughness})`;
          });
          
          // Create textures from canvases
          const diffuseTexture = new THREE.CanvasTexture(diffuseCanvas);
          diffuseTexture.wrapS = THREE.RepeatWrapping;
          diffuseTexture.wrapT = THREE.RepeatWrapping;
          diffuseTexture.repeat.set(4, 4);
          
          const normalTexture = new THREE.CanvasTexture(normalCanvas);
          normalTexture.wrapS = THREE.RepeatWrapping;
          normalTexture.wrapT = THREE.RepeatWrapping;
          normalTexture.repeat.set(4, 4);
          
          const roughnessTexture = new THREE.CanvasTexture(roughnessCanvas);
          roughnessTexture.wrapS = THREE.RepeatWrapping;
          roughnessTexture.wrapT = THREE.RepeatWrapping;
          roughnessTexture.repeat.set(4, 4);
          
          // Create the red brick material
          const redBrickMaterial = new THREE.MeshStandardMaterial({
            map: diffuseTexture,
            normalMap: normalTexture,
            roughnessMap: roughnessTexture,
            roughness: 0.9,
            metalness: 0.1,
            bumpScale: 0.02,
          });
          
          // VERY aggressive approach: Apply to ALL meshes in the model
          // This is a brute force approach, but it will ensure that the walls are changed
          console.log("Applying red brick material to all meshes in the model");
          let wallsFound = 0;
          
          // First, log all materials in the model to help identify walls
          console.log("All materials in the model:");
          const allMaterials = new Set();
          gltf.scene.traverse((child) => {
            if (child.isMesh && child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  if (mat && mat.color) {
                    allMaterials.add(`${mat.uuid}: r=${mat.color.r}, g=${mat.color.g}, b=${mat.color.b}`);
                  }
                });
              } else if (child.material.color) {
                allMaterials.add(`${child.material.uuid}: r=${child.material.color.r}, g=${child.material.color.g}, b=${child.material.color.b}`);
              }
            }
          });
          console.log([...allMaterials]);
          
          // Now apply the red brick material to all meshes with white/light materials
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              // Check if this mesh has a material that looks like a wall
              let isWallMaterial = false;
              
              if (Array.isArray(child.material)) {
                // Check if any of the materials are white/light colored
                isWallMaterial = child.material.some(mat =>
                  mat && mat.color &&
                  mat.color.r > 0.8 &&
                  mat.color.g > 0.8 &&
                  mat.color.b > 0.8
                );
              } else if (child.material && child.material.color) {
                // Check if the material is white/light colored
                isWallMaterial =
                  child.material.color.r > 0.8 &&
                  child.material.color.g > 0.8 &&
                  child.material.color.b > 0.8;
              }
              
              if (isWallMaterial) {
                console.log("Found wall mesh with white material:", child.name, "Position:", child.position);
                wallsFound++;
                
                // Apply the new material to the wall
                if (Array.isArray(child.material)) {
                  // If the mesh has multiple materials, replace them all
                  child.material = child.material.map(() => redBrickMaterial.clone());
                } else {
                  // If the mesh has a single material
                  child.material = redBrickMaterial.clone();
                }
              }
            }
          });
          
          console.log(`Modified ${wallsFound} wall meshes with red brick material`);
        }}
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
        {/* Original artwork */}
        <Frame
          position-y={1.5}
          position-z={-1.5}
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
        
        {/* New image artwork */}
        <Frame
          position-y={1.5}
          position-z={1.5}
          width={2}
          height={2}
          borderSize={0.1}
          color="#222222"
          receiveShadow
          castShadow
        >
          <Suspense fallback={<meshBasicMaterial color="#444444" />}>
            {createArtwork(
              "image01",
              <planeGeometry args={[1.8, 1.8]} />,
              <ImageMaterial
                imageUrl="https://picsum.photos/512/512"
                ref={(ref) => (frameRefs.current["image01"] = ref)}
              />
            )}
          </Suspense>
        </Frame>
      </group>

      {/* LEFT WALL */}
      <group position-x={-5} rotation-y={degToRad(90)}>
        {/* New image artwork - Elvida Santos */}
        <Frame
          position-x={-6}
          position-y={1.5}
          width={2}
          height={2.5}
          borderSize={0.1}
          color="#222222"
          receiveShadow
          castShadow
        >
          <Suspense fallback={<meshBasicMaterial color="#444444" />}>
            {createArtwork(
              "image02",
              <planeGeometry args={[1.8, 2.3]} />,
              <ImageMaterial
                imageUrl="/images/Elvida Santos 6.jpg"
                ref={(ref) => (frameRefs.current["image02"] = ref)}
              />
            )}
          </Suspense>
        </Frame>
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
        
        {/* New image artwork - Engine Hero */}
        <Frame
          position-x={1}
          position-y={1.5}
          width={2.5}
          height={1.8}
          borderSize={0.1}
          color="#333333"
          receiveShadow
          castShadow
        >
          <Suspense fallback={<meshBasicMaterial color="#444444" />}>
            {createArtwork(
              "image03",
              <planeGeometry args={[2.3, 1.6]} />,
              <ImageMaterial
                imageUrl="/images/engineherolrg.png"
                ref={(ref) => (frameRefs.current["image03"] = ref)}
              />
            )}
          </Suspense>
        </Frame>
      </group>

      {/* Artwork interaction component */}
      <ArtworkInteraction frameRefs={frameRefs} />
    </group>
  );
};
