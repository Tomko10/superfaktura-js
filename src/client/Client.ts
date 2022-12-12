interface IBaseClient {}

export interface IGetClient extends IBaseClient {}

export interface ICreateClient extends IBaseClient {}

export default class Client {
  public params: object;

  constructor(params: object) {
    this.params = params;
  }

  public static parseResponse(data: any): IGetClient | null {
    if (!data?.Client) {
      return null;
    }

    return data.Client;
  }
}
