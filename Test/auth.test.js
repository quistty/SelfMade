import request from 'supertest';
import chai from 'chai';
import app from '../app.js'; // Ensure .js extension for ES modules

const { expect } = chai;

describe('Authentication Routes', () => {
  let token;

  // Test user registration
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'John Doe', email: 'john@example.com', password: 'password123' });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message', 'User registered successfully');
  });

  // Test user login and return JWT token
  it('should log in and return a JWT token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'john@example.com', password: 'password123' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    token = res.body.token; // Save token for later tests
  });

  // Test accessing a protected route with a valid token
  it('should access a protected route with a valid token', async () => {
    const res = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('name', 'John Doe');
  });
});
