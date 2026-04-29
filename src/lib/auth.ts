import { storage } from './storage';
import { User, Session } from '../types/auth';

export const auth = {
  signup: (email: string, password: string): { success: boolean; error?: string } => {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    const users = storage.getUsers();
    
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    const newUser: User = {
      id: crypto.randomUUID(), 
      email,
      password, 
      createdAt: new Date().toISOString(),
    };

    storage.setUsers([...users, newUser]);
    
    storage.setSession({ userId: newUser.id, email: newUser.email });

    return { success: true };
  },

  login: (email: string, password: string): { success: boolean; error?: string } => {
    const users = storage.getUsers();
    
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return { success: false, error: 'Invalid email or password' }; 
    }

    storage.setSession({ userId: user.id, email: user.email });
    return { success: true };
  },

  logout: (): void => {
    storage.setSession(null);
  },
  
  getCurrentSession: (): Session | null => {
    return storage.getSession();
  }
};