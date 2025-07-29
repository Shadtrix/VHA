import { gapi } from "gapi-script";

const CLIENT_ID = "your-client-id.apps.googleusercontent.com";
const API_KEY = "your-api-key";
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

export const initGapiClient = () => {
  return new Promise((resolve, reject) => {
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
          ],
          scope: SCOPES,
        })
        .then(() => resolve(gapi))
        .catch(reject);
    });
  });
};

export const signIn = () => gapi.auth2.getAuthInstance().signIn();

export const listLabels = async () => {
  const response = await gapi.client.gmail.users.labels.list({ userId: "me" });
  return response.result.labels;
};
