(function () {
  const { Octokit } = require("@octokit/core");
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const axios = require("axios");

  async function sendDiscordNotification() {
    try {
      const { data } = await octokit.request(
        "GET /repos/:owner/:repo/pulls/:pull_number",
        {
          owner: process.env.GITHUB_REPOSITORY.split("/")[0],
          repo: process.env.GITHUB_REPOSITORY.split("/")[1],
          pull_number: process.env.GITHUB_EVENT.pull_request.number,
        },
      );

      const pullRequest = data;
      const discordMessage = `New PR opened by ${pullRequest.user.login}: ${pullRequest.html_url}`;

      await axios.post(
        `https://discordapp.com/channels/1161586183785160816/1161586503407915078`,
        {
          content: discordMessage,
        },
        {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
          },
        },
      );

      console.log("Discord notification sent successfully.");
    } catch (error) {
      console.log("Error sending Discord notification", error.message);
    }
  }

  sendDiscordNotification();
})();
