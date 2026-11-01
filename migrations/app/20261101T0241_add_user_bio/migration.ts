#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/494e86d69ab2c4cab588ab4f6c84ebe9abf2af9777e1fbedd6b6e3acebdfb4a5/contract';
import startContract from '../../snapshots/494e86d69ab2c4cab588ab4f6c84ebe9abf2af9777e1fbedd6b6e3acebdfb4a5/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/73ee390f0395ee7e57eda8fafc75b1806b5ab4736337c31522504b40b5311903/contract';
import endContract from '../../snapshots/73ee390f0395ee7e57eda8fafc75b1806b5ab4736337c31522504b40b5311903/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('bio', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
