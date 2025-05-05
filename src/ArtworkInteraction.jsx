import { useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Sample artwork information - in a real app, this would come from a database or API
const artworkInfo = {
  front01: {
    title: "Geometric Abstraction",
    artist: "Alex Rivera",
    year: "2023",
    description: "A dynamic exploration of geometric forms and vibrant colors."
  },
  front02: {
    title: "Purple Haze",
    artist: "Maya Johnson",
    year: "2022",
    description: "An immersive journey through layers of purple tones and textures."
  },
  front03: {
    title: "Spectrum Shift",
    artist: "Carlos Mendez",
    year: "2024",
    description: "A gradient study exploring the transition between complementary colors."
  },
  right01: {
    title: "Cubist Composition",
    artist: "Elena Petrov",
    year: "2023",
    description: "A modern take on cubism with digital techniques and animated elements."
  },
  left01: {
    title: "Monochrome Study #7",
    artist: "David Kim",
    year: "2021",
    description: "Part of a series exploring texture and depth through monochromatic palettes."
  },
  left02: {
    title: "Horizon Lines",
    artist: "Sarah Williams",
    year: "2022",
    description: "An abstract landscape inspired by desert horizons at dusk."
  },
  left03: {
    title: "Grid Variations",
    artist: "Thomas Chen",
    year: "2023",
    description: "A systematic exploration of grid structures with organic interruptions."
  },
  rear01: {
    title: "Purple Composition #3",
    artist: "Leila Hassan",
    year: "2024",
    description: "Third in a series examining purple as both form and emotion."
  },
  rear02: {
    title: "Miniature #1",
    artist: "James Wilson",
    year: "2022",
    description: "A small-scale work exploring precision and detail in digital art."
  },
  rear03: {
    title: "Miniature #2",
    artist: "James Wilson",
    year: "2022",
    description: "Companion piece to Miniature #1, exploring contrast and rhythm."
  },
  rear04: {
    title: "Miniature #3",
    artist: "James Wilson",
    year: "2023",
    description: "Final piece in the miniature triptych, focusing on movement and time."
  }
};

export const ArtworkInteraction = ({ frameRefs }) => {
  const [hoveredArtwork, setHoveredArtwork] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const { camera, scene, raycaster, mouse, gl } = useThree();
  const mousePosition = useRef(new THREE.Vector2());
  const artworkPlanes = useRef([]);
  
  // Highlight material for hover effect
  const highlightMaterial = useRef(
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.FrontSide,
    })
  );

  // Setup raycasting for artwork interaction
  useFrame(() => {
    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mousePosition.current, camera);
    
    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(artworkPlanes.current, true);
    
    // Handle hover state
    if (intersects.length > 0) {
      const artworkId = intersects[0].object.userData.artworkId;
      if (hoveredArtwork !== artworkId) {
        setHoveredArtwork(artworkId);
        document.body.style.cursor = 'pointer';
      }
    } else if (hoveredArtwork) {
      setHoveredArtwork(null);
      document.body.style.cursor = 'auto';
    }
  });

  // Handle mouse movement
  const onMouseMove = (event) => {
    // Calculate mouse position in normalized device coordinates
    mousePosition.current.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
    mousePosition.current.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;
  };

  // Handle mouse click
  const onMouseClick = () => {
    if (hoveredArtwork) {
      setSelectedArtwork(hoveredArtwork === selectedArtwork ? null : hoveredArtwork);
    } else {
      setSelectedArtwork(null);
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);
    
    // Collect all artwork planes for raycasting
    artworkPlanes.current = [];
    scene.traverse((object) => {
      if (object.userData && object.userData.isArtwork) {
        artworkPlanes.current.push(object);
      }
    });
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onMouseClick);
    };
  }, [scene]);

  // Render the information panel for the selected artwork
  return selectedArtwork ? (
    <Html
      position={[0, 0, 0]}
      wrapperClass="artwork-info-panel"
      center
      distanceFactor={10}
    >
      <div className="info-panel">
        <button className="close-button" onClick={() => setSelectedArtwork(null)}>×</button>
        <h2>{artworkInfo[selectedArtwork]?.title || "Untitled"}</h2>
        <h3>{artworkInfo[selectedArtwork]?.artist || "Unknown Artist"}, {artworkInfo[selectedArtwork]?.year || "Unknown Year"}</h3>
        <p>{artworkInfo[selectedArtwork]?.description || "No description available."}</p>
      </div>
    </Html>
  ) : null;
};

// Add this CSS to your index.css file:
/*
.artwork-info-panel {
  pointer-events: auto !important;
}

.info-panel {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  max-width: 80vw;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.info-panel h2 {
  margin-top: 0;
  margin-bottom: 5px;
  font-size: 1.5em;
}

.info-panel h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1em;
  font-weight: normal;
  color: #cccccc;
}

.info-panel p {
  line-height: 1.5;
}
*/