import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');
const sourceImage = join(publicDir, 'devfest-armenia.png');

const iconSizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 }
];

async function generateIcons() {
  console.log('Generating icons from devfest-armenia.png...');
  
  for (const { name, size } of iconSizes) {
    const outputPath = join(publicDir, name);
    
    await sharp(sourceImage)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Generated ${name} (${size}x${size})`);
  }
  
  // Generate favicon.ico (using 32x32 as base)
  // Note: This generates a PNG file with .ico extension, which is supported by all modern browsers
  // True ICO format would require additional dependencies, and PNG-as-ICO is the standard for modern web apps
  const icoPath = join(publicDir, 'favicon.ico');
  await sharp(sourceImage)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png()
    .toFile(icoPath);
  
  console.log('✅ Generated favicon.ico (32x32 PNG format)');
  console.log('\n📦 All icons generated successfully!');
}

generateIcons().catch(console.error);
