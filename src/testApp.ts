import WsJsonClient from "./client/wsJsonClient";
import "dotenv/config";
import debug from "debug";
import { PlaceLimitOrderRequestParams } from "./client/messageBuilder";

const logger = debug("testapp");

class TestApp {
  constructor(private readonly client: WsJsonClient) {}

  async chart(symbol: string) {
    logger(" --- chart() requesting chart data ---");
    const chartRequest = {
      symbol,
      timeAggregation: "DAY",
      range: "YEAR2",
      includeExtendedHours: true,
    };
    for await (const event of this.client.chart(chartRequest)) {
      logger("chart() : " + JSON.stringify(event));
    }
  }

  async accountNumber(): Promise<string> {
    logger(" --- accountNumber() requesting account number ---");
    const { defaultAccountCode } = await this.client.userProperties();
    return defaultAccountCode;
  }

  async accountPositions(accountNumber: string) {
    logger(" --- accountPositions() requesting account positions ---");
    for await (const event of this.client.accountPositions(accountNumber)) {
      logger("accountPositions() : " + JSON.stringify(event));
    }
  }

  async quotes(symbols: string[]) {
    logger(" --- quotes() requesting quotes ---");
    for await (const quote of this.client.quotes(symbols)) {
      logger("quotes() : " + JSON.stringify(quote));
    }
  }

  async placeOrder(request: PlaceLimitOrderRequestParams) {
    logger(" --- placeOrder() placing order ---");
    const orderEvents = await this.client.placeOrder(request);
    for await (const event of orderEvents) {
      logger("placeOrder() : " + JSON.stringify(event));
    }
  }

  async cancelOrder(orderId: number) {
    logger(" --- cancelOrder() cancelling order ---");
    const cancelResponse = await this.client.cancelOrder(orderId);
    logger(cancelResponse);
  }
}

async function run() {
  const accessToken = process.env.ACCESS_TOKEN as string;
  const client = new WsJsonClient(accessToken);
  await client.authenticate();
  const app = new TestApp(client);
  // const accountNumber = await app.accountNumber();
  // await app.placeOrder({
  //   limitPrice: 100,
  //   quantity: 1,
  //   symbol: "ABNB",
  //   accountNumber,
  // });
  await app.quotes(["/NQ:XCME"]);
}

run().catch(console.error);
