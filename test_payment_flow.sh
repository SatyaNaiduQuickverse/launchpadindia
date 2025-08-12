#!/bin/bash

echo "🧪 Testing Payment Flow"

# 1. Login as user
echo "1. Logging in as user..."
USER_RESPONSE=$(curl -s -X POST http://35.154.20.15:3037/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{
   "email": "naidu.saikishore9@gmail.com",
   "password": "Satya@888"
 }')

USER_TOKEN=$(echo $USER_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "✅ User logged in"

# 2. Submit resume for review
echo "2. Submitting resume #8 for review..."
SUBMIT_RESPONSE=$(curl -s -X POST http://35.154.20.15:3037/api/resumes/8/submit \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $USER_TOKEN" \
 -d '{
   "paymentDetails": {
     "amount": 249,
     "method": "card",
     "transactionId": "TXN_test_12345"
   },
   "contactInfo": {
     "email": "naidu.saikishore9@gmail.com",
     "phone": "+91 9876543210"
   },
   "specialRequests": "Test submission for software engineer role"
 }')

echo "Submit Response: $SUBMIT_RESPONSE"

# 3. Login as admin
echo "3. Logging in as admin..."
ADMIN_RESPONSE=$(curl -s -X POST http://35.154.20.15:3037/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{
   "email": "admin@resumebuilder.com",
   "password": "admin123"
 }')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "✅ Admin logged in"

# 4. Check paid submissions
echo "4. Checking paid submissions..."
PAID_SUBS=$(curl -s -X GET http://35.154.20.15:3037/api/admin/paid-submissions \
 -H "Authorization: Bearer $ADMIN_TOKEN")

echo "Paid Submissions: $PAID_SUBS"

# 5. Check stats
echo "5. Checking admin stats..."
STATS=$(curl -s -X GET http://35.154.20.15:3037/api/admin/stats \
 -H "Authorization: Bearer $ADMIN_TOKEN")

echo "Stats: $STATS"

echo "🏁 Test complete"
