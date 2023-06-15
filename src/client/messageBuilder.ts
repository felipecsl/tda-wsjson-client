import { RawPayloadRequest } from "./tdaWsJsonTypes";

export type ChartRequestParams = {
  symbol: string;
  timeAggregation: string;
  range: string;
  includeExtendedHours: boolean;
};

export type PlaceLimitOrderRequestParams = {
  accountNumber: string;
  limitPrice: number;
  symbol: string;
  quantity: number;
};

export type CreateAlertRequestParams = {
  symbol: string;
  triggerPrice: number;
  operator: "GREATER_OR_EQUAL" | "LESS_OR_EQUAL";
};

export function newConnectionRequest() {
  return {
    ver: "27.*.*",
    fmt: "json-patches-structured",
    heartbeat: "2s",
  };
}

const newRandomId = () => Math.floor(Math.random() * 1_000_000_000);

export function newAccountPositionsRequest(
  accountNumber: string
): RawPayloadRequest {
  return newPayload({
    header: { service: "positions", ver: 0, id: "positions" },
    params: {
      account: accountNumber,
      betaWeightingSymbols: [],
      //additional fields are: MARK DELTA GAMMA THETA VEGA RHO OPEN_COST BP_EFFECT MARK_CHANGE MARGIN
      fields: [
        "QUANTITY",
        "OPEN_PRICE",
        "NET_LIQ",
        "PL_OPEN",
        "PL_YTD",
        "PL_DAY",
      ],
    },
  });
}

export function newQuotesRequest(symbols: string[]): RawPayloadRequest {
  return newPayload({
    header: { service: "quotes", id: "generalQuotes", ver: 0 },
    params: {
      account: "COMBINED ACCOUNT",
      symbols,
      refreshRate: 300,
      fields: [
        "MARK",
        "MARK_CHANGE",
        "MARK_PERCENT_CHANGE",
        "NET_CHANGE",
        "NET_CHANGE_PERCENT",
        "BID",
        "ASK",
        "BID_SIZE",
        "ASK_SIZE",
        "VOLUME",
        "OPEN",
        "HIGH",
        "LOW",
        "LAST",
        "LAST_SIZE",
        "CLOSE",
      ],
    },
  });
}

export function newUserPropertiesRequest(): RawPayloadRequest {
  return newPayload({
    header: { service: "user_properties", id: "user_properties", ver: 0 },
    params: {},
  });
}

export function newInstrumentSearchRequest(
  query: string,
  limit = 5
): RawPayloadRequest {
  const id = newRandomId();
  return {
    payload: [
      {
        header: {
          service: "instrument_search",
          ver: 0,
          id: `searchForSymbol-${id}`,
        },
        params: { limit, pattern: query },
      },
    ],
  };
}

export function newOptionChainRequest(symbol: string): RawPayloadRequest {
  const id = newRandomId();
  return {
    payload: [
      {
        header: { id: `option-series-${id}`, service: "optionSeries", ver: 0 },
        params: { underlying: symbol },
      },
    ],
  };
}

export function newLoginRequest(accessToken: string): RawPayloadRequest {
  return newPayload({
    header: { service: "login", id: "login", ver: 0 },
    params: {
      accessToken,
      domain: "TOS",
      platform: "PROD",
      token: "",
      tag: "TOSWeb",
    },
  });
}

export function newSubmitLimitOrderRequest({
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

export function newCreateAlertRequest({
  symbol,
  triggerPrice,
  operator,
}: CreateAlertRequestParams): RawPayloadRequest {
  const id = newRandomId();
  return {
    payload: [
      {
        header: { service: "alerts/create", ver: 0, id: `alert-${id}` },
        params: {
          alert: {
            market: {
              components: [{ symbol, quantity: 1 }],
              exchange: "BEST",
              threshold: triggerPrice,
              field: "MARK",
              operator,
            },
          },
        },
      },
    ],
  };
}

export function newCancelAlertRequest(alertId: number): RawPayloadRequest {
  return {
    payload: [
      {
        header: { service: "alerts/cancel", id: "cancel_alert", ver: 0 },
        params: { alertId },
      },
    ],
  };
}
