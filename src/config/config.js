import dotenv from "dotenv";

dotenv.config()

export const githubClientId = process.env.GITHUB_CLIENT_ID
export const githubClientSecret = process.env.GITHUB_CLIENT_SECRET
export const githubCallbackUrl = process.env.GITHUB_CALLBACK_URL
export const mongoUser = process.env.MONGO_USER
export const mongoPassword = process.env.MONGO_PASSWORD
export const mongoSecret = process.env.MONGO_SECRET
