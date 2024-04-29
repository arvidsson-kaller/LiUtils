const path = require("path");
const { join } = require('path');
const { recase } = require('@kristiandupont/recase');
const { tryParse } = require('tagged-comment-parser')
require('dotenv').config();

const toPascalCase = recase('snake', 'pascal');
const outputPath = './models';

/** @type {import('kanel').Config} */
module.exports = {
    connection: process.env.DATABASE_URL,
    preDeleteOutputFolder: true,
    outputPath: "./models",
    customTypeMap: {
        "pg_catalog.tsvector": "string",
        "pg_catalog.bpchar": "string",
        "pg_catalog.jsonb": "any",
    },

    getMetadata: (details, generateFor) => {
        const { comment: strippedComment } = tryParse(details.comment);
        const isAgentNoun = ['initializer', 'mutator'].includes(generateFor);

        const relationComment = isAgentNoun
            ? `Represents the ${generateFor} for the ${details.kind} ${details.schemaName}.${details.name}`
            : `Represents the ${details.kind} ${details.schemaName}.${details.name}`;

        const suffix = isAgentNoun ? `_${generateFor}` : '';

        return {
            name: "Db" + toPascalCase(details.name + suffix),
            comment: [relationComment, ...(strippedComment ? [strippedComment] : [])],
            path: join(outputPath, toPascalCase(details.name)),
        };
    },
};