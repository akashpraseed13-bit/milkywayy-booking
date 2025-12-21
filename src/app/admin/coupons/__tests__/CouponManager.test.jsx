import { render, screen, fireEvent, waitFor } from '../../../../test-utils';
import CouponManager from '../CouponManager';
import { createCoupon, deleteCoupon, toggleCouponStatus } from '../../../../lib/actions/coupons';

const mockCoupons = [
  {
    id: 1,
    code: 'SAVE10',
    percentDiscount: 10,
    maxDiscount: 100,
    minimumAmount: 500,
    isActive: true,
  },
];

describe('CouponManager', () => {
  let originalLocation;

  beforeAll(() => {
    originalLocation = window.location;
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    createCoupon.mockResolvedValue({ success: true });
    deleteCoupon.mockResolvedValue({ success: true });
    toggleCouponStatus.mockResolvedValue({ success: true });
    
    // Mock window.location.reload
    delete window.location;
    window.location = { reload: jest.fn() };
    
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();
  });

  it('renders coupon list', () => {
    render(<CouponManager initialCoupons={mockCoupons} />);
    expect(screen.getByText('SAVE10')).toBeInTheDocument();
    expect(screen.getByText('10% OFF')).toBeInTheDocument();
  });

  it('handles delete coupon', async () => {
    render(<CouponManager initialCoupons={mockCoupons} />);
    const deleteButton = screen.getByTitle('Delete coupon');
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => {
      expect(deleteCoupon).toHaveBeenCalledWith(1);
    });
  });

  it('handles create coupon', async () => {
    render(<CouponManager initialCoupons={[]} />);
    
    fireEvent.click(screen.getByText(/Create Coupon/i));
    
    fireEvent.change(screen.getByLabelText(/Coupon Code/i), { target: { value: 'WELCOME' } });
    fireEvent.change(screen.getByLabelText(/Discount Percentage/i), { target: { value: '15' } });
    fireEvent.change(screen.getByLabelText(/Max Discount/i), { target: { value: '150' } });
    fireEvent.change(screen.getByLabelText(/Min Spend/i), { target: { value: '300' } });
    
    // Click the button in the dialog footer
    const createButtons = screen.getAllByRole('button', { name: /Create Coupon/i });
    fireEvent.click(createButtons[createButtons.length - 1]);
    
    await waitFor(() => {
      expect(createCoupon).toHaveBeenCalledWith(expect.objectContaining({
        code: 'WELCOME',
        percentDiscount: '15',
      }));
    });
  });
});
