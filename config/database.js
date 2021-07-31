const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'risingtest.c0ewkxiorgu8.ap-northeast-2.rds.amazonaws.com',
    user: 'risingTest',
    port: '3306',
    password: 'fa1735fa',
    database: 'risingTest'
});

module.exports = {
    pool: pool
};
