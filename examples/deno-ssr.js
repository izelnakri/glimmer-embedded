import { createRequire } from "https://deno.land/std@0.97.0/node/module.ts";

const require = createRequire(import.meta.url);

require('../dist/index.js');
