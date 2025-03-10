export {};

declare global {
  interface Window {
    electron?: {
      sayHello: () => void;
      receiveHello: (handler: (event: any, ...args: any[]) => void) => void;
      stopReceivingHello: (handler: (event: any, ...args: any[]) => void) => void;
      saveScenario: (content: string) => Promise<{ success: boolean }>;
      reloadMainWindow: () => Promise<void>;
    };
  }
}
