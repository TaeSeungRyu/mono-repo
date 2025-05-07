import { Server } from "http";
import { WebSocketServer } from "ws";

declare module "http" {
  interface IncomingMessage {
    socket: {
      server: Server & { wss?: WebSocketServer };
    };
  }
}
