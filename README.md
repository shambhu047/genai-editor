# Genai Editor

This is a simple prototype app for Browser based code editor.
Which allows user to collaborate online and do coding together.
It is supposed to provide code suggestions using AI.

## Current implementation 
**It is a very primitive prototype.** 

### components:

|   | Component      | Description                          |
|---|----------------|--------------------------------------|
| 1 | Postgresql db  |                                      |
| 2 | NATS           | for real time collaboration and sync |
| 3 | Editor backend | fastapi application                  |
| 4 | Editor         | React + CodeMirror based code editor |

### Entities

|   | Entity        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|---|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 | User          |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 2 | Project       | Multiple projects can be registered                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 3 | Directory     | Project's source is organized in directories                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 4 | File          | Code files in project(organized in directory/folder)                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 4 | Collaboration | It represents an active session for a project, when someone opens an project in editor, one collaboration session is initiated at the backend. When a next user opens the same project in his/her editor, the user will be joined to the same active collaboration. **All the communication for the collaboration happens over NATS(using collaboration id as subject/channel for syncing changes among users and servers, and for providing real time code suggestions using AI)**. |

Note 1: ***In real world implementation a dozens of entity will be envolved***

Note 2: *I have not covered auth considering, there will be a separate system, taking care of authentication and identity management*

### Project structure and Coding style

**Backend app which is a fast api based application, has been implemented in unconventional manner.**
Instead of using typical functional programming approach(which is very common for fastapi based applications), 
it has been implemented using OOP and Dependency Injection through constructor,
to demonstrate that bigger projects becomes a bit easy to develop/maintain/test with DI and other programming practices.

Editor UI is a single page application, implemented using ReactJS, Mui Joy and CodeMirror.

**_Both frontend and backend is served using the fastapi._**

### References / Sources
1. [Nats](https://docs.nats.io/) - (https://docs.nats.io/)
2. [Joy UI](https://mui.com/joy-ui/getting-started/?srsltid=AfmBOorqCbpW2kUjH3eHnEh1pU1eXAMr7soHm-4b8-ve66XsQZatITsu)
3. ChatGpt **only** for SQLAlchemy related help
4. Joy UI templates for UX ideas (for tables and sidebar)

## Real World implementation idea

### High level architectural components
|   | Component            | Description                                                                                                                                                                                                                                                                                                                                              |
|---|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 | IAM                  | For managing users, accounts and access                                                                                                                                                                                                                                                                                                                  |
| 2 | Git/Git-like Server  | Git or any other git like server to store the code repository and history, *It's bit tricky and requires some serious thinking* because when users are collaborating togethere and writing the code, it will tricky to main the code history and actual author, one possibility could be for every commit we can maintain list of users(in VCS history). |
| 3 | Collaboration server | Whenever user collaborates to work on a project, the repository is loaded in the collaboration server, it is like a hot copy of the project. On every commit the change is flushed to the actual git/git-like server. When there is no active user and uncommitted change the project is unloaded from the collaboration server.                         |
| 4 | GenAI server         | It runs some AI solution and provides API to get code suggestions/recommendations.                                                                                                                                                                                                                                                                       |
| 5 | Web UI / Desktop App | It provides UI to manage projects and editor to collaborate.                                                                                                                                                                                                                                                                                             |  
Note: The components mentioned in the above table is high level component, every component in itself is a separate project and might be consists of multiple components.

### High level architecture diagram
TODO

## Deploying and Using

### System requirements
1. Docker (on any of the Linux/Windows/Mac machine)
2. Free Ports on host machine (8000 - UI and fastapi, 5432 - postgres db, 4222 - NATS, 4223 - NATS over websocket)

### To Deply
Move to project root directory and run
> `docker compose up --build -d`

Now you can access
1. [Swagger UI](http://localhost:8000/docs) at [http://localhost:8000/docs](http://localhost:8000/docs)
2. [Web based editor](http://localhost:8000/ui) at [http://localhost:8000/ui](http://localhost:8000/ui)

**In you UI, you can create project, and add files and directories to the project by clicking '+' icon in project file hierarchy.**

All the changes will be communicated over NATS (using websocket) with other users and server.

### To stop servers 
To remove docker containers, volume and network. run this command from project root directory
> `docker compose down`

