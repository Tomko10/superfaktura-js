import { SFClient } from '../../SFClient';

const defaultBriefUrl = '/countries';
const defaultDetailedUrl = '/countries/index';

export interface CountryDetail {
  Country: {
    name: string;
    id: number;
    eu: boolean;
    iso: string;
  };
}

export interface CountriesBrief {
  [key: string]: string;
}

export default class Countries {
  public static async list(
    client: SFClient,
    actionUrl: string = defaultBriefUrl,
  ): Promise<CountriesBrief> {
    return client.sendRequest(actionUrl);
  }

  public static async listDetailed(
    client: SFClient,
    actionUrl: string = defaultDetailedUrl,
  ): Promise<CountryDetail[]> {
    return client.sendRequest(actionUrl, 'GET', undefined, { view_full: 1 });
  }

  public static async getByName(
    client: SFClient,
    name: string,
    listDetailedUrl: string = defaultDetailedUrl,
  ): Promise<CountryDetail | undefined> {
    const countries = await this.listDetailed(client, listDetailedUrl);
    return countries.find((country) => country.Country.name === name);
  }
}
