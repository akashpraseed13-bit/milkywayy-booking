import { render, screen } from '../../../../test-utils';
import InvoiceList from '../InvoiceList';

const mockInvoices = [
  {
    id: 1,
    createdAt: '2025-12-01T10:00:00.000Z',
    amount: 1500,
    invoiceUrl: 'https://example.com/invoice1.pdf',
  },
  {
    id: 2,
    createdAt: '2025-12-05T10:00:00.000Z',
    amount: 500,
    invoiceUrl: null,
  },
];

describe('InvoiceList', () => {
  it('renders list of invoices', () => {
    render(<InvoiceList invoices={mockInvoices} />);
    expect(screen.getByText(/Invoice #INV001/i)).toBeInTheDocument();
    expect(screen.getByText(/AED 1500/i)).toBeInTheDocument();
    expect(screen.getByText(/Invoice #INV002/i)).toBeInTheDocument();
    expect(screen.getByText(/AED 500/i)).toBeInTheDocument();
  });

  it('renders empty state when no invoices', () => {
    render(<InvoiceList invoices={[]} />);
    expect(screen.getByText(/no invoices found/i)).toBeInTheDocument();
  });

  it('renders download link when invoiceUrl is present', () => {
    render(<InvoiceList invoices={[mockInvoices[0]]} />);
    const downloadLink = screen.getByRole('link', { name: /download/i });
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute('href', 'https://example.com/invoice1.pdf');
  });

  it('renders generating message when invoiceUrl is missing', () => {
    render(<InvoiceList invoices={[mockInvoices[1]]} />);
    expect(screen.getByText(/generating invoice.../i)).toBeInTheDocument();
  });
});
