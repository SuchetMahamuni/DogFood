import json
import uuid

def add_ids(item):
    item['id'] = str(uuid.uuid4())
    if 'item' in item:
        for sub_item in item['item']:
            add_ids(sub_item)

collection = {
    "info": {
        "name": "DogFood Backend API",
        "schema": "https://schema.postman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "01 Health",
            "item": [
                {
                    "name": "Health Check",
                    "request": {
                        "method": "GET",
                        "url": "{{base_url}}/health"
                    },
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "pm.test('Status code is 200', function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ]
                }
            ]
        }
    ]
}

for i in collection["item"]:
    add_ids(i)

with open('collection.json', 'w') as f:
    json.dump({"collection": collection}, f)
