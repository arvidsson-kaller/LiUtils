/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("MasterPlan", {
        id: "id",
        title: { type: "text", notNull: true },
        data: { type: "jsonb", notNull: true },
        userId: {
            type: "integer",
            notNull: true,
            references: '"User"',
            onDelete: "cascade",
        },
    });
};
