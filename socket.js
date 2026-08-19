const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
function setupSocket(server) {
const io = new Server(server, {cors: {
      origin: "https://city-of-shadows.github.io",
      methods: ["GET", "POST"],
      credentials: true,},});
const players = new Map(); io.use((socket, next) => { try {
const token = socket.handshake.auth?.token;
      if (!token) { return next(new Error("Authentication required."));}
      if (!process.env.JWT_SECRET) { console.error("JWT_SECRET is missing from .env");
      return next(new Error("Server authentication configuration error."));}
const decoded = jwt.verify(token, process.env.JWT_SECRET); socket.user = decoded;next();}  catch (error) {
      console.error("Socket authentication failed:", error.message); next(new Error("Invalid or expired token."));}});
      io.on("connection", (socket) => {
      console.log("Player connected:", socket.id);
      console.log("User:", socket.user);
const player = {
      socketId: socket.id,
      userId: socket.user.userId || socket.user.id,
      username: socket.user.username || "Player",
      position: { x: 0, y: 0, z: 0,},
      rotation: { x: 0, y: 0, z: 0,},}; players.set(socket.id, player); socket.emit(
      "players-list",Array.from(players.values()).filter( (existingPlayer) => existingPlayer.socketId !== socket.id));
socket.broadcast.emit("player-joined", player); socket.on("player-position", (data) => {
const currentPlayer = players.get(socket.id);
if (!currentPlayer || !data?.position) { return;} currentPlayer.position = {
        x: Number(data.position.x) || 0,
        y: Number(data.position.y) || 0,
        z: Number(data.position.z) || 0,};
if (data.rotation) { currentPlayer.rotation = {
        x: Number(data.rotation.x) || 0,
        y: Number(data.rotation.y) || 0,
        z: Number(data.rotation.z) || 0,};}
socket.broadcast.emit("player-position", {
        socketId: currentPlayer.socketId,
        userId: currentPlayer.userId,
        username: currentPlayer.username,
        position: currentPlayer.position,
        rotation: currentPlayer.rotation,});});
socket.on("player-ready", () => { console.log(`${currentUsername(socket)} is ready`); socket.emit("player-ready-confirmed", { success: true, user: socket.user,});});
socket.on("disconnect", (reason) => {console.log(`${currentUsername(socket)} disconnected:`, reason); players.delete(socket.id); socket.broadcast.emit("player-left", { socketId: socket.id,});});}); 
return io;}
function currentUsername(socket) { return socket.user?.username || "Player";}
module.exports = setupSocket;
