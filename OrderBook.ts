import { PricePoint, OrderBookEntry, Order } from "./auxiliaryStructures";

export class OrderBook {
  // TODO: store all price points in one structure
  private buyPricePoints: PricePoint[] = [];
  private sellPricePoints: PricePoint[] = [];
  private currentOrderId: number = 0;

  processBuyLimitOrder(order: Order) {
    let priceIndex = 0;
    while (order.size) {
      if (
        this.sellPricePoints[priceIndex] &&
        order.price >= this.sellPricePoints[priceIndex].price
      ) {
        for (let i = priceIndex; i < this.sellPricePoints.length; i++) {
          priceIndex++;
          let bookEntry = this.sellPricePoints[0].listHead;
          while (bookEntry) {
            if (bookEntry.size < order.size) {
              this.executeTrade(
                order.traderId,
                bookEntry.traderId,
                order.price,
                bookEntry.size
              );
              order.size -= bookEntry.size;
              bookEntry.size = 0
              bookEntry = bookEntry.next;
            } else {
              this.executeTrade(
                order.traderId,
                bookEntry.traderId,
                order.price,
                order.size
              );
              if (bookEntry.size > order.size) {
                bookEntry.size -= order.size;
                order.size = 0
              } else {
                bookEntry = bookEntry.next;
              }
              this.sellPricePoints[0].listHead = bookEntry;
              return this.currentOrderId++;
            }
          }
        }
      } else {
        const pricePoint = this.buyPricePoints.find(
          pp => pp.price === order.price
        );
        let toInsert: PricePoint;
        if (!pricePoint) {
          toInsert = new PricePoint(order.price);
          // TODO: refactor to avoid pushing and sorting
          this.buyPricePoints.push(toInsert);
          this.buyPricePoints.sort((a, b) => a.price - b.price);
        } else {
          toInsert = pricePoint;
        }
        this.insertBookEntry(
          toInsert,
          new OrderBookEntry(order.size, order.traderId)
        );
        order.size = 0;
      }
    }
  }

  processSellLimitOrder(order: Order) {
    let priceIndex = 0;
    while (order.size) {
      if (
        this.buyPricePoints[priceIndex] &&
        order.price <= this.buyPricePoints[priceIndex].price
      ) {
        for (let i = priceIndex; i < this.buyPricePoints.length; i++) {
          priceIndex++;
          let bookEntry = this.buyPricePoints[i].listHead;
          while (bookEntry) {
            if (bookEntry.size < order.size) {
              this.executeTrade(
                order.traderId,
                bookEntry.traderId,
                order.price,
                bookEntry.size
              );
              order.size -= bookEntry.size;
              bookEntry.size = 0
              bookEntry = bookEntry.next;
            } else {
              this.executeTrade(
                order.traderId,
                bookEntry.traderId,
                order.price,
                order.size
              );
              if (bookEntry.size > order.size) {
                bookEntry.size -= order.size;
                order.size = 0
              } else {
                bookEntry = bookEntry.next;
              }
              this.buyPricePoints[i].listHead = bookEntry;
              return this.currentOrderId++;
            }
          }
        }
      } else {
        const pricePoint = this.sellPricePoints.find(
          pp => pp.price === order.price
        );
        let toInsert: PricePoint;
        if (!pricePoint) {
          toInsert = new PricePoint(order.price);
          // TODO: refactor to avoid pushing and sorting
          this.sellPricePoints.push(toInsert);
          this.sellPricePoints.sort((a, b) => b.price - a.price);
        } else {
          toInsert = pricePoint;
        }
        this.insertBookEntry(
          toInsert,
          new OrderBookEntry(order.size, order.traderId)
        );
        order.size = 0;
      }
    }
  }

  private insertBookEntry(pricePoint: PricePoint, entry: OrderBookEntry) {
    if (pricePoint.listHead) {
      pricePoint.listTail.next = entry;
    } else {
      pricePoint.listHead = entry;
    }
    pricePoint.listTail = entry;
  }

  private executeTrade(
    buyTraderId: number,
    sellTraderId: number,
    price: number,
    size: number
  ) {
    if (!size) {
      return;
    }
    let exec: any = {};
    exec.price = price;
    exec.size = size;
    exec.side = 0;
    exec.traderId = buyTraderId;
    // report to buy-side

    exec.side = 1;
    exec.traderId = sellTraderId;
    // report to sell-side
  }
}
