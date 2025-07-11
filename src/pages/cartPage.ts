import { type Locator, type Page, expect, step } from "../utils/base";

export const CART_URL = /automationexercise\.com\/view_cart/;

export interface CartItem {
  name: string;
  price: string;
  quantity: string;
  total: string;
}

export class CartPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get cartItems() {
    return this.page.locator("#cart_info_table tbody tr[id^='product-']");
  }

  get cartItemNames() {
    return this.page.locator(
      "#cart_info_table tbody tr[id^='product-'] .cart_description h4 a"
    );
  }

  get cartItemPrices() {
    return this.page.locator(
      "#cart_info_table tbody tr[id^='product-'] .cart_price p"
    );
  }

  get cartItemQuantities() {
    return this.page.locator(
      "#cart_info_table tbody tr[id^='product-'] .cart_quantity button"
    );
  }

  get cartItemTotals() {
    return this.page.locator(
      "#cart_info_table tbody tr[id^='product-'] .cart_total_price"
    );
  }

  get deleteButtons() {
    return this.page.locator(".cart_quantity_delete");
  }

  get emptyCartMessage() {
    return this.page.locator("text=Cart is empty!");
  }

  get proceedToCheckoutButton() {
    return this.page.locator(".btn.btn-default.check_out");
  }

  @step("Verify cart page loaded")
  async verifyCartPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(CART_URL);
    await this.page
      .locator("#cart_items")
      .waitFor({ state: "visible", timeout: 10000 });
  }

  @step("Get all cart items")
  async getAllCartItems(): Promise<CartItem[]> {
    const items: CartItem[] = [];
    const count = await this.cartItems.count();

    for (let i = 0; i < count; i++) {
      const name = (await this.cartItemNames.nth(i).textContent()) || "";
      const price = (await this.cartItemPrices.nth(i).textContent()) || "";
      const quantity =
        (await this.cartItemQuantities.nth(i).textContent()) || "";
      const total = (await this.cartItemTotals.nth(i).textContent()) || "";

      items.push({
        name: name.trim(),
        price: price.trim(),
        quantity: quantity.trim(),
        total: total.trim(),
      });
    }

    return items;
  }

  @step("Get cart item count")
  async getCartItemCount(): Promise<number> {
    const count = await this.cartItems.count();
    return count;
  }

  @step("Verify cart contains specific items")
  async verifyCartContainsItems(
    expectedItems: Array<{ name: string; price: string }>
  ): Promise<void> {
    const cartItems = await this.getAllCartItems();

    for (const expectedItem of expectedItems) {
      const foundItem = cartItems.find(
        (item) =>
          item.name.toLowerCase().includes(expectedItem.name.toLowerCase()) &&
          item.price === expectedItem.price
      );

      expect(foundItem).toBeDefined();
    }
  }

  @step("Verify cart item details")
  async verifyCartItemDetails(
    itemName: string,
    expectedPrice: string,
    expectedQuantity: string = "1"
  ): Promise<void> {
    const cartItems = await this.getAllCartItems();
    const foundItem = cartItems.find((item) =>
      item.name.toLowerCase().includes(itemName.toLowerCase())
    );

    expect(foundItem).toBeDefined();
    expect(foundItem!.price).toBe(expectedPrice);
    expect(foundItem!.quantity).toBe(expectedQuantity);
  }

  @step("Delete all items from cart")
  async deleteAllItemsFromCart(): Promise<void> {
    const deleteButtons = this.deleteButtons;
    const count = await deleteButtons.count();

    if (count === 0) {
      return;
    }

    for (let i = 0; i < count; i++) {
      await this.deleteButtons.first().click();
      await this.page.waitForTimeout(1000);
    }
  }

  @step("Verify cart is empty")
  async verifyCartIsEmpty(): Promise<void> {
    const itemCount = await this.getCartItemCount();
    expect(itemCount).toBe(0);
  }

  @step("Click proceed to checkout")
  async clickProceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }

  @step("Clean up cart")
  async cleanUpCart(): Promise<void> {
    try {
      if (!this.page.url().includes("/view_cart")) {
        await this.page.goto("https://automationexercise.com/view_cart");
      }

      await this.deleteAllItemsFromCart();
      await this.verifyCartIsEmpty();
    } catch (error) {}
  }
}
