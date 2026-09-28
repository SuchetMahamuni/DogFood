from app.extensions import db
from app.models.audit_log import AuditLog
from flask import request
import json

class AuditService:
    @staticmethod
    def log_action(actor_id, action, resource_type, resource_id, metadata=None):
        try:
            log = AuditLog(
                actor_id=actor_id,
                action=action,
                resource_type=resource_type,
                resource_id=str(resource_id) if resource_id else None,
                metadata_json=json.dumps(metadata) if metadata else None
            )
            db.session.add(log)
            # Usually we don't commit here so it commits with the surrounding transaction
        except Exception as e:
            # Silently fail logging in simple implementation
            pass
