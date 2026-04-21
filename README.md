# 📊 GitHub User Activity CLI

**Project URL:** https://roadmap.sh/projects/github-user-activity

A simple command-line interface (CLI) application to fetch and display a user's recent GitHub activity in a clean, human-readable format.

---

## 🚀 Features

* Fetch recent public activity from GitHub
* Group similar events for cleaner output
* Supports multiple event types:

  * Push events (with commit count when available)
  * Pull requests (opened, closed, merged, reopened)
  * Issues (opened, closed, reopened)
  * Issue comments
  * Stars (watch events)
  * Forks
  * Releases
* Smart formatting for better readability
* Handles missing data gracefully (e.g., missing commits)

---

## 📦 Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

2. Make sure you are using Node.js (v18+ recommended).

---

## ▶️ Usage

Run the CLI:

```bash
node index.js
```

Then type commands directly in the terminal.

---

## 🧠 Command Structure

All commands start with:

```bash
github-activity <username>
```

---

## ✨ Commands

### 📊 Fetch user activity

```bash
github-activity <username>
```

Example:

```bash
github-activity kamranahmedse
```

---

## 🧾 Example Output

```bash
- Pushed 5 commits to kamranahmedse/developer-roadmap
- Opened a new issue in kamranahmedse/developer-roadmap
- Commented on an issue in kamranahmedse/developer-roadmap
- Starred kamranahmedse/developer-roadmap
- Forked kamranahmedse/developer-roadmap
- Published a release in kamranahmedse/developer-roadmap
```

---

## 🧠 How It Works

* Fetches data from the GitHub Events API:

  ```
  https://api.github.com/users/<username>/events
  ```

* Groups events by:

  * Type
  * Repository
  * Action

* Aggregates:

  * Number of events (`count`)
  * Number of commits (for push events)

* Formats events into readable messages using a formatter function.

---

## ⚠️ Notes

* GitHub may not always include commit data in push events.
* When commits are unavailable:

  * The CLI falls back to:

    * Number of pushes
    * Or branch name
* Only public activity is shown.
* If no activity is found, a message will be displayed.

---

## 🛑 Exit CLI

To exit the program:

```bash
exit
```

---

## 💡 Future Improvements (Ideas)

* Add colors using `chalk` 🎨
* Show timestamps (e.g., "2 hours ago")
* Group events by repository
* Pagination (GitHub API limit is ~30 events)
* Interactive mode
* Filter by event type

---

## 🧑‍💻 Author

Tommy Grullon Contreras

---

## 📄 License

MIT
