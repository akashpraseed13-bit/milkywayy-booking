import { PutObjectCommand } from "@aws-sdk/client-s3";
import { POST } from "../route";

// Mock AWS S3 Client
jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: jest.fn(() => ({
      send: jest.fn().mockResolvedValue({}),
    })),
    PutObjectCommand: jest.fn(),
  };
});

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));

describe("Admin Upload API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uploads a file successfully", async () => {
    const mockFile = new Blob(["test content"], { type: "image/jpeg" });
    mockFile.name = "test.jpg";
    mockFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(8));

    const formData = {
      get: jest.fn((key) => {
        if (key === "file") return mockFile;
        if (key === "folder") return "portfolio";
        return null;
      }),
    };

    const request = {
      formData: async () => formData,
    };

    const response = await POST(request);
    const data = await response.json();

    expect(data.url).toContain("test.jpg");
    expect(PutObjectCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        Key: expect.stringContaining("portfolio/general/"),
      }),
    );
  });

  it("returns 400 if no file is provided", async () => {
    const formData = {
      get: jest.fn(() => null),
    };

    const request = {
      formData: async () => formData,
    };

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
