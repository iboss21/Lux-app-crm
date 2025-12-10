# 🔌 EcoShine Pro - API Documentation

Complete API reference for EcoShine Pro platform.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Booking Endpoints](#booking-endpoints)
4. [Cleaner Endpoints](#cleaner-endpoints)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Webhooks](#webhooks)

---

## 📖 Overview

### Base URL

**Development:**
```
http://localhost:3000/api
```

**Production:**
```
https://yourdomain.com/api
```

### Request Format

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### Response Format

All responses are in JSON format:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

---

## 🔐 Authentication

### JWT Authentication

Most endpoints require authentication via JWT token.

#### Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "userType": "admin" | "cleaner" | "customer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin"
    }
  }
}
```

#### Using the Token

Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Example with curl:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://yourdomain.com/api/bookings
```

---

## 📅 Booking Endpoints

### List Bookings

**Endpoint:** `GET /api/bookings`

**Auth Required:** Yes (Admin, Manager, CSR)

**Query Parameters:**
- `status` - Filter by status (pending, assigned, in-progress, completed, cancelled)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20, max: 100)
- `search` - Search by customer name or address
- `startDate` - Filter by date range start (ISO 8601)
- `endDate` - Filter by date range end (ISO 8601)

**Example Request:**
```bash
GET /api/bookings?status=pending&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "customerId": "uuid",
        "customerName": "Jane Smith",
        "serviceType": "deep-clean",
        "status": "pending",
        "scheduledDate": "2024-01-15T10:00:00Z",
        "address": "123 Main St, City, State 12345",
        "totalPrice": 199.99,
        "createdAt": "2024-01-10T08:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

### Get Booking Details

**Endpoint:** `GET /api/bookings/:id`

**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "customer": {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "phone": "+1234567890"
    },
    "serviceType": "deep-clean",
    "status": "in-progress",
    "scheduledDate": "2024-01-15T10:00:00Z",
    "duration": 180,
    "address": {
      "street": "123 Main St",
      "city": "City",
      "state": "State",
      "zipCode": "12345",
      "accessInstructions": "Gate code: 1234"
    },
    "assignedCleaners": [
      {
        "id": "uuid",
        "name": "John Cleaner",
        "phone": "+1987654321"
      }
    ],
    "pricing": {
      "basePrice": 179.99,
      "extras": 20.00,
      "tax": 16.00,
      "total": 215.99
    },
    "photos": [
      {
        "id": "uuid",
        "type": "before",
        "url": "https://s3.amazonaws.com/...",
        "uploadedAt": "2024-01-15T10:05:00Z"
      }
    ],
    "createdAt": "2024-01-10T08:30:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### Create Booking

**Endpoint:** `POST /api/bookings`

**Auth Required:** Yes (Admin, Manager, CSR, Customer)

**Request:**
```json
{
  "customerId": "uuid",
  "serviceType": "standard-clean",
  "scheduledDate": "2024-01-20T14:00:00Z",
  "duration": 120,
  "address": {
    "street": "456 Oak Ave",
    "city": "City",
    "state": "State",
    "zipCode": "12345",
    "accessInstructions": "Use side door"
  },
  "specialInstructions": "Please focus on kitchen",
  "frequency": "one-time",
  "extras": ["windows", "inside-fridge"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "pending",
    "totalPrice": 149.99,
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

### Update Booking

**Endpoint:** `PATCH /api/bookings/:id`

**Auth Required:** Yes (Admin, Manager, CSR)

**Request:**
```json
{
  "status": "assigned",
  "assignedCleanerIds": ["uuid1", "uuid2"],
  "scheduledDate": "2024-01-20T15:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "assigned",
    "updatedAt": "2024-01-15T13:00:00Z"
  }
}
```

### Cancel Booking

**Endpoint:** `DELETE /api/bookings/:id`

**Auth Required:** Yes

**Request:**
```json
{
  "reason": "Customer requested",
  "refund": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "cancelled",
    "refundAmount": 149.99,
    "refundStatus": "processing"
  }
}
```

---

## 🧹 Cleaner Endpoints

### Cleaner Login

**Endpoint:** `POST /api/cleaner/login`

**Auth Required:** No

**Request:**
```json
{
  "email": "cleaner@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "cleaner": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Cleaner",
      "email": "cleaner@example.com",
      "role": "cleaner"
    }
  }
}
```

### Get Today's Jobs

**Endpoint:** `GET /api/cleaner/jobs`

**Auth Required:** Yes (Cleaner)

**Query Parameters:**
- `date` - Date to fetch jobs for (ISO 8601, default: today)

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "customer": {
          "name": "Jane Smith",
          "phone": "+1234567890"
        },
        "serviceType": "standard-clean",
        "scheduledTime": "09:00",
        "duration": 120,
        "address": {
          "street": "123 Main St",
          "city": "City",
          "state": "State",
          "zipCode": "12345",
          "coordinates": {
            "lat": 40.7128,
            "lng": -74.0060
          }
        },
        "status": "assigned",
        "earnings": 45.00
      }
    ],
    "totalEarnings": 135.00
  }
}
```

### Clock In

**Endpoint:** `POST /api/cleaner/clock-in`

**Auth Required:** Yes (Cleaner)

**Request:**
```json
{
  "bookingId": "uuid",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "timestamp": "2024-01-20T09:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "timeTrackingId": "uuid",
    "clockInTime": "2024-01-20T09:00:00Z",
    "verified": true
  }
}
```

### Clock Out

**Endpoint:** `POST /api/cleaner/clock-out`

**Auth Required:** Yes (Cleaner)

**Request:**
```json
{
  "timeTrackingId": "uuid",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "timestamp": "2024-01-20T11:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clockOutTime": "2024-01-20T11:00:00Z",
    "totalHours": 2.0,
    "earnings": 45.00
  }
}
```

### Upload Photo

**Endpoint:** `POST /api/cleaner/upload-photo`

**Auth Required:** Yes (Cleaner)

**Content-Type:** `multipart/form-data`

**Request:**
```
bookingId: uuid
photoType: before|during|after
photo: [file]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "photoId": "uuid",
    "url": "https://s3.amazonaws.com/...",
    "uploadedAt": "2024-01-20T09:05:00Z"
  }
}
```

---

## ⚠️ Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Email or password is incorrect |
| `TOKEN_EXPIRED` | JWT token has expired |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist |
| `VALIDATION_ERROR` | Request data failed validation |
| `BOOKING_CONFLICT` | Time slot already booked |
| `PAYMENT_FAILED` | Payment processing failed |

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "fields": {
        "email": "Invalid email format",
        "scheduledDate": "Date must be in the future"
      }
    }
  }
}
```

