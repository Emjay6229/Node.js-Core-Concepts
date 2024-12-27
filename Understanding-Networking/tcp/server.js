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

// Creates a TCP server socket instance and a socket as well for client connections
const server = net.createServer();

server.on("connection", socket => {
  console.log("incoming connection from", socket.remoteAddress)
  if (socket.remoteAddress !== config.host) {
    console.log('Rejected connection from', socket.remoteAddress);
    socket.write('You are not authorized to connect.\n');
    socket.end()
  }

  // can add other conditions such as a maxmimun number of connections, invalid creds etc.

  console.log("Connection accepted", socket.address(), socket.remoteAddress);

  socket.on("data", async data => {
    console.log(`message: ${data.toString("utf-8")}`);
    const response = await rl.question("response: ");
    socket.write(response);
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
})

server.listen(config.port, config.host, () => console.log("Server is listening for connections on", server.address()));