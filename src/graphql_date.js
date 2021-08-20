const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

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

module.exports = GraphQLDate;
