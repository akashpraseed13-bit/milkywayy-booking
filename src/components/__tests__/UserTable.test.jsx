import { render, screen, fireEvent } from '../../test-utils';
import UserTable from '../UserTable';
import { useRouter } from 'next/navigation';

const mockUsers = [
  {
    id: 1,
    fullName: 'Admin User',
    email: 'admin@example.com',
    phone: '123456789',
    role: 'SUPERADMIN',
  },
  {
    id: 2,
    fullName: 'Transport User',
    email: 'transport@example.com',
    phone: '987654321',
    role: 'TRANSPORT',
  },
];

const mockPagination = {
  page: 1,
  limit: 10,
  total: 2,
  totalPages: 1,
};

describe('UserTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with users', () => {
    render(<UserTable users={mockUsers} pagination={mockPagination} />);
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByText('SUPERADMIN')).toBeInTheDocument();
    expect(screen.getByText('Transport User')).toBeInTheDocument();
    expect(screen.getByText('TRANSPORT')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<UserTable users={[]} pagination={{ ...mockPagination, total: 0, totalPages: 0 }} />);
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it('navigates to create user page on button click', () => {
    const router = useRouter();
    render(<UserTable users={mockUsers} pagination={mockPagination} />);
    
    fireEvent.click(screen.getByText(/\+ New User/i));
    expect(router.push).toHaveBeenCalledWith('/admin/users/create');
  });

  it('handles page change', () => {
    const router = useRouter();
    const pagination = { ...mockPagination, totalPages: 5 };
    render(<UserTable users={mockUsers} pagination={pagination} />);
    
    // Click page 2
    fireEvent.click(screen.getByText('2'));
    expect(router.push).toHaveBeenCalledWith(expect.stringContaining('page=2'));
  });

  it('handles next page click', () => {
    const router = useRouter();
    const pagination = { ...mockPagination, totalPages: 5 };
    render(<UserTable users={mockUsers} pagination={pagination} />);
    
    // Click next (aria-label="Go to next page") or just the link
    // The PaginationNext component usually has a specific text or icon
    const nextButton = screen.getByLabelText(/Go to next page/i);
    fireEvent.click(nextButton);
    expect(router.push).toHaveBeenCalledWith(expect.stringContaining('page=2'));
  });
});
