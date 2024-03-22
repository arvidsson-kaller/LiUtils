const path = require("path");
require('dotenv').config();

/** @type {import('kanel').Config} */
module.exports = {
    connection: process.env.DATABASE_URL,
    preDeleteOutputFolder: true,
    outputPath: "./models",

    customTypeMap: {
        "pg_catalog.tsvector": "string",
        "pg_catalog.bpchar": "string",
    },
};