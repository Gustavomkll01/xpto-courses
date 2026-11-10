# DER (Entity-Relationship Diagram)

```mermaid
erDiagram
    USERS ||--o{ COURSES : "creates (user_id)"
    USERS ||--o{ MODULES : "creates (user_id)"
    COURSES ||--|{ MODULES : "has 1..N"
    MODULES ||--|{ CONTENTS : "has 1..N"
    USERS ||--o{ CONTENT_VIEWS : "watches"
    CONTENTS ||--o{ CONTENT_VIEWS : "is watched"

    USERS { int id PK
            string name
            string email UK
            string status
            timestamp created_at
            timestamp updated_at }
    COURSES { int id PK
              string code UK
              string title
              text description
              int user_id FK
              timestamp created_at
              timestamp updated_at }
    MODULES { int id PK
              int course_id FK
              int user_id FK
              string title
              text description
              timestamp created_at
              timestamp updated_at }
    CONTENTS { int id PK
               int module_id FK
               string title
               text body
               timestamp created_at
               timestamp updated_at }
    CONTENT_VIEWS { int id PK
                    int user_id FK
                    int content_id FK
                    timestamp watched_at }
```

**Extra table:** "who watched lesson ID=2" is a many-to-many between users and contents with its own attribute (`watched_at`), so a new join table `content_views` (unique `user_id + content_id`) is used instead of extra columns.
