# NurseSim+
NurseSim+ is a web-based clinical simulation platform designed to expand access to flexible, interactive training for nursing students. It enables learners to practice clinical decision-making through structured, decision-based scenarios delivered entirely online.

  The platform primarily serves nursing students seeking to strengthen practical reasoning skills, while also supporting instructors with tools to assign simulations and monitor student progress. NurseSim+ does not rely on VR hardware or real patient interaction, ensuring broad accessibility through standard web browsers.


## Screenshots

---

## 1. How to install the software

### 1.1 paste the following in the command line

```
git clone git@github.com:dalyai33/NurseSim.git
cd NurseSim
```

### 1.2 create a virtual environment
```
python -m venv nursesim
source nursesim/bin/activate # macOs or Linux
nursesim/Scripts\activate # Windows

```

### 1.3 paste the following after that

```
pip install -r requirements.txt
```

## 2. How to run the software

### 2.1 enter the API to your provider
```
echo 'export GEMINI_API_KEY='YOUR_GEMINI_KEY''  >> ~/.zshrc  # can be any of the following:
```
```
source ~/.zshrc # if zsh terminal
source ~/.bashrc # if bash terminal
```

### 2.2 run the server (default port: 5000)
```
python web/backend/app.py
```


## 3. Run the Web Application

### 3.1 run the package manager
```
cd web
npm run dev
```

* Open your preferred web browser.
* Go to the following URL
  ```
  http://localhost:5173/
  ```
  
* Create an Account
* Sign In
* Create your Classroom!

## 5. Set Up the Database
### 5.1 Install pgAdmin

### 5.2 Create a New Server

Right Click on the Servers Icon on the Left Bar
Register -> Server

```
Name: nursesim
username: any (e.g. postgres)
Hostname: localhost
Port: 5432
```

### 5.3 Create a Database 
Right Click on the Servers Icon on the Left Bar
Create -> Database

```
Database: nursesim
Locale Provider: icu (or libc)
```

### 5.5 Define the Environmental Variables in the web directory
** Coming Soon **

### 5.4 Restore the SQL Schema
** Coming Soon **



## 6. Support & Questions

* Open a GitHub Issue.
* Contact with the emails at the bottom of this page


## 7. Common Issues

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


## Contact
martinfr@oregonstate.edu
dalyai@oregonstate.edu
halei@oregonstate.edu
shimk@oregonstate.edu
isweesin@oregonstate.edu

