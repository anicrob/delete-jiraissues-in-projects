const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

const getProjectsKeys = async () => {
  const index = [0, 100, 200, 300, 400];
  const projectKeys = [];
  await Promise.all(
    index.map(async (i) => {
      try {
        const response = await fetch(
          `${process.env.URL}/rest/api/3/project/search?maxResults=100&startAt=${i}`,
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${process.env.API_KEY}`,
              Accept: "application/json",
            },
          }
        );
        let { values } = await response.json();
        if (values.length > 0) {
          const keys = values.map((project) => project.key);
          projectKeys.push(...keys);
        }
      } catch (err) {
        console.log(err);
      }
    })
  );
  return projectKeys;
};

const getJiraIssueIds = async (projectKeys) => {
  const issueKeys = [];
  await Promise.all(
    projectKeys.map(async (key) => {
      try {
        const response = await fetch(
          `${process.env.URL}/rest/api/3/search?jql=project%20%3D%20${key}`,
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${process.env.API_KEY}`,
              Accept: "application/json",
            },
          }
        );
        let { issues } = await response.json();
        if (!Array.isArray(issues)) {
          issues = [issues];
        }
        if (issues) {
          const keys = issues.map((issue) => issue.key);
          issueKeys.push(...keys);
        }
      } catch (err) {
        console.log(
          `you do not have access to view tickets in the ${key} project`
        );
      }
    })
  );
  return issueKeys;
};

const deleteTickets = async (issueKeys) => {
  await Promise.all(
    issueKeys.map(async (key) => {
      try {
        await fetch(`${process.env.URL}/rest/api/3/issue/${key}`, {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${process.env.API_KEY}`,
            Accept: "application/json",
          },
        });
      } catch (err) {
        console.log(
          `There was an error when trying to delete issue with key ${key}:`,
          err
        );
      }
    })
  );
};

module.exports = {
  getProjectsKeys,
  getJiraIssueIds,
  deleteTickets,
};
