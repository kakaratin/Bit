#!/bin/bash
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
