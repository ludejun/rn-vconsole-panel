import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Regression guard.
 *
 * Up to 1.0.3 `index.tsx` used `Platform.OS` twice without importing `Platform`
 * from react-native. Since tsc only strips types, the published lib/index.js
 * carried the same omission, and opening the panel threw
 * `ReferenceError: Platform is not defined`. The entry file's `// @ts-nocheck`
 * is what kept the compiler quiet about it.
 *
 * `@ts-nocheck` is gone and the whole package type-checks now; these tests stop
 * either of those safeguards from being removed again.
 */

interface SourceFile {
  relative: string;
  source: string;
  /** `source` with comments stripped, so commented-out code does not count. */
  code: string;
}

const sourceFiles: SourceFile[] = globSync('{index.tsx,utils.ts,components/**/*.{ts,tsx}}', {
  cwd: resolve(process.cwd()),
}).map((relative: string) => {
  const source = readFileSync(resolve(relative), 'utf8');
  return { relative, source, code: stripComments(source) };
});

/** Commented-out code should not count as a use of an API. */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

/** Things React Native exports that this package pulls in by name. */
const REACT_NATIVE_APIS = [
  'Platform',
  'Dimensions',
  'StyleSheet',
  'View',
  'Text',
  'ScrollView',
  'TouchableOpacity',
  'TextInput',
  'Modal',
  'Appearance',
  'PixelRatio',
  'StatusBar',
];

function importedFrom(source: string, moduleName: string): Set<string> {
  const names = new Set<string>();
  const pattern = new RegExp(`import\\s*\\{([^}]*)\\}\\s*from\\s*['"]${moduleName}['"]`, 'g');
  for (const match of source.matchAll(pattern)) {
    for (const entry of match[1].split(',')) {
      const name = entry
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)[0]
        .trim();
      if (name) names.add(name);
    }
  }
  return names;
}

describe('react-native imports', () => {
  it.each(sourceFiles)('$relative imports every react-native API it uses', ({ source, code }) => {
    const imported = importedFrom(source, 'react-native');
    const missing = REACT_NATIVE_APIS.filter(
      (api) => new RegExp(`\\b${api}\\.`).test(code) && !imported.has(api),
    );
    expect(missing).toEqual([]);
  });
});

describe('type checking is not suppressed', () => {
  it('no file disables checking for the whole module', () => {
    const suppressed = sourceFiles
      .filter(({ source }) => source.includes('@ts-nocheck'))
      .map(({ relative }) => relative);
    expect(suppressed).toEqual([]);
  });

  it('uses @ts-expect-error rather than @ts-ignore where a suppression is needed', () => {
    const ignored = sourceFiles
      .filter(({ source }) => source.includes('@ts-ignore'))
      .map(({ relative }) => relative);
    expect(ignored).toEqual([]);
  });
});
