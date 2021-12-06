import NetworkRequestInfo from './NetworkRequestInfo';
import { StartNetworkLoggingOptions } from './types';
declare class Logger {
    private requests;
    private xhrIdMap;
    private maxRequests;
    private ignoredHosts;
    enabled: boolean;
    callback: (requests: any[]) => void;
    setCallback: (callback: any) => void;
    private getRequest;
    private updateRequest;
    private openCallback;
    private requestHeadersCallback;
    private headerReceivedCallback;
    private sendCallback;
    private responseCallback;
    enableXHRInterception: (options?: StartNetworkLoggingOptions) => void;
    getRequests: () => NetworkRequestInfo[];
    clearRequests: () => void;
}
declare const _default: Logger;
export default _default;
