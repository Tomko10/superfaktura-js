import { BankAccount } from '../bank-account';
import { ICreateClient, IGetClient } from '../client/Client';
import SFClient from '../SFClient';
import InvoiceItem, {
  ICreateInvoiceItem,
  IGetInvoiceItem,
} from './InvoiceItem';
import { Client } from '../client';
import {
  bool,
  formatFields,
  nullableBool,
  nullableDate,
  nullableInt,
  nullableString,
} from '../utils/parse';
import { PartialNullable } from '../utils/types';
import {
  Currency,
  DeliveryType,
  InvoiceType,
  Language,
  PaymentType,
  RoundingType,
} from '../value-lists/static';

interface BaseInvoice {
  comment: string;
  constant: string;
  created: Date;
  delivery: Date;
  delivery_type: DeliveryType;
  deposit: number;
  discount: number;
  due: Date;
  estimate_id: number | null;
  header_comment: string;
  internal_comment: string | null;
  invoice_currency: Currency;
  invoice_no_formatted: string;
  issued_by: string;
  issued_by_email: string;
  issued_by_phone: string;
  issued_by_web: string;
  name: string;
  order_no: string | null;
  parent_id: number | null;
  paydate: Date | null;
  payment_type: PaymentType | null;
  proforma_id: string | null;
  rounding: RoundingType;
  sequence_id: number;
  specific: string | null;
  tax_document: boolean | null;
  type: InvoiceType;
  variable: string;
  vat_transfer: boolean | null;
}

export interface ICreateInvoice extends BaseInvoice {
  add_rounding_item: boolean;
  already_paid: boolean;
  bank_accounts: BankAccount[];
  discount_total: number;
  logo_id: number;
  mark_sent: boolean;
  mark_sent_message: string;
  mark_sent_subject: string;
}

export interface IGetInvoice extends BaseInvoice {
  accounting_date: Date;
  amount: number;
  amount_paid: number;
  client_data: string;
  client_id: number;
  country_exchange_rate: number;
  demo: boolean;
  exchange_rate: number;
  flag: string;
  home_currency: string;
  id: number;
  import_id: number | null;
  import_parent_id: number | null;
  import_type: string | null;
  invoice_no: number;
  invoice_no_formatted_length: number;
  invoice_no_formatted_raw: string;
  items_data: string;
  items_name: string | null;
  lang: string | null;
  mask: string;
  modified: Date;
  my_data: { [key: string]: string };
  paid: number;
  show_items_with_dph: boolean;
  show_special_vat: boolean;
  special_vat_scheme: string | null;
  status: number;
  summary_invoice: string | null;
  tags: string | null;
  taxdate: Date | null;
  token: string;
  user_id: number;
  user_profile_id: number;
  variable_raw: string;
  vat: number;
}

export interface CreateInvoiceParams {
  Invoice: Partial<ICreateInvoice>;
  InvoiceItem: Partial<ICreateInvoiceItem>[];
  Client: Partial<ICreateClient>;
  InvoiceSetting?: {
    settings: string;
  };
  InvoiceExtra?: null; // TODO
  MyData?: null; // TODO
}

export interface GetInvoiceData {
  '0': { [key: string]: string };
  Client: IGetClient;
  ClientData: any;
  Invoice: IGetInvoice;
  InvoiceEmail: any;
  InvoiceExtra: { [key: string]: string };
  InvoiceItem: (IGetInvoiceItem & {
    AccountingDetail: { [key: string]: string };
  })[];
  InvoicePayment: any;
  InvoiceSetting: { [key: string]: string };
  Logo: any;
  MyData: any;
  PaymentLink: string;
  Paypal: boolean;
  PostStamp: any[];
  RelatedItems: any[];
  Signature: { [key: string]: string | boolean | null };
  Summary: any;
  SummaryInvoice: any;
  Tags: any[];
  UnitCount: any[];
}

export interface SendInvoiceParams {
  invoice_id: number;
  to: string;
  bcc?: string[];
  body?: string;
  cc?: string[];
  pdf_language?: Language;
  subject?: string;
}

