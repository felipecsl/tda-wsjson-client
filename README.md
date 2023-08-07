# TD Ameritrade WsJson API client

This is a node and browser API client for the (undocumented) TDAmeritrade WebSocket API.

🚧 Work in progress 🚧

# Prerequisites

- Node 16+

Create a `.env` file and set your TDAmeritrade oauth access token:

```
ACCESS_TOKEN=your-access-token
```

# Building for Node

```

yarn install
yarn build

```

# Running the example app

```

cd example
yarn install
yarn link tda-wsjson-client
yarn start

```

# Supported APIs

- ✅ Authentication via access token
- ✅ Quotes
- ✅ Price History (chart)
- ✅ Account positions
- ✅ Place & submit order
- ✅ Cancel order
- ✅ User properties
- ✅ Create alert
- ✅ Cancel alert
- ✅ Instrument search
- ✅ Option chains
- ✅ Alert lookup
- ✅ Option chain details
- ✅ Option quotes

# Not yet implemented

- ❌ Alert subscription
- ❌ Order events
- ❌ And many others 😀

# Usage

```typescript
import WsJsonClient from "tda-wsjson-client/wsJsonClient";

const client = new WsJsonClient(accessToken);
await client.authenticate();
console.log(loginResponse);
const chartRequest = {
  symbol: "UBER",
  timeAggregation: "DAY",
  range: "YEAR2",
  includeExtendedHours: true,
};
for await (const event of client.chart(chartRequest)) {
  console.log(event);
}
```

For more sample usage check out https://github.com/felipecsl/tda-wsjson-client/blob/master/src/testApp.ts and
https://github.com/felipecsl/tda-wsjson-client/blob/master/example/src/App.tsx

# Running tests

`yarn test`

# License

MIT
