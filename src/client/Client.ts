interface IBaseClient {}

export interface IGetClient extends IBaseClient {}

export interface ICreateClient extends IBaseClient {
  name: string;
  address: string;
  bank_account: string;
  city: string;
  comment: string;
  country: string;
  country_id: number;
  country_iso_id: string;
  delivery_address: string;
  delivery_city: string;
  delivery_country: string;
  delivery_country_id: number;
  delivery_country_iso_id: string;
  delivery_name: string;
  delivery_phone: string;
  delivery_zip: string;
  dic: string;
  email: string;
  fax: string;
  iban: string;
  ic_dph: string;
  ico: string;
  match_address: number;
  phone: string;
  swift: string;
  update_addressbook: number;
  zip: string;
}

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
