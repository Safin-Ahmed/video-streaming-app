import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.ENCRYPTION_SECRET || "";

console.log({ secretKey });

export const encrypt = (text: string) => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const decrypt = (cipherText: string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  console.log({ bytes });
  return bytes.toString(CryptoJS.enc.Utf8);
};
