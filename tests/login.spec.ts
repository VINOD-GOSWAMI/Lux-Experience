import { TestConfig } from "../config/test-config";
import { test, expect } from "../fixtures/loginFixture";

test.describe("Login Feature Suite", () => {
  test("Validate successful login with valid credentials", async ({loginPage}) => {
    await loginPage.login(TestConfig.USER_NAME, TestConfig.PASSWORD);

    await expect(loginPage.page.getByText("Welcome, testUser!")).toBeVisible();
    await expect(loginPage.page).toHaveURL(/account/);
  });

  test("Verify that login page should displayed required fields", async ({ loginPage }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test("Validate browser-required field error for empty credentials", async ({loginPage}) => {
    await loginPage.usernameInput.fill("");
    await loginPage.passwordInput.fill("");

    await loginPage.loginButton.click();

    const validation = await loginPage.usernameInput.evaluate(
      (input: HTMLInputElement) => ({
        isValid: input.validity.valid,
        errorMessage: input.validationMessage,
      })
    );

    expect(validation.isValid).toBe(false);
    expect(validation.errorMessage.toLowerCase()).toContain("fill out this field");

    await expect(loginPage.page).toHaveURL(/login/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
