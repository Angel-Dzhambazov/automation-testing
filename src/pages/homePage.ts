import { type Locator, type Page, expect, step } from "../utils/base";

export const HOME_URL = /automationexercise\.com/;

export class HomePage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get shopMenu() {
    return this.page.locator(".shop-menu");
  }

  get homeLink() {
    return this.page.locator('.shop-menu a:has-text("Home")');
  }

  get cartLink() {
    return this.page.locator('.shop-menu a:has-text("Cart")');
  }

  get signupLoginLink() {
    return this.page.locator('.shop-menu a:has-text("Signup / Login")');
  }

  get logoutLink() {
    return this.page.locator('.shop-menu a:has-text("Logout")');
  }

  get loggedInUserText() {
    return this.page.locator('.shop-menu a:has-text("Logged in as")');
  }

  get productsLink() {
    return this.page.locator('.shop-menu a:has-text("Products")');
  }

  get cookieConsentButton() {
    return this.page.getByRole("button", { name: "Consent" });
  }

  @step("Navigate to home page")
  async navigateToHome(): Promise<void> {
    await this.homeLink.click();
  }

  @step("Navigate to cart page")
  async navigateToCart(): Promise<void> {
    await this.cartLink.click();
  }

  @step("Navigate to signup/login page")
  async navigateToSignupLogin(): Promise<void> {
    await this.signupLoginLink.click();
  }

  @step("Navigate to products page")
  async navigateToProducts(): Promise<void> {
    await this.productsLink.click();
  }

  @step("Click logout")
  async clickLogout(): Promise<void> {
    await this.logoutLink.click();
  }

  @step("Verify user is logged in")
  async verifyUserIsLoggedIn(expectedUsername: string): Promise<void> {
    await this.loggedInUserText.waitFor({ state: "visible", timeout: 10000 });
    await expect(this.loggedInUserText).toBeVisible();
    await expect(this.loggedInUserText).toContainText(expectedUsername);
  }

  @step("Verify user is logged out")
  async verifyUserIsLoggedOut(): Promise<void> {
    await this.signupLoginLink.waitFor({ state: "visible", timeout: 10000 });
    await expect(this.signupLoginLink).toBeVisible();
  }

  @step("Verify home page loaded")
  async verifyHomePageLoaded(): Promise<void> {
    await this.shopMenu.waitFor({ state: "visible", timeout: 10000 });
    expect(await this.shopMenu.isVisible()).toBeTruthy();
  }

  @step("Accept cookies if present")
  async acceptCookiesIfPresent(): Promise<void> {
    try {
      await this.cookieConsentButton.waitFor({
        state: "visible",
        timeout: 3000,
      });
      await this.cookieConsentButton.click();
    } catch (error) {
      console.log("No cookie consent dialog found");
    }
  }
}
