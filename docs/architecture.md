## Sơ đồ luồng xử lý Đặt hàng Flash Sale

```mermaid
sequenceDiagram
    actor User as Frontend (React)
    participant API as Spring Boot (Controller)
    participant Redis as Redis (Lua Script)
    participant DB as PostgreSQL (Database)

    User->>API: 1. POST /api/flash-sale/order
    activate API
    
    API->>Redis: 2. Execute Lua Script (stockKey, userKey)
    activate Redis
    Note over Redis: Atomic Operations:<br/>- Check Stock > 0<br/>- Check User Limit < 2<br/>- Decr Stock & Incr User
    
    alt Hết hàng hoặc Vượt giới hạn
        Redis-->>API: 3a. Return Error Code (1 or 2)
        API-->>User: 4a. 400 Bad Request (Lỗi)
    else Hợp lệ
        Redis-->>API: 3b. Return Success (0)
        deactivate Redis
        
        API->>DB: 4b. Insert into orders table
        activate DB
        DB-->>API: 5. Save Success
        deactivate DB
        
        API-->>User: 6. 200 OK (Thành công)
    end
    deactivate API