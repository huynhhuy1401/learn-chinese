import type { CodegenConfig } from '@graphql-codegen/cli';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql';

const config: CodegenConfig = {
  schema: API_URL,
  documents: [
    'src/graphql/operations.ts',
    'src/graphql/operations/**/*.ts',
  ],
  generates: {
    'src/graphql/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
    'src/graphql/schema.graphql': {
      plugins: ['schema-ast'],
      config: { includeDirectives: false },
    },
  },
  config: {
    useTypeImports: true,
    dedupeFragments: true,
    nonOptionalTypename: true,
    scalars: {
      DateTime: 'string',
    },
  },
};

export default config;