import { describe, expect, it } from 'vitest';
import { extractHost, fromEntries, jsonParse, splitString } from '../utils';

describe('jsonParse', () => {
  it('parses JSON', () => {
    expect(jsonParse('{"a":1}')).toEqual({ a: 1 });
    expect(jsonParse('[1,2]')).toEqual([1, 2]);
  });

  it('returns the input unchanged when it is not JSON', () => {
    expect(jsonParse('not json')).toBe('not json');
    expect(jsonParse('')).toBe('');
  });

  it('never throws, whatever it is handed', () => {
    expect(() => jsonParse(undefined)).not.toThrow();
    expect(() => jsonParse({ already: 'an object' })).not.toThrow();
  });
});

describe('extractHost', () => {
  it('pulls the host out of a url', () => {
    expect(extractHost('https://api.example.com/v1/users')).toBe('api.example.com');
    expect(extractHost('http://localhost:8081/symbolicate')).toBe('localhost:8081');
  });

  it('handles a url with no path', () => {
    expect(extractHost('https://example.com')).toBe('example.com');
  });

  it('returns undefined when there is no host to find', () => {
    expect(extractHost('/relative/path')).toBeUndefined();
    expect(extractHost('')).toBeUndefined();
  });
});

describe('splitString', () => {
  it('leaves short strings alone', () => {
    expect(splitString('short')).toBe('short');
  });

  it('truncates past the limit and marks it', () => {
    const long = 'x'.repeat(250);
    const result = splitString(long);
    expect(result).toHaveLength(203);
    expect(result.endsWith('...')).toBe(true);
  });

  it('honours a custom limit', () => {
    expect(splitString('abcdef', 3)).toBe('abc...');
    expect(splitString('abc', 3)).toBe('abc');
  });
});

describe('fromEntries', () => {
  it('builds an object from key/value pairs', () => {
    expect(
      fromEntries([
        ['a', 1],
        ['b', 2],
      ]),
    ).toEqual({ a: 1, b: 2 });
  });

  it('returns an empty object for an empty list', () => {
    expect(fromEntries([])).toEqual({});
  });

  it('keeps the last value when a key repeats', () => {
    expect(
      fromEntries([
        ['a', 1],
        ['a', 2],
      ]),
    ).toEqual({ a: 2 });
  });
});
