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
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });


// Валидация email

  test("validates email: empty → 'Email is required', wrong → 'Invalid email'", async () => {
    mockUseAuth({});
    renderWithRouter(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);

    // empty
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });

    // wrong
    fireEvent.change(emailInput, { target: { value: "wrong" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });
  });


// Валидация пароля

  test("validates password: empty → 'Password is required', short → 'Minimum 8 characters'", async () => {
    mockUseAuth({});
    renderWithRouter(<LoginPage />);

    const passInput = screen.getByPlaceholderText("Enter password");

    // empty
    fireEvent.blur(passInput);

    await waitFor(() => {
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    // short
    fireEvent.change(passInput, { target: { value: "1234567" } });
    fireEvent.blur(passInput);

    await waitFor(() => {
      expect(screen.getByText("Minimum 8 characters")).toBeInTheDocument();
    });
  });


// Ошибка login

  test("shows login error from useAuth", () => {
    mockUseAuth({
      error: "Invalid email or password",
    });

    renderWithRouter(<LoginPage />);

    expect(
      screen.getByText("Invalid email or password")
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
    const password = screen.getByPlaceholderText("Enter password");
    const submit = screen.getByRole("button", { name: /log in/i });

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
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "12345678" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
