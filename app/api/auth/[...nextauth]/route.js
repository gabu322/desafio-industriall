import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import axios from "axios";


const handler = NextAuth({
    // Configure one or more authentication providers
    providers: [
        // ...add more providers here
        CredentialsProvider({
            // The name to display on the sign-in form (e.g., "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign-in page.
            // You can specify which fields should be submitted by adding keys to the `credentials` object.
            // e.g., domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                userName: {
                    label: "Username",
                    type: "text",
                    placeholder: "jsmith",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials, req) {
                const { userName, password } = credentials;
                const res = await fetch("https://desafio-iall.azurewebsites.net/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userName,
                        password,
                    }),
                });
                const user = await res.json();


                if (res.ok && user) {
                    return user;
                } else return null;
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            session.user = token;

            let infos = {
                token: token.token,
                id: token.user.id,
                userName: token.user.userName,
                fullName: token.user.fullName,
                email: token.user.email,
            }
            session.infos = infos;
            return session;
        },
    },

    // pages: {
    //     signIn: "/auth/login",
    // },
});


export { handler as GET, handler as POST }
