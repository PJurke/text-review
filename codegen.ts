import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: 'app/api/graphql/graphql-schema.gql',
    documents: ['{app,services}/**/*.ts?(x)'],
    generates: {
        'lib/graphql/generated/': {
            preset: 'client',
            plugins: [  ]
        }
    },
}

export default config;