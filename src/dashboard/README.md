# Dashboard API Documentation

This document provides detailed information about the Dashboard API endpoints.

## Base URL
All endpoints are prefixed with `/dashboard`

## Authentication
All endpoints require authentication and specific roles as indicated below.

## Endpoints

### 1. Get Dashboard Summary
Returns summary statistics including login and enrollment counts.

- **URL**: `/summary`
- **Method**: `GET`
- **Roles**: `admin`
- **Query Parameters**:
  - `month` (optional): Month in YYYY-MM format. If not provided, current month is used.

**Response**:
```json
{
  "status": "success",
  "data": {
    "loginCount": {
      "lastMonth": 100,
      "thisMonth": 150
    },
    "enrollCount": {
      "lastMonth": 50,
      "thisMonth": 75
    }
  }
}
```

### 2. Get Monthly Traffic
Returns daily traffic statistics for a specific month.

- **URL**: `/monthly-traffic`
- **Method**: `GET`
- **Roles**: `admin`
- **Query Parameters**:
  - `month` (optional): Month in YYYY-MM format. If not provided, current month is used.

**Response**:
```json
{
  "status": "success",
  "data": {
    "days": [
      {
        "day": 1,
        "loginCount": 10,
        "enrollmentCount": 5
      },
      // ... more days
    ]
  }
}
```

### 3. Get Popular Content Categories
Returns statistics about content categories and their popularity.

- **URL**: `/content-categories`
- **Method**: `GET`
- **Roles**: `admin`
- **Query Parameters**:
  - `month` (optional): Month in YYYY-MM format. If not provided, current month is used.

**Response**:
```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "category": "Technology",
        "contentCount": 25
      },
      // ... more categories
    ]
  }
}
```

### 4. Get Popular Contents
Returns the most popular contents based on enrollment count.

- **URL**: `/popular-contents`
- **Method**: `GET`
- **Roles**: `admin`
- **Query Parameters**:
  - `limit` (optional): Number of results to return. Default: 5
  - `month` (optional): Month in YYYY-MM format. If not provided, current month is used.

**Response**:
```json
{
  "status": "success",
  "data": {
    "courses": [
      {
        "contentId": "123",
        "contentName": "Introduction to Programming",
        "enrollmentCount": 100
      },
      // ... more courses
    ]
  }
}
```

### 5. Get Project Dashboard
Returns project-related statistics.

- **URL**: `/projects`
- **Method**: `GET`
- **Roles**: `admin`, `project-approver`
- **Query Parameters**:
  - `month` (optional): Month in YYYY-MM format. If not provided, current month is used.

**Response**:
```json
{
  "status": "success",
  "data": {
    "pending_projects": {
      "lastMonth": 10,
      "thisMonth": 15
    },
    "total_projects": {
      "lastMonth": 50,
      "thisMonth": 60
    },
    "rejected_projects": {
      "lastMonth": 5,
      "thisMonth": 8
    },
    "project_types": [
      {
        "type": "Research",
        "count": 25
      },
      // ... more project types
    ]
  }
}
```

## Error Responses

All endpoints may return the following error responses:

- `401 Unauthorized`: When authentication is missing or invalid
- `403 Forbidden`: When the user doesn't have the required role
- `500 Internal Server Error`: When an unexpected error occurs

Error response format:
```json
{
  "status": "error",
  "message": "Error description"
}
``` 