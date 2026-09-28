# DogFood Hackathon Backend

Open-source, self-hostable hackathon management platform backend.

## Prerequisites

- Docker and Docker Compose
- Python 3.12+ (for local development without Docker)

## Setup and Workflow

1. Clone the repository and navigate to the backend directory.
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Start the database service:
   ```bash
   docker compose up -d db
   ```
4. Install dependencies locally (optional but recommended for IDEs and running scripts):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
5. Run migrations to initialize the database:
   ```bash
   flask db upgrade
   ```
6. (Optional) Seed the database with mock data:
   ```bash
   python -m app.seed.seed
   ```
7. Start the backend:
   ```bash
   docker compose up backend
   ```
   Or run locally:
   ```bash
   flask run
   ```

## Running tests

```bash
pytest
```
