// src/lib/google.ts
let loading = false;
let loaded = false;
const callbacks: Callback[] = [];

type Callback = () => void;

export const loadGoogle = (cb: Callback): void => {
  if ((window as any).google?.accounts?.id || loaded) {
    cb();
    return;
  }

  if (loading) {
    callbacks.push(cb);
    return;
  }

  loading = true;
  callbacks.push(cb);

  const existing = document.querySelector('#google-identity-script');
  if (existing) {
    loaded = true;
    callbacks.forEach(fn => fn());
    callbacks.length = 0;
    return;
  }

  const script = document.createElement('script');
  script.id = 'google-identity-script';
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    loaded = true;
    callbacks.forEach(fn => fn());
    callbacks.length = 0;
  };
  document.body.appendChild(script);
};
