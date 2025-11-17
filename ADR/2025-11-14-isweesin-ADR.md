# ADR-001: Use Flask for the Backend

**Status:** Accepted

**Context:**
Nursesim is nursing training website, simulating scenarios to educate nurses.
We need a flexible, lightweight API for the backend to serve JSON API for the client.
It should also be easy to learn for the teammates with no experience in API implementation.

**Decision:**
We Will use Flask as the primary backend framework for the website

**Options Considered:**
- Flask
- FastAPI
- Django
- Express

**Rationale:**
Flask is simple, and easy for the team to pick up. It integrates with Python, making simulation requests straightforward.
Other options like FastAPI are more complicated then the current needs of NurseSim. Express is a good option but we have to use two languages for the tech stack.

**Consequences:**
- Extensions may need to be added manually.
- async or high-concurrence features may require additional setup

**References:**
- Flask Documentation: https://flask.palletsprojects.com
- Team discussion notes (2025-11-14)
