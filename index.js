import { GITHUB_ACTION_TYPE } from "./constant.js"

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

fetchUser = async (username) => {
  fetch(`https://api.github.com/users/${username}/events`)
    .then(async (data) => {
        const response = await data.json()

        if(response.length == 0) {
            console.log("Username not found...")
            return   
        }

        let events = []

        for(let i = 0; i < response.length; i++) {
            let repository = response[i]?.repo?.id
            let type = response[i]?.type

            filterByTypeAndRepo()

        }

        console.log(response)
    })
    .catch((error) => {
      console.log("Something went wrong: ", error);
    });
};

const filterByTypeAndRepo = (events, repo, type) => {
    return events.filter((e) => e.repo == repo && e.type == type)
}
