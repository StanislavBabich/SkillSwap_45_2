import React from "react";
import { render, screen } from "@testing-library/react";
import { PrivateRoute } from "./PrivateRoute";
import { AuthService } from "@/features/auth";
import { BrowserRouter, Navigate } from "react-router-dom";

// Тип пропсов Navigate
type NavigateProps = React.ComponentProps<typeof Navigate>;

// Функция с корректной типизацией и _props для ESLint
const mockNavigateComponentFn = (_props: NavigateProps) => null;

// Превращаем её в jest mock
const mockNavigateComponent = jest.fn(mockNavigateComponentFn);

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");

  return {
    ...actual,

    useLocation: () => ({ pathname: "/secret", search: "" }),

    Navigate: (props: NavigateProps) => {
      mockNavigateComponent(props);
      return null;
    },
  };
});

// Мок AuthService
jest.mock("@/features/auth", () => ({
  AuthService: {
    isAuthenticated: jest.fn(),
  },
}));

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe("PrivateRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("redirects to /login when NOT authenticated", () => {
    (AuthService.isAuthenticated as jest.Mock).mockReturnValue(false);

    renderWithRouter(
      <PrivateRoute>
        <div>PRIVATE CONTENT</div>
      </PrivateRoute>
    );

    expect(mockNavigateComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "/login",
        replace: true,
        state: { from: "/secret" },
      })
    );

    expect(screen.queryByText("PRIVATE CONTENT")).toBeNull();
  });

  test("renders children when authenticated", () => {
    (AuthService.isAuthenticated as jest.Mock).mockReturnValue(true);

    renderWithRouter(
      <PrivateRoute>
        <div>PRIVATE CONTENT</div>
      </PrivateRoute>
    );

    expect(screen.getByText("PRIVATE CONTENT")).toBeInTheDocument();
    expect(mockNavigateComponent).not.toHaveBeenCalled();
  });
});
