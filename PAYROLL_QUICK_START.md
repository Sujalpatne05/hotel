# Payroll Attendance - Quick Start Guide

## What's New
The Payroll page now allows you to edit staff attendance and leaves directly from the staff list table.

## How to Use

### Step 1: Open Payroll Page
- Navigate to Payroll from the sidebar
- You'll see the staff list with columns: Name, Role, Present, Leaves, Salary, Actions

### Step 2: Edit Attendance
Click on any staff member's **Present** column (Yes/No button):
- Green button = Present (Yes)
- Red button = Absent (No)

### Step 3: Edit Leaves
Click on any staff member's **Leaves** column (number button):
- Blue button with number = Current leaves count

### Step 4: Update Modal Opens
A modal dialog will appear with:
- **Present Section**: Two buttons (Yes/No) to toggle attendance
- **Leaves Section**: Number input to set leaves

### Step 5: Make Changes
- Click "Yes" or "No" to change attendance status
- Enter a number in the Leaves field
- Click "Update" to save

### Step 6: Verify Changes
- Modal closes
- Table updates immediately
- Changes are saved to the backend

## Visual Guide

### Before Clicking
```
Name          | Role    | Present | Leaves | Salary  | Actions
Amit Kumar    | Waiter  | Yes     | 2      | 15,000  | Edit Delete
Priya Singh   | Chef    | No      | 1      | 22,000  | Edit Delete
```

### After Clicking "Yes" (Present)
Modal appears:
```
┌─────────────────────────────┐
│ Update Attendance           │
├─────────────────────────────┤
│ Present                     │
│ [Yes] [No]                  │
│                             │
│ Leaves                      │
│ [2]                         │
│                             │
│ [Update] [Cancel]           │
└─────────────────────────────┘
```

## Features

✅ **Clickable Buttons** - Present and Leaves columns are now interactive
✅ **Color Coding** - Green for Yes, Red for No, Blue for Leaves
✅ **Modal Dialog** - Clean interface for editing
✅ **Instant Updates** - Changes save immediately
✅ **Error Handling** - Shows alerts if update fails
✅ **Responsive** - Works on all screen sizes

## Keyboard Shortcuts
- Tab: Navigate between fields
- Enter: Submit form
- Escape: Close modal

## Tips

1. **Quick Toggle**: Click Present button to quickly toggle Yes/No
2. **Bulk Updates**: Update multiple staff members one by one
3. **Validation**: Leaves cannot be negative (minimum is 0)
4. **Persistence**: All changes are saved to the backend

## Troubleshooting

### Modal doesn't open
- Make sure you're clicking on the Present or Leaves button
- Check browser console for errors

### Changes don't save
- Check if backend is running
- Verify you have proper permissions
- Try refreshing the page

### Button colors look wrong
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh the page

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move to next field |
| Shift+Tab | Move to previous field |
| Enter | Submit form |
| Escape | Close modal |
| Space | Toggle button |

## Mobile Support
The interface is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile phones

## Accessibility
- All buttons have clear labels
- Color is not the only indicator
- Keyboard navigation fully supported
- Screen reader compatible

## Next Steps
- Update staff attendance daily
- Track leaves for payroll calculations
- Generate reports based on attendance data
- Integrate with shift management

## Support
If you encounter any issues:
1. Check the browser console for errors
2. Verify backend is running
3. Try refreshing the page
4. Contact support if problem persists
