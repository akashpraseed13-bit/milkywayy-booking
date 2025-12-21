import OurWork from "../ourwork.js";

describe("OurWork Model", () => {
  it("should be defined", () => {
    expect(OurWork).toBeDefined();
  });

  it("should have correct attributes", () => {
    const attributes = OurWork.rawAttributes;
    expect(attributes.id).toBeDefined();
    expect(attributes.title).toBeDefined();
    expect(attributes.subtitle).toBeDefined();
    expect(attributes.type).toBeDefined();
    expect(attributes.mediaContent).toBeDefined();
    expect(attributes.order).toBeDefined();
    expect(attributes.isVisible).toBeDefined();
  });
});
