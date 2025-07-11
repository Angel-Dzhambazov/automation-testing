import { type Locator, type Page, expect, step } from "../../utils/base";

export const SIGNUP_URL = /automationexercise\.com\/signup/;

export class SignupPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get mrRadioButton() {
    return this.page.locator("#id_gender1");
  }

  get mrsRadioButton() {
    return this.page.locator("#id_gender2");
  }

  get nameInput() {
    return this.page.locator('[data-qa="name"]');
  }

  get emailInput() {
    return this.page.locator('[data-qa="email"]');
  }

  get passwordInput() {
    return this.page.locator('[data-qa="password"]');
  }

  get dayDropdown() {
    return this.page.locator('[data-qa="days"]');
  }

  get monthDropdown() {
    return this.page.locator('[data-qa="months"]');
  }

  get yearDropdown() {
    return this.page.locator('[data-qa="years"]');
  }

  get newsletterCheckbox() {
    return this.page.locator("#newsletter");
  }

  get specialOffersCheckbox() {
    return this.page.locator("#optin");
  }

  get firstNameInput() {
    return this.page.locator('[data-qa="first_name"]');
  }

  get lastNameInput() {
    return this.page.locator('[data-qa="last_name"]');
  }

  get addressInput() {
    return this.page.locator('[data-qa="address"]');
  }

  get countryDropdown() {
    return this.page.locator('[data-qa="country"]');
  }

  get stateInput() {
    return this.page.locator('[data-qa="state"]');
  }

  get cityInput() {
    return this.page.locator('[data-qa="city"]');
  }

  get zipcodeInput() {
    return this.page.locator('[data-qa="zipcode"]');
  }

  get mobileNumberInput() {
    return this.page.locator('[data-qa="mobile_number"]');
  }

  get createAccountButton() {
    return this.page.locator('[data-qa="create-account"]');
  }

  @step("Get country options from dropdown")
  async getCountryOptions(): Promise<string[]> {
    const options = await this.countryDropdown
      .locator("option")
      .allTextContents();
    return options.filter((option) => option.trim() !== "");
  }

  @step("Get day options from dropdown")
  async getDayOptions(): Promise<string[]> {
    const options = await this.dayDropdown.locator("option").allTextContents();
    return options.filter((option) => option.trim() !== "");
  }

  @step("Get month options from dropdown")
  async getMonthOptions(): Promise<string[]> {
    const options = await this.monthDropdown
      .locator("option")
      .allTextContents();
    return options.filter((option) => option.trim() !== "");
  }

  @step("Get year options from dropdown")
  async getYearOptions(): Promise<string[]> {
    const options = await this.yearDropdown.locator("option").allTextContents();
    return options.filter((option) => option.trim() !== "");
  }

  @step("Fill mandatory signup fields")
  async fillMandatorySignUpFields(registrationData: any): Promise<void> {
    const currentName = await this.nameInput.inputValue();
    if (currentName !== registrationData.name) {
      await this.nameInput.clear();
      await this.nameInput.fill(registrationData.name);
    }

    await expect(this.emailInput).toHaveValue(registrationData.email);

    await this.passwordInput.fill(registrationData.password);

    await this.firstNameInput.fill(registrationData.address.firstName);
    await this.lastNameInput.fill(registrationData.address.lastName);
    await this.addressInput.fill(registrationData.address.address);
    await this.countryDropdown.selectOption(registrationData.address.country);
    await this.stateInput.fill(registrationData.address.state);
    await this.cityInput.fill(registrationData.address.city);
    await this.zipcodeInput.fill(registrationData.address.zipcode);
    await this.mobileNumberInput.fill(registrationData.address.mobileNumber);
  }
}
