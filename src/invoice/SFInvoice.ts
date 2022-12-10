import SFInvoiceItem from './SFInvoiceItem';
import SFInvoiceClient from './SFInvoiceClient';

export default class SFInvoice {
  public client: SFInvoiceClient;
  public params: object;
  private readonly _items: SFInvoiceItem[];

  constructor(client: SFInvoiceClient, params: object, items: SFInvoiceItem[] = []) {
    this.client = client;
    this.params = params;
    this._items = items;
  }

  get items(): SFInvoiceItem[] {
    return this._items;
  }

  addItem(item: SFInvoiceItem) {
    this._items.push(item);
  }
}
