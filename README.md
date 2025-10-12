# NurseSim+
 An AI-Powered Clinical Simulation for Nursing Education

 # Connect to Git with SSH (Secure Shell)

---

## 1) Generate an SSH Key Pair

**Linux / macOS**

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519
```

> Press Enter to accept defaults. The `-C` flag is just a comment (usually your email).

**Windows (PowerShell)**

```powershell
mkdir \.ssh
cd \.ssh
ssh-keygen -t ed25519 -C "your_github_email@example.com" -f $env:USERPROFILE\.ssh\id_ed25519
```

---

## 2) Start the SSH Agent & Add Your Key

**Linux / macOS**

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

**Windows (PowerShell)**

```powershell
Start-Service ssh-agent
ssh-add $env:USERPROFILE\.ssh\id_ed25519
```

---

## 3) Add the Public Key to GitHub

Copy your **public** key:

```bash
cat ~/.ssh/id_ed25519.pub
```

Then go to **GitHub** → **Settings** → **SSH and GPG keys** → **New SSH key** → Paste the key → **Add key**.

If your organization uses **SSO**, click **Enable SSO** and authorize it for your org (e.g., `CS-374-F25`).

---

## 4) Test the SSH Connection

```bash
ssh -T git@github.com
```

Expected output:

```
Hi <username>! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 5) Clone Your Repository with SSH

Use the **SSH URL** (not HTTPS): **GitHub** → **<Code>(Green Code button)** → **SSH** → **Copy Link**

```bash
git clone <sshURL>
```

If you already cloned with HTTPS, switch it:

```bash
git remote set-url origin <sshURL>
```

---

## 6) Basic Git Commands

```bash
# Stage all changes
git add -A

# Commit changes
git commit -m "Your commit message"

# Push changes to GitHub
git push -u origin HEAD

# Pull updates from GitHub
git pull --rebase
```

---

## 7) Common Issues

**Permission denied (publickey)**
Your SSH key isn’t being used or isn’t recognized. Try:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
ssh -T git@github.com
```

**Repository not found**
You don’t have access or used the wrong repo name. Make sure you can view it on GitHub while logged in.

**Asked for a password**
You cloned using HTTPS instead of SSH. Switch the remote URL (see step 5).

**Wrong key or path**
If your key isn’t in the default location, specify it in `~/.ssh/config`:

```
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/my_custom_key
  IdentitiesOnly yes
  AddKeysToAgent yes
```

---

## 8) Permissions

SSH is strict about file permissions:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

---


Contact------------------------------------
martinfr@oregonstate.edu, 
dalyai@oregonstate.edu, 
halei@oregonstate.edu, 
shimk@oregonstate.edu, 
isweesin@oregonstate.edu,
Contact------------------------------------
