import { test, expect } from "../utils/base";
import { HomePage } from "../pages/homePage";
import { ProductsPage } from "../pages/productsPage";
import { CartPage } from "../pages/cartPage";

test.describe("Search and Add Product to Cart", () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    await page.goto("https://automationexercise.com");
    await homePage.acceptCookiesIfPresent();
    await homePage.verifyHomePageLoaded();
    await cartPage.cleanUpCart();
  });

  test("should search for T-shirt and add first result to cart", async ({
    page,
  }) => {
    await homePage.navigateToProducts();
    await productsPage.verifyProductsPageLoaded();

    await productsPage.searchForProduct("T-shirt");
    await productsPage.waitForSearchResults();
    await productsPage.verifySearchResultsContainTerm("T-shirt");

    const productCount = await productsPage.getProductCount();
    const productDetails = await productsPage.getProductDetailsByIndex(0);

    await productsPage.addFirstProductToCart();
    await productsPage.clickContinueShoppingFromModal();
    await productsPage.waitForCartModalToClose();

    await homePage.navigateToCart();
    await cartPage.verifyCartPageLoaded();
    await cartPage.verifyCartItemDetails(
      productDetails.name,
      productDetails.price
    );
  });

  test("should search for Dress and add specific product to cart", async ({
    page,
  }) => {
    await homePage.navigateToProducts();
    await productsPage.verifyProductsPageLoaded();

    await productsPage.searchForProduct("Dress");
    await productsPage.waitForSearchResults();
    await productsPage.verifySearchResultsContainTerm("Dress");

    const productNames = await productsPage.getAllProductNames();
    const productDetails = await productsPage.getProductDetailsByName("Dress");
    expect(productDetails).not.toBeNull();

    await productsPage.addProductToCartByName("Dress");
    await productsPage.clickContinueShoppingFromModal();
    await productsPage.waitForCartModalToClose();

    await homePage.navigateToCart();
    await cartPage.verifyCartPageLoaded();
    await cartPage.verifyCartItemDetails(
      productDetails!.name,
      productDetails!.price
    );
  });

  test("should search for Top and add product by index", async ({ page }) => {
    await homePage.navigateToProducts();
    await productsPage.verifyProductsPageLoaded();

    await productsPage.searchForProduct("Top");
    await productsPage.waitForSearchResults();
    await productsPage.verifySearchResultsContainTerm("Top");

    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    const productNames = await productsPage.getAllProductNames();
    const productDetails = await productsPage.getProductDetailsByIndex(1);

    await productsPage.addProductToCartByIndex(1);
    await productsPage.clickContinueShoppingFromModal();
    await productsPage.waitForCartModalToClose();

    await homePage.navigateToCart();
    await cartPage.verifyCartPageLoaded();
    await cartPage.verifyCartItemDetails(
      productDetails.name,
      productDetails.price
    );
  });

  test("should handle search with no results", async ({ page }) => {
    await homePage.navigateToProducts();
    await productsPage.verifyProductsPageLoaded();

    await productsPage.searchForProduct("NonExistentProduct123");
    await productsPage.waitForSearchResults();

    const productCount = await productsPage.getProductCount();
    expect(productCount).toBe(0);
  });

  test("should search and add multiple products to cart", async ({ page }) => {
    await homePage.navigateToProducts();
    await productsPage.verifyProductsPageLoaded();

    await productsPage.searchForProduct("Men");
    await productsPage.waitForSearchResults();
    await productsPage.verifySearchResultsContainTerm("Men");

    const selectedProducts: Array<{ name: string; price: string }> = [];

    const firstProductDetails = await productsPage.getProductDetailsByIndex(0);
    selectedProducts.push(firstProductDetails);

    await productsPage.addFirstProductToCart();
    await productsPage.clickContinueShoppingFromModal();
    await productsPage.waitForCartModalToClose();

    const secondProductDetails = await productsPage.getProductDetailsByIndex(1);
    selectedProducts.push(secondProductDetails);

    await productsPage.addProductToCartByIndex(1);
    await productsPage.clickContinueShoppingFromModal();
    await productsPage.waitForCartModalToClose();

    await homePage.navigateToCart();
    await cartPage.verifyCartPageLoaded();
    await cartPage.verifyCartContainsItems(selectedProducts);

    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(2);
  });

  test("should search for Jeans and verify product details", async ({
    page,
  }) => {
    await homePage.navigateToProducts();
    await productsPage.verifyProductsPageLoaded();

    await productsPage.searchForProduct("Jeans");
    await productsPage.waitForSearchResults();
    await productsPage.verifySearchResultsContainTerm("Jeans");

    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    const productDetails = await productsPage.getProductDetailsByName("Jeans");
    expect(productDetails).not.toBeNull();

    await productsPage.addProductToCartByName("Jeans");
    await productsPage.clickContinueShoppingFromModal();
    await productsPage.waitForCartModalToClose();

    await homePage.navigateToCart();
    await cartPage.verifyCartPageLoaded();
    await cartPage.verifyCartItemDetails(
      productDetails!.name,
      productDetails!.price
    );
  });

  test("should complete full search and add to cart workflow", async ({
    page,
  }) => {
    await homePage.navigateToProducts();
    await productsPage.verifyProductsPageLoaded();

    const searchTerm = "T-shirt";
    await productsPage.searchForProduct(searchTerm);
    await productsPage.waitForSearchResults();
    await productsPage.verifySearchResultsContainTerm(searchTerm);

    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    const productDetails = await productsPage.getProductDetailsByIndex(0);

    await productsPage.addFirstProductToCart();
    await productsPage.clickContinueShoppingFromModal();
    await productsPage.waitForCartModalToClose();

    await homePage.navigateToCart();
    await cartPage.verifyCartPageLoaded();
    await cartPage.verifyCartItemDetails(
      productDetails.name,
      productDetails.price
    );

    const cartItems = await cartPage.getAllCartItems();
    const addedItem = cartItems.find((item) =>
      item.name.toLowerCase().includes(productDetails.name.toLowerCase())
    );
    expect(addedItem).toBeDefined();
    expect(addedItem!.quantity).toBe("1");
  });
});
