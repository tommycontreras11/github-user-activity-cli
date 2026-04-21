import { GITHUB_ACTION_TYPE } from "./constant.js"

const fetchUser = async (username) => {
  fetch(`https://api.github.com/users/${username}/events`)
    .then(async (data) => {
        const response = await data.json()

        if(response.length == 0) {
            console.log("Username not found...")
            return   
        }

        let events = []
        let events_filtered = []

        for (const event of response) {
              events.push({
                type: event.type,
                repo: event.repo.name,
                payload: event.payload
              })
          }
    
        for(let i = 0; i < events.length; i++) {
          let repo = events[i].repo
          let payload = events[i]?.payload
          let action = events[i]?.payload?.action
          let type = events[i].type

          if(events_filtered?.filter((a) => a.repo == repo && a.type == type && a?.payload.action == action).length > 0) {
            let findIndex = events_filtered.findIndex((a) => a.repo == repo && a.type == type && a?.payload.action == action)

            events_filtered[findIndex].count += 1
          } else {
            events_filtered.push({
                type,
                repo,
                payload,
                count: 1
              })

          }
        }

        for(const event of events_filtered) {
           console.log(`- ${formatEvent(event)}`)
        }
    })
    .catch((error) => {
      console.log("Something went wrong: ", error);
    });
};

const formatEvent = (event) => {
  const repo = event.repo
  let action = event?.payload?.action ?? null
  const pr = event.payload.pull_request;
  let message = ""

  switch(event.type) {
    case GITHUB_ACTION_TYPE.PUSH_EVENT:
      const commits = event?.count

        if (commits) {
          return `Pushed ${commits} commit${commits !== 1 ? "s" : ""} to ${repo}`;
        }
      
        return `Pushed to ${repo}`;
    case GITHUB_ACTION_TYPE.WATCH_EVENT:
      return `Starred ${repo}`
      
    case GITHUB_ACTION_TYPE.PULL_REQUEST_EVENT:
      if(action == "opened") message = "Opened a new"
      if(action == "reopened") message = "Reopened a"
      if (action === "closed") {
        if (pr?.merged) message = "Merged a"
        else message = "Closed a"
      }

      return `${message + " pull request in " + repo}`
      
    case GITHUB_ACTION_TYPE.ISSUES_EVENT:
      if(action == "opened") message = "Opened a new"
      if(action == "reopened") message = "Reopened a"
      if(action == "closed") message = "Closed a"

      return `${message + " issue " + repo}`

    case GITHUB_ACTION_TYPE.ISSUE_COMMENT_EVENT:
      return `Commented on an issue in ${repo}`
    
    case GITHUB_ACTION_TYPE.WATCH_EVENT:
      return `Starred ${repo}`
    
    case GITHUB_ACTION_TYPE.FORK_EVENT:
      return `Forked ${repo}`

    case GITHUB_ACTION_TYPE.RELEASE_EVENT:
      if (action === "published") message = "Published a release in"
      if (action === "unpublished") message = "Unpublished a release in"
      if (action === "created") message = "Created a release in"
      if (action === "edited") message = "Edited a release in"
      if (action === "deleted") message = "Deleted a release in"
      if (action === "prereleased") message = "Published a pre-release in"
      if (action === "released") message = "Published a release in"

      return `${message} ${repo}`
  }
}

async function main() {
  process.stdin.on("data", async (data) => {
    const input = data.toString().trim();

    const command = input.split(" ")[0];

    console.log("Input: ", input);

    switch (command) {
      case "github-activity":
        const username = input.split(" ")[1];
        await fetchUser(username)
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