const {
  getProjectsKeys,
  deleteIssuesInProjects,
  getTicketCount,
} = require("./helpers.js");
require("dotenv").config();

var fs = require("fs");
var util = require("util");
var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
var log_stdout = process.stdout;

console.log = function (d) {
  log_file.write(util.format(d) + "\n");
  log_stdout.write(util.format(d) + "\n");
};

const script = async () => {
  const start = Date.now();
  const projectKeys = await getProjectsKeys();
  if (projectKeys) {
    if (projectKeys.includes("CSPV3X")) {
      const index = projectKeys.indexOf("CSPV3X");
      projectKeys.splice(index, 1);
    }
    console.log(
      `${new Date().toGMTString()} - ✅ All project keys have been found and CSPV3X was taken out of the list\n`
    );
    const finished = await deleteIssuesInProjects(projectKeys);
    if (finished) {
      const end = Date.now();
      const totalTime = end - start;
      const ticketCount = getTicketCount();
      console.log(
        `${new Date().toGMTString()} - ✅ ${ticketCount} issues have been deleted in ${
          totalTime / 1000
        } seconds. \n\n\n→ Please check the debug.log file for any errors that might have occurred.\n`
      );
    }
  }
};

script();
