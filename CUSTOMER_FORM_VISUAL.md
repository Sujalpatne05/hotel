# Customer Form - Visual Guide

## Form Layout

### Desktop View (420px width)
```
┌──────────────────────────────────────────┐
│ ✕                                        │
│ Add Customer                             │
├──────────────────────────────────────────┤
│                                          │
│ Name                                     │
│ ┌──────────────────────────────────────┐ │
│ │ Enter customer name                  │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Email                                    │
│ ┌──────────────────────────────────────┐ │
│ │ Enter email address                  │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Phone                                    │
│ ┌──────────────────────────────────────┐ │
│ │ Enter phone number                   │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Visits              Total Spent (₹)      │
│ ┌──────────────┐  ┌──────────────────┐  │
│ │ 0            │  │ 0                │  │
│ └──────────────┘  └──────────────────┘  │
│                                          │
│ ☐ Mark as VIP Customer                   │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ Add Customer                         │ │
│ └──────────────────────────────────────┘ │
│                                          │
└──────────────────────────────────────────┘
```

## Input Field States

### Default State
```
Name
┌──────────────────────────────────────┐
│ Enter customer name                  │
└──────────────────────────────────────┘
```

### Focus State
```
Name
┌──────────────────────────────────────┐
│ Enter customer name                  │ ← Orange ring
└──────────────────────────────────────┘
```

### Filled State
```
Name
┌──────────────────────────────────────┐
│ Rahul Sharma                         │
└──────────────────────────────────────┘
```

## Label Styling

### Label Format
```
Font: Medium (500)
Size: 14px (0.875rem)
Color: #374151 (dark gray)
Margin: 4px bottom
```

### Example
```
Name
↓ (4px gap)
[Input field]
```

## Button States

### Default State
```
┌──────────────────────────────────────┐
│ Add Customer                         │
└──────────────────────────────────────┘
Background: #f97316 (orange)
Text: white, semibold
```

### Hover State
```
┌──────────────────────────────────────┐
│ Add Customer                         │ ← Darker orange
└──────────────────────────────────────┘
Background: #ea580c (darker orange)
```

### Active State
```
┌──────────────────────────────────────┐
│ Add Customer                         │ ← Pressed effect
└──────────────────────────────────────┘
```

## Two-Column Layout

### Visits and Total Spent
```
Visits              Total Spent (₹)
┌──────────────┐  ┌──────────────────┐
│ 0            │  │ 0                │
└──────────────┘  └──────────────────┘
```

### Grid Configuration
- Grid columns: 2
- Gap: 12px (0.75rem)
- Each column: 50% width

## Checkbox Styling

### Unchecked
```
☐ Mark as VIP Customer
```

### Checked
```
☑ Mark as VIP Customer
```

### Styling
- Size: 16px × 16px
- Border radius: 4px
- Gap from label: 8px
- Cursor: pointer

## Color Scheme

### Text Colors
- Labels: #374151 (dark gray)
- Placeholders: #9ca3af (light gray)
- Input text: #000000 (black)

### Border Colors
- Default: #d1d5db (light gray)
- Focus: #f97316 (orange ring)

### Button Colors
- Default: #f97316 (orange)
- Hover: #ea580c (darker orange)
- Text: #ffffff (white)

## Spacing

### Vertical Spacing
- Between fields: 16px (space-y-4)
- Label to input: 4px
- Form padding: 24px

### Horizontal Spacing
- Input padding: 12px (px-3)
- Input vertical padding: 8px (py-2)
- Grid gap: 12px

## Focus Ring

### Focus State
```
┌──────────────────────────────────────┐
│ ┌────────────────────────────────┐   │
│ │ Input text                     │   │
│ └────────────────────────────────┘   │
│ └──────────────────────────────────┘
  ↑ Orange ring (2px)
```

### Ring Details
- Width: 2px
- Color: #f97316 (orange)
- Offset: 0px

## Mobile View

### Responsive Behavior
```
Mobile (< 640px)
┌────────────────────┐
│ Add Customer       │
├────────────────────┤
│ Name               │
│ [Input]            │
│ Email              │
│ [Input]            │
│ Phone              │
│ [Input]            │
│ Visits             │
│ [Input]            │
│ Total Spent (₹)    │
│ [Input]            │
│ ☐ VIP Customer     │
│ [Add Customer]     │
└────────────────────┘
```

Note: On mobile, Visits and Total Spent stack vertically instead of side-by-side.

## Transitions

### Button Hover
```
Duration: 150ms
Easing: ease-in-out
Property: background-color
```

### Input Focus
```
Duration: 150ms
Easing: ease-in-out
Property: border-color, box-shadow
```

## Accessibility Features

### Keyboard Navigation
- Tab: Move to next field
- Shift+Tab: Move to previous field
- Enter: Submit form
- Space: Toggle checkbox

### Screen Reader
- "Name, text input, required"
- "Email, email input, required"
- "Phone, text input, required"
- "Visits, number input"
- "Total Spent, number input"
- "Mark as VIP Customer, checkbox"

## Form Validation

### Required Fields
- Name: Required
- Email: Required (must be valid email)
- Phone: Required

### Optional Fields
- Visits: Optional (default 0)
- Total Spent: Optional (default 0)
- VIP Customer: Optional (default unchecked)

### Validation Messages
- Empty required field: Browser default
- Invalid email: Browser default
- Negative number: Prevented by min="0"

## Summary

The customer form provides:
- Clear, labeled fields
- Professional styling
- Good visual hierarchy
- Responsive design
- Accessibility support
- Smooth interactions
- Intuitive layout
