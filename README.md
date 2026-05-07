![CI](https://github.com/estheroladoyin9-lgtm/zedu-api-automation/actions/workflows/ci.yml/badge.svg)

# Zedu API Automation Tests

A structured API test suite for the Zedu platform built with Jest and Axios.

---

## Project Overview

This project contains automated API tests for the Zedu platform (`https://zedu.chat`).
It covers authentication, user management, and organisation endpoints with positive,
negative, and edge case test scenarios.

The test suite was built using JavaScript with Jest as the testing framework and Axios
for making HTTP requests. Test data is dynamically generated using Faker to ensure
tests are independent, idempotent, and repeatable.

---

## Project Structure

`````
zedu-api-automation/
├── .github/
│   └── workflows/
│       └── ci.yml
├── tests/
│   ├── auth.test.js
│   ├── users.test.js
│   └── organisations.test.js
├── utils/
│   └── auth.js
├── .env.example
├── .gitignore
├── babel.config.js
├── package.json
└── README.md
`````

## Prerequisites

Make sure you have the following installed before running the project:

- **Node.js** v24 or higher (https://nodejs.org)
- **npm** (comes with Node.js)

To verify your versions:

```bash
node --version
npm --version
```

---

## Setup Instructions

**Step 1 — Clone the repository:**
```bash
git clone https://github.com/estheroladoyin9-lgtm/zedu-api-automation
cd zedu-api-automation
```

**Step 2 — Install dependencies:**
```bash
npm install
```

**Step 3 — Set up environment variables:**

Copy the example env file:
```bash
cp .env.example .env
```

On Windows:
```bash
copy .env.example .env
```

**Step 4 — Fill in your credentials in the `.env` file:**
```env
BASE_URL=https://api.staging.zedu.chat/api/v1
TEST_EMAIL=your_registered_email_here
TEST_PASSWORD=your_account_password_here
```

 Never commit your `.env` file. It is already listed in `.gitignore`.

---

## How to Run Tests Locally

**Run all test files:**
```bash
npm test
```

**Run a specific test file:**
```bash
npm test -- auth.test.js
npm test -- users.test.js
npm test -- organisations.test.js
```

**Run a specific test by name:**
```bash
npm test -- --testNamePattern="should login successfully"
```

---

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration.

The pipeline is located at `.github/workflows/ci.yml` and automatically:

- Triggers on every push and pull request to `main`
- Sets up Node.js v24
- Installs all dependencies via `npm install`
- Runs the full test suite via `npm test`
- Fails the build if any test fails
- Generates a JUnit XML test report
- Uploads test results as downloadable artifacts

Environment variables are stored as GitHub Secrets and injected
into the pipeline at runtime and never hardcoded.

**To view pipeline runs:**
Go to your repo → click the **Actions** tab

---

## Test Files

### `tests/auth.test.js`
Covers all authentication related endpoints:

| Endpoint | Tests Included |
|---|---|
| `POST /auth/register` | Valid registration, duplicate email, missing fields, invalid email format, password boundary, case sensitivity |
| `POST /auth/login` | Valid login, wrong password, non-existent email, missing fields, empty body |
| `PUT /auth/change-password` | Valid change, wrong old password, missing fields, login with new password, login with old password |
| `POST /auth/logout` | Valid logout across platforms, no token, malformed token, missing X-Platform, double logout, token invalidation |

### `tests/users.test.js`
Covers user profile endpoints:

| Endpoint | Tests Included |
|---|---|
| `GET /users/me` | Retrieve current user data, consistent data, no sensitive fields exposed, no token, expired token, empty auth header |

### `tests/organisations.test.js`
Covers organisation management endpoints:

| Endpoint | Tests Included |
|---|---|
| `POST /organisations` | Valid creation, empty body, no token, invalid token, missing email, invalid email format |

---

## Environment Variables

The following environment variables are required to run this project.
Add them to a `.env` file locally and as GitHub Secrets in CI.

| Variable | Description | Example |
|---|---|---|
| `BASE_URL` | Base URL of the Zedu API | `https://api.staging.zedu.chat/api/v1` |
| `TEST_EMAIL` | Email of your registered Zedu account | `john@gmail.com` |
| `TEST_PASSWORD` | Password of your registered Zedu account | `YourPassword123` |

---

## Key Design Decisions

- **No hardcoded credentials** — all sensitive values loaded from `.env` via `dotenv`
- **Single auth utility** — `utils/auth.js` contains all login, register and token logic, shared across all test files.
- **Independent tests** — every test is self-contained and does not depend on any other test running first
- **Idempotent tests** — dynamically generated data via `@faker-js/faker` ensures tests can be run multiple times without conflicts
- **Fresh users for auth tests** — register and change password tests create fresh users to avoid affecting the real account.
- **No hardcoded tokens** — tokens are always obtained programmatically via `getToken()`

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| `jest` | ^30.3.0 | Test framework |
| `axios` | ^1.15.2 | HTTP requests |
| `dotenv` | ^17.4.2 | Environment variable management |
| `@faker-js/faker` | ^10.4.0 | Dynamic test data generation |
| `@babel/core` | ^7.29.0 | Babel core for ESM support |
| `@babel/preset-env` | ^7.29.2 | Babel preset for modern JS |
| `babel-jest` | ^30.3.0 | Jest Babel transformer |
| `jest-junit` | ^17.0.0 | JUnit XML test reporting |

---

## Author

**Esther Oladoyin**
GitHub: [estheroladoyin9-lgtm](https://github.com/estheroladoyin9-lgtm) 
