import { test, expect, Locator, Response } from "@playwright/test";
import type { Page, BrowserContext } from "@playwright/test";

// Export standard Playwright utilities
export { test, expect, type Page, type BrowserContext, Locator, Response };

export function step(stepName?: string) {
    return <T extends (this: any, ...args: any[]) => any>(target: T, context: ClassMethodDecoratorContext) => {
        const methodName = String(context.name);
        const name = stepName || `${methodName}`;

        return function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
            return test.step(name, () => {
                return target.apply(this, args);
            }) as ReturnType<T>;
        };
    };
}