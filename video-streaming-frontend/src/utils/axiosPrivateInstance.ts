import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { encrypt } from "./encryption";

const axiosPrivateInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Add a request interceptor
axiosPrivateInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get the current session from Amplify
      const session = await fetchAuthSession();
      const token = String(session.tokens?.accessToken.toString());

      // Encrypt the token
      const encryptedToken = encrypt(token);

      // Attach the encrypted token to the request headers
      config.headers["Authorization"] = `Bearer ${encryptedToken}`;
    } catch (error) {
      console.error("Error getting session or encrypting token: ", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosPrivateInstance;
