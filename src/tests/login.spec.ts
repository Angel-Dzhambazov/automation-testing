import { test, expect } from "../utils/base";
import { HomePage } from "../pages/homePage";
import { SignupLoginPage } from "../pages/signup/signup-loginPage";
import { registrationData } from "../data/fixtures/registrationData";

test.describe("Login and Logout Functionality", () => {
  let homePage: HomePage;
  let signupLoginPage: SignupLoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signupLoginPage = new SignupLoginPage(page);

    await page.goto("https://automationexercise.com");
    await homePage.acceptCookiesIfPresent();
    await homePage.verifyHomePageLoaded();
  });

  test("should login successfully with valid credentials and logout", async ({
    page,
  }) => {
    await homePage.navigateToSignupLogin();
    await signupLoginPage.verifyLoginPageLoaded();

    await signupLoginPage.loginWithCredentials(
      registrationData.email,
      registrationData.password
    );

    await homePage.verifyUserIsLoggedIn(registrationData.name);

    await expect(page).toHaveURL(/automationexercise\.com/);

    await homePage.clickLogout();

    await homePage.verifyUserIsLoggedOut();

    await expect(page).toHaveURL(/automationexercise\.com/);
  });

  test("should display error message for invalid credentials", async ({
    page,
  }) => {
    await homePage.navigateToSignupLogin();
    await signupLoginPage.verifyLoginPageLoaded();

    await signupLoginPage.loginWithCredentials(
      "invalid@email.com",
      "wrongpassword"
    );

    await signupLoginPage.verifyLoginErrorMessage();

    await expect(page).toHaveURL(/.*\/login/);
  });

  test("should display error message for empty credentials", async ({
    page,
  }) => {
    await homePage.navigateToSignupLogin();
    await signupLoginPage.verifyLoginPageLoaded();

    await signupLoginPage.loginButton.click();

    await expect(signupLoginPage.emptyFieldsValidationMessage).toBeVisible();

    await expect(page).toHaveURL(/.*\/login/);
  });

  test("should maintain login state after page refresh", async ({ page }) => {
    await homePage.navigateToSignupLogin();
    await signupLoginPage.verifyLoginPageLoaded();
    await signupLoginPage.loginWithCredentials(
      registrationData.email,
      registrationData.password
    );

    await homePage.verifyUserIsLoggedIn(registrationData.name);

    await page.reload();

    await homePage.verifyUserIsLoggedIn(registrationData.name);

    await homePage.clickLogout();
    await homePage.verifyUserIsLoggedOut();
  });

  test("should verify login via API with valid credentials", async ({
    request,
  }) => {
    const formData = `email=${encodeURIComponent(
      registrationData.email
    )}&password=${encodeURIComponent(registrationData.password)}`;

    const response = await request.post(
      "https://automationexercise.com/api/verifyLogin",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: formData,
      }
    );

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toEqual({
      responseCode: 200,
      message: "User exists!",
    });
  });
});
