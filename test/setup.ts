import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    error;
  }
});
