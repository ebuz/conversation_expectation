require('dotenv').config()
const { Pool } = require('pg')

const poolFactory = config => {
    if(config){
        return new Pool(config);
    }
    return new Pool({
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
    });
}


module.exports = {
    poolFactory
}
