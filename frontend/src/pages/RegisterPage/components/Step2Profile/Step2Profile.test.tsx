import { render, screen, fireEvent } from "@testing-library/react";
import { Step2Profile } from "./Step2Profile";
import type { RegistrationData } from "@/pages/RegisterPage/types";

//   MOCK REDUX HOOKS

const mockState = {
  cities: {
    items: [{ id: 1, name: "Moscow" }],
  },
  categories: {
    categories: [{ id: 10, name: "IT" }],
    subcategories: [
      { id: 101, categoryId: 10, name: "Frontend" },
      { id: 102, categoryId: 10, name: "Backend" },
    ],
    error: null,
  },
};

jest.mock("@/app/store/hooks", () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (selector: (s: typeof mockState) => unknown) => selector(mockState),
}));

//   MOCK UI COMPONENTS

// Simple replacement for Select
jest.mock("@/shared/ui/Select", () => ({
  Select: ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">--</option>
      <option value="10">IT</option>
    </select>
  ),
}));

// Simple replacement for DropDownCity
jest.mock("@/shared/ui/DropDownCity", () => ({
  DropDownCity: ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <input
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// Dropdown mock
jest.mock("@/shared/ui/Dropdown", () => ({
  Dropdown: ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string[];
    onChange: (v: string[]) => void;
  }) => (
    <input
      aria-label={label}
      data-value={value.join(",")}
      onChange={(e) => onChange([e.target.value])}
    />
  ),
}));

// DatePicker mock
jest.mock("@/shared/ui/DatePicker/DatePicker", () => ({
  DatePicker: ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <input
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// AvatarUpload mock
jest.mock("./components/AvatarUpload", () => ({
  AvatarUpload: () => <div data-testid="avatar-upload" />,
}));

//   HELPER: create valid RegistrationData

function createData(): RegistrationData {
  return {
    // Step 1
    email: "",
    password: "",

    // Step 2
    avatarSeed: null,
    name: "",
    dateOfBirth: "",
    gender: undefined,
    cityId: undefined,
    about: "",
    selectedCategories: [],
    selectedSubcategories: [],

    // Step 3
    teachSkill: {
      name: "",
      categoryId: 0,
      subcategoryId: 0,
      description: "",
      images: [],
    },
  };
}

//   TESTS

describe("Step2Profile", () => {
  test("renders required fields", () => {
    const data = createData();
    const onUpdate = jest.fn();
    const onNext = jest.fn();
    const onBack = jest.fn();

    render(
      <Step2Profile
        data={data}
        onUpdate={onUpdate}
        onNext={onNext}
        onBack={onBack}
        embedded
      />
    );

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Date of birth")).toBeInTheDocument();
    expect(screen.getByLabelText("Gender")).toBeInTheDocument();
    expect(screen.getByLabelText("City")).toBeInTheDocument();
    expect(screen.getByLabelText("Categories you want to learn")).toBeInTheDocument();
  });

  test("allows entering name and updates parent data", () => {
    const data = createData();
    const onUpdate = jest.fn();
    const onNext = jest.fn();
    const onBack = jest.fn();

    render(
      <Step2Profile
        data={data}
        onUpdate={onUpdate}
        onNext={onNext}
        onBack={onBack}
        embedded
      />
    );

    const nameInput = screen.getByLabelText("Name");

    fireEvent.change(nameInput, { target: { value: "Alexey" } });

    expect(onUpdate).toHaveBeenCalledWith({ name: "Alexey" });
  });

  test("selecting category triggers update", () => {
    const data = createData();
    const onUpdate = jest.fn();

    render(
      <Step2Profile
        data={data}
        onUpdate={onUpdate}
        onNext={() => {}}
        onBack={() => {}}
        embedded
      />
    );

    const categorySelect = screen.getByLabelText("Categories you want to learn");

    fireEvent.change(categorySelect, { target: { value: "10" } });

    expect(onUpdate).toHaveBeenCalled();
  });
});
