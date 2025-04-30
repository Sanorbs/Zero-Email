# ZEMS API Documentation

## Backend API

### POST /api/process
Process an email and return metadata

**Request Body:**
```json
{
  "email": {
    "id": "string",
    "from": "string",
    "to": ["string"],
    "subject": "string",
    "body": "string",
    "date": "ISO8601"
  }
}