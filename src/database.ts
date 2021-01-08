import { md5 } from "./hash";
import { Redisearch } from "redis-modules-sdk";
import * as config from "config";
import { log } from "./logger";

export class Database {
    private client: any;

    public constructor() {
        const port: number = config.get("server.port");
        const host: string = config.get("server.host");

        this.client = new Redisearch({
            host: host,
            port: port,
        });
    }

    public async init() {
        //Connect to the Redis database with Redisearch module
        await this.client.connect();

        try {
            await this.client.create(
                "index",
                ["data TEXT", "timestamp NUMERIC"],
                ["SORTABLE", "STOPWORDS 0"]
            );
        } catch (error) {
            if (
                error +
                    "".indexOf(
                        "Redisearch: ReplyError: Index already exists"
                    ) !=
                0
            ) {
                log.info("No new index created.");
            } else {
                log.error(error);
            }
        }
    }

    public save(data: string): any {
        // adding to index: docID = hash, score = 1.0 with FILEDS data = the date we pass.

        // replace linebreak with space + linebreak (https://github.com/b3z/reventlou/issues/13#issuecomment-749061225)
        data = data.replace(/\n/g, " \n"); // TODO fix this (#13) in a better way as soon as there is a solution from RediSearch/RediSearch#1749

        this.client.ft_add(
            // TOOD fix to HSET using redis-module-sdk if possible?
            [
                "index",
                md5(data),
                "1.0",
                "FIELDS",
                "data",
                data,
                "timestamp",
                +new Date(), // timestamp in milli seconds
            ],
            (err: Error) => {
                if (err) {
                    log.error(err);
                }
            }
        );

        // "commit"
        this.client.save(); // save RDB

        log.debug(md5(data));
    }

    public async search(query: string): Promise<string[]> {
        return new Promise<string[]>((resolve) => {
            // token escaping --> https://oss.redislabs.com/redisearch/Escaping.html
            query = query.replace(/:/g, "\\:"); // escape ':' // bad fix for #6 - works but is not good

            this.client.ft_search(
                // ft.search index @data:(test) RETURN 1 data SORTBY timestamp
                [
                    "index",
                    "@data:(" + query + ")",
                    "RETURN",
                    1,
                    "data",
                    "SORTBY",
                    "timestamp",
                    "DESC",
                ],
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
