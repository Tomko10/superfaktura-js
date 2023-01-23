import SFClient from '../SFClient';
import { PartialNullable } from '../utils/types';
import { nullableFloat, nullableInt } from '../utils/parse';

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

  static parseResponse(data: any): PartialNullable<IGetInvoiceItem> | null {
    // TODO: Implement
    if (!data) return null;
    return {
      description: data.description,
      discount: parseFloat(data.discount),
      discount_description: data.discount_description,
      discount_no_vat: parseFloat(data.discount_no_vat),
      discount_no_vat_total: parseFloat(data.discount_no_vat_total),
      discount_with_vat: parseFloat(data.discount_with_vat),
      discount_with_vat_total: parseFloat(data.discount_with_vat_total),
      id: parseInt(data.id, 10),
      invoice_id: parseInt(data.invoice_id, 10),
      item_price: parseFloat(data.item_price),
      item_price_no_discount: parseFloat(data.item_price_no_discount),
      item_price_vat: parseFloat(data.item_price_vat),
      item_price_vat_check: parseFloat(data.item_price_vat_check),
      item_price_vat_no_discount: parseFloat(data.item_price_vat_no_discount),
      name: data.name,
      ordernum: data.ordernum,
      quantity: parseFloat(data.quantity),
      sku: data.sku,
      stock_item_id: nullableInt(data.stock_item_id),
      tax: parseFloat(data.tax),
      tax_deposit: nullableFloat(data.tax_deposit),
      unit: data.unit,
      unit_price: parseFloat(data.unit_price),
      unit_price_discount: parseFloat(data.unit_price_discount),
      unit_price_vat: parseFloat(data.unit_price_vat),
      unit_price_vat_no_discount: parseFloat(data.unit_price_vat_no_discount),
      user_id: data.user_id,
      user_profile_id: data.user_profile_id,
    };
  }
}
