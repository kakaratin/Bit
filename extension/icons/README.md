# Extension Icons

## Quick Setup

You need to create three PNG icon files:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)  
- `icon128.png` (128x128 pixels)

## Option 1: Use the Generator (Recommended)

1. Open `generate-icons.html` in your browser
2. Right-click on each canvas and select "Save image as..."
3. Save as:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

## Option 2: Use the SVG

1. Open `icon.svg` in a browser or image editor
2. Export/save as PNG at three different sizes:
   - 16x16 → `icon16.png`
   - 48x48 → `icon48.png`
   - 128x128 → `icon128.png`

## Option 3: Create Your Own

Create your own icon designs at the three required sizes and save them in this folder.

## Option 4: Use ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Convert SVG to PNGs
convert -background none icon.svg -resize 16x16 icon16.png
convert -background none icon.svg -resize 48x48 icon48.png
convert -background none icon.svg -resize 128x128 icon128.png
```

## Temporary Workaround

If you need to test the extension without proper icons, you can create simple placeholder images or use any square PNG images you have, just rename them to match the required names.

The extension will work fine even with placeholder icons - they just affect how the extension looks in your browser toolbar and extension management page.
