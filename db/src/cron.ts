import { Client } from 'pg';

const client = new Client({
    user: 'cosmosDB_owner',
    // host: 'ep-super-violet-a5vzzmwg.us-east-2.aws.neon.tech',
    host: 'localhost',
    database: 'cosmosDB',
    password: 'Nw3Sz4RUknBm',
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Allows self-signed certificates; adjust as needed for production
    }
});
client.connect();

async function refreshViews() {

    await client.query('REFRESH MATERIALIZED VIEW klines_1m');
    await client.query('REFRESH MATERIALIZED VIEW klines_1h');
    await client.query('REFRESH MATERIALIZED VIEW klines_1w');

    console.log("Materialized views refreshed successfully");
}

refreshViews().catch(console.error);

setInterval(() => {
    refreshViews()
}, 1000 * 10);