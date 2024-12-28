import { Amplify, ResourcesConfig } from "aws-amplify";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { defaultStorage } from "aws-amplify/utils";

cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);

console.log(process.env.NEXT_PUBLIC_USER_POOL_ID);
console.log(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID);

export const authConfig: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
    userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
  },
};

Amplify.configure(
  {
    Auth: authConfig,
  },
  { ssr: true }
);

export default function ConfigureAmplify() {
  return null;
}
