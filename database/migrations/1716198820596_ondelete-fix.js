/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.dropConstraint('User', 'User_choosenMasterPlanId_fkey')

    pgm.addConstraint('User', 'User_choosenMasterPlanId_fkey', {
        foreignKeys: {
            columns: "choosenMasterPlanId",
            references: '"MasterPlan"',
            onDelete: "SET NULL",
        },
    })
};

exports.down = pgm => {
    pgm.dropConstraint('User', 'User_choosenMasterPlanId_fkey')

    pgm.addConstraint('User', 'User_choosenMasterPlanId_fkey', {
        foreignKeys: {
            columns: "choosenMasterPlanId",
            references: '"MasterPlan"',
            onDelete: "cascade",
        },
    })
}
