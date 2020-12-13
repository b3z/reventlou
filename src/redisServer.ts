const RedisServer = require("redis-server");
const server = new RedisServer(6379);

export function startServer() {
    const RedisServer = require("redis-server");

    // Simply pass the port that you want a Redis server to listen on.
    const server = new RedisServer(6379);

    server.open((err: any) => {
        if (err === null) {
            // You may now connect a client to the Redis
            // server bound to port 6379.
        }
    });
}
