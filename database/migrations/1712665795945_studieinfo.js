/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("MasterProgram", {
    id: "id",
    name: { type: "text", notNull: true },
  });

  pgm.createTable("StartYear", {
    id: "id",
    masterProgramId: {
      type: "integer",
      notNull: true,
      references: '"MasterProgram"',
      onDelete: "cascade",
    },
    name: { type: "text", notNull: true },
    data: { type: "jsonb", notNull: true },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
  pgm.createIndex("StartYear", "masterProgramId");
};
