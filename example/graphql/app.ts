import { ApolloServer } from 'apollo-server-express';
import { Diesel, type ContextType } from 'diesel-core';
import { gql } from "apollo-server-express";

export const typeDefs = gql`
    type Query {
      hello: String
      add(a: Int!, b: Int!): Int
    }
  `;

const resolvers = {
    Query: {
        hello: () => 'Hello from GraphQL and Diesel.js!',
        add: (_: any, { a, b }: { a: number, b: number }) => a + b,
    },
};

export function applyGraphQL(app: Diesel, typeDefs: any, resolvers: any) {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        plugins: [],
        formatResponse: (response) => {
            if (response.http) delete response.http
            return response;
        }
    });

    server.start().then(() => {
        app.post('/graphql', async (ctx: ContextType) => {
            try {
                const body = await ctx.body

                const result = await server.executeOperation({
                    query: body?.query,
                    variables: body?.variables,
                });

                return ctx.json(result);
            } catch (error) {
                console.log('err ', error);
                return ctx.json({ error })
            }
        });
    });
}

const app = new Diesel({
    logger: true
});

app
    .get("/", (ctx: ContextType) => ctx.send("Hello graphql"));


applyGraphQL(app, typeDefs, resolvers);

app.listen(3000, () => console.log("GraphQL server running on http://localhost:3000/"));