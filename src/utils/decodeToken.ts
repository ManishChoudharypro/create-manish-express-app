import jwt from 'jsonwebtoken';
const { ENCRYPTION_KEY } = process.env,
  decodeToken = async (authToken: string) => {
    try {
      const token: any = authToken.split(' ')[1].toString().trim();
      let decoded = jwt.verify(token, ENCRYPTION_KEY.trim());
      if (decoded) {
        return decoded;
      } else {
        return false;
      }
    } catch (err) {
      return err;
    }
  };
export default decodeToken;
