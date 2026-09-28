import json
import uuid

def create_item(name, method, url, script=None, body=None):
    item = {
        "id": str(uuid.uuid4()),
        "name": name,
        "request": {
            "method": method,
            "url": url,
            "header": [
                {"key": "Authorization", "value": "Bearer {{access_token}}", "type": "text"}
            ]
        },
        "event": []
    }
    if body:
        item["request"]["body"] = body
        item["request"]["header"].append({"key": "Content-Type", "value": "application/json"})
    
    if script:
        item["event"].append({
            "listen": "test",
            "script": {
                "exec": script,
                "type": "text/javascript"
            }
        })
    return item

collection = {
    "info": {
        "name": "DogFood Backend API",
        "schema": "https://schema.postman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "id": str(uuid.uuid4()),
            "name": "01 Health",
            "item": [
                create_item(
                    "Health Check", "GET", "{{base_url}}/health",
                    script=[
                        "pm.test('Status code is 200', function () {",
                        "    pm.response.to.have.status(200);",
                        "});"
                    ]
                )
            ]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "02 Authentication",
            "item": [
                create_item(
                    "Login Admin", "POST", "{{base_url}}/api/auth/login",
                    body={"mode": "raw", "raw": json.dumps({"email": "admin@example.com", "password": "password123"})},
                    script=[
                        "pm.test('Status code is 200', function () { pm.response.to.have.status(200); });",
                        "var data = pm.response.json();",
                        "pm.environment.set('admin_token', data.data.token);",
                        "pm.environment.set('access_token', data.data.token);"
                    ]
                ),
                create_item(
                    "Login Organizer", "POST", "{{base_url}}/api/auth/login",
                    body={"mode": "raw", "raw": json.dumps({"email": "organizer@example.com", "password": "password123"})},
                    script=[
                        "pm.test('Status code is 200', function () { pm.response.to.have.status(200); });",
                        "var data = pm.response.json();",
                        "pm.environment.set('organizer_token', data.data.token);"
                    ]
                ),
                create_item(
                    "Login Judge", "POST", "{{base_url}}/api/auth/login",
                    body={"mode": "raw", "raw": json.dumps({"email": "judge1@example.com", "password": "password123"})},
                    script=[
                        "pm.test('Status code is 200', function () { pm.response.to.have.status(200); });",
                        "var data = pm.response.json();",
                        "pm.environment.set('judge_token', data.data.token);"
                    ]
                ),
                create_item(
                    "Login Participant", "POST", "{{base_url}}/api/auth/login",
                    body={"mode": "raw", "raw": json.dumps({"email": "participant1@example.com", "password": "password123"})},
                    script=[
                        "pm.test('Status code is 200', function () { pm.response.to.have.status(200); });",
                        "var data = pm.response.json();",
                        "pm.environment.set('participant_token', data.data.token);"
                    ]
                ),
                create_item(
                    "Get Me (Admin)", "GET", "{{base_url}}/api/auth/me",
                    script=["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"]
                )
            ]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "03 Users & Profiles",
            "item": [
                create_item(
                    "Set Token to Participant", "GET", "{{base_url}}/health",
                    script=["pm.environment.set('access_token', pm.environment.get('participant_token'));"]
                ),
                create_item(
                    "Discover Users", "GET", "{{base_url}}/api/users/discover",
                    script=["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"]
                )
            ]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "04 Events",
            "item": [
                create_item(
                    "Set Token to Organizer", "GET", "{{base_url}}/health",
                    script=["pm.environment.set('access_token', pm.environment.get('organizer_token'));"]
                ),
                create_item(
                    "Create Event (Organizer)", "POST", "{{base_url}}/api/events",
                    body={"mode": "raw", "raw": json.dumps({
                        "name": "Test Event",
                        "description": "An event",
                        "start_date": "2026-10-01T00:00:00",
                        "end_date": "2026-10-10T00:00:00",
                        "submission_deadline": "2026-10-09T00:00:00"
                    })},
                    script=[
                        "pm.test('Status code is 201', function () { pm.response.to.have.status(201); });",
                        "if (pm.response.code === 201) { pm.environment.set('event_id', pm.response.json().data.id); }"
                    ]
                ),
                create_item(
                    "Set Token to Participant", "GET", "{{base_url}}/health",
                    script=["pm.environment.set('access_token', pm.environment.get('participant_token'));"]
                ),
                create_item(
                    "Create Event (Participant - Should Fail)", "POST", "{{base_url}}/api/events",
                    body={"mode": "raw", "raw": json.dumps({
                        "name": "Bad Event", "description": "bad", "start_date": "2026-10-01T00:00:00", "end_date": "2026-10-10T00:00:00", "submission_deadline": "2026-10-09T00:00:00"
                    })},
                    script=["pm.test('Status code is 401/403', function () { pm.expect(pm.response.code).to.be.oneOf([401, 403]); });"]
                )
            ]
        }
    ]
}

with open('collection.json', 'w') as f:
    json.dump({"collection": collection}, f)
