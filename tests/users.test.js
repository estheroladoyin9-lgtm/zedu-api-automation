import 'dotenv/config';
import axios from 'axios';
import { getToken, BASE_URL} from '../utils/auth.js';
import { faker } from '@faker-js/faker';

// Retrieve Current user
describe('GET /users/me', () => {
   
  let token; 

  beforeAll(async () => {
    token = await getToken();
  });
  // POSITIVE TESTS
  test('should return authenticated user profile successfully', async () => {
    const response = await axios.get(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // status code
    expect(response.status).toBe(200);

    // field presence
    expect(response.data.data.user).toHaveProperty('id');
    expect(response.data.data.user).toHaveProperty('first_name');
    expect(response.data.data.user).toHaveProperty('last_name');
    expect(response.data.data.user).toHaveProperty('username');

    // data types
    expect(typeof response.data.data.user.id).toBe('string');
    expect(typeof response.data.data.user.first_name).toBe('string');
    expect(typeof response.data.data.user.last_name).toBe('string');
    expect(typeof response.data.data.user.username).toBe('string');

    // field values — id must not be empty
    expect(response.data.data.user.id).toBeTruthy();
  });


// NEGATIVE TESTS

  test('should fail to get user profile with no token', async () => {
    try {
      await axios.get(`${BASE_URL}/users/me`);
      throw new Error('Expected request to fail with no token but API accepted it');
    } catch (error) {
      if (!error.response) throw error;

      // status code
      expect(error.response.status).toBe(401);

      // field presence
      expect(error.response.data).toHaveProperty('status');
      expect(error.response.data).toHaveProperty('message');
      expect(error.response.data).toHaveProperty('status_code');

      // field values
      expect(error.response.data.status).toBe('error');
      expect(error.response.data.status_code).toBe(401);

      // data types
      expect(typeof error.response.data.message).toBe('string');
    }
  });

  test('should fail to get user profile with invalid token', async () => {
    const invalidToken = faker.string.alphanumeric(30); // generate a random invalid token
    try {
      await axios.get(`${BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${invalidToken}`, 
        },
      });
      throw new Error('Expected request to fail with invalid token but API accepted it');
    } catch (error) {
      if (!error.response) throw error;

      // status code
      expect(error.response.status).toBe(401);

      // field presence
      expect(error.response.data).toHaveProperty('status');
      expect(error.response.data).toHaveProperty('message');
      expect(error.response.data).toHaveProperty('status_code');

      // field values
      expect(error.response.data.status).toBe('error');
      expect(error.response.data.status_code).toBe(401);

      // data types
      expect(typeof error.response.data.message).toBe('string');
    }
  });
// EDGE CASE
 test('should return same user data on multiple consecutive calls', async () => {
    const headers = { Authorization: `Bearer ${token}` };

    // call the endpoint twice with same token
    const res1 = await axios.get(`${BASE_URL}/users/me`, { headers });
    const res2 = await axios.get(`${BASE_URL}/users/me`, { headers });

    // both must succeed
    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);

    // both must return the same user
    expect(res1.data.data.user.id).toBe(res2.data.data.user.id);
    expect(res1.data.data.user.first_name).toBe(res2.data.data.user.first_name);
    expect(res1.data.data.user.last_name).toBe(res2.data.data.user.last_name);
    expect(res1.data.data.user.username).toBe(res2.data.data.user.username);
  });

  test('should not expose sensitive fields like password', async () => {
    const response = await axios.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // status code
    expect(response.status).toBe(200);

    // password must NEVER be returned
    expect(response.data.data.user).not.toHaveProperty('password');
    expect(response.data.data.user).not.toHaveProperty('access_token');
  });

  test('should fail with empty Authorization header', async () => {
    try {
      await axios.get(`${BASE_URL}/users/me`, {
        headers: { Authorization: '' },
      });
      throw new Error('Expected request to fail with empty Authorization but API accepted it');
    } catch (error) {
      if (!error.response) throw error;

      // status code
      expect([400, 401]).toContain(error.response.status);

      // field presence
      expect(error.response.data).toHaveProperty('message');

      // data types
      expect(typeof error.response.data.message).toBe('string');
    }
  });

});
