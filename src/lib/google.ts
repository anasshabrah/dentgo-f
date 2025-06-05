let loading = false;
type Callback = () => void;

export const loadGoogle = (cb: Callback): void => {
  if ((window as any).google?.accounts?.id) {
    cb();
    return;
  }
  if (loading) return;
  loading = true;
  const s = document.createElement("script");
  s.src = "https://accounts.google.com/gsi/client";
  s.async = true;
  s.defer = true;
  s.onload = cb;
  document.body.appendChild(s);
};
