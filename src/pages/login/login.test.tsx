import { it, describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginPage from './login';

describe('Login page', () => {
    it('should render with all the required fields', () => {
        render(<LoginPage />);
        // getBy -> throws an error
        // queryBy -> null
        // findBy -> Async
        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Remember me' })).toBeInTheDocument();
        expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    });
});
