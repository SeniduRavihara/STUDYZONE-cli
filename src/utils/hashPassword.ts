import SHA256 from 'crypto-js/sha256';

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = SHA256(password).toString();
  return hashedPassword;
};
