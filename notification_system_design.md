# Notification System Design

# Stage 1

## REST API Design

### Fetch Notifications

Endpoint:

GET /api/notifications

Headers:

Authorization: Bearer <token>

Response:

```json
{
  "notifications": [
    {
      "id": "123",
      "type": "Placement",
      "message": "Google Hiring",
      "isRead": false,
      "createdAt": "2026-05-14T10:00:00Z"
    }
  ]
}
```

---

### Create Notification

Endpoint:

POST /api/notifications

Request:

```json
{
  "type": "Placement",
  "message": "Amazon Hiring"
}
```

Response:

```json
{
  "success": true,
  "notificationId": "abc123"
}
```

---

### Mark Notification As Read

Endpoint:

PUT /api/notifications/:id/read

Response:

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## Real Time Notifications

WebSockets or Server Sent Events (SSE) can be used for real-time updates.

Advantages:
- instant notifications
- reduced polling
- better UX

---

# Stage 2

## Database Choice

PostgreSQL is recommended because:

- ACID compliance
- strong relational support
- indexing support
- scalability
- efficient joins

---

## Database Schema

### students

| Column | Type |
|---|---|
| id | BIGINT |
| name | VARCHAR |
| email | VARCHAR |

---

### notifications

| Column | Type |
|---|---|
| id | UUID |
| studentID | BIGINT |
| notificationType | ENUM |
| message | TEXT |
| isRead | BOOLEAN |
| createdAt | TIMESTAMP |

---

## Scaling Problems

As data grows:
- slower queries
- memory overhead
- locking issues
- increased DB traffic

---

## Solutions

- indexing
- pagination
- caching
- partitioning
- read replicas

---

## Example Query

```sql
SELECT * FROM notifications
WHERE studentID = 1042;
```

---

# Stage 3

## Query Analysis

```sql
SELECT * FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

---

## Why Slow?

- millions of rows
- full table scans
- sorting overhead
- missing indexes

---

## Better Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

---

## Complexity

Before indexing:
- O(n)

After indexing:
- O(log n)

---

## Should Every Column Be Indexed?

No.

Too many indexes:
- slow inserts
- more storage usage
- maintenance overhead

Indexes should only be created for frequently queried columns.

---

## Placement Notification Query

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

---

# Stage 4

## Problem

Notifications are fetched repeatedly on every page load causing DB overload.

---

## Solution 1 — Redis Caching

Advantages:
- fast reads
- reduced DB load

Tradeoffs:
- cache invalidation complexity

---

## Solution 2 — Pagination

Advantages:
- smaller payloads
- faster APIs

Tradeoffs:
- additional frontend logic

---

## Solution 3 — WebSockets / SSE

Advantages:
- real-time communication
- fewer repeated API calls

Tradeoffs:
- persistent connection management

---

# Stage 5

## Problems With Current Implementation

- sequential processing is slow
- no retry mechanism
- email failures stop execution
- poor scalability

---

## Better Architecture

Use:
- RabbitMQ
OR
- Kafka

---

## Why Save To DB First?

Saving to DB first guarantees durability even if external email service fails.

---

## Improved Flow

1. Save notification in DB
2. Publish job to queue
3. Workers process emails and push notifications
4. Retry failed jobs

---

## Revised Pseudocode

```text
function notify_all(student_ids, message):

    notification_id = save_notification(message)

    for student_id in student_ids:

        queue.publish({
            student_id,
            notification_id
        })

worker():

    while jobs exist:

        send_email()

        push_notification()

        update_status()
```

---

# Stage 6

## Priority Notification Strategy

Weights:

| Type | Weight |
|---|---|
| Placement | 3 |
| Result | 2 |
| Event | 1 |

Priority depends on:
- notification type weight
- recency

New notifications are continuously inserted into a Min Heap / Priority Queue to efficiently maintain top 10 notifications.

Complexity:
- insertion: O(log n)
- retrieval: O(1)
