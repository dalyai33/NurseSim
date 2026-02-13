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

### Conflict resolution
- **Discuss first** in Discord or in a meeting; aim for consensus on small decisions.
- **Major decisions** → majority vote; if tied, discuss priorities and try to incorporate everyone’s input.
- **Escalate** to the Team Lead (Ian) or advisor/TA when the team can’t resolve it.
- **Accountability:** Use PRs, reviews, and meeting notes as evidence when needed.

## Getting Started
### Prerequisites
- **Node.js**
- **Python 3** (for the backend)
- **Git** with **SSH** configured (we use SSH, not HTTPS)
- **PostgreSQL** (or access to a shared project database)
- **pgAdmin** (to view and manage the database)
- **Ren’Py** (for the simulation / VN-style UI segment)
- Recommended: VS Code + ESLint

### Clone via SSH
Follow the README steps (already in the repo) to set up SSH: clone using the SSH URL from the repo (e.g. `git clone <sshURL>`).

### Local setup

#### 1. Web app (frontend)
From the repo root:
```bash
cd web
npm install
npm run dev
```
The app will be available at the URL shown (e.g. `http://localhost:5173`).

#### 2. Database (PostgreSQL + pgAdmin)
- Install **PostgreSQL** and **pgAdmin** if you don’t have them.
- In pgAdmin, create or connect to a PostgreSQL server (localhost or your team’s host).
- Create a database for the project (e.g. the same name you will use for `DB_NAME` in `.env`).
- Keep pgAdmin open to inspect tables, run queries, and manage data. Connection details (host, port, database name, user, password) must match the values in the backend’s `.env` file.

#### 3. Backend (Flask API)
The backend lives in the `backend/` directory and uses a `.env` file for database and other config (e.g. `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`). Create a `.env` in `backend/` if needed (see team or README for required variables).

**On macOS / Linux (non-WSL):**
```bash
cd backend
pip install -r requirements.txt
python3 app.py
```

**On WSL (Windows Subsystem for Linux):** use a virtual environment so dependencies don’t conflict with the system Python:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```
When you’re done, type `deactivate` to leave the venv. Next time you work on the backend, run `source venv/bin/activate` from `backend/` before `python3 app.py`.

The API will run at the URL/port shown in the terminal (e.g. `http://localhost:5001`).

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

### Reporting bugs
Use **GitHub Issues**. Include:
- Steps to reproduce
- What you expected vs what actually happened
- Browser and OS (and a screenshot if it helps)

### Requesting changes
Use **GitHub Issues**. Include:
- What you want changed or added
- Why (use case or problem it solves)
- Simple acceptance criteria (how we’ll know it’s done)

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

We enforce code quality through **ESLint** in CI. Every push and every pull request targeting `main` runs the workflow in `.github/workflows/lint.yml`, so lint runs automatically on GitHub when you push or open a PR. To catch issues before that, run lint (and optionally build and tests) locally from the `web/` directory:

**Do This Before You Push**
```bash
cd web
npm install
npm run lint
npm run lint -- --fix
```
Running these from `web/` matches what CI does and helps avoid failed checks after you push.

### Run CI checks locally
To run the same checks that CI runs (build, lint, tests), use these commands from the `web/` directory:

```bash
cd web
npm install
npm run build
npm run lint
npm test
```

Or use `npm run coverage` instead of `npm test` to include coverage. Fix any failures before pushing so CI passes.

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

### Definition of Done (DoD)
A PR is done when: **no direct pushes to main** (use a PR); **CI passes** (build, tests, lint); **docs updated** for new features/setup/API (reviewers verify); **≥1 approval** and all **review comments resolved**. Reviewers check correctness, tests, style, and docs.

### How to open a PR
1. Create a branch from `main` (e.g. `feature/my-feature` or `fix/123`).
2. Push your branch and open a **Pull Request** on GitHub targeting `main`.
3. Fill out the **PR template** and **link the issue** (`Closes #123` or `Related to #123`).
4. **Request reviewers**; address feedback and fix any failing CI checks until the PR is approved and mergeable.

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
- CI (build) passes – `.github/workflows/CI.yml`
- Tests pass – `.github/workflows/Tests.yml`
- Lint passes – `.github/workflows/lint.yml`
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

### Reporting
If you notice a security issue, data misuse, or suspicious access:

- Report it **immediately** in **Discord** (project channel), **or**
- Bring it up in the **next team meeting**, **and**
- If it relates to data/privacy or looks serious, escalate to:
  - **Ian (Team Lead):** `halei@oregonstate.edu`
  - **Aidan (QA):** `dalyai@oregonstate.edu`
  - If required by the assignment/partner, also notify the course TA / partner (OHSU)

Charter rule: critical security items should be logged and addressed within **24–48 hours** and documented in GitHub Issues.

### Prohibited Patterns
- ❌ No **hard-coded secrets** (API keys, tokens, passwords)
- ❌ No **real or identifiable** patient/student data
- ❌ No committing `.env`, `.pem`, or SSH keys
- ❌ No disabling auth/role checks “just for testing” without documenting it
- ✅ Use `.env` / `.env.local` and ensure they are in `.gitignore`
  
