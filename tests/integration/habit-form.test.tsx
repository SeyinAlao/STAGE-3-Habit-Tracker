import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';
import { storage } from '@/lib/storage';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() })
}));

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear();
    storage.setSession({ userId: 'u1', email: 'user@test.com' });
  });

  afterEach(() => {
    cleanup(); 
  });

  it('shows a validation error when habit name is empty', async () => {
    render(<DashboardPage />);
    
    const createButtons = screen.getAllByTestId('create-habit-button');
    fireEvent.click(createButtons[0]);
    
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: '   ' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));
    
    expect(await screen.findByText('Habit name is required')).toBeDefined();
  });

  it('creates a new habit and renders it in the list', async () => {
    render(<DashboardPage />);
    
    const createButtons = screen.getAllByTestId('create-habit-button');
    fireEvent.click(createButtons[0]);
    
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'Drink Water' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('habit-card-drink-water')).toBeDefined();
    });
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    storage.setHabits([{ id: 'h1', userId: 'u1', name: 'Old Name', description: '', frequency: 'daily', createdAt: '2023-01-01', completions: ['2023-10-10'] }]);
    render(<DashboardPage />);
    
    await waitFor(() => screen.getByTestId('habit-edit-old-name'));
    fireEvent.click(screen.getByTestId('habit-edit-old-name'));
    
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'New Name' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('habit-card-new-name')).toBeDefined();
    });
    
    const habits = storage.getHabits();
    expect(habits[0].createdAt).toBe('2023-01-01');
    expect(habits[0].completions).toContain('2023-10-10'); // Verifies array wasn't wiped
  });

  it('deletes a habit only after explicit confirmation', async () => {
    storage.setHabits([{ id: 'h2', userId: 'u1', name: 'To Delete', description: '', frequency: 'daily', createdAt: '2023-01-01', completions: [] }]);
    render(<DashboardPage />);
    
    await waitFor(() => screen.getByTestId('habit-delete-to-delete'));
    fireEvent.click(screen.getByTestId('habit-delete-to-delete'));
    
    // Clicks the inline confirmation button
    await waitFor(() => screen.getByTestId('confirm-delete-button'));
    fireEvent.click(screen.getByTestId('confirm-delete-button'));
    
    await waitFor(() => {
      expect(screen.queryByTestId('habit-card-to-delete')).toBeNull();
    });
  });

  it('toggles completion and updates the streak display', async () => {
    storage.setHabits([{ id: 'h3', userId: 'u1', name: 'Streak Test', description: '', frequency: 'daily', createdAt: '2023-01-01', completions: [] }]);
    render(<DashboardPage />);
    
    await waitFor(() => screen.getByTestId('habit-complete-streak-test'));
    
    expect(screen.getByTestId('habit-streak-streak-test').textContent).toContain('0');
    
    fireEvent.click(screen.getByTestId('habit-complete-streak-test'));
    
    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-streak-test').textContent).toContain('1');
    });
  });
});