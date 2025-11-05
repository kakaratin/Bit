#!/usr/bin/env node

/**
 * Convert SVG icons to PNG using Sharp
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function convertIcon(size) {
  const svgPath = path.join(__dirname, `icon${size}.svg`);
  const pngPath = path.join(__dirname, `icon${size}.png`);
  
  try {
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(pngPath);
    
    console.log(`✅ Created icon${size}.png`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create icon${size}.png:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔄 Converting SVG icons to PNG...\n');
  
  const sizes = [16, 48, 128];
  const results = await Promise.all(sizes.map(size => convertIcon(size)));
  
  if (results.every(r => r)) {
    console.log('\n✨ All PNG icons created successfully!');
    console.log('🚀 Extension is ready to use!\n');
  } else {
    console.log('\n⚠️  Some icons failed to convert.');
  }
}

main();
