import { GITHUB_ACTION_TYPE } from "./constant.js";

const fetchUser = async (username) => {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/events`);
    const response = await res.json();

    if (!Array.isArray(response) || response.length == 0) {
      console.log("No activity found or username does not exists...");
      return;
    }

    const grouped = new Map();

    for (const event of response) {
      const type = event.type;
      const repo = event.repo.name;
      const action = event?.payload?.action || "";

      const key = `${type}-${repo}-${action}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          type,
          repo,
          action,
          payload: event.payload,
          count: 0,
          commits: 0,
        });
      }

      const group = grouped.get(key);
      group.count += 1;

      if (type === GITHUB_ACTION_TYPE.PUSH_EVENT) {
        const commitsCount = event?.payload?.commits?.length || 0;
        group.commits += commitsCount;
      }
    }

    const events_filtered = Array.from(grouped.values());

    events_filtered
      .map(formatEvent)
      .filter(Boolean)
      .forEach((e) => console.log(`- ${e}`));
  } catch (error) {
    console.log("Something went wrong: ", error);
  }
};

const formatEvent = (event) => {
  const repo = event.repo;

  switch (event.type) {
    case GITHUB_ACTION_TYPE.PUSH_EVENT:
      console.log(event.count)

      if (event.commits > 0) {
        return `Pushed ${event.commits} commit${event.commits !== 1 ? "s" : ""} to ${repo}`;
      }
    
      if (event.count > 1) {
        return `Pushed ${event.count} times to ${repo}`;
      }
    
      const branch = event.payload?.ref?.split("/").pop();
      return `Pushed to ${repo}${branch ? ` (${branch})` : ""}`;
    case GITHUB_ACTION_TYPE.WATCH_EVENT:
      return `Starred ${repo}`;

    case GITHUB_ACTION_TYPE.PULL_REQUEST_EVENT:
      if (event.action == "opened")
        return `Opened a new pull request in ${repo}`;
      if (event.action == "reopened")
        return `Reopened a pull request in ${repo}`;
      if (event.action === "closed") {
        if (event.payload?.pull_request?.merged)
          return `Merged a pull request in ${repo}`;
        else return `Closed a pull request in ${repo}`;
      }

      return null;

    case GITHUB_ACTION_TYPE.ISSUES_EVENT:
      if (event.action == "opened") return `Opened a new issue in ${repo}`;
      if (event.action == "reopened") return `Reopened an issue in ${repo}`;
      if (event.action == "closed") return `Closed an issue in ${repo}`;

      return null;

    case GITHUB_ACTION_TYPE.ISSUE_COMMENT_EVENT:
      return `Commented on an issue in ${repo}`;

    case GITHUB_ACTION_TYPE.FORK_EVENT:
      return `Forked ${repo}`;

    case GITHUB_ACTION_TYPE.RELEASE_EVENT:
      if (event.action === "published") return `Published a release in ${repo}`;
      if (event.action === "unpublished")
        return `Unpublished a release in ${repo}`;
      if (event.action === "created") return `Created a release in ${repo}`;
      if (event.action === "edited") return `Edited a release in ${repo}`;
      if (event.action === "deleted") return `Deleted a release in ${repo}`;
      if (event.action === "prereleased")
        return `Published a pre-release in ${repo}`;
      if (event.action === "released") return `Published a release in ${repo}`;

      return null;
    default:
      return null;
  }
};

async function main() {
  process.stdin.on("data", async (data) => {
    const input = data.toString().trim();

    const command = input.split(" ")[0];

    switch (command) {
      case "github-activity":
        const username = input.split(" ")[1];
        await fetchUser(username);
        break;
      case "exit":
        process.exit();
        break;
      default:
        console.log("Unknown command.");
    }
  });
}

main();
