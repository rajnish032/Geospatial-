

import isTokenExpired from "../utils/isTokenExpired.js";

const setAuthHeader = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (accessToken && !isTokenExpired(accessToken)) {
      //  Add the access token to the Authorization header
      req.headers['authorization'] = `Bearer ${accessToken}`;
    }
    
    next();
  } catch (error) {
    console.error('Error adding access token to header:', error.message);
    res.status(401).json({ error: 'Unauthorized', message: 'Failed to set authorization header' });
  }
};

export default setAuthHeader;