---

## 🚦 Rate Limiting

### Limits

- **Authenticated requests**: 100 requests per minute
- **Unauthenticated requests**: 20 requests per minute

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641234567
```

### When Rate Limited

**Status Code:** `429 Too Many Requests`

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retryAfter": 60
    }
  }
}
```

---

## 🪝 Webhooks

### Stripe Webhooks

**Endpoint:** `POST /api/webhooks/stripe`

Handles Stripe webhook events:

#### Payment Succeeded

```json
{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_...",
      "amount": 14999,
      "currency": "usd",
      "metadata": {
        "bookingId": "uuid"
      }
    }
  }
}
```

**Actions:**
- Updates booking payment status
- Sends confirmation email
- Creates invoice

#### Payment Failed

```json
{
  "type": "payment_intent.payment_failed",
  "data": {
    "object": {
      "id": "pi_...",
      "last_payment_error": {
        "message": "Your card was declined"
      }
    }
  }
}
```

**Actions:**
- Marks payment as failed
- Notifies customer
- Logs error

### Custom Webhooks

You can set up custom webhooks to receive notifications:

**Events:**
- `booking.created`
- `booking.assigned`
- `booking.completed`
- `booking.cancelled`
- `review.created`

**Webhook Format:**
```json
{
  "event": "booking.created",
  "timestamp": "2024-01-20T10:00:00Z",
  "data": {
    "bookingId": "uuid",
    "customerId": "uuid",
    "serviceType": "standard-clean"
  }
}
```

---

## 📝 Examples

### Complete Booking Flow

```javascript
// 1. Customer logs in
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'customer@example.com',
    password: 'password123',
    userType: 'customer'
  })
})
const { token } = await loginResponse.json()

// 2. Create booking
const bookingResponse = await fetch('/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    serviceType: 'standard-clean',
    scheduledDate: '2024-01-25T10:00:00Z',
    address: {
      street: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345'
    }
  })
})
const booking = await bookingResponse.json()

// 3. Get booking status
const statusResponse = await fetch(`/api/bookings/${booking.data.id}`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
const status = await statusResponse.json()
```

### Cleaner Job Flow

```javascript
// 1. Cleaner logs in
const { token } = await loginAsCleaner()

// 2. Get today's jobs
const jobsResponse = await fetch('/api/cleaner/jobs', {
  headers: { 'Authorization': `Bearer ${token}` }
})
const jobs = await jobsResponse.json()

// 3. Clock in
await fetch('/api/cleaner/clock-in', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    bookingId: jobs.data.jobs[0].id,
    location: { lat: 40.7128, lng: -74.0060 },
    timestamp: new Date().toISOString()
  })
})

// 4. Upload before photo
const formData = new FormData()
formData.append('bookingId', jobs.data.jobs[0].id)
formData.append('photoType', 'before')
formData.append('photo', photoFile)

await fetch('/api/cleaner/upload-photo', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
})

// 5. Complete and clock out
await fetch('/api/cleaner/clock-out', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    timeTrackingId: 'uuid',
    location: { lat: 40.7128, lng: -74.0060 },
    timestamp: new Date().toISOString()
  })
})
```

---

*For deployment configuration, see [DEPLOYMENT.md](DEPLOYMENT.md)*

*For user guides, see [USER_GUIDE.md](USER_GUIDE.md)*
