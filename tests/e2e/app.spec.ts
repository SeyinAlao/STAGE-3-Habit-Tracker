import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  test.use({ baseURL: 'http://localhost:3000' });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.goto('/login'); 
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'user123', email: 'test@test.com' }));
    });
    await page.goto('/');
    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('newuser@test.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    
    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-users', JSON.stringify([{ 
        id: 'user1', email: 'exist@test.com', password: 'password123', createdAt: new Date().toISOString() 
      }]));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        { id: 'h1', userId: 'user1', name: 'User 1 Habit', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: [] },
        { id: 'h2', userId: 'user2', name: 'User 2 Habit', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: [] }
      ]));
    });

    await page.getByTestId('auth-login-email').fill('exist@test.com');
    await page.getByTestId('auth-login-password').fill('password123');
    await page.getByTestId('auth-login-submit').click();

    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('habit-card-user-1-habit')).toBeVisible();
    await expect(page.getByTestId('habit-card-user-2-habit')).toBeHidden();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'user123', email: 'test@test.com' }));
    });
    await page.goto('/dashboard');

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'user123', email: 'test@test.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        { id: 'h1', userId: 'user123', name: 'Read', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: [] }
      ]));
    });
    await page.goto('/dashboard');

    const streakText = page.getByTestId('habit-streak-read');
    await expect(streakText).toContainText('0');

    await page.getByTestId('habit-complete-read').click();
    await expect(streakText).toContainText('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'user123', email: 'test@test.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        { id: 'h1', userId: 'user123', name: 'Persisted Habit', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: [] }
      ]));
    });
    
    await page.goto('/dashboard');
    await expect(page.getByTestId('habit-card-persisted-habit')).toBeVisible();
    
    await page.reload();
    await expect(page.getByTestId('habit-card-persisted-habit')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
     await page.goto('/login');
      await page.evaluate(() => {
       localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'user123', email: 'test@test.com' }));
      });
      await page.goto('/dashboard');

     await page.getByTestId('auth-logout-button').click();
     await page.waitForURL('**/login');
    
    const session = await page.evaluate(() => localStorage.getItem('habit-tracker-session'));
    expect(JSON.parse(session || 'null')).toBeNull();
  });

  
  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
   await page.goto('/login');
   await expect(page.getByTestId('auth-login-email')).toBeVisible();

    await page.evaluate(async () => {
     await navigator.serviceWorker.register('/sw.js');
     await navigator.serviceWorker.ready;
    });

   await page.reload();
   await expect(page.getByTestId('auth-login-email')).toBeVisible();

   await page.waitForFunction(() => !!navigator.serviceWorker.controller);
   await context.setOffline(true);

    try {
     await page.reload({ timeout: 5000 });
    } catch {
    }
   await expect(page.getByTestId('auth-login-email')).toBeVisible({ timeout: 10000 });
  });
});