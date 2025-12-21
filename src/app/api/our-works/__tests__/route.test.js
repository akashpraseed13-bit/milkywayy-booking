import OurWork from "../../../../lib/db/models/ourwork";
import { GET } from "../route";

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));

// Mock Database Models
jest.mock("../../../../lib/db/models/ourwork", () => ({
  findAll: jest.fn(),
}));

describe("OurWorks Public API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns our works on success", async () => {
    const mockWorks = [{ id: 1, title: "Test Work" }];
    OurWork.findAll.mockResolvedValue(mockWorks);

    const request = { url: "http://localhost/api/our-works" };
    const response = await GET(request);
    const data = await response.json();

    expect(data).toEqual(mockWorks);
    expect(OurWork.findAll).toHaveBeenCalled();
  });

  it("handles limit parameter", async () => {
    OurWork.findAll.mockResolvedValue([]);
    const request = { url: "http://localhost/api/our-works?limit=3" };
    await GET(request);

    expect(OurWork.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 3,
      }),
    );
  });

  it("handles type filter", async () => {
    OurWork.findAll.mockResolvedValue([]);
    const request = { url: "http://localhost/api/our-works?type=IMAGE" };
    await GET(request);

    expect(OurWork.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          type: "IMAGE",
        }),
      }),
    );
  });
});
