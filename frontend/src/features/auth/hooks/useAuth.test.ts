import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { AuthService } from '@/features/auth';

// мок navigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// мок AuthService
jest.mock('@/features/auth', () => ({
  AuthService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
    isAuthenticated: jest.fn(),
  },
}));

describe('useAuth hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (AuthService.getCurrentUser as jest.Mock).mockReturnValue(null);
  });

  test('loads current user on mount', () => {
    (AuthService.getCurrentUser as jest.Mock).mockReturnValue({ id: 1, name: 'Test' });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual({ id: 1, name: 'Test' });
  });

  // LOGIN

  test('login success', async () => {
    (AuthService.login as jest.Mock).mockResolvedValue({ id: 1, name: 'User1' });

    const { result } = renderHook(() => useAuth());

    let loginResult = false;
    await act(async () => {
      loginResult = await result.current.login({ email: 'a@mail.com', password: '123' });
    });

    expect(loginResult).toBe(true);
    expect(result.current.user).toEqual({ id: 1, name: 'User1' });
    expect(result.current.error).toBeNull();
  });

  test('login wrong credentials', async () => {
    (AuthService.login as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useAuth());

    let loginResult = true;
    await act(async () => {
      loginResult = await result.current.login({ email: 'wrong@mail', password: '111' });
    });

    expect(loginResult).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe('Invalid email or password');
  });

  test('login error thrown from AuthService', async () => {
    (AuthService.login as jest.Mock).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useAuth());

    let loginResult = true;
    await act(async () => {
      loginResult = await result.current.login({ email: 'x', password: 'y' });
    });

    expect(loginResult).toBe(false);
    expect(result.current.error).toBe('fail');
  });

  // REGISTER

  test('register success', async () => {
    (AuthService.register as jest.Mock).mockResolvedValue({ id: 1, name: 'NewUser' });

    const { result } = renderHook(() => useAuth());

    let regResult = false;
    await act(async () => {
      regResult = await result.current.register({
        email: 'a@mail.com',
        password: '12345678',
        name: 'A',
        skillInterests: [],
      });
    });

    expect(regResult).toBe(true);
    expect(result.current.user).toEqual({ id: 1, name: 'NewUser' });
    expect(result.current.error).toBeNull();
  });

  test('register throws error', async () => {
    (AuthService.register as jest.Mock).mockRejectedValue(new Error('email used'));

    const { result } = renderHook(() => useAuth());

    let regResult = true;
    await act(async () => {
      regResult = await result.current.register({
        email: 'a@mail.com',
        password: '12345678',
        name: 'A',
        skillInterests: [],
      });
    });

    expect(regResult).toBe(false);
    expect(result.current.error).toBe('email used');
  });

  // LOGOUT

  test('logout resets user and navigates home', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(AuthService.logout).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  // isAuthenticated

  test('isAuthenticated delegates to AuthService.isAuthenticated', () => {
    (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated()).toBe(true);
  });

  // refreshSession + events

  test('refreshSession is called on AUTH_SESSION_EVENT', () => {
    (AuthService.getCurrentUser as jest.Mock).mockReturnValue({ id: 5, name: 'X' });

    const { result } = renderHook(() => useAuth());

    act(() => {
      window.dispatchEvent(new CustomEvent('auth-session-changed'));
    });

    expect(result.current.user).toEqual({ id: 5, name: 'X' });
  });
});
