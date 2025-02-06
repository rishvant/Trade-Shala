import { Client, Account, OAuthProvider } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // The Appwrite API endpoint
  .setProject("67a36cce002b7c3eb65c"); // Your Appwrite project IDexport const account = new Account(client)
const account = new Account(client);
export { Client, account, OAuthProvider };
