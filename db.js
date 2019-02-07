require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
})

process.on('beforeExit', () => {
    try{
        pool.end();
        console.log('successfully shutdown postgresql pool')
    }
    catch(error){
        console.log('postgresql pool failed to shutdown')
    }
});

module.exports = {
    pool
}
