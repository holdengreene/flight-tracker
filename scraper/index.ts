import playwright from "playwright";
import type { Flight } from "./types";

(async () => {
  const browser = await playwright.chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://matrix.itasoftware.com/search");

  await page.locator("#mat-mdc-chip-list-input-0").fill("SLC");

  await page.locator(".mat-mdc-option").click();

  await page.locator("#mat-mdc-chip-list-input-1").fill("CPT");

  await page.locator(".mat-mdc-option").click();

  await page.locator(".mat-start-date").fill("04/01/2025");

  await page.locator(".mat-end-date").fill("04/08/2025");

  await page.locator("body").click();

  await page.screenshot({ path: "before_submission.png", fullPage: true });

  await page.getByRole("button", { name: "Search" }).click();

  await page.screenshot({ path: "after_submission.png", fullPage: true });

  const matrix = page.locator("matrix-result-set-panel");

  await matrix.waitFor({ timeout: 120_000 });

  const flights = await page.$$eval(".mat-mdc-row", (allFlights) => {
    const data: Flight[] = [];

    for (const flight of allFlights) {
      const price =
        flight.querySelector<HTMLButtonElement>(
          ".mdc-button__label"
        )?.innerText;
      const airline =
        flight.querySelector<HTMLElement>(".airline-display")?.innerText;
      const departCol = flight.querySelector<HTMLElement>(".cdk-column-depart");
      const arriveCol = flight.querySelector<HTMLElement>(".cdk-column-arrive");
      // const departId = departCol?.querySelector<HTMLElement>(".time-display")?.getAttribute(".aria-describedby");

      const depart = Array.from(
        departCol?.querySelectorAll<HTMLElement>(".time-display") ?? []
      ).map((time) => time.innerText);
      const arrive = Array.from(
        arriveCol?.querySelectorAll<HTMLElement>(".time-display") ?? []
      ).map((time) => time.innerText);
      const duration = flight.querySelector<HTMLElement>(
        ".mat-column-duration"
      )?.innerText;

      data.push({ price, airline, depart, arrive, duration });
    }

    return data;
  });

  await page.screenshot({ path: "after_fetch.png", fullPage: true });

  console.log(flights);

  await browser.close();
})();
