# Delete all Jira Issues in All Projects (Except One)


## Description

Follow the set up directions in the Setup Instructions section to run this script. This script will allow you to find any filters that contain a certain keyword (not in the title but within the filter jql itself). This data is then exported into a CSV file.

## Table of Contents
* [Setup Instructions](#setup-instructions)
* [Usage](#usage)
* [Basic Auth](#basic-auth)
* [Permissions](#permissions)
* [Limitations](#limitations)
* [Credits](#credits)


## Setup Instructions

Here are the setup steps:

1. Ensure you have Node.js downloaded: https://nodejs.org/en 

Select the option on the left. 

To check and see if you have node already installed or if the install was successful, run the command:

~~~
node -v
~~~

2. After doing a git clone, install the necessary packages. They are already added to the package.json, so all that's needed is to run the following commmand:
~~~
npm i
~~~

3. Set up an .env file

Run the following command:
~~~
touch .env
~~~

Add three values to this file with the following titles:

API_KEY - see Basic Auth section on how to get this value; see permissions section to see which permissions this user needs

URL - this is the Atlassian url instance (e.g. https://your-domain.atlassian.net)


## Usage

To use this script, run it by using the following command:

~~~
npm run start
~~~

OR

~~~
node index.js
~~~

## Basic Auth

Atlassian uses Basic Auth for a few of their REST endpoints for their authentication headers. Here are the steps to get your API token into Basic Auth format:

1. Ensure you have an API key created. Go here to create one if needed: https://id.atlassian.com/manage-profile/security/api-tokens

2. The format of basic auth is username:password then base64. The username is your email associated with your Atlassian account and then the password is the API key.

3. In the terminal run this command: (replacing user@example.com with your Atlassian account email and api_token_string with your api ke from step 1)

~~~
echo -n user@example.com:api_token_string | base64
~~~

## Permissions 

Delete Issue project permissions are needed for this script to work, but please note that the projects/issues found depend on the following:

- if you have Browse Projects permissions on the project
- if you have permissions to view the issue (there's no issue security set on the ticket)

Therefore, this script cannot guarantee that ALL projects/issues are found, but any available based on the above limitations to the API endpoints. 

## Limitations

The only limitations are the following:
- currently goes up to 500 projects
- could be API rate limits

## Credits

This was created by anicrob. 

Jira Cloud REST APIs Endpoint used: 
- [Get Project](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-projects/#api-rest-api-3-project-projectidorkey-get)
- [Search for Issues using JQL (GET)](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-search-get)
- [Delete Issue](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-delete)


You can find more of my work at [anicrob](https://github.com/anicrob).

