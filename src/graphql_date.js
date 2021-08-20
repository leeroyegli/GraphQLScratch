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

module.exports = GraphQLDate;
