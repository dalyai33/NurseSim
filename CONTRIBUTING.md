# Contributing Guide
Welcome to NurseSim+ — an AI-powered clinical simulation for nursing education.
This guide explains how to set up, contribute, and ensure all code meets our Definition of Complete.

## Code of Conduct
We follow a professionalism-first approach:

- Be respectful, inclusive, and constructive in Discord, GitHub, and meetings.
- Respond to teammates within **24 hours** unless you’ve said you’ll be unavailable (our team charter standard).:contentReference[oaicite:1]{index=1}
- Major disagreements → majority vote; minor assignment details → consensus.
- Escalate only when team-level resolution fails.

**Reporting:**  
Contact **Ian (Team Leader)**   
- **Ian Hale** – `halei@oregonstate.edu`  

## Getting Started
### 2.1 Prerequisites
- **Node.js** ≥ 18 and **npm**
- **Git** with **SSH** configured (we use SSH, not HTTPS)
- **Ren’Py** (for the simulation / VN-style UI segment)
- Recommended: VS Code + ESLint + Prettier
### 2.2 Clone via SSH
Follow the README steps (already in the repo) to set up SSH:

## Branching & Workflow
We use a **lightweight GitFlow** process designed for our senior capstone schedule.

### 3.1 Branch Structure

- **Main branch:** `main` — always stable and deployable  
- **Feature branches:** `feature/<short-description>`  
- **Bug-fix branches:** `fix/<issue-number>`  
- **Docs branches:** `docs/<topic>`  

**Examples:**
```bash
git checkout -b feature/add-student-scenario
# work on your feature
git add -A
git commit -m "feat(simulation): add new patient scenario"
git push -u origin feature/add-student-scenario 
```
## Issues & Planning
Explain how to file issues, required templates/labels, estimation, and
triage/assignment practices.
## Commit Messages
State the convention (e.g., Conventional Commits), include examples, and how to
reference issues.
## Code Style, Linting & Formatting
Name the formatter/linter, config file locations, and the exact commands to
check/fix locally.
## Testing
Define required test types, how to run tests, expected coverage thresholds, and
when new/updated tests are mandatory.
## Pull Requests & Reviews
Outline PR requirements (template, checklist, size limits), reviewer expectations,
approval rules, and required status checks.
## CI/CD
Link to pipeline definitions, list mandatory jobs, how to view logs/re-run jobs,
and what must pass before merge/release.
## Security & Secrets
State how to report vulnerabilities, prohibited patterns (hard-coded secrets),
dependency update policy, and scanning tools.
## Documentation Expectations
Specify what must be updated (README, docs/, API refs, CHANGELOG) and
docstring/comment standards.
## Release Process
Describe versioning scheme, tagging, changelog generation, packaging/publishing
steps, and rollback process.
## Support & Contact
Provide maintainer contact channel, expected response windows, and where to ask
questions.
