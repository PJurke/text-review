import { GraphQLScalarType, Kind } from "graphql";

const jsonScalar = new GraphQLScalarType({
    name: 'JSON',
    description: 'A JSON scalar type',
    serialize(value) {
        return value;
    },
    parseValue(value) {
        return value;
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING)
            return JSON.parse(ast.value);
        return null;
    }
});

export default jsonScalar;