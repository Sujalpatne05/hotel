# Payroll Attendance - Visual Guide

## Staff List Table

### Column Headers
```
┌──────────────┬────────┬─────────┬────────┬──────────┬─────────────┐
│ Name         │ Role   │ Present │ Leaves │ Salary   │ Actions     │
└──────────────┴────────┴─────────┴────────┴──────────┴─────────────┘
```

### Staff Rows (Before Clicking)
```
┌──────────────┬────────┬─────────┬────────┬──────────┬─────────────┐
│ Amit Kumar   │ Waiter │ [Yes]   │ [2]    │ 15,000   │ Edit Delete │
│ Priya Singh  │ Chef   │ [No]    │ [1]    │ 22,000   │ Edit Delete │
│ Rahul Verma  │ Manager│ [Yes]   │ [0]    │ 30,000   │ Edit Delete │
└──────────────┴────────┴─────────┴────────┴──────────┴─────────────┘
```

### Button Colors
- **Present Yes**: Green background (#dcfce7), Green text (#16a34a)
- **Present No**: Red background (#fee2e2), Red text (#dc2626)
- **Leaves**: Blue background (#dbeafe), Blue text (#2563eb)

## Attendance Modal

### When Clicking Present Button
```
┌─────────────────────────────────────────┐
│ ✓ Update Attendance                     │
├─────────────────────────────────────────┤
│                                         │
│ Present                                 │
│ ┌──────────────┬──────────────┐        │
│ │     Yes      │     No       │        │
│ └──────────────┴──────────────┘        │
│                                         │
│ Leaves                                  │
│ ┌─────────────────────────────┐        │
│ │ 2                           │        │
│ └─────────────────────────────┘        │
│                                         │
│ ┌──────────────┬──────────────┐        │
│ │   Update     │   Cancel     │        │
│ └──────────────┴──────────────┘        │
│                                         │
└─────────────────────────────────────────┘
```

### When Clicking Leaves Button
```
┌─────────────────────────────────────────┐
│ ✓ Update Attendance                     │
├─────────────────────────────────────────┤
│                                         │
│ Present                                 │
│ ┌──────────────┬──────────────┐        │
│ │     Yes      │     No       │        │
│ └──────────────┴──────────────┘        │
│                                         │
│ Leaves                                  │
│ ┌─────────────────────────────┐        │
│ │ 2                           │        │
│ └─────────────────────────────┘        │
│                                         │
│ ┌──────────────┬──────────────┐        │
│ │   Update     │   Cancel     │        │
│ └──────────────┴──────────────┘        │
│                                         │
└─────────────────────────────────────────┘
```

## Button States

### Present Button States
```
Active (Yes)          Inactive (Yes)        Active (No)           Inactive (No)
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│   Yes    │         │   Yes    │         │   No     │         │   No     │
│ (Green)  │         │ (Gray)   │         │ (Red)    │         │ (Gray)   │
└──────────┘         └──────────┘         └──────────┘         └──────────┘
```

### Leaves Input
```
┌─────────────────────────────┐
│ 2                           │
└─────────────────────────────┘
```

## Interaction Flow

### Step 1: View Staff List
```
┌─────────────────────────────────────────────────────────┐
│ Payroll - Staff List                                    │
├─────────────────────────────────────────────────────────┤
│ Name         │ Role   │ Present │ Leaves │ Salary       │
│ Amit Kumar   │ Waiter │ [Yes]   │ [2]    │ 15,000       │
│ Priya Singh  │ Chef   │ [No]    │ [1]    │ 22,000       │
└─────────────────────────────────────────────────────────┘
```

### Step 2: Click Present Button
```
User clicks [Yes] or [No] button
         ↓
Modal opens with current values
```

### Step 3: Edit in Modal
```
┌─────────────────────────────────────────┐
│ Update Attendance                       │
├─────────────────────────────────────────┤
│ Present: [Yes] [No] ← User clicks here  │
│ Leaves:  [2]        ← Or here           │
│ [Update] [Cancel]                       │
└─────────────────────────────────────────┘
```

### Step 4: Save Changes
```
User clicks [Update]
         ↓
Modal closes
         ↓
Table updates with new values
         ↓
Changes saved to backend
```

## Color Legend

### Present Column
```
┌─────────────────────────────────────────┐
│ Green Button = Present (Yes)            │
│ Red Button   = Absent (No)              │
└─────────────────────────────────────────┘
```

### Leaves Column
```
┌─────────────────────────────────────────┐
│ Blue Button = Leaves Count              │
│ Shows current number of leaves          │
└─────────────────────────────────────────┘
```

## Hover Effects

### Before Hover
```
[Yes]  [2]
```

### After Hover
```
[Yes]↑  [2]↑
(scales up slightly)
```

## Modal Appearance

### Light Theme
```
┌─────────────────────────────────────────┐
│ White background                        │
│ Dark text                               │
│ Orange accent color                     │
│ Rounded corners                         │
│ Shadow effect                           │
└─────────────────────────────────────────┘
```

## Responsive Design

### Desktop (Full Width)
```
┌──────────────────────────────────────────────────────────┐
│ Name │ Role │ Present │ Leaves │ Salary │ Actions        │
└──────────────────────────────────────────────────────────┘
```

### Tablet (Medium Width)
```
┌────────────────────────────────────────┐
│ Name │ Role │ Present │ Leaves │ Salary │
└────────────────────────────────────────┘
```

### Mobile (Small Width)
```
┌──────────────────────────┐
│ Name: Amit Kumar         │
│ Role: Waiter             │
│ Present: [Yes]           │
│ Leaves: [2]              │
│ Salary: 15,000           │
│ [Edit] [Delete]          │
└──────────────────────────┘
```

## Animation Timeline

### Modal Open
```
0ms:   Modal hidden
100ms: Modal appears with fade-in
200ms: Modal fully visible
```

### Button Hover
```
0ms:   Button at normal size
50ms:  Button scales to 1.05x
100ms: Button at hover size
```

### Update Action
```
0ms:   User clicks Update
100ms: Request sent to backend
500ms: Response received
600ms: Modal closes
700ms: Table updates
```

## Accessibility Features

### Keyboard Navigation
```
Tab:        Move to next button/field
Shift+Tab:  Move to previous button/field
Enter:      Activate button / Submit form
Escape:     Close modal
Space:      Toggle button
```

### Screen Reader
```
"Update Attendance dialog"
"Present section"
"Yes button, currently selected"
"No button"
"Leaves input field, value 2"
"Update button"
"Cancel button"
```

## Error States

### Update Failed
```
┌─────────────────────────────────────────┐
│ ⚠ Unable to update attendance           │
│ Please try again                        │
│ [OK]                                    │
└─────────────────────────────────────────┘
```

### Network Error
```
┌─────────────────────────────────────────┐
│ ⚠ Unable to connect to backend          │
│ Check your internet connection          │
│ [OK]                                    │
└─────────────────────────────────────────┘
```

## Success Feedback

### After Update
```
Table updates immediately:
Old: [Yes] [2]
New: [No]  [5]

Visual confirmation:
- Button colors change
- Values update
- Modal closes
```

## Summary
The Payroll attendance feature provides an intuitive, visually clear interface for managing staff attendance and leaves with immediate feedback and error handling.
