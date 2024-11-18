import * as signalR from "@microsoft/signalr";
import { useAuthStore } from "@/stores/AuthStore";

const signalRConnection = new signalR.HubConnectionBuilder()
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

export default signalRConnection;
