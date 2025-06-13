// src/lib/stripeAppearance.ts
export function getStripeAppearance() {
  const isMobile = window.matchMedia('(max-width: 640px)').matches;
  return {
    theme: 'stripe',
    variables: {
      fontSizeBase: isMobile ? '12px' : '14px',
      fontSizeSm:   isMobile ? '10px' : '12px',
      fontSizeXs:   isMobile ? '8px' : '10px',
    },
    rules: {
      '.Input': {
        padding: isMobile ? '6px' : '10px',
      },
      '.Label': {
        fontSize: isMobile ? '10px' : '12px',
      }
    }
  };
}
