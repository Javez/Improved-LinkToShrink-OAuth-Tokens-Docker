const axios = require('axios');
const encodedParams = new URLSearchParams();
import dotenv from 'dotenv';

dotenv.config();

const options = {
  method: 'POST',
  url: process.env.API_URL,
  headers: {
    'content-type': process.env.CONTENT_TYPE,
    'X-RapidAPI-Key': process.env.X_RAPID_API_KEY,
    'X-RapidAPI-Host': process.env.X_RAPID_API_HOST
  },
  data: encodedParams
};

const shrinkLink = async (url: string) => {
  encodedParams.set('url', url);
  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export default shrinkLink;
