import * as signalR from "@microsoft/signalr";
import { useAuthStore } from "@/stores/AuthStore";
import { useSignalrStateStore } from "@/stores/SignalrStateStore";
import { useAuctionStore } from "@/stores/AuctionStore";
import { singalrStates } from "./signalrStates";

let connection = null;

export default {
  async startConnection() {
    // Create and configure the connection object
    connection = new signalR.HubConnectionBuilder()
      .withUrl("https://bidx.runasp.net/appHub", {
        accessTokenFactory: () => useAuthStore().accessToken,
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true, // Improves the performance by skipping the negotiate request and establish the WS connection directly
      })
      .configureLogging(signalR.LogLevel.Information)
      .withServerTimeout(10000) // 2X the KeepAliveInterval value configured by the server
      .withAutomaticReconnect()
      .withStatefulReconnect()
      .build();

    // Register handlers
    const signalrStateStore = useSignalrStateStore();
    const auctionStore = useAuctionStore();

    connection.onreconnecting(() =>
      signalrStateStore.setState(singalrStates.reconnecting)
    );
    connection.onreconnected(async () => {
      signalrStateStore.setState(singalrStates.connected);
      auctionStore.reload();
    });
    connection.onclose(() =>
      signalrStateStore.setState(singalrStates.disconnected)
    );
    connection?.on("BidCreated", auctionStore.bidPlacedHandler);
    connection?.on("BidAccepted", auctionStore.bidAcceptedHandler);

    // Start the connection
    try {
      await connection.start();
      signalrStateStore.setState(singalrStates.connected);
    } catch {
      setTimeout(() => this.startConnection(), 3000);
    }
  },

  async stopConnection() {
    try {
      await connection.stop();
    } catch {
      // Suppress the error
    }
  },

  // Server Functions to Invoke
  async joinAuctionRoom(auctionId) {
    await connection.invoke("JoinAuctionRoom", { auctionId });
  },

  async leaveAuctionRoom(auctionId) {
    await connection.invoke("LeaveAuctionRoom", { auctionId });
  },

  async placeBid(auctionId, amount) {
    await connection.invoke("BidUp", { auctionId, amount });
  },

  async acceptBid(bidId) {
    await connection.invoke("AcceptBid", { bidId });
  },
};