export default class Invoice {
  /**
   * Parses the response from the API transforming to appropriate types.
   * @param data The response from the API (from JSON.parse).
   */
  public static parseResponse(data: any): PartialNullable<GetInvoiceData> {
    const clientData = data.Client ? Client.parseResponse(data) : null;

    const invoiceIn = data.Invoice;
    const invoiceData = !invoiceIn
      ? null
      : {
          accounting_date: new Date(invoiceIn.accounting_date),
          amount: parseFloat(invoiceIn.amount),
          amount_paid: parseFloat(invoiceIn.amount_paid),
          client_data: invoiceIn.client_data,
          client_id: parseInt(invoiceIn.client_id, 10),
          comment: invoiceIn.comment,
          constant: invoiceIn.constant,
          country_exchange_rate: parseFloat(invoiceIn.country_exchange_rate),
          created: new Date(invoiceIn.created),
          delivery: new Date(invoiceIn.delivery),
          delivery_type: invoiceIn.delivery_type,
          demo: bool(invoiceIn.demo),
          deposit: parseFloat(invoiceIn.deposit),
          discount: parseFloat(invoiceIn.discount),
          due: new Date(invoiceIn.due),
          estimate_id: nullableInt(invoiceIn.estimate_id),
          exchange_rate: parseFloat(invoiceIn.exchange_rate),
          flag: invoiceIn.flag,
          header_comment: invoiceIn.header_comment,
          home_currency: invoiceIn.home_currency,
          id: parseInt(invoiceIn.id, 10),
          import_id: nullableInt(invoiceIn.import_id),
          import_parent_id: nullableInt(invoiceIn.import_parent_id),
          import_type: invoiceIn.import_type,
          internal_comment: invoiceIn.internal_comment,
          invoice_currency: invoiceIn.invoice_currency,
          invoice_no: parseInt(invoiceIn.invoice_no, 10),
          invoice_no_formatted: invoiceIn.invoice_no_formatted,
          invoice_no_formatted_length: parseInt(
            invoiceIn.invoice_no_formatted_length,
            10,
          ),
          invoice_no_formatted_raw: invoiceIn.invoice_no_formatted_raw,
          issued_by: invoiceIn.issued_by,
          issued_by_email: invoiceIn.issued_by_email,
          issued_by_phone: invoiceIn.issued_by_phone,
          issued_by_web: invoiceIn.issued_by_web,
          items_data: invoiceIn.items_data,
          items_name: nullableString(invoiceIn.items_name),
          lang: nullableString(invoiceIn.lang),
          mask: invoiceIn.mask,
          modified: new Date(invoiceIn.modified),
          my_data: JSON.parse(invoiceIn.my_data),
          name: invoiceIn.name,
          order_no: nullableString(invoiceIn.order_no),
          paid: parseFloat(invoiceIn.paid),
          parent_id: nullableInt(invoiceIn.parent_id),
          paydate: nullableDate(invoiceIn.paydate),
          payment_type: invoiceIn.payment_type,
          proforma_id: nullableString(invoiceIn.proforma_id),
          // TODO: Find out what this is
          // recurring: nullableString(invoiceIn.recurring),
          rounding: invoiceIn.rounding,
          sequence_id: parseInt(invoiceIn.sequence_id, 10),
          show_items_with_dph: invoiceIn.show_items_with_dph,
          show_special_vat: invoiceIn.show_special_vat,
          special_vat_scheme: nullableString(invoiceIn.special_vat_scheme),
          specific: nullableString(invoiceIn.specific),
          status: parseInt(invoiceIn.status, 10),
          summary_invoice: nullableString(invoiceIn.summary_invoice),
          tags: nullableString(invoiceIn.tags),
          tax_document: nullableBool(invoiceIn.tax_document),
          taxdate: nullableDate(invoiceIn.taxdate),
          token: invoiceIn.token,
          type: invoiceIn.type,
          user_id: parseInt(invoiceIn.user_id, 10),
          user_profile_id: parseInt(invoiceIn.user_profile_id, 10),
          variable: invoiceIn.variable,
          variable_raw: invoiceIn.variable_raw,
          vat: parseFloat(invoiceIn.vat),
          vat_transfer: nullableBool(invoiceIn.vat_transfer),
        };

    const invoiceItems = !data.InvoiceItem
      ? null
      : data.InvoiceItem.map((item: any) => InvoiceItem.parseResponse(item));

    return {
      Client: clientData,
      Invoice: invoiceData,
      InvoiceItem: invoiceItems,
    };
  }

  public static async create(client: SFClient, params: CreateInvoiceParams) {
    const formattedParams = formatFields(params);

    const response = await client.sendRequest(
      '/invoices/create',
      'POST',
      formattedParams,
    );
    if (!response?.data) {
      return null;
    }
    return Invoice.parseResponse(response.data);
  }

  public static async get(
    client: SFClient,
    id: number,
  ): Promise<PartialNullable<GetInvoiceData> | null> {
    const data = await client.sendRequest(`/invoices/view/${id}.json`, 'GET');
    if (!data) {
      return null;
    }
    return Invoice.parseResponse(data);
  }

  public static async sendEmail(client: SFClient, params: SendInvoiceParams) {
    const response = await client.sendRequest('/invoices/send', 'POST', {
      Email: params,
    });
    if (!response?.data) {
      return null;
    }
    return Invoice.parseResponse(response.data);
  }
}
