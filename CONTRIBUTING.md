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
Contact  
- **Ian Hale (Team Leader)** – `halei@oregonstate.edu`

## Getting Started
### Prerequisites
- **Node.js** 
- **Git** with **SSH** configured (we use SSH, not HTTPS)
- **Ren’Py** (for the simulation / VN-style UI segment)
- Recommended: VS Code + ESLint
### Clone via SSH
Follow the README steps (already in the repo) to set up SSH:

## Branching & Workflow
We use a **lightweight GitFlow** process designed for our senior capstone schedule.

### Branch Structure

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
Rebase before pushing to keep history linear.
```bash
git pull --rebase origin main
```
Merge through GitHub once approved (do NOT local-merge into main).

## Issues & Planning
We use **GitHub Issues** to plan, assign, and track all project work — including bugs, features, documentation, and risk management.  
This keeps our progress visible to the entire team and aligns with our weekly meeting goals.

### Issue Criteria
- Name of issue
- Location/where to find the issue
- Short description of what needs to be done and why

## Commit Messages
- **Feature branches:** `feature/<short-description>`  
- **Bug-fix branches:** `fix/<issue-number>`  
- **Docs branches:** `docs/<topic>` 

**Example:**
```bash
git commit -m "feat(simulation): add new patient scenario"
git push -u origin feature/add-student-scenario 
```

## Code Style, Linting & Formatting

We enforce code quality through **ESLint** in CI. Every push and every pull request to `main` runs the workflow defined in `.github/workflows/lint.yml`.

**Do This Before You Push**
```bash
npm install
npm run lint
npm run lint -- --fix
```

## Testing

### Required Test Types
- **Unit tests:** For utility functions, React hooks, and basic logic.
- **Component/UI tests:** For main user flows such as login, dashboard, and scenario selection.
- **Integration tests (planned):** For interactions between modules (React ↔ Ren’Py).

### How to Run Tests
All tests are run from the `web/` directory:

```bash
cd web
npm install    # if not already done
npm test
```

### When Tests are Mandatory
Add or update tests when:
- A new Feature is added.
- A bug has been fixed.
- Changed authentication, access control, or data handling.
- Modify shared UI components or simulation logic

## Pull Requests & Reviews
All changes to `main` must go through a Pull Request (PR). This keeps the repo consistent with our Definition of Complete and the CI/lint workflows.

### PR Requirements
- **Use the PR template**
- **One feature/fix per PR** (no “everything I did this week” PRs).
- **Keep it small**: aim for **≤ 400 lines changed**; if bigger, explain why.
- **Link the issue**: `Closes #<issue-number>` or `Related to #<issue-number>`.

### Approval Rules
- At least 1 approval from a teammate is required (Random Reviewer will be implemented).
- If the change touches security, auth, or data handling, ping QA (Aidan) or Team Lead (Ian).
- All review comments must be resolved before merge.

### Required Status Checks
A PR can be merged only if:
- CI (build) passes – from `.github/workflows/CI.yml`
- Lint passes – from `.github/workflows/lint.yml`
- Branch is up to date with main
- Review is approved

If any checks fail, fix it -> push again -> CI re-runs

## CI/CD
Our project uses **GitHub Actions** to automatically build and verify changes on every push and pull request to `main`.

The CI pipeline is defined in `.github/workflows/CI.yml`:

### What the CI Workflow Does

The current **CI.yml** performs these tasks automatically:

1. **Runs on:** Every push and pull request to the `main` branch.  
2. **Installs dependencies:** Executes `npm install` inside the `./web` directory.  
3. **Builds the project:** Runs `npm run build` to ensure the React app compiles successfully.  
4. **Fails the PR if the build fails:** If the build step errors, the CI job fails, blocking the merge until fixed.

This guarantees that only code that **builds cleanly** can be merged into `main`.

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
