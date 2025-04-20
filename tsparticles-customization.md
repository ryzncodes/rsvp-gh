# tsParticles Customization Guide

This guide documents how to customize the tsParticles animation on our wedding website, including using custom images like flowers.

## Using Custom Image Particles

### Basic Configuration

To change the default circular particles to custom images (like flowers), you need to modify the `shape` property in the tsParticles configuration:

```javascript
particles: {
  // other particle settings...
  shape: {
    type: "image",
    image: {
      src: "path/to/your/flower-image.png", // URL to your flower image
      width: 100,
      height: 100,
      replaceColor: false
    }
  }
}
```

### Image Considerations

1. **Transparency**: Use PNG images with transparent backgrounds for best results
2. **Size**: Keep images small (ideally under 50kb) for better performance
3. **Resolution**: Higher resolution isn't always better - 100x100px is usually sufficient
4. **Variety**: For more natural-looking effects, you can use multiple images

### Multiple Image Sources

If you want to use multiple different flower images for variety, you can configure the shape like this:

```javascript
shape: {
  type: "image",
  image: [
    {
      src: "path/to/flower1.png",
      width: 100,
      height: 100
    },
    {
      src: "path/to/flower2.png", 
      width: 100,
      height: 100
    },
    {
      src: "path/to/flower3.png",
      width: 100,
      height: 100
    }
  ]
}
```

## Common Errors and Solutions

### Image Loading Errors

**Error**: "Failed to load image from URL" or particles not showing

**Solutions**:
- Check if the image URL is correct and accessible
- Ensure the image is not blocked by CORS policies
- Try using a different image hosting service
- Make sure the image format is supported (PNG, JPG, etc.)

### Performance Issues

**Error**: Website becomes slow or laggy

**Solutions**:
- Reduce the number of particles (`number.value`)
- Use smaller image files
- Disable complex animations like rotation
- Lower the particle movement speed

```javascript
particles: {
  number: {
    value: 30 // Reduced from higher value
  },
  // other settings...
}
```

### Console Errors

**Error**: "Uncaught TypeError: Cannot read property of undefined"

**Solutions**:
- Check if tsParticles is properly loaded before configuration
- Verify the DOM element with the specified ID exists
- Ensure all required properties are defined in the configuration
- Update to the latest version of tsParticles

## Tips for Flower Particles

1. **Rotation**: Add gentle rotation to make the flowers look more natural

```javascript
rotate: {
  value: 0,
  random: true,
  direction: "clockwise",
  animation: {
    enable: true,
    speed: 3,
    sync: false
  }
}
```

2. **Size Variation**: Make flowers different sizes for a more organic effect

```javascript
size: {
  value: 15,
  random: true,
  anim: {
    enable: false,
    speed: 2,
    size_min: 8,
    sync: false
  }
}
```

3. **Color Tinting**: You can tint white flower images with the color property

```javascript
color: {
  value: "#ffaadd" // Pinkish tint
}
```

4. **Interaction**: Allow flowers to respond to mouse movement

```javascript
interactivity: {
  detect_on: "window",
  events: {
    onhover: {
      enable: true,
      mode: "repulse" // Flowers move away from cursor
    }
  }
}
```

## Resources

- [Official tsParticles Documentation](https://particles.js.org/docs/)
- [tsParticles GitHub Repository](https://github.com/matteobruni/tsparticles)
- Free flower PNG images:
  - [Transparent PNG](https://www.transparentpng.com/cats/flower-720.html)
  - [PNGItem](https://www.pngitem.com/middle/mmxJxo_transparent-background-flower-png-png-download/)
  - [Clipart Library](http://clipart-library.com/free/transparent-flower-png.html) 