import { GET } from '../route';
import { NextResponse } from 'next/server';
import Booking from '../../../../../lib/db/models/booking';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));

// Mock Database Models
jest.mock('../../../../../lib/db/models/booking', () => ({
  findAll: jest.fn(),
}));
jest.mock('../../../../../lib/db/models/transaction', () => ({}));
jest.mock('../../../../../lib/db/models/user', () => ({}));
jest.mock('../../../../../lib/db/relations', () => ({}));

describe('Admin Bookings API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns bookings on success', async () => {
    const mockBookings = [{ id: 1, status: 'CONFIRMED' }];
    Booking.findAll.mockResolvedValue(mockBookings);

    const response = await GET();
    const data = await response.json();

    expect(data).toEqual(mockBookings);
    expect(Booking.findAll).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(mockBookings);
  });

  it('returns 500 on error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    Booking.findAll.mockRejectedValue(new Error('DB Error'));

    const response = await GET();
    
    expect(response.status).toBe(500);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
    
    consoleSpy.mockRestore();
  });
});