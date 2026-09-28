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
        item["event"].append({"listen": "test", "script": {"exec": script, "type": "text/javascript"}})
    return item

folders = []

# 01 Health
folders.append({
    "id": str(uuid.uuid4()), "name": "01 Health", "item": [
        create_item("Health Check", "GET", "{{base_url}}/health", script=["pm.test('Status 200', function() { pm.response.to.have.status(200); });"])
    ]
})

# 02 Auth
auth_items = []
for r in ["admin", "organizer", "judge1", "judge2", "participant1", "participant2"]:
    tok_var = f"{r}_token"
    auth_items.append(create_item(f"Login {r}", "POST", "{{base_url}}/api/auth/login",
        body={"mode": "raw", "raw": json.dumps({"email": f"{r}@example.com", "password": "password123"})},
        script=["pm.test('Status 200', function() { pm.response.to.have.status(200); });",
                "var data = pm.response.json();", f"pm.environment.set('{tok_var}', data.data.token);"]
    ))
auth_items.append(create_item("Set Admin Token", "GET", "{{base_url}}/health", script=["pm.environment.set('access_token', pm.environment.get('admin_token'));"]))
auth_items.append(create_item("Get Me", "GET", "{{base_url}}/api/auth/me", script=["pm.test('Status 200', function() { pm.response.to.have.status(200); });"]))
folders.append({"id": str(uuid.uuid4()), "name": "02 Authentication", "item": auth_items})

# 03 Users & Profiles
folders.append({
    "id": str(uuid.uuid4()), "name": "03 Users & Profiles", "item": [
        create_item("Discover Users", "GET", "{{base_url}}/api/users/discover", script=["pm.test('Status 200', function() { pm.response.to.have.status(200); });"])
    ]
})

# 04 Events
folders.append({
    "id": str(uuid.uuid4()), "name": "04 Events", "item": [
        create_item("Set Organizer Token", "GET", "{{base_url}}/health", script=["pm.environment.set('access_token', pm.environment.get('organizer_token'));"]),
        create_item("Create Event", "POST", "{{base_url}}/api/events/",
            body={"mode": "raw", "raw": json.dumps({"name": "Test Event", "description": "Desc", "status": "LIVE", "start_time": "2026-10-01T00:00:00", "end_time": "2026-10-10T00:00:00", "submission_deadline": "2026-10-09T00:00:00"})},
            script=["pm.test('Status 201', function() { pm.response.to.have.status(201); });", "if(pm.response.code===201) { pm.environment.set('event_id', pm.response.json().data.id); }"]
        ),
        create_item("Set Participant1 Token", "GET", "{{base_url}}/health", script=["pm.environment.set('access_token', pm.environment.get('participant1_token'));"]),
        create_item("Participant Create Event Fail", "POST", "{{base_url}}/api/events/",
            body={"mode": "raw", "raw": json.dumps({"name": "Bad", "start_time": "2026-10-01T00:00:00", "end_time": "2026-10-10T00:00:00", "submission_deadline": "2026-10-09T00:00:00"})},
            script=["pm.test('Status 401/403', function() { pm.expect(pm.response.code).to.be.oneOf([401, 403]); });"]
        )
    ]
})

# 05 Teams
folders.append({
    "id": str(uuid.uuid4()), "name": "05 Teams", "item": [
        create_item("Set Participant1 Token", "GET", "{{base_url}}/health", script=["pm.environment.set('access_token', pm.environment.get('participant1_token'));"]),
        create_item("Create Team", "POST", "{{base_url}}/api/events/{{event_id}}/teams",
            body={"mode": "raw", "raw": json.dumps({"name": "Team One", "description": "Team one!"})},
            script=["pm.test('Status 201', function() { pm.response.to.have.status(201); });", "if(pm.response.code===201) { pm.environment.set('team_id', pm.response.json().data.id); }"]
        ),
        create_item("Invite Participant2", "POST", "{{base_url}}/api/teams/{{team_id}}/invite",
            body={"mode": "raw", "raw": json.dumps({"invitee_id": 6})},
            script=["pm.test('Status 201', function() { pm.response.to.have.status(201); });", "if(pm.response.code===201) { pm.environment.set('invite_id', pm.response.json().data.id); }"]
        ),
        create_item("Set Participant2 Token", "GET", "{{base_url}}/health", script=["pm.environment.set('access_token', pm.environment.get('participant2_token'));"]),
        create_item("Accept Invite", "POST", "{{base_url}}/api/teams/invitations/{{invite_id}}/accept",
            script=["pm.test('Status 200', function() { pm.response.to.have.status(200); });"]
        )
    ]
})

