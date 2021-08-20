const fs = require("fs");
const express = require("express");
const { ApolloServer, UserInputError } = require("apollo-server-express");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const { isNaN } = require("lodash");

const GraphQLDate = new GraphQLScalarType({
  name: "GraphQLDate",
  description: "Convert a Date() into ISOString()",
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    const date = new Date(value);
    return isNaN(date) ? undefined : date;
  },
  parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
      const date = new Date(ast.value);
      return isNaN(date) ? undefined : date;
    }
  },
});

// mock data
let aboutMessage = "Issue Tracker API v.1.0";

const issuesDB = [
  {
    id: 1,
    status: "New",
    owner: "Lee Roy",
    effort: 5,
    created: new Date("2021-08-20"),
    due: undefined,
    title: "Error in console when clicking button",
  },
  {
    id: 2,
    status: "Assigned",
    owner: "Frank",
    effort: 14,
    created: new Date("2021-07-29"),
    due: new Date("2021-08-28"),
    title: "Missing bottom border on panel",
  },
];

const resolvers = {
  Query: {
    about: () => aboutMessage,
    issueList,
  },
  Mutation: {
    setAboutMessage,
    issueAdd,
  },
  GraphQLDate,
};

function setAboutMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

function issueAdd(_, { issue }) {
  validateIssue(issue);
  issue.created = new Date();
  issue.id = issuesDB.length + 1;
  issuesDB.push(issue);
  return issue;
}

function validateIssue(issue) {
  const errors = [];

  if (issue.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long.');
  }
  if (issue.status == "Assigned" && !issue.owner) {
    errors.push('Field "owner" is required when status is "Assigned".');
  }
  if (errors.length > 0) {
    throw new UserInputError("Invalid input(s)", { errors });
  }
}

function issueList() {
  return issuesDB;
}

(async function start() {
  try {
    // create express server
    const app = express();
    const port = 3000;
    app.listen(port, () => {
      console.log(`RUNNING: Server on http://localhost:${port}/graphql`);
    });

    // create apollo server
    const server = new ApolloServer({
      typeDefs: fs.readFileSync("./src/schema.graphql", "utf-8"),
      resolvers,
      formatError: (error) => {
        console.log(error);
        return error;
      },
    });
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });
  } catch (err) {
    console.log("ERROR: Server has error:", err);
  }
})();
