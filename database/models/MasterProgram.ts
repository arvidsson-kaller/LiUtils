// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.MasterProgram */
export type MasterProgramId = number & { __brand: 'MasterProgramId' };

/** Represents the table public.MasterProgram */
export default interface DbMasterProgram {
  id: MasterProgramId;

  name: string;
}

/** Represents the initializer for the table public.MasterProgram */
export interface DbMasterProgramInitializer {
  /** Default value: nextval('"MasterProgram_id_seq"'::regclass) */
  id?: MasterProgramId;

  name: string;
}

/** Represents the mutator for the table public.MasterProgram */
export interface DbMasterProgramMutator {
  id?: MasterProgramId;

  name?: string;
}
