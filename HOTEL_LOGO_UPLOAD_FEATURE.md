# Hotel Logo Upload Feature ✅

## What Was Added

### Logo Upload Functionality
Added the ability to upload and store hotel/restaurant logos in the Super Admin Restaurant Management section.

## Changes Made

### File: `src/pages/SuperAdminRestaurants.tsx`

#### 1. State Management
- Added `logo` field to the form state
- Added `logoFile` state to track the selected file
- Added `logoPreview` state to display image preview

#### 2. Logo Upload Handler
- Created `handleLogoChange()` function that:
  - Accepts image files
  - Converts image to base64 format
  - Updates form state with base64 data
  - Shows preview of selected logo

#### 3. Form Updates
- Updated `closeModal()` to reset logo state
- Updated `handleEdit()` to load existing logo
- Updated `handleAdd()` to send logo with restaurant creation
- Updated `handleSave()` to send logo with restaurant update

#### 4. UI Changes
- Added logo upload input field in the restaurant form
- Added logo preview display (16x16px thumbnail)
- Logo field appears after Plan selection

## How to Use

### Adding a Restaurant with Logo

1. Go to **Super Admin → Restaurants**
2. Click **"Add Restaurant"** button
3. Fill in:
   - Restaurant Name
   - Owner Name
   - City
   - Plan (Standard/Premium)
4. **Upload Logo** - Click the file input and select an image
5. See the logo preview appear
6. Click **"Create Restaurant"**

### Editing Restaurant Logo

1. Go to **Super Admin → Restaurants**
2. Click **"Edit"** on any restaurant
3. Upload a new logo or keep existing one
4. Click **"Save Changes"**

## Technical Details

### Logo Storage
- Logos are stored as **base64 encoded strings**
- Supported formats: PNG, JPG, GIF, WebP, etc.
- No file size limit enforced on frontend (backend should validate)

### API Integration
- Logo is sent in POST/PUT requests to backend
- Backend stores logo in restaurant record
- Logo can be retrieved when fetching restaurant details

## Features

✅ Image file selection
✅ Real-time preview
✅ Base64 encoding
✅ Create with logo
✅ Edit existing logo
✅ Logo persistence

## Next Steps (Optional)

1. **Display logos** in restaurant list table
2. **Add logo validation** (max file size, dimensions)
3. **Compress images** before storing
4. **Add logo removal** option
5. **Display logo** in restaurant dashboard/sidebar

## Testing

1. Create a new restaurant with a logo
2. Verify logo is saved
3. Edit the restaurant and change the logo
4. Verify logo updates correctly
5. Check that logo persists after page refresh

## Files Modified
- `src/pages/SuperAdminRestaurants.tsx` - Added logo upload functionality
