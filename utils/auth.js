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

//Helper generateUserData, helps to generate random user data for registration tests.
export async function generateUserData(overrides={}) {
    return{
        username:faker.internet.username().replace(/[^a-zA-Z0-9_]/g, '_'),
        email:faker.internet.email(),
        password:process.env.TEST_PASSWORD,
        first_name:faker.person.firstName(),
        last_name:faker.person.lastName(),
        phone_number: faker.phone.number({ style: 'international' }),
        ...overrides,
    };
}
// Helper function to register a user with given payload for registration tests.
 export async function registerUser(payload) {
    return axios.post(`${BASE_URL}/auth/register`,payload);
    }


// Helper function to register a new user and get their credentials for Change password tests.
export async function registerAndGetCredentials() {
  const credentials = {
    email: faker.internet.email().toLowerCase(),
    password: process.env.TEST_PASSWORD,
  };
  await axios.post(`${BASE_URL}/auth/register`, {
    username: faker.internet.username().replace(/[^a-zA-Z0-9_]/g, '_'),
    email: credentials.email,
    password: credentials.password,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    phone_number: faker.phone.number({ style: 'international' }),
  });

  return credentials;
}

// Helper function to generate random organization data for Organisation tests.
export async function generateOrgData() {
    return {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        email: faker.internet.email().toLowerCase(),
        type: faker.helpers.arrayElement(['school', 'company', 'non-profit']),
        location: faker.location.city(),
        country: faker.location.country(),
        logo_url: faker.image.url(),
    };
}