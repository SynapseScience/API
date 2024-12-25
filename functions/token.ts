import jwt from "jsonwebtoken";

export function newToken(
  username: string, 
  code: string, appSignature: string): string {

  return jwt.sign(
    {
      username,
      code,
      aud: appSignature,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  
}