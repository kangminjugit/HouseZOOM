import axios from 'axios';

const client = axios.create({
  baseURL: 'http://3.35.141.211:3000',
});

export default client;
