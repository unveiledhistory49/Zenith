export const KNOWN_PROGRAMS = {
  JUPITER: {
    name: 'Jupiter',
    programId: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
    importantAccounts: [
      'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4'
    ]
  },
  MARGINFI: {
    name: 'Marginfi',
    programId: 'MFv2hWf21ZbwcvAMUZHVb3fcXo9kVXN3n2J2A4GBX4u',
    importantAccounts: [
      'MFv2hWf21ZbwcvAMUZHVb3fcXo9kVXN3n2J2A4GBX4u'
    ]
  },
  RAYDIUM: {
    name: 'Raydium',
    programId: 'CAMMCzo5YL8w4VFF8KVHrK22GGUQpEELgS49t3wquj4o',
    importantAccounts: [
      'CAMMCzo5YL8w4VFF8KVHrK22GGUQpEELgS49t3wquj4o'
    ]
  }
} as const;

export type KnownProgram = keyof typeof KNOWN_PROGRAMS;
