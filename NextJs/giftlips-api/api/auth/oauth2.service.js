const axios = require("axios");
const queryString = require("querystring");

async function getAccessTokenFromCode(code) {
  const { data } = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.API_URL}/auth/google/redirect/`,
      grant_type: "authorization_code",
      code,
    },
  });
  console.log(data); // { access_token, expires_in, token_type, refresh_token }
  return data.access_token;
}

const createGoogleLoginUrl = async () => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.FRONTEND_URL}/auth/google/redirect/`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "), // space seperated string
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;
};

const getGoogleUserInfo = async (token) => {
  const { data } = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(data); // { id, email, given_name, family_name }
  return data;
};

module.exports = {
  getAccessTokenFromCode,
  createGoogleLoginUrl,
  getGoogleUserInfo,
};
