import axios from "axios";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import jwksClient from "jwks-rsa";

dotenv.config();

const cognitoJwksUrl = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

export function getJWKSKey(): jwt.GetPublicKeyOrSecret | undefined {
  try {
    const client = jwksClient({
      jwksUri: cognitoJwksUrl,
    });

    const getKey = (header: any, callback: any) => {
      client.getSigningKey(header.kid, (err, key) => {
        if (err) {
          return callback(err, null);
        }
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
      });
    };

    return getKey;
  } catch (error: any) {
    console.error("Error verifying JWT token: ", error.message);
  }
}
