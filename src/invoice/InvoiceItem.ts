import { SFClient } from '../SFClient';

interface IBaseInvoiceItem {
  description: string;
  discount: number;
  discount_description: string;
  name: string;
  quantity: number;
  sku: string;
  stock_item_id: number;
  tax: number;
  unit: string;
  unit_price: number;
}

export interface ICreateInvoiceItem extends IBaseInvoiceItem {
  load_data_from_stock: number;
  use_document_currency: number;
}

export interface IGetInvoiceItem extends IBaseInvoiceItem {
  discount_no_vat: number;
  discount_no_vat_total: number;
  discount_with_vat: number;
  discount_with_vat_total: number;
  id: number;
  invoice_id: number;
  item_price: number;
  item_price_no_discount: number;
  item_price_vat: number;
  item_price_vat_check: number;
  item_price_vat_no_discount: number;
  ordernum: string;
  tax_deposit: number;
  unit_price_discount: number;
  unit_price_vat: number;
  unit_price_vat_no_discount: number;
  user_id: string;
  user_profile_id: string;
}

export default class InvoiceItem {
  private client: SFClient;

  constructor(client: SFClient) {
    this.client = client;
  }

  static parseResponse(data: any): IGetInvoiceItem | null {
    // TODO: Implement
    return null;
  }
}
