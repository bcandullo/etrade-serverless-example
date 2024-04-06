import { log } from 'console';
import { PlaceOrderResponse, PreviewOrderResponse } from 'e-trade-api';

import {
  etrade,
  orderType,
  securityType,
  ACCOUNT_ID_KEY as accountIdKey,
} from '../etrade';
import { OrderData } from '../types';

export const createBuyOrderPreviews = async (
  orderData: OrderData[],
): Promise<PreviewOrderResponse[]> => {
  const clientOrderId = Date.now();

  const previewOrderRequests: Promise<PreviewOrderResponse>[] = orderData.map(
    ({ symbol, quantity }, index) =>
      etrade.previewOrder({
        accountIdKey,
        orderType,
        clientOrderId: clientOrderId + (index + 1) * 2,
        order: [
          {
            allOrNone: true,
            priceType: 'MARKET',
            orderTerm: 'GOOD_FOR_DAY',
            marketSession: 'REGULAR',
            Instrument: [
              {
                Product: {
                  symbol,
                  securityType,
                },
                orderAction: 'BUY',
                quantityType: 'QUANTITY',
                quantity,
              },
            ],
          },
        ],
      }),
  );

  const previewOrderResponses = await Promise.all(previewOrderRequests);

  // log('createBuyOrderPreviews', previewOrderResponses);

  return previewOrderResponses;
};

export const createBuyOrders = async (
  orderData: OrderData[],
): Promise<PlaceOrderResponse[]> => {
  const orderPreviews: PreviewOrderResponse[] = await createBuyOrderPreviews(
    orderData,
  );

  // log('created buy order previews');
  // log(JSON.stringify(orderPreviews, null, 4));

  // Immediately request order with mandatory preview id
  const orderRequests: Promise<PlaceOrderResponse>[] = orderPreviews.map(
    preview =>
      etrade.placeOrder({
        accountIdKey,
        orderType,
        clientOrderId: preview.PreviewIds[0].previewId,
        order: preview.Order,
        previewIds: preview.PreviewIds,
      }),
  );

  const orders = await Promise.all(orderRequests);

  log('created buy orders', orders);

  return orders;
};

// This particular order is just long at market, many different order types are supported.
export const createSellOrderPreview = async (
  clientOrderId: string,
  symbol: string,
  quantity: number = 1,
) =>
  await etrade.previewOrder({
    accountIdKey,
    orderType,
    clientOrderId,
    order: [
      {
        allOrNone: true,
        priceType: 'MARKET',
        orderTerm: 'GOOD_FOR_DAY',
        marketSession: 'REGULAR',
        Instrument: [
          {
            Product: {
              symbol,
              securityType,
            },
            orderAction: 'SELL',
            quantityType: 'QUANTITY',
            quantity,
          },
        ],
      },
    ],
  });

export const createSellOrder = async (
  clientOrderId: string,
  symbol: string,
  quantity: number = 1,
) => {
  const sellOrderPreview = await createSellOrderPreview(
    clientOrderId,
    symbol,
    quantity,
  );

  log('created sell order preview', sellOrderPreview);

  // Immediately request order with mandatory preview id
  const sellOrder = await etrade.placeOrder({
    accountIdKey,
    orderType,
    clientOrderId,
    order: sellOrderPreview.Order,
    previewIds: sellOrderPreview.PreviewIds,
  });

  log('created sell order', sellOrder);

  return sellOrder;
};
