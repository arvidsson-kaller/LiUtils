/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('User', {
        authProvider: { type: 'text' },
        authUserId: { type: 'text' },
    });

    pgm.createIndex('User', ['authProvider', 'authUserId']);
};
