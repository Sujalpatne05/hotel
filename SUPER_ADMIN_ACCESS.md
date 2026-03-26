# Super Admin Panel - Access Guide

## 🔐 Login Credentials

**Email:** `superadmin@restrohub.local`
**Password:** `super123`

## 🌐 Access URLs

### Local Development
- **Frontend:** http://localhost:8080
- **Super Admin Login:** http://localhost:8080/superadmin-login
- **Super Admin Dashboard:** http://localhost:8080/superadmin-dashboard

### Backend API
- **API Base:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## 📋 Navigation After Login

Once logged in, you'll see the sidebar with these options:

1. **Dashboard** - Overview of all metrics
2. **Restaurants** - Manage restaurants with logos
3. **Subscriptions** - Track and renew subscriptions (dates in DD-MM-YYYY format)
4. **Revenue** - Financial metrics and trends
5. **Users** - Manage system users
6. **Analytics** - View trends and insights
7. **System Settings** - Configure system behavior
8. **Support** - Handle support tickets

## ✅ What to Check

### Restaurants Page
- [ ] View existing restaurants
- [ ] See logo thumbnails (16x16px)
- [ ] Add new restaurant with logo upload
- [ ] Set subscription start and expiry dates
- [ ] Create admin accounts during onboarding

### Subscriptions Page
- [ ] View all subscriptions
- [ ] Check dates are in DD-MM-YYYY format (e.g., 26-03-2026)
- [ ] Click "Details" to see full subscription info
- [ ] Click "Renew" to extend subscription by 1 year
- [ ] Verify dates update after renewal

### Dashboard
- [ ] View overview cards
- [ ] Check restaurant count
- [ ] View revenue chart
- [ ] See subscription status

### Other Pages
- [ ] Revenue - Check financial metrics
- [ ] Users - View all system users
- [ ] Analytics - View trends
- [ ] Settings - Configure system
- [ ] Support - View support tickets

## 🚀 Quick Start

1. Open browser and go to: **http://localhost:8080/superadmin-login**
2. Enter credentials above
3. Click "Login"
4. You'll be redirected to the dashboard
5. Use sidebar to navigate to different sections

## 📊 Test Data Available

- **Demo Restaurant** - Created with subscription dates
- **Test Restaurant** - Created during testing
- **rip n dip CAFE** - Additional test restaurant

All have subscriptions with dates in DD-MM-YYYY format.

## 🔧 Backend Status

- ✅ Backend running on port 5000
- ✅ All endpoints working
- ✅ Subscriptions initialized
- ✅ PATCH endpoint for renewal working

## 📝 Notes

- Dates display as DD-MM-YYYY (26-03-2026)
- Logos show as 16x16px thumbnails
- Subscription renewal extends exactly 1 year
- All data is stored in mock backend (in-memory)
