import { Client } from 'pg';
import { createClient } from 'redis';
import { DbMessage } from './types';

const pgClient = new Client({
    user: 'cosmosDB_owner',
    host: 'ep-super-violet-a5vzzmwg.us-east-2.aws.neon.tech',
    database: 'cosmosDB',
    password: 'Nw3Sz4RUknBm',
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Allows self-signed certificates; adjust as needed for production
    }
});

pgClient.connect()
.then(() => {
    console.log("connected to pg");
    main();
})

async function main() {
    const redisClient = createClient();
    await redisClient.connect();
    console.log("connected to redis");

    while (true) {
        const response = await redisClient.rPop("db_processor" as string)
        if (!response) {

        } else {
            const data: DbMessage = JSON.parse(response);
            if (data.type === "TRADE_ADDED") {
                console.log("adding data");
                console.log(data);
                const price = data.data.price;
                const timestamp = new Date(data.data.timestamp);
                const query = 'INSERT INTO tata_prices (time, price) VALUES ($1, $2)';
                // TODO: How to add volume?
                const values = [timestamp, price];
                await pgClient.query(query, values);
            }
        }
    }

}

// main();