import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import Page from "../app/[locale]/(auth)/auth/sign-up/[[...sign-up]]/page";

test("Sign Up Page", async () => {
  const { container } = render(
    await Page({ params: Promise.resolve({ locale: "en" }) })
  );
  expect(container).toBeDefined();
});
