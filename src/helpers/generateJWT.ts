import jwt from 'jsonwebtoken';

// Generate token
export const generateJWT = (
   payload: any,
   secret: string,
   expiresIn: string
) => {
   return jwt.sign(payload, secret, { expiresIn });
};
