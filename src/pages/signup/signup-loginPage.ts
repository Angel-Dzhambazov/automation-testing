import { type Locator, type Page, expect, step } from "../../utils/base";

export const SIGNUP_LOGIN_URL = /automationexercise\.com\/login/;

export class SignupLoginPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get loginToYourAccountHeadline() {
    return this.page.locator('h2:has-text("Login to your account")');
  }

  get newUserSignupHeadline() {
    return this.page.locator('h2:has-text("New User Signup!")');
  }

  get loginEmailInput() {
    return this.page.locator('[data-qa="login-email"]');
  }

  get loginPasswordInput() {
    return this.page.locator('[data-qa="login-password"]');
  }

  get loginButton() {
    return this.page.locator('[data-qa="login-button"]');
  }

  get signupNameInput() {
    return this.page.locator('[data-qa="signup-name"]');
  }

  get signupEmailInput() {
    return this.page.locator('[data-qa="signup-email"]');
  }

  get signupButton() {
    return this.page.locator('[data-qa="signup-button"]');
  }

  get emailExistsError() {
    return this.page.locator(".signup-form p", {
      hasText: "Email Address already exist!",
    });
  }

  get emptyFieldsValidationMessage() {
    return this.page.locator('text="Please fill out this field."');
  }

  // Methods
  @step("Verify login page loaded")
  async verifyLoginPageLoaded(): Promise<void> {
    await this.loginToYourAccountHeadline.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await expect(this.loginToYourAccountHeadline).toBeVisible();
  }

  @step("Login with credentials")
  async loginWithCredentials(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  @step("Verify login error message")
  async verifyLoginErrorMessage(): Promise<void> {
    await this.page
      .locator(".login-form p", {
        hasText: "Your email or password is incorrect!",
      })
      .waitFor({ state: "visible" });
  }
}
