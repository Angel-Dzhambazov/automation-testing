import { type Locator, type Page, expect, step } from "../../utils/base";

export const ACCOUNT_CREATED_URL = /automationexercise\.com\/account_created/;

export class AccountCreatedPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get accountCreatedHeading() {
    return this.page.locator('[data-qa="account-created"]');
  }

  get congratulationsMessage() {
    return this.page.locator(
      'p:has-text("Congratulations! Your new account has been successfully created!")'
    );
  }

  get memberPrivilegesMessage() {
    return this.page.locator(
      'p:has-text("You can now take advantage of member privileges")'
    );
  }

  get continueButton() {
    return this.page.locator('[data-qa="continue-button"]');
  }

  @step("Verify account created page loaded")
  async verifyAccountCreatedPageLoaded(): Promise<void> {
    await this.accountCreatedHeading.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await expect(this.accountCreatedHeading).toBeVisible();
    await expect(this.accountCreatedHeading).toHaveText("Account Created!");
  }

  @step("Verify success messages")
  async verifySuccessMessages(): Promise<void> {
    await expect(this.congratulationsMessage).toBeVisible();
    await expect(this.memberPrivilegesMessage).toBeVisible();
  }

  @step("Click continue button")
  async clickContinueButton(): Promise<void> {
    await this.continueButton.click();
  }

  @step("Verify complete account creation")
  async verifyCompleteAccountCreation(): Promise<void> {
    await this.verifyAccountCreatedPageLoaded();
    await this.verifySuccessMessages();
  }
}
