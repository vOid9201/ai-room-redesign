import bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPassword = async plainText => {
  const hashedText = await bcrypt.hash(plainText, saltRounds);
  return hashedText;
};
