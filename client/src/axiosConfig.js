import axios from 'axios';

const client = axios.create({
  baseURL: 'http://13.125.141.137:3000',
});

export default client;
