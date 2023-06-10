# TD Ameritrade WsJson API client

This is a node and browser API client for the (undocumented) TDAmeritrade WebSocket API.

🚧 Work in progress 🚧

# Building for Node

```
yarn install
yarn build
```

# Running the sample app

```
cd example
yarn install
yarn link tda-wsjson-client
yarn start
```

# Usage

```typescript
import WsJsonClient from "tda-wsjson-client/wsJsonClient";

const client = new WsJsonClient(accessToken);
const loginResponse = await client.connect();
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

# Running tests

`yarn test`

# License

MIT
