import "server-only";
import crypto from "crypto";
const ALGORITHM = "aes-256-cbc";

export const encrypt = async (value: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("Encryption key not found");
  }
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, "hex"), iv);
  let encrypted = cipher.update(value);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = async (value: string) => {
  const textParts = value.split(":");
  const iv = Buffer.from(textParts.shift()!, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("Encryption key not found");
  }
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(key, "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
