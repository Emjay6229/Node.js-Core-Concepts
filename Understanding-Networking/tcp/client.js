const net = require("net");
const readLineAsync = require("readline/promises");

const config = {
  port: 4000,
  host: "127.0.0.1"
}

const rl = readLineAsync.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initiates a connection from the client's kernel to the listening server's kernel (The TCP 3-way handshake).
// @returns a client socket -> a duplex stream object that enables bi-directional communication
const socket = net.createConnection(config, async () => {
   // This callback is executed after the handshake.
  console.log("Connection is successfully established. Address:", socket.address());
  const message = await rl.question("message: ");
  socket.write(message);
});

socket.on("data", async data => {
  console.log("message:", data.toString("utf-8"));
  const message = await rl.question("response: ");
  socket.write(message);
});

socket.on("end", () => console.log("Connection ended!"));
