import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import argon2 from "argon2"
import { Provider } from "@prisma/client"
import { SiweMessage } from "siwe"
import { getCsrfToken } from "next-auth/react"
import { getStartingBalance } from "@/lib/serv-utils"
import prisma from "@/prisma/db"


export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: "Email",
        credentials: {
          email: {
            label: "Email",
            type: "email",
            placeholder: "me@example.com",
          },
          password: {
            label: "Password",
            type: "password",
            placeholder: "supersecret",
          },
        },
        async authorize(credentials) {
          if (!credentials) return null
          const user = await prisma.user.findFirst({
            where: { email: credentials.email },
          })
  
          if (
            user &&
            user.password &&
            (await argon2.verify(user.password, credentials.password))
          ) {
            return { id: user.id, name: user.email }
          }
  
          return null
        },
      }),
      CredentialsProvider({
        name: "Ethereum",
        credentials: {
          message: {
            label: "Message",
            type: "text",
            placeholder: "0x0",
          },
          signature: {
            label: "Signature",
            type: "text",
            placeholder: "0x0",
          },
        },
        async authorize(credentials, req) {
          if (!credentials) return null
          try {
            const siwe = new SiweMessage(JSON.parse(credentials.message || "{}"))
            const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!)
  
            const result = await siwe.verify({
              signature: credentials.signature || "",
              domain: nextAuthUrl.host,
              nonce: await getCsrfToken({ req }),
            })
  
            if (result.success) {
              let user = await prisma.user.findFirst({
                where: { address: siwe.address },
              })
              if (!user) {
                user = await prisma.user.create({
                  data: {
                    address: siwe.address,
                    provider: Provider.WALLET,
                    balance: await getStartingBalance(),
                  },
                })
              }
              return {
                id: user.id,
                name: siwe.address,
              }
            }
            return null
          } catch (e) {
            return null
          }
        },
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      }),
    ],
    callbacks: {
      async signIn({ user, account }) {
        if (!user.email) return false
        const existingUser = await prisma.user.findFirst({
          where: { email: user.email },
        })
  
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              provider: Provider.GOOGLE,
              balance: await getStartingBalance(),
            },
          })
        }
  
        return true
      },
      async session({ session, token }) {
        const user = await prisma.user.findUnique({
          where: { id: token.userId },
        })
  
        if (!user) {
          throw new Error("User ID does not exist")
        }
  
        session.user.id = token.userId
  
        return session
      },
  
      async jwt({ token }) {
        if (token.email) {
          const user = await prisma.user.findUnique({
            where: { email: token.email },
          })
          if (!user) {
            throw new Error(`User with email ${token.email} not found`)
          }
          token.userId = user.id
        }
  
        return token
      },
    },
    session: {
      strategy: "jwt",
    },
  }