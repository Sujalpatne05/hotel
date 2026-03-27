# Menu Category Issue - Debugging Guide

## Problem
When adding a menu item, the category field is not being saved correctly. User selects "Rice" but item saves as "Beverages" or "bravegres".

## Root Cause Analysis
The issue appears to be in how the category value is being captured from the form select element. Enhanced logging has been added to trace the issue.

## Steps to Debug

### 1. Open Browser Developer Tools
- Press `F12` or right-click → Inspect
- Go to the **Console** tab
- Keep the console open while testing

### 2. Add a Menu Item with Debugging
1. Navigate to Menu Management page
2. Click "Add Item" button
3. Fill in the form:
   - **Name**: "Test Rice" (or any name)
   - **Category**: Select "Rice" from dropdown
   - **Price**: 100
   - Leave image empty
   - Check "Available"

### 3. Watch Console Logs
As you interact with the form, you should see logs like:
```
Field changed: name = "Test Rice" (type: text)
Current newItem before update: {name: "", category: "", price: "", available: true, image_url: ""}
Updated newItem: {name: "Test Rice", category: "", price: "", available: true, image_url: ""}

Field changed: category = "Rice" (type: select-one)
Current newItem before update: {name: "Test Rice", category: "", price: "", available: true, image_url: ""}
Updated newItem: {name: "Test Rice", category: "Rice", price: "", available: true, image_url: ""}

Field changed: price = "100" (type: number)
...
```

### 4. Submit the Form
When you click "Add Item", check the console for:
```
Form state before validation: {name: "Test Rice", category: "Rice", price: "100", available: true, image_url: ""}
Final payload being sent: {
  "name": "Test Rice",
  "category": "Rice",
  "price": 100,
  "available": true,
  "image_url": ""
}
Response from backend: {id: 7, name: "Test Rice", category: "Rice", price: 100, available: true, image_url: ""}
Response status: 201
Saved item after toUiItem: {id: 7, name: "Test Rice", category: "Rice", price: 100, available: true, popular: false, image_url: ""}
```

## Expected Behavior
- Category should be captured correctly from the select dropdown
- Payload sent to backend should include the selected category
- Backend should return the item with the correct category
- Item should display with the correct category in the menu list

## What to Look For
1. **In handleChange logs**: Does the category value update correctly when you select from dropdown?
2. **In handleSubmit logs**: Is the category value present in the payload?
3. **In backend response**: Does the backend return the correct category?
4. **In final item**: Does the saved item show the correct category?

## If Category is Still Wrong
If the category is still showing as "Beverages" or "bravegres" after submission:
1. Check if the select dropdown is actually changing (look for "Field changed: category" logs)
2. Check if the payload being sent has the correct category
3. Check the backend logs to see what it's receiving
4. Clear browser cache (Ctrl+Shift+Delete) and refresh

## Backend Logs
The backend should log:
```
POST /menu - Received body: {name: "Test Rice", category: "Rice", price: 100, available: true, image_url: ""}
POST /menu - Creating item: {id: 7, name: "Test Rice", category: "Rice", price: 100, available: true, image_url: ""}
```

If the category is missing or wrong in these logs, the issue is in the frontend form submission.