### Dependency / Update Policy
- Run `npm audit` or `npm audit fix` locally when adding new packages.
- If CI later adds a security step, PRs with **high-severity** vulns must fix or justify them before merge (planned in charter).:contentReference[oaicite:3]{index=3}
- Keep React/front-end deps reasonably current to avoid known CVEs.

### Scanning Tools (Planned)
- **CI security/audit step** in GitHub Actions (`npm audit`) before merge
- Optionally add a simple secret scanner (e.g. `git-secrets`) if we start integrating external APIs

### Access & Data Rules
From the charter:  
- Only **fictional, anonymized, or de-identified** datasets are allowed.  
- Unauthorized login attempts or strange roles must be **monitored by QA (Aidan)** and escalated to **Ian** and the partner within **24 hours**.
- UI should help prevent misuse (Kiana owns this on the UI/UX side)
  
## Documentation Expectations

Any changes in expectations or processes that the team agrees upon must be recorded to maintain consistency and accountability.

If those changes affect setup, workflows, or contributor steps, they must also be updated in one or more of the following files:
- `README.md` — for setup instructions or user-facing information.
- `CONTRIBUTING.md` — for development, workflow, or process updates.

### Additional Guidelines
- Keep documentation clear, concise, and consistent with the team’s terminology.
- Use Markdown formatting for all internal documentation.
- Update code comments or docstrings when function behavior changes.
- Ensure PRs that modify functionality also include related documentation updates.

## Release Process
Our release flow ensures each version of NurseSim+ is stable, documented, and easy to roll back if needed.

### 12.1 Versioning
We follow **Semantic Versioning**:
- **MAJOR** – Breaking changes or major new systems.
- **MINOR** – New features or scenarios added.
- **PATCH** – Bug fixes or small UI/documentation updates.

Example: `v1.2.0`

### 12.2 Tagging a Release
After merging a feature set into `main` and verifying all CI checks pass:

```bash
# Update changelog first
git add CHANGELOG.md
git commit -m "docs: update changelog for v1.2.0"

# Create version tag
git tag -a v1.2.0 -m "NurseSim+ release v1.2.0"
git push origin v1.2.0
```
Tags are created only after merging into `main` to ensure stability.

### Changelog Management
- Maintain a `CHANGELOG.md` file at the root of the repository.  
- Each release must include an entry with:
  - **Added** – new features or files
  - **Changed** – updates or refactors
  - **Fixed** – resolved bugs or issues
  - **Security** – vulnerabilities or dependency updates
- Any PR that modifies functionality or setup must update the changelog before merging.

### Packaging & Publishing
- For internal or class demos:
  - Build the React project:
    ```bash
    cd web
    npm run build
    ```
  - Share or deploy the built artifact for presentation.
- For Ren’Py simulations:
  - Export the latest project version.
  - Name the build with the corresponding release tag (e.g., `NurseSim-v1.2.0`).
- All builds and exports should be linked or referenced in GitHub release notes or the team’s shared documentation.

### Rollback Procedure
If a release causes major issues or breaks functionality:

1. **Identify** the last stable version (e.g., `v1.1.0`).  
2. **Check out** that version:
   ```bash
   git checkout v1.1.0
   ```
3. **Re-deploy or notify** the team; fix forward on `main` when ready, then cut a new release.

## Support & Contact
For help, start with the **Discord project channel** or the contacts below.

For any questions, issues, or clarification about NurseSim+, please reach out through the following channels.

### Communication Channels
- **Primary:** Team Discord (project channel) — for quick questions, updates, and coordination.  
- **Secondary:** Email (for formal communication or if Discord is unavailable).  
- **Tertiary:** Weekly or bi-weekly team meetings for in-depth discussions and planning.

### Maintainer Contacts
| Name | Role | Email |
|------|------|--------|
| **Ian Hale** | Team Lead | halei@oregonstate.edu |
| **Aidan Daly** | QA Lead | dalyai@oregonstate.edu |
| **Francisco Martinez** | Documentation Lead | martinfr@oregonstate.edu |
| **Kiana Shim** | UI/UX Developer | shimk@oregonstate.edu |
| **Nadir Isweesi** | Lead Developer | isweesin@oregonstate.edu |

### Response Expectations
- **Discord messages:** Within 24 hours.  
- **Email inquiries:** Within 1–2 business days.  
- **Critical issues (e.g., CI/CD failures, merge blockers):** Immediate attention from the responsible lead.

### Where to Ask Questions
- **General project or workflow questions:** Discord project channel.  
- **Technical/code issues:** Open a GitHub Issue tagged with `help-wanted` or `question`.  
- **Documentation or process updates:** Ping Francisco (Documentation Lead).  
- **Security or privacy concerns:** Notify Aidan (QA Lead) or Ian (Team Lead).

All questions and feedback are welcome — maintaining open, respectful communication helps keep the project on track and collaborative.

