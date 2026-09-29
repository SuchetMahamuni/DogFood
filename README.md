
# DogFood — Hackathon Management Platform

An open-source, scalable, and self-hostable hackathon management platform developed for the DogFood Hackathon, organized by the Hackathon Raptors community.

DogFood aims to simplify the entire hackathon experience by bringing event management, team collaboration, project submissions, and judging into one unified platform.

## About the Project

Managing hackathons involves multiple processes, including participant registration, team formation, project submissions, judge assignments, and result generation.

DogFood provides a unified platform to manage these processes efficiently and transparently.

The platform is designed to support multiple hackathons and can be extended into Android and iOS applications in the future.

## Key Features

### Participant Management
- User registration and authentication
- Hackathon registration
- Participant profiles
- Role-based access control

### Team Management
- Team creation
- Team invitations
- Team member management

### Project Submissions
- Project creation and editing
- Draft submissions
- GitHub repository and demo links
- Submission deadline enforcement
- Public project gallery

### Judging System
- Judge assignment
- Configurable judging criteria
- Weighted scoring
- Score normalization
- Automated rankings
- Results and CSV exports

### Organizer Dashboard
- Hackathon creation and management
- Participant and team management
- Judge management
- Submission monitoring
- Results management

## Technology Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Node.js
- NestJS
- TypeScript
- Prisma ORM

### Database
- PostgreSQL

### Authentication
- JWT
- Argon2
- Role-Based Access Control (RBAC)

### Deployment
- Docker
- Docker Compose

### Future Mobile Application
- React Native
- Expo

## System Architecture

DogFood follows a modular architecture with separate frontend and backend applications.

The Next.js frontend communicates with the NestJS backend through REST APIs.

PostgreSQL manages application data, while Prisma provides database access.

The API-first architecture allows future mobile applications to reuse the same backend.

## Scalability

The platform is designed with long-term scalability and maintainability in mind.

Key considerations include:

- Modular backend architecture
- Reusable REST APIs
- Multi-event support
- Secure authentication
- Efficient database management
- Containerized deployment
- Future mobile application support

## Getting Started

### Prerequisites

- Git
- Docker
- Docker Compose

### Installation

Clone the repository:

    git clone <repository-url>

Navigate to the project directory:

    cd dogfood

Configure the required environment variables using the provided example environment file.

Start the application:

    docker compose up --build

Note: Setup instructions should be updated once the Docker configuration is finalized.

## Future Scope

- Android and iOS applications
- Community voting
- Real-time notifications
- Certificate generation
- Advanced analytics
- Enhanced organizer dashboards
- Third-party integrations
