"use client";

import { Download } from "lucide-react";

export default function InvoiceList({ invoices }) {
  if (!invoices || invoices.length === 0) {
    return <p className="text-gray-400">No invoices found.</p>;
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="bg-card/70 p-6 rounded-lg border flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <div className="text-xl font-semibold mb-2 text-white">
              Invoice #INV{(invoice.id + "").padStart(3, "0")}
            </div>
            <div className="text-gray-400 space-y-1 text-sm">
              <p>{new Date(invoice.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-end flex-col gap-2">
            <span className="font-bold">AED {invoice.amount}</span>
            {invoice.invoiceUrl ? (
              <a
                href={invoice.invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground font-semibold rounded-md text-sm font-medium transition-colors"
              >
                <Download size={16} />
                Download
              </a>
            ) : (
              <span className="text-gray-500 text-sm italic">
                Generating invoice...
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
