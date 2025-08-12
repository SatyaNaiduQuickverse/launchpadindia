#!/bin/bash

echo "🧪 Testing Payment Flow with Debug"

# 1. Login as user
echo "1. Logging in as user..."
USER_RESPONSE=$(curl -v -X POST http://35.154.20.15:3037/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "naidu.saikishore9@gmail.com",
    "password": "Satya@888"
  }' 2>&1)

echo "Full user response: $USER_RESPONSE"

USER_TOKEN=$(echo $USER_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "User token: $USER_TOKEN"

# 2. Submit with debug
echo "2. Submitting resume #8..."
SUBMIT_RESPONSE=$(curl -v -X POST http://35.154.20.15:3037/api/resumes/8/submit \
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
    "specialRequests": "Test submission"
  }' 2>&1)

echo "Full submit response: $SUBMIT_RESPONSE"
