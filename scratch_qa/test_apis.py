import requests

BASE_URL = "http://127.0.0.1:8000/api"
session = requests.Session()

# 1. Login
print("1. Login")
res = session.post(f"{BASE_URL}/auth/login", json={"email": "participant1@example.com", "password": "password123"})
print(res.status_code, res.json())
assert res.status_code == 200
token = res.json()["data"]["token"]
session.headers.update({"Authorization": f"Bearer {token}"})

# 2. Get Events
print("\n2. Get Events")
res = session.get(f"{BASE_URL}/events/")
print(res.status_code, [e["name"] for e in res.json().get("data", [])])
assert res.status_code == 200

# 3. Create Team
print("\n3. Create Team")
res = session.post(f"{BASE_URL}/events/1/teams", json={"name": "Auto QA Team"})
print(res.status_code, res.json())

# 4. Get Discover
print("\n4. Get Discover")
res = session.get(f"{BASE_URL}/users/discover")
print(res.status_code, len(res.json().get("data", [])))

# 5. Get Guidance
print("\n5. Get Guidance")
res = session.get(f"{BASE_URL}/recommendations")
print(res.status_code, len(res.json().get("data", [])))

print("\nAPI Tests Complete!")

# 6. Create Project
print('\n6. Create Project')
res = session.post(f'{BASE_URL}/teams/1/project', json={'track_id': 1, 'title': 'QA Test Project', 'short_description': 'Test project desc'})
print(res.status_code, res.json())

# 7. Get Event Projects
print('\n7. Get Event Projects')
res = session.get(f'{BASE_URL}/events/1/projects?public_only=false')
print(res.status_code, len(res.json().get('data', [])))
