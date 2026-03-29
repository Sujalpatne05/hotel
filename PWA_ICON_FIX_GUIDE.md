# PWA Icon Fix Guide

**Problem**: App shows just "N" instead of "RestroHub" when added to home screen

**Solution**: Create proper PWA icons with branding

---

## Quick Fix (Online Tool)

### Step 1: Generate Icons Online
1. Go to: https://www.favicon-generator.org/
2. Upload your logo or use text "RestroHub"
3. Download the icons

### Step 2: Replace Icon Files
1. Replace `public/icon-192x192.png` with the 192x192 icon
2. Replace `public/icon-512x512.png` with the 512x512 icon

### Step 3: Clear Cache
1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Click "Unregister"
4. Go to Application → Cache Storage
5. Delete all caches
6. Refresh page

### Step 4: Reinstall App
1. Open browser menu
2. Click "Install app" or "Add to home screen"
3. App should now show "RestroHub" with proper icon

---

## Alternative: Use Online Icon Generator

### Option 1: Favicon.io
1. Go to: https://favicon.io/
2. Click "Text"
3. Enter: "RestroHub"
4. Choose colors:
   - Background: #e53935 (red)
   - Text: #ffffff (white)
5. Download
6. Replace icon files

### Option 2: PWA Builder
1. Go to: https://www.pwabuilder.com/
2. Upload your logo
3. Generate icons
4. Download all sizes

---

## Manual Fix (Using Code)

If you want to create icons programmatically:

### Using Node.js + Sharp

```bash
npm install sharp
```

Create `generate-icons.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs');

// Create 192x192 icon
sharp('logo.png')
  .resize(192, 192)
  .toFile('public/icon-192x192.png');

// Create 512x512 icon
sharp('logo.png')
  .resize(512, 512)
  .toFile('public/icon-512x512.png');
```

Run:
```bash
node generate-icons.js
```

---

## What Changed in vite.config.ts

Updated PWA manifest to:
- Separate `any` and `maskable` purposes
- Add categories
- Add screenshots
- Better icon configuration

This ensures iOS and Android properly recognize and display the app icon.

---

## Testing

### On Android
1. Open Chrome
2. Go to your app URL
3. Click menu → "Install app"
4. Check home screen icon

### On iOS
1. Open Safari
2. Go to your app URL
3. Click Share → "Add to Home Screen"
4. Check home screen icon

---

## If Still Not Working

### Clear Everything
```bash
# Delete node_modules/.vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build

# Clear browser cache
# DevTools → Application → Clear site data
```

### Check Manifest
1. Open DevTools
2. Go to Application → Manifest
3. Verify icons are listed correctly
4. Verify all paths are correct

### Verify Icon Files
1. Check `public/icon-192x192.png` exists
2. Check `public/icon-512x512.png` exists
3. Check file sizes (should be > 1KB)
4. Check files are valid PNG images

---

## Recommended Icon Sizes

For best results, create these sizes:

- 192x192 (Android home screen)
- 512x512 (Splash screen)
- 180x180 (iOS home screen)
- 167x167 (iPad home screen)

---

## Next Steps

1. Generate proper icons using one of the tools above
2. Replace `public/icon-192x192.png` and `public/icon-512x512.png`
3. Clear browser cache
4. Rebuild: `npm run build`
5. Reinstall app on home screen
6. App should now show "RestroHub" properly

---

## Icon Design Tips

- Use solid colors (avoid gradients for maskable icons)
- Keep important content in center (safe zone)
- Use brand colors: #e53935 (red) and #1a1a2e (dark)
- Make sure text is readable at small sizes
- Test on both Android and iOS

