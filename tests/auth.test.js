import 'dotenv/config';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { BASE_URL } from '../utils/auth.js';
import { getToken } from "../utils/auth.js";


//Helper generateUserData, helps to generate random user datafor registration tests.
function generateUserData(overrides={}) {
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
// Helper function to register a user with given payload
 async function registerUser(payload) {
    return axios.post(`${BASE_URL}/auth/register`,payload);
    }

// REGISTER ENDPOINT TESTS
describe('POST /auth/register',()=>{
    
test ('Register a user successfully with valid credentials',async () =>{
const user=generateUserData();
const res = await registerUser(user);
//status code
expect(res.status).toBe(201);
// field validation
expect(res.data).toHaveProperty('status');
expect(res.data).toHaveProperty('message');
expect(res.data).toHaveProperty('status_code');
// data type validation
expect(typeof res.data.status).toBe('string');
expect(typeof res.data.message).toBe('string');
expect(typeof res.data.status_code).toBe('number');
});

// NEGATIVE TESTS
 test('Fail to register a user with an already registered email',async () =>{
    const user=generateUserData();
    // First , register the user
    await registerUser(user);
    // Attempt to register the same user again
    try{
        await registerUser(user);
         throw new Error('Expected request to fail but it succeeded');
    } 
    catch (error) {
      if (!error.response) throw error;

      expect([400, 409,]).toContain(error.response.status);
      expect(error.response.data).toHaveProperty('message');
      expect(typeof error.response.data.message).toBe('string');
    }
  });

test('Fail to register a user with missing email field',async ()=>{
    const user = generateUserData();
    delete user.email;
    try {
        await registerUser(user); 
         throw new Error('Expected request to fail but it succeeded');
    } 
    catch (error) {
       if (!error.response) throw error;
      expect([400, 409, 422]).toContain(error.response.status);
      expect(error.response.data).toHaveProperty('message');
      expect(typeof error.response.data.message).toBe('string');
    }
  }); 
   

test ('Fail to register user with missing password field', async ()=>{
    const user = generateUserData();
    //delete the password field
    delete user.password;
    try {
    await registerUser(user);
     throw new Error('Expected request to fail but it succeeded');
    } 
    catch (error) {
      if (!error.response) throw error;
      expect([400, 409, 422]).toContain(error.response.status);
      expect(error.response.data).toHaveProperty('message');
      expect(typeof error.response.data.message).toBe('string');
    }
  });

test ('Fail to register user with missing username field', async ()=>{
    const user = generateUserData();
    //delete the username field
    delete user.username;
    try {
    await registerUser(user);
     throw new Error('Expected request to fail but it succeeded');
    } 
    catch (error) {
      if (!error.response) throw error;
      expect([400, 409, 422]).toContain(error.response.status);
      expect(error.response.data).toHaveProperty('message');
      expect(typeof error.response.data.message).toBe('string');
    }
  });

test ('Fail to register user with missing first_name field', async ()=>{
    const user = generateUserData();
    //delete the first name field
    delete user.first_name;
    try {
    await registerUser(user);
     throw new Error('Expected request to fail but it succeeded');
    } 
    catch (error) {
      if (!error.response) throw error;
      expect([400, 409, 422]).toContain(error.response.status);
      expect(error.response.data).toHaveProperty('message');
      expect(typeof error.response.data.message).toBe('string');
    }
});

test ('Fail to register user with missing last_name field', async ()=>{
    const user = generateUserData();
    //delete the lastname field
    delete user.last_name;
    try {
    await registerUser(user);
     throw new Error('Expected request to fail but it succeeded');
    } 
    catch (error) {
       if (!error.response) throw error;
      expect([400, 409, 422]).toContain(error.response.status);
      expect(error.response.data).toHaveProperty('message');
      expect(typeof error.response.data.message).toBe('string');
    }
});
 
test ('Fail to register a user with invalid email format', async () =>{
    const user = generateUserData({email:'invalid-email'});
    try{
        await registerUser(user);
         throw new Error('Expected request to fail but it succeeded');
    } 
    catch (error) {
       if (!error.response) throw error;
      expect([400, 409, 422]).toContain(error.response.status);
      expect(error.response.data).toHaveProperty('message');
      expect(typeof error.response.data.message).toBe('string');
    }
  });

// EDGE CASES

test ('should treat both lowercase and uppercase email as duplicates', async () =>{
   
    const user = generateUserData();
    const Lower_case_Email=user.email.toLowerCase();
    const Upper_case_Email=user.email.toUpperCase();

    // Register with lowercase
    await registerUser({...user, email:Lower_case_Email});
   // Register with uppercase
try{
    await registerUser({...user, email:Upper_case_Email});
        throw new Error('Expected request to fail but it succeeded');
}
catch (error){
    if (!error.response) throw error;
    expect([400, 422]).toContain(error.response.status);
      expect(error.response.data).toHaveProperty('message');
      expect(typeof error.response.data.message).toBe('string');
}
});

test('Fail to register user with password one character below minimum', async ()=>{
    const user = generateUserData({password:'abc123'});
    try{
        await registerUser(user);
         throw new Error('Expected request to fail but it succeeded');
    } catch (error) {
       if (!error.response) throw error;
      expect([400, 422]).toContain(error.response.status);
      expect(error.response.data).toHaveProperty('message');
      expect(typeof error.response.data.message).toBe('string');
    }
  });
test('Fail to register user with phone number including letters', async ()=>{
    const user = generateUserData({phone_number:'12345abcde'});
    try{
        await registerUser(user);
         throw new Error('Expected request to fail but it succeeded');
    } catch (error) {if (!error.response) throw error;
      expect([400, 422]).toContain(error.response.status);
      expect(error.response.data).toHaveProperty('message');
      expect(typeof error.response.data.message).toBe('string');
    }
  });
  test('Fail to register user with missing phone number field', async ()=>{
    const user = generateUserData();
    delete user.phone_number;
    try{
        await registerUser(user);
         throw new Error('Expected request to fail but it succeeded');
    } catch (error) {if (!error.response) throw error;
      expect([400, 422]).toContain(error.response.status);
      expect(error.response.data).toHaveProperty('message');
      expect(typeof error.response.data.message).toBe('string');
    }

});
});


// LOGIN TESTS
describe('POST/auth/login',()=>{
  // POSITIVE TEST
test('Login successfully with valid credentials', async ()=>{

  const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
    email: process.env.TEST_EMAIL,
    password: process.env.TEST_PASSWORD,
  });
  
  // status code
  expect(loginResponse.status).toBe(200);

  // field presence
  expect(loginResponse.data).toHaveProperty('status');
  expect(loginResponse.data).toHaveProperty('message');
  expect(loginResponse.data).toHaveProperty('data');
  expect(loginResponse.data.data).toHaveProperty('access_token');
  expect(loginResponse.data.data).toHaveProperty('user');

  // field values
  expect(loginResponse.data.status).toBe('success');
  expect(loginResponse.data.status_code).toBe(200);
  expect(loginResponse.data.data.access_token).toBeTruthy();
  expect(loginResponse.data.data.user.email).toBe(process.env.TEST_EMAIL);

  // data types
  expect(typeof loginResponse.data.status).toBe('string');
  expect(typeof loginResponse.data.message).toBe('string');
  expect(typeof loginResponse.data.status_code).toBe('number');
  expect(typeof loginResponse.data.data.access_token).toBe('string');
  expect(typeof loginResponse.data.data.user.is_verified).toBe('boolean');
  expect(typeof loginResponse.data.data.user.is_onboarded).toBe('boolean');
});

// NEGATIVE TESTS

test('Fail to login with incorrect password', async ()=>{
  try{
 await axios.post(`${BASE_URL}/auth/login`, {
    email: process.env.TEST_EMAIL,
    password: faker.internet.password(), // random incorrect password
  }); throw new Error('Expected request to fail but it succeeded');
  } catch (error) {
    if (!error.response) throw error;
    expect([400, 401]).toContain(error.response.status);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
 });

 test('fail to login with unregistered email',async ()=>{
try{
  await axios.post(`${BASE_URL}/auth/login`, {
    email: faker.internet.email().toLowerCase(),
    password: process.env.TEST_PASSWORD,
  }); throw new Error('Expected request to fail but it succeeded');
} catch (error) {  if (!error.response) throw error;
  expect([400, 401]).toContain(error.response.status);
  expect(error.response.data).toHaveProperty('message');
  expect(typeof error.response.data.message).toBe('string');
}

 });

 test('Fail to login with missing email field', async ()=>{

  try{
    await axios.post(`${BASE_URL}/auth/login`, {
      password: process.env.TEST_PASSWORD,
    });
  } catch (error) {  if (!error.response) throw error;
    expect([400, 422]).toContain(error.response.status);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
});

test('Fail to login with missing password field', async ()=>{
  try{    await axios.post(`${BASE_URL}/auth/login`, {
      email: process.env.TEST_EMAIL,
    });
  } catch (error) {  if (!error.response) throw error;
    expect([400, 422]).toContain(error.response.status);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
});

test('Fail to login with invalid email format', async ()=>{
  try{
    await axios.post(`${BASE_URL}/auth/login`, {
      email: 'invalid-email',
      password: process.env.TEST_PASSWORD,
    });
  } catch (error) {  if (!error.response) throw error;
    expect([400, 422]).toContain(error.response.status);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
});

// EDGE CASES

test('Fail to login with both email and password missing', async ()=>{
  try{
    await axios.post(`${BASE_URL}/auth/login`, {
      email: '',
      password: '',
    });
  } catch (error) {  if (!error.response) throw error;
    expect([400, 422]).toContain(error.response.status);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
});
});

// CHANGE PASSWORD TESTS
// Helper function to register a new user and get their credentials
async function registerAndGetCredentials() {
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

describe('PUT /auth/change-password',()=>{
  // POSITIVE TESTS

  test('Successfully change password with valid current and new passwords', async ()=>{
    // Register a new userand get credentials
    const credentials = await registerAndGetCredentials();
    // Login to get the access token
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: credentials.email,
      password: credentials.password,
    });
    const token = loginResponse.data.data.access_token;
    // Attempt to change password
    const newPassword = faker.internet.password();
    const ChangePasswordResponse = await axios.put(`${BASE_URL}/auth/change-password`, {
      old_password: credentials.password,
      new_password: newPassword,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
   //Status code validation
    expect(ChangePasswordResponse.status).toBe(200);
   // field presence
    expect(ChangePasswordResponse.data).toHaveProperty('status');
    expect(ChangePasswordResponse.data).toHaveProperty('message');
    expect(ChangePasswordResponse.data).toHaveProperty('status_code');

    // field values
    expect(ChangePasswordResponse.data.status).toBe('success');
    expect(ChangePasswordResponse.data.message).toBe('Password updated successfully');
    expect(ChangePasswordResponse.data.status_code).toBe(200);

    // data types
    expect(typeof ChangePasswordResponse.data.status).toBe('string');
    expect(typeof ChangePasswordResponse.data.message).toBe('string');
    expect(typeof ChangePasswordResponse.data.status_code).toBe('number');
  });

  test('Successfully change password and verify login with new password', async ()=>{
  // Register a new user and get credentials
  const credentials = await registerAndGetCredentials();
  //Login to get the access token
  const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
    email: credentials.email,
    password: credentials.password
  });
  const token = loginResponse.data.data.access_token;
  // Change password
  const newPassword = faker.internet.password();
  const ChangePasswordResponse = await axios.put(`${BASE_URL}/auth/change-password`, {
    old_password: credentials.password,
    new_password: newPassword,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  // Login with new password to verifyit works
    const newLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: credentials.email,
      password: newPassword
    });
    //Status code validation
    expect(newLoginResponse.status).toBe(200);
    // field presence
    expect(newLoginResponse.data).toHaveProperty('status');
    expect(newLoginResponse.data).toHaveProperty('message');
    expect(newLoginResponse.data).toHaveProperty('data');
    expect(newLoginResponse.data.data).toHaveProperty('access_token');
    expect(newLoginResponse.data.data).toHaveProperty('user');
    // field values
    expect(newLoginResponse.data.status).toBe('success');
    expect(newLoginResponse.data.status_code).toBe(200);
    expect(newLoginResponse.data.data.access_token).toBeTruthy();
    expect(newLoginResponse.data.data.user.email).toBe(credentials.email);
  });


// NEGATIVE TESTS
test('Fail to change password with incorrect old password', async ()=>{
  
  // Register a new user and get credentials
  const credentials = await registerAndGetCredentials();
  //Login to get the access token
  const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
    email: credentials.email,
    password: credentials.password
  });
  const token = loginResponse.data.data.access_token;
  // Attempt to change password with incorrect old password
  try{
    await axios.put(`${BASE_URL}/auth/change-password`, {
      old_password: 'incorrect_password',
      new_password: faker.internet.password()
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    if (!error.response) throw error;
    expect([400, 422]).toContain(error.response.status);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
});

test('Fail to change password with missing old_password field', async ()=>{
  // Register a new user and get credentials
  const credentials = await registerAndGetCredentials();
  //Login to get the access token
  const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
    email: credentials.email,
    password: credentials.password
  });
  const token = loginResponse.data.data.access_token;
  // Attempt to change password with missing old_password field
  try{
    await axios.put(`${BASE_URL}/auth/change-password`, {
      new_password: faker.internet.password()
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    if (!error.response) throw error;
    expect([400, 422]).toContain(error.response.status);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
});
test('Fail to change password with missing new_password field', async ()=>{
  // Register a new user and get credentials
  const credentials = await registerAndGetCredentials();
  //Login to get the access token
  const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
    email: credentials.email,
    password: credentials.password
  });
  const token = loginResponse.data.data.access_token;
  // Attempt to change password with missing new_password field
  try{
    await axios.put(`${BASE_URL}/auth/change-password`, {
      old_password: credentials.password,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    if (!error.response) throw error;
    expect([400, 422]).toContain(error.response.status);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
});
test('Fail to change password with no authorization token', async ()=>{
  const credentials = await registerAndGetCredentials();
  const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
    email: credentials.email,
    password: credentials.password
  });
  const token = loginResponse.data.data.access_token;
  try{
    await axios.put(`${BASE_URL}/auth/change-password`, {
      old_password: credentials.password,
      new_password: faker.internet.password()
    });
  } catch (error) {
    if (!error.response) throw error;
    expect(error.response.status).toBe(401);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
});
test('Fail to change password with invalid authorization token', async ()=>{
  const credentials = await registerAndGetCredentials();
  const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
    email: credentials.email,
    password: credentials.password
  });
  const token = loginResponse.data.data.access_token;
  try{
    await axios.put(`${BASE_URL}/auth/change-password`, {
      old_password: credentials.password,
      new_password: faker.internet.password()
    }, {
      headers: {
        Authorization: `Bearer ${token}invalid_token`
      }
    });
  } catch (error) {
    if (!error.response) throw error;
    expect(error.response.status).toBe(401);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
});

// EDGE CASE
   test('Successfully change password and verify login fails with old password', async ()=>{
    // Register a new user and get credentials
    const credentials = await registerAndGetCredentials();
    //Login to get the access token
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: credentials.email,
      password: credentials.password
    });
    const token = loginResponse.data.data.access_token;
    // Change password
    const newPassword = faker.internet.password();
    const ChangePasswordResponse = await axios.put(`${BASE_URL}/auth/change-password`, {
      old_password: credentials.password,
      new_password: newPassword,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // Attempt to login with old password - should fail
    try{
      await axios.post(`${BASE_URL}/auth/login`, {
        email: credentials.email,
        password: credentials.password
      });
    } catch (error) {
      if (!error.response) throw error;
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('message');
      expect(typeof error.response.data.message).toBe('string');
    }
  });
  });


  
// LOGOUT TESTS
describe('/POST /auth/logout',()=>{
  // POSITIVE TEST

 test('Successfully logout with valid token and platform header', async ()=>{
   const token = await getToken();
   const response = await axios.post(`${BASE_URL}/auth/logout`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Platform': 'web'
    }
    });
    // Status code validation
    expect(response.status).toBe(200);
    // Field presence
    expect(response.data).toHaveProperty('status');
    expect(response.data).toHaveProperty('message');
    expect(response.data).toHaveProperty('status_code');
    // Field values
    expect(response.data.status).toBe('success');
    expect(response.data.status_code).toBe(200);
    // Data types
    expect(typeof response.data.status).toBe('string');
    expect(typeof response.data.message).toBe('string');
    expect(typeof response.data.status_code).toBe('number');
  });


// NEGATIVE TESTS

test('Fail to logout with missing platform header', async ()=>{
  const token = await getToken();
  try{
    await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }); throw new Error('Expected request to fail but it succeeded');
  } catch (error) {if (!error.response) throw error;
    expect(error.response.status).toBe(400);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
});

test('Fail to logout with no authorization token', async ()=>{
  try{    await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: {
        'X-Platform': 'web'
      }
    });  throw new Error('Expected request to fail but it succeeded');
  } catch (error) {if (!error.response) throw error;
    expect(error.response.status).toBe(401);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
  });
test('Fail to logout with invalid authorization token', async ()=>{
  const token = await getToken();
  try{    await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer invalid_token`,
        'X-Platform': 'web'
      }
    }); throw new Error('Expected request to fail but it succeeded');
  }
  catch (error) { if (!error.response) throw error;
    expect(error.response.status).toBe(401);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
});


// EDGE CASE

test('Fail to logout with invalid platform header value', async ()=>{
  const token = await getToken();
  try{    
    await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Platform': 'invalid_platform'
      }
    });  throw new Error('Expected request to fail but it succeeded');
  } catch (error) { if (!error.response) throw error;
    expect(error.response.status).toBe(400);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
});

test('Successfully logout and verify token is invalidated', async ()=>{
  const token = await getToken();
  const response = await axios.post(`${BASE_URL}/auth/logout`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Platform': 'web'
    }
  });
  expect(response.status).toBe(200);
  // Attempt to access a protected endpoint with the same token - should fail
  try{ await axios.get(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }); throw new Error('Expected request to fail but it succeeded');
  } catch (error) { if (!error.response) throw error;
    expect(error.response.status).toBe(401);
    expect(error.response.data).toHaveProperty('message');
    expect(typeof error.response.data.message).toBe('string');
  }
});


});
