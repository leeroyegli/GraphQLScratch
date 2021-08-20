const fs = require("fs");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

let aboutMessage = "Issue Tracker API v.1.0";

const resolvers = {
  Query: {
    about: () => aboutMessage,
  },
  Mutation: {
    setAboutMessage,
  },
};

function setAboutMessage(_, { message }) {
  return (aboutMessage = message);
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
