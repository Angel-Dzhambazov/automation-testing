import { test, expect } from "../utils/base";
import { HomePage } from "../pages/homePage";
import { SignupLoginPage } from "../pages/signup/signup-loginPage";
import { SignupPage } from "../pages/signup/signupPage";
import { AccountCreatedPage } from "../pages/signup/account-createdPage";
import {
  registrationData,
  type RegistrationData,
} from "../data/fixtures/registrationData";

test.describe("Registration Flow", () => {
  let homePage: HomePage;
  let signupLoginPage: SignupLoginPage;
  let signupPage: SignupPage;
  let accountCreatedPage: AccountCreatedPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signupLoginPage = new SignupLoginPage(page);
    signupPage = new SignupPage(page);
    accountCreatedPage = new AccountCreatedPage(page);

    await page.goto("https://automationexercise.com");
    await homePage.acceptCookiesIfPresent();
    await homePage.verifyHomePageLoaded();
  });

  test("should navigate to signup page and fill form with fixture data", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const timestampedRegistrationData: RegistrationData = {
      ...registrationData,
      email: `automation-tester-${timestamp}@test.auto`,
    };

    await homePage.navigateToSignupLogin();

    await signupLoginPage.newUserSignupHeadline.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await expect(signupLoginPage.newUserSignupHeadline).toBeVisible();

    await signupLoginPage.signupNameInput.fill(
      timestampedRegistrationData.name
    );
    await signupLoginPage.signupEmailInput.fill(
      timestampedRegistrationData.email
    );

    try {
      await signupLoginPage.signupButton.click();

      await expect(page).toHaveURL(/.*\/signup/);

      await signupPage.fillMandatorySignUpFields(timestampedRegistrationData);

      await signupPage.createAccountButton.click();

      await accountCreatedPage.verifyCompleteAccountCreation();
    } catch (error) {
      const emailExistsError =
        await signupLoginPage.emailExistsError.isVisible();

      if (emailExistsError) {
        const newTimestamp = Date.now();
        const newTimestampedRegistrationData: RegistrationData = {
          ...timestampedRegistrationData,
          email: `automation-tester-${newTimestamp}@test.auto`,
        };

        await signupLoginPage.signupNameInput.clear();
        await signupLoginPage.signupEmailInput.clear();
        await signupLoginPage.signupNameInput.fill(
          newTimestampedRegistrationData.name
        );
        await signupLoginPage.signupEmailInput.fill(
          newTimestampedRegistrationData.email
        );
        await signupLoginPage.signupButton.click();

        await expect(page).toHaveURL(/.*\/signup/);

        await signupPage.fillMandatorySignUpFields(
          newTimestampedRegistrationData
        );

        await signupPage.createAccountButton.click();

        await accountCreatedPage.verifyCompleteAccountCreation();
      } else {
        throw error;
      }
    }
  });

  test("should display validation error for existing email", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const timestampedRegistrationData: RegistrationData = {
      ...registrationData,
      email: `automation-tester-${timestamp}@test.auto`,
    };

    await homePage.navigateToSignupLogin();
    await signupLoginPage.newUserSignupHeadline.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await expect(signupLoginPage.newUserSignupHeadline).toBeVisible();

    await signupLoginPage.signupNameInput.fill(
      timestampedRegistrationData.name
    );
    await signupLoginPage.signupEmailInput.fill(
      timestampedRegistrationData.email
    );
    await signupLoginPage.signupButton.click();

    await expect(page).toHaveURL(/.*\/signup/);
    await signupPage.fillMandatorySignUpFields(timestampedRegistrationData);
    await signupPage.createAccountButton.click();
    await accountCreatedPage.verifyCompleteAccountCreation();

    await accountCreatedPage.clickContinueButton();
    await homePage.verifyHomePageLoaded();

    await homePage.clickLogout();

    await homePage.navigateToSignupLogin();
    await signupLoginPage.newUserSignupHeadline.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await expect(signupLoginPage.newUserSignupHeadline).toBeVisible();

    await signupLoginPage.signupNameInput.fill("Another User");
    await signupLoginPage.signupEmailInput.fill(
      timestampedRegistrationData.email
    );
    await signupLoginPage.signupButton.click();

    await expect(signupLoginPage.emailExistsError).toBeVisible();
  });

  test("should display validation error for known existing email", async ({
    page,
  }) => {
    await homePage.navigateToSignupLogin();

    await signupLoginPage.newUserSignupHeadline.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await expect(signupLoginPage.newUserSignupHeadline).toBeVisible();

    await signupLoginPage.signupNameInput.fill("Test User");
    await signupLoginPage.signupEmailInput.fill("test@test.test");

    await signupLoginPage.signupButton.click();

    await expect(signupLoginPage.emailExistsError).toBeVisible();
  });
});
