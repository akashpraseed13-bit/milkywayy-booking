import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DateSlotPicker from '../DateSlotPicker';
import { getAvailabilityForRange } from '@/lib/actions/bookings';

// Mock the action
jest.mock('../../lib/actions/bookings', () => ({
  getAvailabilityForRange: jest.fn(() => Promise.resolve({ success: true, data: {} })),
}));

describe('DateSlotPicker', () => {
  const mockOnDateChange = jest.fn();
  const mockOnSlotChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and opens dialog', async () => {
    render(
      <DateSlotPicker 
        date="2026-01-05" 
        slot="10:00" 
        onDateChange={mockOnDateChange} 
        onSlotChange={mockOnSlotChange} 
      />
    );

    const input = screen.getByPlaceholderText(/Select Date & Time/i);
    fireEvent.click(input);

    expect(screen.getByText(/Select Date & Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Available Slots/i)).toBeInTheDocument();
  });

  it('renders hourly slots', async () => {
    render(
      <DateSlotPicker 
        date="2026-01-05" 
        slot="10:00" 
        onDateChange={mockOnDateChange} 
        onSlotChange={mockOnSlotChange} 
      />
    );

    fireEvent.click(screen.getByPlaceholderText(/Select Date & Time/i));

    // Check for some hourly slots
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('05:30 PM')).toBeInTheDocument();
  });

  it('disables slots that exceed 18:00 based on duration', async () => {
    // Duration 4 hours. 15:00 + 4h = 19:00 > 18:00.
    // 14:00 + 4h = 18:00. Should be available.
    render(
      <DateSlotPicker 
        date="2026-01-05" 
        slot="" 
        duration={4}
        onDateChange={mockOnDateChange} 
        onSlotChange={mockOnSlotChange} 
      />
    );

    fireEvent.click(screen.getByPlaceholderText(/Select Date & Time/i));

    const slot1400 = screen.getByText('02:00 PM').closest('button');
    const slot1500 = screen.getByText('03:00 PM').closest('button');

    expect(slot1400).not.toBeDisabled();
    expect(slot1500).toBeDisabled();
  });

  it('disables slots that overlap with blocked slots', async () => {
    // Blocked slot at 12:00
    // User wants 2 hours. 11:00 should be disabled because 11:00-13:00 overlaps 12:00.
    render(
      <DateSlotPicker 
        date="2026-01-05" 
        slot="" 
        duration={2}
        blockedSlotsMap={{"2026-01-05": ["12:00"]}}
        onDateChange={mockOnDateChange} 
        onSlotChange={mockOnSlotChange} 
      />
    );

    fireEvent.click(screen.getByPlaceholderText(/Select Date & Time/i));

    const slot1100 = screen.getByText('11:00 AM').closest('button');
    const slot1130 = screen.getByText('11:30 AM').closest('button');
    const slot1200 = screen.getByText('12:00 PM').closest('button');
    const slot1000 = screen.getByText('10:00 AM').closest('button'); // 10:00-12:00, touches 12:00 but shouldn't overlap if we use strict <

    expect(slot1100).toBeDisabled();
    expect(slot1130).toBeDisabled();
    expect(slot1200).toBeDisabled();
    expect(slot1000).not.toBeDisabled();
  });
});
