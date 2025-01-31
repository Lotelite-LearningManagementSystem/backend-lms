# API Documentation

## Admin Endpoints

### 1. Register New Admin
**Endpoint:** `POST /api/admin/register`

**Description:** Registers a new admin.

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
    "email": "admin@example.com",
    "password": "admin123"
}
```

**Response:**
```json
{
    "token": "<admin_jwt_token>"
}
```

### 2. Admin Login
**Endpoint:** `POST /api/admin/login`

**Description:** Authenticates an admin and returns a JWT token.

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
    "email": "admin@example.com",
    "password": "admin123"
}
```

**Response:**
```json
{
    "token": "<admin_jwt_token>"
}
```

### 3. Create New User
**Endpoint:** `POST /api/admin/create-user`

**Description:** Creates a new user.

**Headers:**
- `Content-Type: application/json`
- `x-auth-token: <admin_jwt_token>`

**Request Body:**
```json
{
    "userId": "student123",
    "password": "student123"
}
```

**Response:**
```json
{
    "message": "User created successfully",
    "userId": "student123"
}
```

### 4. Create New Subject
**Endpoint:** `POST /api/content/subject`

**Description:** Creates a new subject.

**Headers:**
- `Content-Type: application/json`
- `x-auth-token: <admin_jwt_token>`

**Request Body:**
```json
{
    "name": "Mathematics",
    "description": "Advanced Mathematics Course"
}
```

**Response:**
```json
{
    "name": "Mathematics",
    "description": "Advanced Mathematics Course",
    "chapters": [],
    "createdBy": "<admin_id>",
    "_id": "<subject_id>",
    "createdAt": "<timestamp>",
    "__v": 0
}
```

### 5. Create New Chapter
**Endpoint:** `POST /api/content/chapter`

**Description:** Adds a new chapter to a subject.

**Headers:**
- `Content-Type: application/json`
- `x-auth-token: <admin_jwt_token>`

**Request Body:**
```json
{
    "name": "Calculus",
    "description": "Introduction to Calculus",
    "subjectId": "<subject_id>"
}
```

**Response:**
```json
{
    "name": "Calculus",
    "subject": "<subject_id>",
    "description": "Introduction to Calculus",
    "contents": [],
    "createdBy": "<admin_id>",
    "_id": "<chapter_id>",
    "createdAt": "<timestamp>",
    "__v": 0
}
```

### 6. Upload Video Content
**Endpoint:** `POST /api/content/upload`

**Description:** Uploads a video to a chapter.

**Headers:**
- `Content-Type: multipart/form-data`
- `x-auth-token: <admin_jwt_token>`

**Request Body:**
```json
{
    "title": "Introduction to Derivatives",
    "description": "Learn about derivatives in calculus",
    "chapterId": "<chapter_id>",
    "video": "<video_file>"
}
```

**Response:**
```json
{
    "title": "Introduction to Derivatives",
    "chapter": "<chapter_id>",
    "videoUrl": "<video_url>",
    "description": "Learn about derivatives in calculus",
    "createdBy": "<admin_id>",
    "_id": "<content_id>",
    "createdAt": "<timestamp>",
    "__v": 0
}
```

## User Endpoints

### 1. User Login
**Endpoint:** `POST /api/users/login`

**Description:** Authenticates a user and returns a JWT token.

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
    "userId": "student123",
    "password": "student123"
}
```

**Response:**
```json
{
    "token": "<user_jwt_token>"
}
```

### 2. Get Content Structure
**Endpoint:** `GET /api/content/structure`

**Description:** Fetches all available subjects, chapters, and content.

**Headers:**
- `x-auth-token: <user_jwt_token>`

**Response:**
```json
[
    {
        "_id": "<subject_id>",
        "name": "Mathematics",
        "description": "Advanced Mathematics Course",
        "createdBy": "<admin_id>",
        "createdAt": "<timestamp>",
        "chapters": [
            {
                "_id": "<chapter_id>",
                "name": "Calculus",
                "subject": "<subject_id>",
                "description": "Introduction to Calculus",
                "createdAt": "<timestamp>",
                "contents": [
                    {
                        "_id": "<content_id>",
                        "title": "Introduction to Derivatives",
                        "chapter": "<chapter_id>",
                        "videoUrl": "<video_url>",
                        "description": "Learn about derivatives in calculus"
                    }
                ]
            }
        ]
    }
]
```

### 3. Get Chapters
**Endpoint:** `GET /api/content/chapters`

**Headers:**
- `x-auth-token: <user_jwt_token>`

**Response:**
```json
<response_data_for_chapters>
```

### 4. Get Subjects
**Endpoint:** `GET /api/content/subjects`

**Headers:**
- `x-auth-token: <user_jwt_token>`

**Response:**
```json
<response_data_for_subjects>
```

