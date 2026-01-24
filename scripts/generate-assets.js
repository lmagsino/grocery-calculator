/**
 * Generate app icon and splash screen assets
 * Uses the "Fresh Market" theme colors
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Theme colors from the app
const colors = {
  primary: '#7A9E77',      // Sage Green
  primaryDark: '#5C7D59',  // Forest
  background: '#FBF7F1',   // Parchment
  textInverse: '#FFFDF9',  // Warm White
  surface: '#FFFFFF',      // White
};

const assetsDir = path.join(__dirname, '..', 'assets');

/**
 * Draw a rounded rectangle
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Draw a shopping cart icon
 */
function drawCart(ctx, centerX, centerY, size) {
  const scale = size / 100;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);

  ctx.strokeStyle = colors.textInverse;
  ctx.fillStyle = colors.textInverse;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Cart body
  ctx.beginPath();
  ctx.moveTo(-35, -25);
  ctx.lineTo(-25, -25);
  ctx.lineTo(-15, 15);
  ctx.lineTo(30, 15);
  ctx.lineTo(35, -15);
  ctx.lineTo(-10, -15);
  ctx.stroke();

  // Cart handle
  ctx.beginPath();
  ctx.moveTo(-35, -25);
  ctx.lineTo(-45, -35);
  ctx.stroke();

  // Wheels
  ctx.beginPath();
  ctx.arc(-10, 25, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(25, 25, 6, 0, Math.PI * 2);
  ctx.fill();

  // Plus sign (for adding items)
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(5, -8);
  ctx.lineTo(5, 8);
  ctx.moveTo(-3, 0);
  ctx.lineTo(13, 0);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw the app name text
 */
function drawAppName(ctx, centerX, y, fontSize) {
  ctx.fillStyle = colors.textInverse;
  ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GroceryCalc', centerX, y);
}

/**
 * Generate the main app icon (1024x1024)
 */
function generateIcon() {
  const size = 1024;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background with rounded corners (iOS style)
  ctx.fillStyle = colors.primary;
  roundRect(ctx, 0, 0, size, size, size * 0.22);
  ctx.fill();

  // Add subtle gradient overlay
  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
  ctx.fillStyle = gradient;
  roundRect(ctx, 0, 0, size, size, size * 0.22);
  ctx.fill();

  // Draw cart icon
  drawCart(ctx, size / 2, size / 2 - 50, 450);

  // Draw peso sign below cart
  ctx.fillStyle = colors.textInverse;
  ctx.font = `bold 180px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('₱', size / 2, size / 2 + 280);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(assetsDir, 'icon.png'), buffer);
  console.log('✓ Generated icon.png (1024x1024)');
}

/**
 * Generate adaptive icon for Android (1024x1024)
 */
function generateAdaptiveIcon() {
  const size = 1024;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Transparent background (foreground only)
  ctx.clearRect(0, 0, size, size);

  // Draw cart icon (centered, smaller for safe zone)
  ctx.fillStyle = colors.primary;
  drawCart(ctx, size / 2, size / 2 - 30, 350);

  // Draw peso sign
  ctx.fillStyle = colors.primary;
  ctx.font = `bold 140px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('₱', size / 2, size / 2 + 200);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), buffer);
  console.log('✓ Generated adaptive-icon.png (1024x1024)');
}

/**
 * Generate splash icon (200x200)
 */
function generateSplashIcon() {
  const size = 200;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Transparent background
  ctx.clearRect(0, 0, size, size);

  // Draw cart icon
  ctx.strokeStyle = colors.textInverse;
  ctx.fillStyle = colors.textInverse;
  drawCart(ctx, size / 2, size / 2, 150);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(assetsDir, 'splash-icon.png'), buffer);
  console.log('✓ Generated splash-icon.png (200x200)');
}

/**
 * Generate favicon (48x48)
 */
function generateFavicon() {
  const size = 48;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = colors.primary;
  roundRect(ctx, 0, 0, size, size, 8);
  ctx.fill();

  // Simple cart outline
  ctx.strokeStyle = colors.textInverse;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Simplified cart for small size
  ctx.beginPath();
  ctx.moveTo(10, 16);
  ctx.lineTo(14, 16);
  ctx.lineTo(18, 30);
  ctx.lineTo(36, 30);
  ctx.lineTo(38, 20);
  ctx.lineTo(18, 20);
  ctx.stroke();

  // Wheels
  ctx.fillStyle = colors.textInverse;
  ctx.beginPath();
  ctx.arc(21, 35, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(33, 35, 3, 0, Math.PI * 2);
  ctx.fill();

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(assetsDir, 'favicon.png'), buffer);
  console.log('✓ Generated favicon.png (48x48)');
}

// Run all generators
console.log('\n🎨 Generating Fresh Market app assets...\n');
generateIcon();
generateAdaptiveIcon();
generateSplashIcon();
generateFavicon();
console.log('\n✅ All assets generated successfully!\n');
