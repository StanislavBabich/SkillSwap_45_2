import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Step1Account } from "./Step1Account";

function setup(initial: { email?: string; password?: string; emailAlreadyUsed?: boolean } = {}) {
  let data = {
    email: initial.email ?? "",
    password: initial.password ?? "",
  };

  const onUpdate = jest.fn((update) => {
    data = { ...data, ...update };
  });

  const onNext = jest.fn();

  const renderResult = render(
    <Step1Account
      data={data}
      onUpdate={onUpdate}
      onNext={onNext}
      emailAlreadyUsed={initial.emailAlreadyUsed ?? false}
    />
  );

  function updateRender() {
    renderResult.rerender(
      <Step1Account
        data={data}
        onUpdate={onUpdate}
        onNext={onNext}
        emailAlreadyUsed={initial.emailAlreadyUsed ?? false}
      />
    );
  }

  return {
    get data() {
      return data;
    },
    onUpdate,
    onNext,
    updateRender,
    ...renderResult,
  };
}

function getHelper(input: HTMLElement) {
  const desc = input.getAttribute("aria-describedby");
  return desc ? document.getElementById(desc) : null;
}

//   EMAIL VALIDATION 

test("email validation follows real component logic", async () => {
  const { updateRender, onUpdate } = setup();

  const emailInput = screen.getByPlaceholderText("Введите email");

  // EMPTY - "Введите email"
  fireEvent.blur(emailInput);
  updateRender();

  await waitFor(() => {
    expect(screen.getByText("Введите email")).toBeInTheDocument();
  });

  // WRONG FORMAT
  fireEvent.change(emailInput, { target: { value: "wrong" } });
  expect(onUpdate).toHaveBeenCalledWith({ email: "wrong" });

  fireEvent.blur(emailInput);
  updateRender();

  await waitFor(() => {
    expect(screen.getByText("Неверный формат email")).toBeInTheDocument();
  });

  // CORRECT
  fireEvent.change(emailInput, { target: { value: "valid@mail.com" } });
  expect(onUpdate).toHaveBeenCalledWith({ email: "valid@mail.com" });

  fireEvent.blur(emailInput);
  updateRender();

  await waitFor(() => {
    const helper = getHelper(emailInput);
    expect(helper).toBeNull(); // корректно для валидного email
  });
});

// EMAIL ALREADY USED

test("emailAlreadyUsed shows correct error", async () => {
  const { updateRender } = setup({
    email: "exists@mail.com",
    emailAlreadyUsed: true,
  });

  const emailInput = screen.getByPlaceholderText("Введите email");

  fireEvent.blur(emailInput);
  updateRender();

  await waitFor(() => {
    expect(screen.getByText("Email уже используется")).toBeInTheDocument();
  });
});

// PASSWORD VALIDATION 

test("password validation follows real logic", async () => {
  const { updateRender, onUpdate } = setup();

  const passwordInput = screen.getByPlaceholderText("Придумайте надёжный пароль");

  // EMPTY
  fireEvent.blur(passwordInput);
  updateRender();

  await waitFor(() => {
    expect(screen.getByText("Введите пароль")).toBeInTheDocument();
  });

  // SHORT
  fireEvent.change(passwordInput, { target: { value: "1234567" } });
  expect(onUpdate).toHaveBeenCalledWith({ password: "1234567" });

  fireEvent.blur(passwordInput);
  updateRender();

  await waitFor(() => {
    expect(screen.getByText("Пароль должен содержать не менее 8 знаков")).toBeInTheDocument();
  });

  // VALID
  fireEvent.change(passwordInput, { target: { value: "12345678" } });
  expect(onUpdate).toHaveBeenCalledWith({ password: "12345678" });

  fireEvent.blur(passwordInput);
  updateRender();

  await waitFor(() => {
    expect(screen.getByText("Надёжный")).toBeInTheDocument();
  });
});

// SUBMIT BUTTON & SUCCESS FLOW


test("submit triggers onNext only when form is valid", async () => {
  const { onUpdate, onNext, updateRender } = setup();

  const email = screen.getByPlaceholderText("Введите email");
  const password = screen.getByPlaceholderText("Придумайте надёжный пароль");
  const submitBtn = screen.getByRole("button", { name: /далее/i });

  // initially invalid
  expect(submitBtn).toBeDisabled();

  fireEvent.change(email, { target: { value: "user@mail.com" } });
  expect(onUpdate).toHaveBeenCalledWith({ email: "user@mail.com" });

  fireEvent.change(password, { target: { value: "12345678" } });
  expect(onUpdate).toHaveBeenCalledWith({ password: "12345678" });

  updateRender();

  await waitFor(() => expect(submitBtn).not.toBeDisabled());

  fireEvent.click(submitBtn);

  expect(onNext).toHaveBeenCalledTimes(1);
});
