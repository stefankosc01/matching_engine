export class OrderBookEntry {
  size: number;
  next?: OrderBookEntry;
  traderId: number;
  constructor(size: number, traderId: number) {
    this.size = size;
    this.traderId = traderId;
  }
}

export class PricePoint {
  listHead?: OrderBookEntry;
  listTail: OrderBookEntry;
  price: number;

  constructor(price: number) {
    this.price = price;
  }
}

export class Order {
  traderId: number;
  price: number;
  size: number;
//   side: number;
  constructor(traderId: number, price: number, size: number) {
      this.traderId = traderId
      this.price = price
      this.size = size
  }
}
