# Menu Category - Quick Test Card

## Quick Start
1. Open http://localhost:8080
2. Press F12 to open console
3. Go to Menu Management
4. Click "Add Item"

## Test Data
| Field | Value |
|-------|-------|
| Name | Test Rice |
| Category | Rice |
| Price | 250 |
| Image | (leave empty) |
| Available | ✓ checked |

## Console Logs to Watch For

### When selecting category:
```
Field changed: category = "Rice" (type: select-one)
Updated newItem: {..., category: "Rice", ...}
```

### When submitting:
```
Form state before validation: {..., category: "Rice", ...}
Final payload being sent: {..., "category": "Rice", ...}
Response from backend: {..., "category": "Rice", ...}
```

## Success Indicators
✅ Console shows category: "Rice" (not empty, not "Beverages", not "bravegres")
✅ Item appears in menu list with "Rice" category
✅ No error messages in console

## Quick Troubleshooting
| Problem | Check |
|---------|-------|
| Category not in logs | Form select not working |
| Category in logs but not in payload | State not updating |
| Payload correct but backend response wrong | Backend issue |
| Backend response correct but item shows wrong | Display issue |

## Test Categories
- Starters
- Main Course
- Breads
- Rice
- Desserts
- Beverages

Test at least 3 different categories to verify fix works consistently.
