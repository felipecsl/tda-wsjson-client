import WebSocketApiMessageHandler, {
  newPayload,
} from "./webSocketApiMessageHandler";
import { PlaceLimitOrderRequestParams } from "./placeOrderMessageHandler";
import { ApiService } from "./apiService";
import { RawPayloadRequest, RawPayloadResponse } from "../tdaWsJsonTypes";
import { OrderEventsPatchResponse } from "./orderEventsMessageHandler";

export default class SubmitOrderMessageHandler
  implements
    WebSocketApiMessageHandler<
      PlaceLimitOrderRequestParams,
      OrderEventsPatchResponse
    >
{
  buildRequest({
    accountNumber,
    limitPrice,
    symbol,
    quantity,
  }: PlaceLimitOrderRequestParams): RawPayloadRequest {
    return newPayload({
      header: {
        id: `update-draft-order-${symbol}`,
        service: "place_order",
        ver: 0,
      },
      params: {
        accountCode: accountNumber,
        action: "SUBMIT",
        marker: "SINGLE",
        orders: [
          {
            tif: "DAY",
            orderType: "LIMIT",
            limitPrice: limitPrice,
            requestType: "EDIT_ORDER",
            legs: [{ symbol, quantity }],
            tag: "TOSWeb",
          },
        ],
      },
    });
  }

  // This should never be called because the `place_order` service is handled by PlaceOrderMessageHandler instead
  parseResponse(_: RawPayloadResponse): never {
    throw new Error("This should never happen");
  }

  service: ApiService = "place_order";
}