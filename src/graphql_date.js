const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const GraphQLDate = new GraphQLScalarType({
  name: "GraphQLDate",
  description: "Convert a Date() into ISOString()",
  serialize(value) {
    return value.toISOString();
  },
});

module.exports = GraphQLDate;
