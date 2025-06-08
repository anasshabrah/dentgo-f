// src/types/global.d.ts
export {};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}
