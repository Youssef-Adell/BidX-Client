import * as signalR from "@microsoft/signalr";
import { useAuthStore } from "@/stores/AuthStore";

const signalRConnection = new signalR.HubConnectionBuilder()
  .withUrl("https://bidx.runasp.net/appHub", {
    accessTokenFactory: () => useAuthStore().accessToken,
  })
  .configureLogging(signalR.LogLevel.Information)
  .withAutomaticReconnect()
  .build();

export default signalRConnection;
