# Adding Custom Images to the 3D Art Gallery

This guide explains how to add your own custom images to the 3D art gallery.

## Quick Start

1. Place your image files in the `public/images/` directory
2. Update the `Gallery.jsx` file to use your image

## Detailed Instructions

### Step 1: Prepare Your Image

- For best results, use square images (e.g., 512x512, 1024x1024)
- Supported formats: JPG, PNG, WebP
- Optimize your images for web to keep file sizes small

### Step 2: Add Images to the Project

Place your image files in the `public/images/` directory. For example:
```
public/images/my-artwork.jpg
```

### Step 3: Update the Gallery Component

Open `src/Gallery.jsx` and find the image frame section:

```jsx
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
```

Change the `imageUrl` prop to point to your image:

```jsx
<ImageMaterial
  imageUrl="/images/my-artwork.jpg"
  ref={(ref) => (frameRefs.current["image01"] = ref)}
/>
```

### Step 4: Add More Image Frames (Optional)

To add more image frames, duplicate the Frame component and:

1. Change the position values to place it in a different location
2. Update the artwork ID (e.g., from "image01" to "image02")
3. Point to a different image file
4. Add information about the new artwork in `src/ArtworkInteraction.jsx`

## Troubleshooting

- If your image doesn't appear, check that the file path is correct
- Make sure the image file exists in the specified location
- Try using a different image format if you encounter issues
- Check the browser console for any error messages

## Advanced: Using External Image URLs

You can also use external image URLs, but be aware of potential CORS issues:

```jsx
<ImageMaterial
  imageUrl="https://example.com/path/to/image.jpg"
  ref={(ref) => (frameRefs.current["image01"] = ref)}
/>
```

For external URLs, the server hosting the image must allow cross-origin requests.