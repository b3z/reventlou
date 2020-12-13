import { stringify } from "querystring";
import { md5 } from "./hash";
import * as redis from "redis";
import * as redisearch from "redis-redisearch";
import * as config from "config";
import { log } from "./logger";

export class Database {
    private client: any;

    constructor() {
        this.client = redis.createClient(6379, "127.0.0.1");
        this.client.on("connect", function () {
            log.debug("Connected to database.");
        });
        redisearch(redis);
        this.client.ft_create("index STOPWORDS 0 SCHEMA data TEXT".split(" "), (err: any) => {
            log.error(err);
        });
    }

    save(data: string): any {
        this.client.ft_add(["index", md5(data), "1.0", "FIELDS", "data", data], (err: any) => {
            log.error(err);
        });

        log.debug(md5(data));
    }

    async search(query: string): Promise<string[]> {
        return new Promise<string[]>((resolve) => {
            this.client.ft_search(["index", query], (err: any, result: any) => {
                if (err) log.error(err);
                resolve(result);
            });
        });
    }
    //TODO for now returns nothing TODO make async
    suggest(input: string): void {
        this.client.ft_sugget(["index", input, "FUZZY"], (err: any, result: any) => {
            if (err) log.error(err);
            log.info(result);
        });
    }

    public exists(key: string) {
        if (key == null || key.length == 0) throw new Error("Illegal Argument.");

        this.client.exists(key, function (err: string, reply: any) {
            if (reply === 1) {
                return true;
            } else {
                return false;
            }
        });
    }
}

/* Save as obj

client.hmset('frameworks', {
    'javascript': 'AngularJS',
    'css': 'Bootstrap',
    'node': 'Express'
});

*/

/*

if value is of type string -> GET <key>
if value is of type hash -> HGETALL <key>
if value is of type lists -> lrange <key> <start> <end>
if value is of type sets -> smembers <key>
if value is of type sorted sets -> ZRANGEBYSCORE <key> <min> <max>

*/
