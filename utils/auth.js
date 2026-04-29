import 'dotenv/config';
import axios from 'axios';
import { faker } from '@faker-js/faker';

export const BASE_URL = process.env.BASE_URL;
 
 // Registers a fresh user, logs them in, and returns the access token.

export async function getToken() {
  const response = await axios.post(`${BASE_URL}/auth/login`, {
    email: process.env.TEST_EMAIL,
    password: process.env.TEST_PASSWORD,
  });

  const token = response.data?.data?.access_token;

  if (!token) {
    throw new Error(`Token not found in login response: ${JSON.stringify(response.data)}`);
  }

  return token;
}