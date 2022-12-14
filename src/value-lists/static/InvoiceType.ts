type InvoiceType =
  | 'cancel'
  | 'delivery'
  | 'draft'
  | 'estimate'
  | 'order'
  | 'proforma'
  | 'regular'
  | 'reverse_order'
  | 'tax_document';

export default InvoiceType;
