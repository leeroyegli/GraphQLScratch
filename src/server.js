const fs = require("fs");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const GraphQLDate = new GraphQLScalarType({
  name: "GraphQLDate",
  description: "Convert a Date() into ISOString()",
  serialize(value) {
    return value.toISOString();
  },
  parseLiteral(ast) {
    return ast.kind == Kind.STRING ? new Date(ast.value) : undefined;
  },
  parseValue(value) {
    return new Date(value);
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
  issue.created = new Date();
  if (issue.status == undefined) {
    issue.status = "New";
  }
  issue.id = issuesDB.length + 1;
  issuesDB.push(issue);
  return issue;
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
    });
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });
  } catch (err) {
    console.log("ERROR: Server has error:", err);
  }
})();
