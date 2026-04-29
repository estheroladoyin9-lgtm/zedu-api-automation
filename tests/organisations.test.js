import 'dotenv/config';
import axios from 'axios';
import { getToken, BASE_URL,} from '../utils/auth.js';
import { faker } from '@faker-js/faker';


// Helper function to generate random organization data
function generateOrgData() {
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

describe ('POST /organisations', () => {
    // POSITIVE TEST

  test('should create a new organisation successfully', async () => {
    const token = await getToken();
    const orgData = generateOrgData();
    const response = await axios.post(`${BASE_URL}/organisations`, orgData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    // status code
    expect(response.status).toBe(201);

    // field presence 
    expect(response.data).toHaveProperty('status');
    expect(response.data).toHaveProperty('status_code');
    expect(response.data).toHaveProperty('message');
    expect(response.data).toHaveProperty('data');

    // field presence 
    expect(response.data.data).toHaveProperty('id');
    expect(response.data.data).toHaveProperty('name');
    expect(response.data.data).toHaveProperty('description');
    expect(response.data.data).toHaveProperty('email');
    expect(response.data.data).toHaveProperty('country');
    expect(response.data.data).toHaveProperty('location');
    expect(response.data.data).toHaveProperty('owner_id');
    expect(response.data.data).toHaveProperty('created_at');
    expect(response.data.data).toHaveProperty('updated_at');

    // field values 
    expect(response.data.status).toBe('success');
    expect(response.data.status_code).toBe(201);
    expect(response.data.message).toBe('Organisation Created Successfully');

    // data types
    expect(typeof response.data.status).toBe('string');
    expect(typeof response.data.message).toBe('string');
    expect(typeof response.data.status_code).toBe('number');
    expect(typeof response.data.data.id).toBe('string');
    expect(typeof response.data.data.name).toBe('string');
    expect(typeof response.data.data.owner_id).toBe('string');

    // id must not be empty
    expect(response.data.data.id).toBeTruthy();
    expect(response.data.data.owner_id).toBeTruthy();
    
});

// NEGATIVE TESTS

test('should fail to create organisation with no token', async () => {
  const orgData = generateOrgData();
    try {
        await axios.post(`${BASE_URL}/organisations`, orgData);
        throw new Error('Expected request to fail with no token but API accepted it');
    } catch (error) {
        if (!error.response) throw error;
        expect(error.response.status).toBe(401);
        expect(error.response.data).toHaveProperty('message');
        expect(typeof error.response.data.message).toBe('string');
    }
});
 test('should fail to create organisation with invalid token', async () => {
    const invalidToken = '{FAKE_INVALID_TOKEN}'; 
    const orgData = generateOrgData();
    try {      await axios.post(`${BASE_URL}/organisations`, orgData, {
        headers: {
          Authorization: `Bearer ${invalidToken}`, 
        },
      });
      throw new Error('Expected request to fail with invalid token but API accepted it');
    } catch (error) {
      if (!error.response) throw error;
      expect(error.response.status).toBe(401);
      expect(error.response.data).toHaveProperty('message');
      expect(typeof error.response.data.message).toBe('string');
    }

});
test('should fail to create organisation with missing email field', async () => {
  const token = await getToken();
  const orgData = generateOrgData();
  delete orgData.email;

  try {
    await axios.post(`${BASE_URL}/organisations`, orgData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    throw new Error('Expected request to fail with missing email but API accepted it');
  } catch (error) {
    if (!error.response) throw error;
    expect([400, 422]).toContain(error.response.status);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }

});

test('should fail to create organisation with invalid email format', async () => {
  const token = await getToken();
  const orgData = generateOrgData();
  orgData.email = 'invalid-email-format';

  try {
    await axios.post(`${BASE_URL}/organisations`, orgData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    throw new Error('Expected request to fail with invalid email format but API accepted it');
  } catch (error) {
    if (!error.response) throw error;
    expect([400, 422]).toContain(error.response.status);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
});

// EDGE CASE
test('should fail to create organisation with empty request', async () => {
    const token = await getToken();
    try {
        await axios.post(`${BASE_URL}/organisations`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }); throw new Error('Expected request to fail with empty body but API accepted it');
    } catch (error) {
        if (!error.response) throw error;
        expect(error.response.status).toBe(422);
        expect(error.response.data).toHaveProperty('message');
       expect(typeof error.response.data.message).toBe('string');
    }

});

});

