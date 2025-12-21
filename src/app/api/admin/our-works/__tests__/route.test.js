import OurWork from "../../../../../lib/db/models/ourwork";
import { POST } from "../route";

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
jest.mock("../../../../../lib/db/models/ourwork", () => ({
  create: jest.fn(),
}));

describe("Admin OurWorks API Route - POST", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a new work entry on success", async () => {
    const mockPayload = {
      title: "New Work",
      subtitle: "New Subtitle",
      type: "IMAGE",
      mediaContent: "http://example.com/image.jpg",
    };
    OurWork.create.mockResolvedValue({ id: 1, ...mockPayload });

    const request = {
      json: async () => mockPayload,
    };
    const response = await POST(request);
    const data = await response.json();

    expect(data.id).toBe(1);
    expect(OurWork.create).toHaveBeenCalledWith(
      expect.objectContaining(mockPayload),
    );
    expect(response.status).toBe(201);
  });

  it("returns 400 if required fields are missing", async () => {
    const request = {
      json: async () => ({ title: "Incomplete" }),
    };
    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
