import { md5 } from "./hash";
import { Redisearch } from "redis-modules-sdk";
import * as config from "config";
import { log } from "./logger";
import { stat } from "fs";

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

    public async save(data: string): Promise<any> {
        // adding to index: docID = hash, score = 1.0 with FILEDS data = the date we pass.

        // replace linebreak with space + linebreak (https://github.com/b3z/reventlou/issues/13#issuecomment-749061225)
        data = data.replace(/\n/g, " \n"); // TODO fix this (#13) in a better way as soon as there is a solution from RediSearch/RediSearch#1749

        log.debug(md5(data));
        const p: Promise<any> = await this.client.redis.hmset([
            md5(data),
            "data",
            data,
            "timestamp",
            +new Date(), // timestamp in milli seconds
        ]);

        this.client.redis.save();
        return p; // mabye evaluate promise here already.
    }

    public async search(query: string): Promise<string[]> {
        return new Promise<string[]>((resolve) => {
            // token escaping --> https://oss.redislabs.com/redisearch/Escaping.html
            query = query.replace(/:/g, "\\:"); // escape ':' // bad fix for #6 - works but is not good

            //index: string, query: string, parameters?: FTSearchParameters
            // ft.search index @data:(test) RETURN 1 data SORTBY timestamp
            resolve(
                // use raw command here - client.search just didn't want to work
                this.client.redis.send_command("FT.SEARCH", [
                    "index",
                    "@data:(" + query + ")",
                    "RETURN",
                    "1",
                    "data",
                    "SORTBY",
                    "timestamp",
                ])
            );
        });
    }

    public async getNoteByHash(hash: string): Promise<string> {
        return new Promise<string>((resolve) => {
            resolve(this.client.redis.send_command("HGET", [hash, "data"]));
        });
    }

    public async deleteNoteByHash(hash: string) {
        const status = await this.client.redis.send_command("DEL", [hash]);
        if (status != 1) {
            log.warn("Delete did not succeed. Code " + status);
        }
    }

    //TODO for now returns nothing TODO make async
    // suggest(input: string): void {
    //     this.client.ft_sugget(["index", input, "FUZZY"], (err: any, result: any) => {
    //         if (err) log.error(err);
    //         log.info(result);
    //     });
    // }
}
