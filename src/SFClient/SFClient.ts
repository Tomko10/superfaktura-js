import axios, { AxiosInstance } from 'axios';
import { SFAPIError } from '../error';
import { SFInvoice } from '../invoice';

const defaultBaseURL = 'https://moja.superfaktura.sk';
const createInvoiceURL = 'invoices/create';
const listInvoicesURL = 'invoices/index.json';
const getPdfURL = 'invoices/pdf';

export default class SFClient {
  private readonly apiUrl: string;
  private readonly email: string;
  private readonly apiKey: string;
  private readonly module: string;
  private readonly companyId: string | undefined;
  private fetcher: AxiosInstance;

  constructor(email: string, apiKey: string, module: string, companyId?: string, apiUrl: string = defaultBaseURL) {
    this.email = email;
    this.apiKey = apiKey;
    this.module = module;
    this.companyId = companyId;
    this.apiUrl = apiUrl;
    this.fetcher = axios.create({
      baseURL: this.apiUrl,
      headers: this.requestHeaders(),
    });
  }

  constructFilter(params: { [key: string]: any }) {
    return Object.entries(params)
      .map(([key, value]) => `/${key}:${value.toString()}`)
      .join('');
  }

  requestHeaders() {
    const authHeader =
      `SFAPI email=${this.email}
                      &apikey=${this.apiKey}
                      &module=${this.module}` + (this.companyId ? `&company_id=${this.companyId}` : '');

    return {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Authorization: authHeader,
    };
  }

  /**
   * Sends a request to the API
   * @param action {string} The URL of the action to perform
   * @param method {string} The HTTP method to use
   * @param data {object} The data to send
   * @param filter {object} The filters to use
   * @returns {Promise<any>} The response from the API
   * @throws {SFAPIError} If the API returns an error
   */
  async sendRequest(
    action: string,
    method: string = 'GET',
    data?: { [key: string]: any },
    filter?: { [key: string]: any },
  ) {
    const url = `${this.apiUrl}/${action}` + (filter ? '/' + this.constructFilter(filter) : '');

    try {
      const response = await this.fetcher.request({
        method,
        url,
        headers: this.requestHeaders(),
        data: data ? 'data=' + JSON.stringify(data) : undefined,
      });

      if (response.status < 200 || response.status >= 300) {
        throw new SFAPIError(
          `${method} on ${action} failed with status 
          ${response.status}: ${response.statusText}`,
          response.status,
        );
      }

      return response.data;
    } catch (error: any) {
      console.log(error);
      if (error instanceof SFAPIError) {
        throw error;
      } else if (error instanceof Error) {
        throw new SFAPIError(`${method} on ${action} failed with ${error.message}`);
      }
    }
  }

  /**
   * Creates an invoice in the API
   * @param invoice {SFInvoice} The invoice to create
   * @returns {Promise<any>} The response from the API
   */
  async createInvoice(invoice: SFInvoice) {
    const data = {
      Client: invoice.client.params,
      Invoice: invoice.params,
      Items: invoice.items.map((item) => item.params),
    };

    return this.sendRequest(createInvoiceURL, 'POST', data);
  }

  /**
   * Gets an invoice's PDF from the API
   * @param invoiceId {string} The ID of the invoice to get
   * @param token {string} The token of the invoice to get
   */
  async getPdf(invoiceId: string, token: string) {
    const action = getPdfURL + '/' + invoiceId;
    return this.sendRequest(action, 'GET', undefined, { token });
  }

  async listInvoices(params: { [key: string]: any }) {
    const invoices = this.sendRequest(listInvoicesURL, 'GET', undefined, params);
    // TODO: Parse the response into SFInvoice objects
  }
}
