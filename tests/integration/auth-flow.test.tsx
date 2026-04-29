import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import SignupPage from '@/app/signup/page';
import LoginPage from '@/app/login/page';
import { storage } from '@/lib/storage';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() })
}));

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup(); 
  });

  it('submits the signup form and creates a session', () => {
    render(<SignupPage />);
    
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'new@test.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));
    
    const session = storage.getSession();
    expect(session?.email).toBe('new@test.com');
  });

  it('shows an error for duplicate signup email', () => {
    storage.setUsers([{ id: '1', email: 'exist@test.com', password: 'password123', createdAt: new Date().toISOString() }]);
    
    render(<SignupPage />);
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'exist@test.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));
    
    expect(screen.getByText('User already exists')).toBeDefined();
  });

  it('submits the login form and stores the active session', () => {
    storage.setUsers([{ id: '2', email: 'login@test.com', password: 'password123', createdAt: new Date().toISOString() }]);
    
    render(<LoginPage />);
    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'login@test.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));
    
    const session = storage.getSession();
    expect(session?.email).toBe('login@test.com');
  });

  it('shows an error for invalid login credentials', () => {
    render(<LoginPage />);
    
    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));
    
    expect(screen.getByText('Invalid email or password')).toBeDefined();
  });
});