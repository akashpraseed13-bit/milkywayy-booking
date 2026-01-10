import { isTouchDevice } from "../ui";

describe("ui helpers", () => {
  const originalOntouchstart = window.ontouchstart;
  const originalMaxTouchPoints = navigator.maxTouchPoints;

  afterEach(() => {
    window.ontouchstart = originalOntouchstart;
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: originalMaxTouchPoints,
      configurable: true,
    });
  });

  it("returns true if ontouchstart is in window", () => {
    window.ontouchstart = () => {};
    expect(isTouchDevice()).toBe(true);
  });

  it("returns true if maxTouchPoints > 0", () => {
    delete window.ontouchstart;
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: 1,
      configurable: true,
    });
    expect(isTouchDevice()).toBe(true);
  });

  it("returns false if no touch points and no ontouchstart", () => {
    delete window.ontouchstart;
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: 0,
      configurable: true,
    });
    expect(isTouchDevice()).toBe(false);
  });
});
