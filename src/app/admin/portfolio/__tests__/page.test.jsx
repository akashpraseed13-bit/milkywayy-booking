import { render, screen, waitFor } from "../../../../test-utils";
import PortfolioManagement from "../page";

// Mock global fetch
global.fetch = jest.fn();

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// Mock Auth helper
jest.mock("../../../../lib/helpers/auth", () => ({
  getSessionUser: jest.fn(),
}));

describe("Portfolio Management Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders portfolio items after fetching", async () => {
    const { getSessionUser } = require("../../../../lib/helpers/auth");
    getSessionUser.mockResolvedValue({ role: "SUPERADMIN" });

    const mockItems = [
      { id: 1, title: "Work 1", type: "IMAGE", isVisible: true, order: 0 },
    ];
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockItems,
    });

    // Since it's an async server component, we render it
    const page = await PortfolioManagement({
      searchParams: Promise.resolve({}),
    });
    render(page);

    await waitFor(() => {
      expect(screen.getByText("Work 1")).toBeInTheDocument();
    });
  });

  it("shows empty state when no items", async () => {
    const { getSessionUser } = require("../../../../lib/helpers/auth");
    getSessionUser.mockResolvedValue({ role: "SUPERADMIN" });

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const page = await PortfolioManagement({
      searchParams: Promise.resolve({}),
    });
    render(page);

    await waitFor(() => {
      expect(screen.getByText(/no portfolio items found/i)).toBeInTheDocument();
    });
  });
});
