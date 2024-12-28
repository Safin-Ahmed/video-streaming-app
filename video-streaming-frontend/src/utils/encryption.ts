import CryptoJS from "crypto-js";

const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";

export const encrypt = (text: string) => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const decrypt = (cipherText: string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
