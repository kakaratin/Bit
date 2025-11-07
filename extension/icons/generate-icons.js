#!/usr/bin/env node

/**
 * Generate PNG icons for the browser extension
 * This script creates 16x16, 48x48, and 128x128 PNG icons
 */

const fs = require('fs');
const path = require('path');

// Simple PNG encoder (creates a valid PNG file)
function createSimplePNG(width, height) {
  // This creates a simple PNG with gradient background and centered emoji-like icon
  // For a production app, you'd use a proper image library like 'canvas' or 'sharp'
  // But for simplicity, we'll create a basic SVG and note that icons can be manually generated
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="${width * 0.15}" ry="${width * 0.15}" fill="url(#grad)"/>
  
  <!-- Email envelope -->
  <rect x="${width * 0.2}" y="${height * 0.3}" width="${width * 0.6}" height="${height * 0.4}" fill="white" rx="2"/>
  <path d="M ${width * 0.2} ${height * 0.3} L ${width * 0.5} ${height * 0.5} L ${width * 0.8} ${height * 0.3}" 
        stroke="#764ba2" stroke-width="2" fill="none"/>
  
  ${width >= 48 ? `<text x="${width * 0.75}" y="${height * 0.35}" font-size="${width * 0.25}" fill="white">🚀</text>` : ''}
</svg>`;
  
  return svg;
}

// Generate icons
const sizes = [16, 48, 128];
const iconsDir = __dirname;

console.log('🎨 Generating extension icons...\n');

sizes.forEach(size => {
  const svg = createSimplePNG(size, size);
  const filename = `icon${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svg);
  console.log(`✅ Created ${filename} (${size}x${size})`);
});

console.log('\n📝 Note: SVG icons have been generated.');
console.log('For better compatibility, you can:');
console.log('1. Open generate-icons.html in a browser and save the canvas images as PNG');
console.log('2. Use an online converter to convert the SVG files to PNG');
console.log('3. Install a package like "sharp" or "canvas" for PNG generation\n');

// Create a script to convert SVG to PNG using ImageMagick if available
const convertScript = `#!/bin/bash
# Convert SVG icons to PNG using ImageMagick (if available)

if command -v convert &> /dev/null; then
    echo "Converting SVG to PNG..."
    convert icon16.svg icon16.png
    convert icon48.svg icon48.png
    convert icon128.svg icon128.png
    echo "✅ PNG icons created!"
else
    echo "❌ ImageMagick not found. Please:"
    echo "1. Open generate-icons.html in a browser and save as PNG, or"
    echo "2. Install ImageMagick: sudo apt-get install imagemagick"
fi
`;

fs.writeFileSync(path.join(iconsDir, 'convert.sh'), convertScript, { mode: 0o755 });
console.log('💡 Created convert.sh - run this if you have ImageMagick installed\n');
