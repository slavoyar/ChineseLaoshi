import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dictUrl = import.meta.resolve('@zh-keyboard/recognizer/models/dict.txt');
const modelsDir = dirname(fileURLToPath(dictUrl));
const destDir = join(fileURLToPath(new URL('../public/models', import.meta.url)));

mkdirSync(destDir, { recursive: true });
cpSync(modelsDir, destDir, { recursive: true });