# 06 Projects
folders.append({
    "id": str(uuid.uuid4()), "name": "06 Projects", "item": [
        create_item("Set Participant1 Token", "GET", "{{base_url}}/health", script=["pm.environment.set('access_token', pm.environment.get('participant1_token'));"]),
        create_item("Create Project", "POST", "{{base_url}}/api/teams/{{team_id}}/project",
            body={"mode": "raw", "raw": json.dumps({"title": "Proj One", "short_description": "cool project", "repository_url": "https://github.com/a/b"})},
            script=["pm.test('Status 201', function() { pm.response.to.have.status(201); });", "if(pm.response.code===201) { pm.environment.set('project_id', pm.response.json().data.id); }"]
        )
    ]
})

# 07 Submissions
folders.append({
    "id": str(uuid.uuid4()), "name": "07 Submissions", "item": [
        create_item("Submit Project", "POST", "{{base_url}}/api/projects/{{project_id}}/submit",
            script=["pm.test('Status 200', function() { pm.response.to.have.status(200); });"]
        )
    ]
})

# 09 Judging
folders.append({
    "id": str(uuid.uuid4()), "name": "09 Judging", "item": [
        create_item("Set Organizer Token", "GET", "{{base_url}}/health", script=["pm.environment.set('access_token', pm.environment.get('organizer_token'));"]),
        create_item("Assign Judge", "POST", "{{base_url}}/api/judging/assignments",
            body={"mode": "raw", "raw": json.dumps({"project_id": "{{project_id}}", "judge_id": 3, "event_id": "{{event_id}}"})}, # user id for judge1
            script=["pm.test('Status 201', function() { pm.response.to.have.status(201); });", "if(pm.response.code===201) { pm.environment.set('assignment_id', pm.response.json().data.id); }"]
        ),
        create_item("Set Judge Token", "GET", "{{base_url}}/health", script=["pm.environment.set('access_token', pm.environment.get('judge1_token'));"]),
        create_item("Submit Score", "POST", "{{base_url}}/api/judging/assignments/{{assignment_id}}/scores",
            body={"mode": "raw", "raw": json.dumps({"scores": [{"criterion_id": 1, "value": 8, "comment": "Good job"}]})},
            script=["pm.test('Status 200', function() { pm.response.to.have.status(200); });"]
        )
    ]
})

# 10 Results
folders.append({
    "id": str(uuid.uuid4()), "name": "10 Results", "item": [
        create_item("Set Organizer Token", "GET", "{{base_url}}/health", script=["pm.environment.set('access_token', pm.environment.get('organizer_token'));"]),
        create_item("Get Results", "GET", "{{base_url}}/api/judging/events/{{event_id}}/results",
            script=["pm.test('Status 200', function() { pm.response.to.have.status(200); });"]
        )
    ]
})

# 11 Guidance
folders.append({
    "id": str(uuid.uuid4()), "name": "11 Guidance", "item": [
        create_item("Get Recommendations", "GET", "{{base_url}}/api/recommendations?stage=IDEATION",
            script=["pm.test('Status 200', function() { pm.response.to.have.status(200); });"]
        )
    ]
})


collection = {
    "info": {
        "name": "DogFood Backend API",
        "schema": "https://schema.postman.com/json/collection/v2.1.0/collection.json"
    },
    "item": folders
}

with open('collection.json', 'w') as f:
    json.dump({"collection": collection}, f)
