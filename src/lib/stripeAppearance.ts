// src/lib/stripeAppearance.ts
export function getStripeAppearance() {
  const isMobile = window.matchMedia('(max-width: 640px)').matches;
  return {
    theme: 'stripe',
    variables: {
      fontSizeBase: isMobile ? '14px' : '16px',
      fontSizeSm:   isMobile ? '12px' : '14px',
      fontSizeXs:   isMobile ? '10px' : '12px',
    },
    rules: {
      '.Input': {
        padding: isMobile ? '8px' : '12px',
      },
      '.Label': {
        fontSize: isMobile ? '12px' : '14px',
      }
    }
  };
}
