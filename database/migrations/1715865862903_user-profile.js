/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('User', {
        picture: { type: 'text' },
        choosenMasterPlanId: {
            type: "integer",
            notNull: false,
            references: '"MasterPlan"',
            onDelete: "cascade",
        },
    });

    pgm.addConstraint('User', 'oauth', {
        unique: ['authProvider', 'authUserId']
    })
};