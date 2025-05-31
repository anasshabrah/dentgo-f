let loading = false;
export const loadGoogle = (cb) => {
  if (window.google?.accounts?.id) {
    cb();
    return;
  }
  if (loading) return;
  loading = true;
  const s = document.createElement('script');
  s.src = 'https://accounts.google.com/gsi/client';
  s.async = true;
  s.defer = true;
  s.onload = cb;
  document.body.appendChild(s);
};
