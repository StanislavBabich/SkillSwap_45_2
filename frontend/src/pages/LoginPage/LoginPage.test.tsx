import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginPage } from "./LoginPage";
import * as AuthHook from "@/features/auth/hooks/useAuth";
import { BrowserRouter } from "react-router-dom";
import React from "react";

// Мок REACT ROUTER

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null }),
}));

// Мок useAuth

function mockUseAuth(options: Partial<ReturnType<typeof AuthHook.useAuth>>) {
  jest.spyOn(AuthHook, "useAuth").mockReturnValue({
    login: jest.fn(),
    isAuthenticated: jest.fn(() => false),
    error: null,
    isLoading: false,

    // обязательные поля
    register: jest.fn(),
    logout: jest.fn(),
    refreshSession: jest.fn(),
    user: null,

    ...options,
  });
}

/* Helper */
const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

// TESTS

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

// Страница рендерится

  test("renders email, password and submit button", () => {
    mockUseAuth({});
    renderWithRouter(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Введите пароль")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /войти/i })).toBeInTheDocument();
  });


// Валидация email

  test("validates email: empty → 'Email обязателен', wrong → 'Некорректный email'", async () => {
    mockUseAuth({});
    renderWithRouter(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);

    // empty
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("Email обязателен")).toBeInTheDocument();
    });

    // wrong
    fireEvent.change(emailInput, { target: { value: "wrong" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("Некорректный email")).toBeInTheDocument();
    });
  });


// Валидация пароля

  test("validates password: empty → 'Пароль обязателен', short → 'Минимум 8 символов'", async () => {
    mockUseAuth({});
    renderWithRouter(<LoginPage />);

    const passInput = screen.getByPlaceholderText("Введите пароль");

    // empty
    fireEvent.blur(passInput);

    await waitFor(() => {
      expect(screen.getByText("Пароль обязателен")).toBeInTheDocument();
    });

    // short
    fireEvent.change(passInput, { target: { value: "1234567" } });
    fireEvent.blur(passInput);

    await waitFor(() => {
      expect(screen.getByText("Минимум 8 символов")).toBeInTheDocument();
    });
  });


// Ошибка login

  test("shows login error from useAuth", () => {
    mockUseAuth({
      error: "Неверный email или пароль",
    });

    renderWithRouter(<LoginPage />);

    expect(
      screen.getByText("Неверный email или пароль")
    ).toBeInTheDocument();
  });


// Успешный login - redirect

  test("successful login redirects user", async () => {
    const loginMock = jest.fn().mockResolvedValue(true);

    mockUseAuth({
      login: loginMock,
    });

    renderWithRouter(<LoginPage />);

    const email = screen.getByLabelText(/email/i);
    const password = screen.getByPlaceholderText("Введите пароль");
    const submit = screen.getByRole("button", { name: /войти/i });

    fireEvent.change(email, { target: { value: "user@mail.com" } });
    fireEvent.change(password, { target: { value: "12345678" } });

    fireEvent.click(submit);

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: "user@mail.com",
        password: "12345678",
      });
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  // Failed login - no redirect

  test("failed login shows no redirect", async () => {
    const loginMock = jest.fn().mockResolvedValue(false);

    mockUseAuth({ login: loginMock });

    renderWithRouter(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@mail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Введите пароль"), {
      target: { value: "12345678" },
    });

    fireEvent.click(screen.getByRole("button", { name: /войти/i }));

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
