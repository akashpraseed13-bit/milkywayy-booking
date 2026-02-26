import { render, screen, fireEvent, waitFor } from '../../../../test-utils';
import BookingList from '../BookingList';
import { cancelBooking } from '../../../../lib/actions/bookings';

// Mock window.confirm
window.confirm = jest.fn();

const mockBookings = [
  {
    id: 1,
    date: '2099-12-25',
    slot: 1,
    propertyDetails: { unit: '101', building: 'Tower A', community: 'Marina' },
    shootDetails: { services: ['Photography'] },
    cancelledAt: null,
    completedAt: null,
    transaction: { amount: 500 },
  },
];

describe('BookingList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation
    cancelBooking.mockResolvedValue({ success: true });
  });

  it('renders list of bookings', () => {
    render(<BookingList bookings={mockBookings} />);
    expect(screen.getByText('101, Tower A, Marina')).toBeInTheDocument();
    expect(screen.getByText('Photography')).toBeInTheDocument();
  });

  it('renders empty state when no bookings', () => {
    render(<BookingList bookings={[]} />);
    expect(screen.getByText(/no bookings found/i)).toBeInTheDocument();
  });

  it('opens dialog when booking is clicked', () => {
    render(<BookingList bookings={mockBookings} />);
    fireEvent.click(screen.getByText('101, Tower A, Marina'));
    expect(screen.getByText(/booking details #1/i)).toBeInTheDocument();
  });

  it('calls cancelBooking when cancel button is clicked and confirmed', async () => {
    render(<BookingList bookings={mockBookings} />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm cancel/i }));

    await waitFor(() => {
      expect(cancelBooking).toHaveBeenCalledWith(1);
    });
  });

  it('does not call cancelBooking if modal is dismissed', async () => {
    render(<BookingList bookings={mockBookings} />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    fireEvent.click(screen.getByRole('button', { name: /keep booking/i }));

    expect(cancelBooking).not.toHaveBeenCalled();
  });
});
