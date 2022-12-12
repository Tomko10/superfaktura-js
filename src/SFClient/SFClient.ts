import axios, { AxiosInstance } from 'axios';
import { SFAPIError } from '../error';

const defaultBaseURL = 'https://moja.superfaktura.sk';

export default class SFClient {
  private readonly apiUrl: string;
  private readonly email: string;
  private readonly apiKey: string;
  private readonly module: string;
  private readonly companyId: string | undefined;
  private fetcher: AxiosInstance;

  constructor(
    email: string,
    apiKey: string,
    module: string,
    companyId?: string,
    apiUrl: string = defaultBaseURL,
  ) {
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

  private static constructFilter(params: { [key: string]: any }) {
    return Object.entries(params)
      .map(([key, value]) => `/${key}:${value.toString()}`)
      .join('');
  }

  private requestHeaders() {
    const authHeader =
      `SFAPI email=${this.email}` +
      `&apikey=${this.apiKey}` +
      `&module=${this.module}` +
      (this.companyId ? `&company=${this.companyId}` : '');

    return {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Authorization: authHeader,
    };
  }

  private requestUrl(action: string, filter?: { [key: string]: any }) {
    return (
      `${this.apiUrl}${action}` +
      (filter ? SFClient.constructFilter(filter) : '')
    );
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
    const url = this.requestUrl(action, filter);

    try {
      const response = await this.fetcher.request({
        method,
        url,
        headers: this.requestHeaders(),
        data: data ? 'data=' + JSON.stringify(data) : undefined,
      });

      if (
        response.status < 200 ||
        response.status >= 300 ||
        response.data.error > 0
      ) {
        throw new SFAPIError(
          `${method} on ${action} failed with status 
          ${response.status}: ${
            response.data.error > 0
              ? response.data.error_message
              : response.statusText
          }`,
          response.status,
        );
      }

      return response.data;
    } catch (error: any) {
      console.log(error);
      if (error instanceof SFAPIError) {
        throw error;
      } else if (error instanceof Error) {
        throw new SFAPIError(
          `${method} on ${action} failed with ${error.message}`,
        );
      }
    }
  }
}
