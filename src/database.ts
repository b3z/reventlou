import { md5 } from "./hash";
import * as redis from "redis";
import * as redisearch from "redis-redisearch";
import * as config from "config";
import { log } from "./logger";

export class Database {
    private client: any;

    public constructor() {
        const port: number = config.get("server.port");
        const host: string = config.get("server.host");
        this.client = redis.createClient(port, host);
        this.client.on("connect", function () {
            log.debug("Connected to redis server: " + host + ":" + port);
        });
        redisearch(redis);
        this.client.ft_create(
            "index STOPWORDS 0 SCHEMA data TEXT".split(" "),
            (err: Error) => {
                if (err.message == "Index already exists") {
                    // check for schema already existent
                    log.debug(err.message);
                } else {
                    log.error(err);
                }
            }
        );
    }

    public save(data: string): any {
        // adding to index: docID = hash, score = 1.0 with FILEDS data = the date we pass.
        this.client.ft_add(
            ["index", md5(data), "1.0", "FIELDS", "data", data],
            (err: Error) => {
                log.error(err);
            }
        );

        log.debug(md5(data));
    }

    public async search(query: string): Promise<string[]> {
        return new Promise<string[]>((resolve) => {
            // token escaping --> https://oss.redislabs.com/redisearch/Escaping.html

            query = query.replace(/:/g, "\\:"); // escape ':' // bad fix for #6 - works but is not good
            log.debug(this.client.ft_explain);
            this.client.ft_search(
                ["index", query],
                (err: Error, result: any) => {
                    if (err) {
                        log.error(err);
                    }

                    resolve(result);
                }
            );
        });
    }
    //TODO for now returns nothing TODO make async
    // suggest(input: string): void {
    //     this.client.ft_sugget(["index", input, "FUZZY"], (err: any, result: any) => {
    //         if (err) log.error(err);
    //         log.info(result);
    //     });
    // }

    public exists(key: string) {
        if (key == null || key.length == 0) {
            throw new Error("Illegal Argument.");
        }

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
