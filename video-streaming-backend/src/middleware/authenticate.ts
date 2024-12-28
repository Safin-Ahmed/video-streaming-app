import { NextFunction, Request, Response } from "express";
import { decrypt } from "../utils/encryption";
import jwt from "jsonwebtoken";
import { getJWKSKey } from "../utils/jwt";

interface CustomRequest extends Request {
  user?: string | object;
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  console.log({ authHeader });
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  console.log("Request Object in auth middleware", req.files);

  const token = String(authHeader).split(" ")[1];

  console.log({ token });

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    // Decrypt the token
    const decryptedToken = decrypt(token);

    console.log({ decryptedToken });

    // Verify the JWT Token
    const getKey = getJWKSKey();

    jwt.verify(
      decryptedToken,
      getKey!,
      { algorithms: ["RS256"] },
      (err, decoded) => {
        if (err) {
          console.error("Error while verifying the jwt token", err);
          throw err;
        }

        // Attach user info to request object
        (req as CustomRequest).user = decoded;
      }
    );
    next();
  } catch (error) {
    console.error("Error while decrypting the token", error);
    return res.status(401).json({ message: "Authentication Failed" });
  }
};

export default authenticate;
