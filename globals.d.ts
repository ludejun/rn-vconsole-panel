/**
 * Ambient declarations for the parts of React Native this package reaches into.
 *
 * This file is deliberately in script scope (no top-level import/export), so
 * the `declare module` blocks below declare ambient modules rather than
 * augmenting existing ones.
 */

/**
 * XHRInterceptor is not part of React Native's public API and ships without
 * types; the network panel needs it to observe requests.
 */
declare module 'react-native/Libraries/Network/XHRInterceptor' {
  /**
   * The callbacks are typed loosely on purpose. React Native does not publish
   * the shape of the XHR object it hands back, and it has changed between
   * versions; NetworkLogger models the fields it actually reads (see the `XHR`
   * type there), and that model is where the real typing lives.
   */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  interface XHRInterceptorStatic {
    setOpenCallback(callback: (method: any, url: string, xhr: any) => void): void;
    setRequestHeaderCallback(callback: (header: string, value: string, xhr: any) => void): void;
    setSendCallback(callback: (data: any, xhr: any) => void): void;
    setHeaderReceivedCallback(
      callback: (contentType: any, size: any, responseHeaders: any, xhr: any) => void,
    ): void;
    setResponseCallback(
      callback: (
        status: any,
        timeout: any,
        response: any,
        responseURL: any,
        responseType: any,
        xhr: any,
      ) => void,
    ): void;
    enableInterception(): void;
    disableInterception(): void;
    isInterceptorEnabled(): boolean;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const XHRInterceptor: XHRInterceptorStatic;
  export default XHRInterceptor;
}

/** React Native's own FileReader, used to read response blobs. */
declare module 'react-native/Libraries/Blob/FileReader' {
  /**
   * React Native's FileReader accepts the response values XHRInterceptor hands
   * over, which are not always the `Blob` the DOM signature requires.
   */
  interface RNFileReader extends Omit<globalThis.FileReader, 'readAsText' | 'result'> {
    readAsText(data: unknown, encoding?: string): void;
    readonly result: string;
  }
  const FileReader: { new (): RNFileReader };
  export default FileReader;
}

/**
 * React Native exposes `global`, and this package stashes its log buffers there
 * so the panels can read them without threading state through the tree.
 */
declare const global: typeof globalThis & {
  $BOARD_LOGGER: Record<string, unknown[]>;
  console: Console & Record<string, (...args: unknown[]) => void>;
};
