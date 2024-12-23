import jwt from "jsonwebtoken";

export function newToken(code: string, clientId: string): string {

  return jwt.sign(
    {
      code,
      aud: clientId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  
}