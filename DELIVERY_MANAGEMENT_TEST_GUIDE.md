# Delivery Management - Quick Test Guide

## Prerequisites
- Backend running on port 5000
- Frontend running on port 8080
- Logged in as Admin or Manager

## Test Steps

### 1. Test Page Load
1. Navigate to `/delivery-management`
2. Should see:
   - Summary cards (Total, Delivered, Pending, Revenue)
   - API Keys section
   - Delivery list with 2 existing deliveries
3. ✅ Page loads successfully

### 2. Test Fetch Deliveries
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Should see GET request to `/deliveries`
5. Response should have 2 deliveries (Ria Verma, Kunal Jain)
6. ✅ Deliveries loaded from backend

### 3. Test Fetch API Keys
1. In Network tab, look for GET `/delivery-api-keys`
2. Response should be: `{ swiggy: "", zomato: "" }`
3. ✅ API keys loaded from backend

### 4. Test Update API Keys
1. Enter in Swiggy field: "test-swiggy-123"
2. Enter in Zomato field: "test-zomato-456"
3. Click "Update Keys" button
4. Should see success toast: "API keys updated successfully"
5. In Network tab, should see PUT request to `/delivery-api-keys`
6. ✅ API keys saved to backend

### 5. Test Create Delivery
1. Click "Add Delivery" button
2. Modal opens with empty form
3. Fill in:
   - Order Number: "ORD-999"
   - Customer Name: "Test Customer"
   - Phone: "9999999999"
   - Address: "Test Address, City"
   - Partner: "Swiggy"
   - Amount: "500"
   - Driver: "Test Driver"
   - Status: "Pending"
4. Click "Save"
5. Should see success toast: "Delivery created successfully"
6. Modal closes
7. New delivery appears at top of list
8. In Network tab, should see POST request to `/deliveries`
9. ✅ Delivery created successfully

### 6. Test Edit Delivery
1. Click "Edit" on the newly created delivery (ORD-999)
2. Modal opens with data pre-filled
3. Change Status to "Dispatched"
4. Click "Save"
5. Should see success toast: "Delivery updated successfully"
6. Modal closes
7. Delivery status in list should now show "Dispatched"
8. In Network tab, should see PUT request to `/deliveries/3003`
9. ✅ Delivery updated successfully

### 7. Test Delete Delivery
1. Click "Delete" on the edited delivery (ORD-999)
2. Confirmation dialog appears: "Are you sure you want to delete this delivery?"
3. Click "OK" to confirm
4. Should see success toast: "Delivery deleted successfully"
5. Delivery disappears from list
6. In Network tab, should see DELETE request to `/deliveries/3003`
7. ✅ Delivery deleted successfully

### 8. Test Search
1. In search box, type "Ria"
2. List should filter to show only "Ria Verma" delivery
3. Type "ORD-301"
4. List should filter to show only "ORD-301" delivery
5. Clear search box
6. All deliveries should show again
7. ✅ Search works correctly

### 9. Test Error Handling
1. Try creating delivery without Order Number
2. Should see error toast: "Please fill in all required fields"
3. ✅ Validation works

### 10. Test Session Expiration
1. Clear auth session (open DevTools, Application tab, clear localStorage)
2. Try to create a delivery
3. Should redirect to login page
4. ✅ Session handling works

---

## Expected Results

| Test | Expected | Status |
|------|----------|--------|
| Page Load | Loads with data | ✅ |
| Fetch Deliveries | 2 deliveries loaded | ✅ |
| Fetch API Keys | Empty keys loaded | ✅ |
| Update API Keys | Keys saved, toast shown | ✅ |
| Create Delivery | New delivery added to list | ✅ |
| Edit Delivery | Delivery updated in list | ✅ |
| Delete Delivery | Delivery removed from list | ✅ |
| Search | Filters list correctly | ✅ |
| Validation | Shows error for missing fields | ✅ |
| Session | Redirects to login if expired | ✅ |

---

## Backend Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/deliveries` | Fetch all deliveries |
| POST | `/deliveries` | Create new delivery |
| PUT | `/deliveries/:id` | Update delivery |
| DELETE | `/deliveries/:id` | Delete delivery |
| GET | `/delivery-api-keys` | Fetch API keys |
| PUT | `/delivery-api-keys` | Update API keys |

---

## Notes

- All data is stored in memory (backend)
- Data persists while backend is running
- Data resets when backend restarts
- To make data persistent, add JSON file storage (like users.json)
- Swiggy/Zomato integration is optional (API keys are stored but not used yet)

