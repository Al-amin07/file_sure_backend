import * as argon2 from 'argon2';

export const hashPassword = async (password: string): Promise<string> => {
  const hash = await argon2.hash(password);
  return hash;
};

export const verifyPassword = async (
  hashedPassword: string,
  plainPassword: string,
): Promise<boolean> => {
  return await argon2.verify(hashedPassword, plainPassword);
};
