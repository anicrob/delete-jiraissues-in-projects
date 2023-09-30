const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();
var fs = require("fs");
var util = require("util");
var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
var log_stdout = process.stdout;
var count = 0;
console.log = function (d) {
  log_file.write(util.format(d) + "\n");
  log_stdout.write(util.format(d) + "\n");
};
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
const deleteTickets = async (issueKeys) => {
  await Promise.all(
    issueKeys.map(async (key) => {
      try {
        const response = await fetch(
          `${process.env.URL}/rest/api/3/issue/${key}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Basic ${process.env.API_KEY}`,
              Accept: "application/json",
            },
          }
        );
        if (response.ok) {
          count += 1;
          console.log(
            `${new Date().toGMTString()} - Issue ${key} has been deleted.`
          );
        }
      } catch (err) {
        console.log(
          `${new Date().toGMTString()} - ERROR: There was an error when trying to delete issue with key ${key}.`
        );
      }
    })
  );
};

const deleteIssuesInProjects = async (projectKeys) => {
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
        let data = await response.json();
        const { issues } = data;
        if (data.errorMessages) {
          console.log(`${new Date().toGMTString()} - ERROR: An error occured in the ${key} project. This is what Atlassian says:\n
          ${
            data.errorMessages
          }\n -------------------------------------------------------------------------------`);
          return;
        }
        if (issues.length === 0) {
          console.log(
            `\n${new Date().toGMTString()} - All tickets in project ${key} have been deleted 🎉\n`
          );
          return;
        }
        if (issues) {
          const keys = issues.map((issue) => issue.key);
          await deleteTickets(keys);
          await deleteIssuesInProjects([key]);
          return;
        }
      } catch (err) {
        console.log(
          `${new Date().toGMTString()} - ERROR: Something went wrong with the ${key} project:`,
          err
        );
        return;
      }
    })
  );
  return true;
};

const getTicketCount = () => {
  return count;
};

module.exports = {
  getProjectsKeys,
  deleteIssuesInProjects,
  getTicketCount,
};
