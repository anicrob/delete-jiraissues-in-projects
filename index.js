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
    console.log("All project keys have been found and CSPV3X was taken out of the list")
    const issueKeys = await getJiraIssueIds(projectKeys);
    console.log("All issues in the projects you have access to have been collected. Starting to delete issues now...")
    await deleteTickets(issueKeys);
    console.log(
      "The issues have been deleted. Please read the console for any errors that might have occurred"
    );
  }
};

script();
