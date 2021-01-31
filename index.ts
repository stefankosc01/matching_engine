import {Order} from './auxiliaryStructures'
import {OrderBook} from './OrderBook'


const init = () => {
  const orderBook = new OrderBook()

  const buyOrder = new Order(1, 90, 100)

  orderBook.processBuyLimitOrder(buyOrder)

  const sellOrder = new Order(2, 85, 150)

  orderBook.processSellLimitOrder(sellOrder)

}

init()