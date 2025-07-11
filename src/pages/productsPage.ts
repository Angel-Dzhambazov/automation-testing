import { type Locator, type Page, expect, step } from "../utils/base";

export const PRODUCTS_URL = /automationexercise\.com\/products/;

export class ProductsPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get searchProductInput() {
    return this.page.locator("#search_product");
  }

  get submitSearchButton() {
    return this.page.locator("#submit_search");
  }

  get allProductsTitle() {
    return this.page.locator('h2.title.text-center:has-text("All Products")');
  }

  get productCards() {
    return this.page.locator(".product-image-wrapper");
  }

  get productNames() {
    return this.page.locator(".productinfo p");
  }

  get productPrices() {
    return this.page.locator(".productinfo h2");
  }

  get addToCartButtons() {
    return this.page.locator(
      ".product-image-wrapper .overlay-content .add-to-cart"
    );
  }

  get productImageWrappers() {
    return this.page.locator(".product-image-wrapper");
  }

  get viewProductLinks() {
    return this.page.locator('a[href*="/product_details/"]');
  }

  get viewCartLink() {
    return this.page.locator("li a[href='/view_cart']");
  }

  get continueShoppingButton() {
    return this.page.getByRole("button", { name: "Continue Shopping" });
  }

  @step("Verify products page loaded")
  async verifyProductsPageLoaded(): Promise<void> {
    await this.allProductsTitle.waitFor({ state: "visible", timeout: 10000 });
    await expect(this.allProductsTitle).toBeVisible();
    await expect(this.allProductsTitle).toHaveText("All Products");
  }

  @step("Search for product")
  async searchForProduct(searchTerm: string): Promise<void> {
    await this.searchProductInput.fill(searchTerm);
    await this.submitSearchButton.click();
  }

  @step("Wait for search results to load")
  async waitForSearchResults(): Promise<void> {
    try {
      await this.page.waitForLoadState("domcontentloaded", { timeout: 5000 });
      await this.productCards
        .first()
        .waitFor({ state: "visible", timeout: 5000 });
    } catch (error) {
      await this.page
        .locator(".features_items")
        .waitFor({ state: "visible", timeout: 5000 });
    }
  }

  @step("Get all product names")
  async getAllProductNames(): Promise<string[]> {
    const names = await this.productNames.allTextContents();
    return names.filter((name) => name.trim() !== "");
  }

  @step("Get all product prices")
  async getAllProductPrices(): Promise<string[]> {
    const prices = await this.productPrices.allTextContents();
    return prices.filter((price) => price.trim() !== "");
  }

  @step("Get product details by index")
  async getProductDetailsByIndex(
    index: number
  ): Promise<{ name: string; price: string }> {
    const name = (await this.productNames.nth(index).textContent()) || "";
    const price = (await this.productPrices.nth(index).textContent()) || "";

    return {
      name: name.trim(),
      price: price.trim(),
    };
  }

  @step("Get product details by name")
  async getProductDetailsByName(
    productName: string
  ): Promise<{ name: string; price: string } | null> {
    const productCards = this.productCards;
    const productNames = this.productNames;
    const productPrices = this.productPrices;

    for (let i = 0; i < (await productCards.count()); i++) {
      const name = await productNames.nth(i).textContent();
      if (name && name.toLowerCase().includes(productName.toLowerCase())) {
        const price = (await productPrices.nth(i).textContent()) || "";
        return {
          name: name.trim(),
          price: price.trim(),
        };
      }
    }

    return null;
  }

  @step("Get product count")
  async getProductCount(): Promise<number> {
    const count = await this.productCards.count();
    return count;
  }

  @step("Verify search results contain term")
  async verifySearchResultsContainTerm(searchTerm: string): Promise<void> {
    const productNames = await this.getAllProductNames();
    const hasMatchingProducts = productNames.some((name) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(hasMatchingProducts).toBeTruthy();
  }

  @step("Add first product to cart")
  async addFirstProductToCart(): Promise<void> {
    const firstProductWrapper = this.productImageWrappers.first();
    await firstProductWrapper.hover();

    const firstAddToCartButton = this.addToCartButtons.first();
    await firstAddToCartButton.click();
  }

  @step("Add product to cart by index")
  async addProductToCartByIndex(index: number): Promise<void> {
    const productWrapper = this.productImageWrappers.nth(index);
    await productWrapper.hover();

    const addToCartButton = this.addToCartButtons.nth(index);
    await addToCartButton.click();
  }

  @step("Add product to cart by name")
  async addProductToCartByName(productName: string): Promise<void> {
    const productCards = this.productCards;
    const productNames = this.productNames;

    for (let i = 0; i < (await productCards.count()); i++) {
      const name = await productNames.nth(i).textContent();
      if (name && name.toLowerCase().includes(productName.toLowerCase())) {
        const productWrapper = this.productImageWrappers.nth(i);
        await productWrapper.hover();

        await this.addToCartButtons.nth(i).click();
        return;
      }
    }

    throw new Error(`Product with name containing "${productName}" not found`);
  }

  @step("Wait for cart modal to appear")
  async waitForCartModalToAppear(): Promise<void> {
    await this.continueShoppingButton.waitFor({
      state: "visible",
      timeout: 10000,
    });
  }

  @step("Click continue shopping from modal")
  async clickContinueShoppingFromModal(): Promise<void> {
    await this.waitForCartModalToAppear();
    await this.continueShoppingButton.click();
  }

  @step("Wait for cart modal to be closed")
  async waitForCartModalToClose(): Promise<void> {
    await this.page
      .locator("#cartModal")
      .waitFor({ state: "hidden", timeout: 5000 });
  }

  @step("Click view cart from modal")
  async clickViewCartFromModal(): Promise<void> {
    await this.viewCartLink.click();
  }
}
