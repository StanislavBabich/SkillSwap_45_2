import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Step3Skill } from "./Step3Skill";
import type { RegistrationData } from "@/pages/RegisterPage/types";
import type { RootState } from "@/app/store";
import * as hooks from "@/app/store/hooks";

// Моки useAppDispatch / useAppSelector

jest.mock("@/app/store/hooks", () => ({
  __esModule: true,
  ...jest.requireActual("@/app/store/hooks"),
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

const mockDispatch = jest.fn();
const mockUseAppSelector = hooks.useAppSelector as jest.Mock;

// Моки категорий

const mockCategories = [
  { id: 1, name: "Категория A", color: "#000", icon: "iconA" },
  { id: 2, name: "Категория B", color: "#111", icon: "iconB" },
];

const mockSubcategories = [
  { id: 10, name: "Подкат A1", categoryId: 1 },
  { id: 11, name: "Подкат B1", categoryId: 2 },
];

beforeEach(() => {
  jest.clearAllMocks();
  (hooks.useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);

  mockUseAppSelector.mockImplementation(
    (selector: (state: RootState) => unknown) =>
      selector({
        categories: {
          categories: mockCategories,
          subcategories: mockSubcategories,
          isLoading: false,
          error: null,
        },
        users: { status: "idle", items: [], error: null },
        skills: { status: "idle", items: [], error: null },
        cities: { status: "idle", cities: [], error: null },
        filters: { activeFilters: {}, allFilters: [] },
        favorites: { items: [] },
        requests: { items: [] },
        exchanges: { items: [] },
        notifications: { list: [] },
        ui: { modal: null },
        exchangeRequests: { items: [] },
      } as unknown as RootState)
  );
});

// setup()

function setup(initial?: Partial<RegistrationData["teachSkill"]>) {
  let teachSkill: RegistrationData["teachSkill"] = {
    name: "",
    categoryId: 0,
    subcategoryId: 0,
    description: "",
    images: [],
    ...initial,
  };

  const onUpdate = jest.fn((update: Partial<RegistrationData>) => {
    if (update.teachSkill) {
      teachSkill = update.teachSkill;
    }
  });

  const onNext = jest.fn();
  const onBack = jest.fn();

  const renderResult = render(
    <Step3Skill
      data={{ teachSkill }}
      onUpdate={onUpdate}
      onNext={onNext}
      onBack={onBack}
    />
  );

  function updateRender() {
    renderResult.rerender(
      <Step3Skill
        data={{ teachSkill }}
        onUpdate={onUpdate}
        onNext={onNext}
        onBack={onBack}
      />
    );
  }

  return {
    get teachSkill() {
      return teachSkill;
    },
    onUpdate,
    onNext,
    onBack,
    updateRender,
    ...renderResult,
  };
}

// TESTS

test("renders main fields", () => {
  setup();

  expect(
    screen.getByPlaceholderText("Введите название вашего навыка")
  ).toBeInTheDocument();

  expect(screen.getByLabelText("Категория навыка")).toBeInTheDocument();
  expect(screen.getByLabelText("Подкатегория навыка")).toBeInTheDocument();

  expect(
    screen.getByPlaceholderText("Коротко опишите, чему можете научить")
  ).toBeInTheDocument();
});

test("empty submit shows validation errors", async () => {
  const { updateRender } = setup();

  const form = document.querySelector("form")!;
fireEvent.submit(form);
  updateRender();

  await waitFor(() => {
    // проверяем ошибку имени
    expect(
      screen.getByText("Введите название навыка")
    ).toBeInTheDocument();

    // проверяем ошибку категории
    expect(
      screen.getByText("Выберите категорию")
    ).toBeInTheDocument();
  });
});

test("changing category resets subcategory", () => {
  const { onUpdate, updateRender } = setup({
    name: "Skill",
    categoryId: 2,
    subcategoryId: 11,
  });

  const catSelect = screen.getByLabelText("Категория навыка");
  fireEvent.click(catSelect);

  // выбираем пункт меню по ролям, избегая дубликатов
  fireEvent.click(
    screen.getByRole("option", { name: "Категория A" })
  );

  updateRender();

  expect(onUpdate).toHaveBeenCalled();
  expect(onUpdate.mock.calls[0][0].teachSkill?.subcategoryId).toBe(0);
});

test("changing subcategory triggers onUpdate", () => {
  const { onUpdate, updateRender } = setup({
    name: "Skill",
    categoryId: 1,
    subcategoryId: 0,
  });

  const catSelect = screen.getByLabelText("Категория навыка");
  fireEvent.click(catSelect);

  fireEvent.click(
    screen.getByRole("option", { name: "Категория A" })
  );
  updateRender();

  const subSelect = screen.getByLabelText("Подкатегория навыка");
  fireEvent.click(subSelect);

  fireEvent.click(
    screen.getByRole("option", { name: "Подкат A1" })
  );
  updateRender();

  expect(onUpdate).toHaveBeenCalled();
  expect(
    onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0].teachSkill
  ).toMatchObject({ subcategoryId: 10 });
});

test("valid form enables submit and calls onNext", () => {
  const { onNext, updateRender } = setup();

  const nameInput = screen.getByPlaceholderText(
    "Введите название вашего навыка"
  );
  fireEvent.change(nameInput, { target: { value: "React" } });
  updateRender();

  const catSelect = screen.getByLabelText("Категория навыка");
  fireEvent.click(catSelect);
  fireEvent.click(screen.getByRole("option", { name: "Категория A" }));
  updateRender();

  const subSelect = screen.getByLabelText("Подкатегория навыка");
  fireEvent.click(subSelect);
  fireEvent.click(screen.getByRole("option", { name: "Подкат A1" }));
  updateRender();

  const submitBtn = screen.getByRole("button", { name: /продолжить/i });
  expect(submitBtn).not.toBeDisabled();

  fireEvent.click(submitBtn);
  expect(onNext).toHaveBeenCalledTimes(1);
});
