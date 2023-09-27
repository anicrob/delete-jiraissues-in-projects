const {
  getProjectsKeys,
  getJiraIssueIds,
  deleteTickets,
} = require("./helpers.js");
require("dotenv").config();

const script = async () => {
  const projectKeys = await getProjectsKeys();
  if (projectKeys) {
    if (projectKeys.includes("CSPV3X")) {
      const index = projectKeys.indexOf("CSPV3X");
      projectKeys.splice(index, 1);
    }
    const issueKeys = await getJiraIssueIds(projectKeys);
    await deleteTickets(issueKeys);
    console.log(
      "The issues have been deleted. Please read the console for any errors that might have occurred"
    );
  }
};

script();
