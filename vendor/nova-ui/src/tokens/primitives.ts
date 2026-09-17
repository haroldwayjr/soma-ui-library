// Raw design values. Components consume semantic tokens instead of importing
// this file directly, so palette or scale changes remain centralized.
export const primitives = {
  // One ramp per family, theme-independent: a ramp is a set of hues, not a set
  // of light or dark values. Choosing a step per theme is the semantic layer's
  // job — see colors.ts, where `grey[900]` in light pairs with `white` in dark.
  //
  // Never consumed by components. The step marked (base) in the design file is
  // the family's reference hue; it carries no special meaning in code.
  color: {
    black: '#000000',
    blue: {
      100: '#f0f4ff',
      200: '#e0eaff',
      300: '#d0e0ff',
      400: '#a6c5ff',
      500: '#81adff',
      600: '#558eff',
      700: '#1d4ed8',
      800: '#002383', // base
      900: '#000b48',
    },
    brand: {
      blue: '#0012e7',
    },
    // Utility ramps: one hue at nine alpha steps, for scrims and highlights.
    coolDarkTransparent: {
      10: '#101d381a',
      20: '#101d3833',
      30: '#101d384d',
      40: '#101d3866',
      50: '#101d3880',
      60: '#101d3899',
      70: '#101d38b2',
      80: '#101d38cc',
      90: '#101d38e5',
    },
    coolLightTransparent: {
      10: '#e0e8f51a',
      20: '#e0e8f533',
      30: '#e0e8f54d',
      40: '#e0e8f566',
      50: '#e0e8f580',
      60: '#e0e8f599',
      70: '#e0e8f5b2',
      80: '#e0e8f5cc',
      90: '#e0e8f5e5',
    },
    green: {
      100: '#f8fbf8',
      200: '#edf9ed',
      300: '#d0e9d0',
      400: '#a4d6a4',
      500: '#7dc07d',
      600: '#4ea64e',
      700: '#008200', // base
      800: '#004f00',
      900: '#002c00',
    },
    grey: {
      100: '#f2f4f7',
      200: '#eaecf0',
      300: '#d0d5dd',
      400: '#98a2b3',
      500: '#667085', // base
      600: '#475467',
      700: '#344054',
      800: '#1d2939',
      900: '#101828',
    },
    orange: {
      100: '#fff5f2',
      200: '#ffeae3',
      300: '#ffd3c2',
      400: '#ffaf93',
      500: '#ec9179',
      600: '#d26a4c',
      700: '#b54325', // base
      800: '#771100',
      900: '#3b0300',
    },
    purple: {
      100: '#f4f0ff',
      200: '#ebe0ff',
      300: '#d6c2ff',
      400: '#c3a3ff',
      500: '#ad85ff',
      600: '#9261ff',
      700: '#6b22d6', // base
      800: '#3c008f',
      900: '#1a0040',
    },
    red: {
      100: '#fef9f8',
      200: '#fdf2f1',
      300: '#fdd6d4',
      400: '#fab1ae',
      500: '#ed8e8c',
      600: '#db6566',
      700: '#cb0c31', // base
      800: '#7f0009',
      900: '#3c0002',
    },
    teal: {
      100: '#f7fbfb',
      200: '#edf8f8',
      300: '#cce8e8',
      400: '#91d6d6',
      500: '#60bfbf',
      600: '#00abab',
      700: '#0b7e7e', // base
      800: '#005353',
      900: '#002525',
    },
    white: '#ffffff',
    yellow: {
      100: '#fffbf5',
      200: '#fcf4e6',
      300: '#f5dcc3',
      400: '#ecbc8a',
      500: '#dd9e56',
      600: '#c97a00',
      700: '#a55600', // base
      800: '#662600',
      900: '#350500',
    },
  },
  // Raw shadow recipes from the Elevation specification. These remain a
  // one-to-one scale until component usage establishes durable semantic roles.
  elevation: {
    '2xl': '0 24px 48px rgb(16 24 40 / 18%)',
    '3xl': '0 32px 64px rgb(16 24 40 / 20%)',
    inner: 'inset 0 2px 4px rgb(16 24 40 / 6%)',
    lg: '0 12px 16px rgb(16 24 40 / 8%), 0 4px 6px rgb(16 24 40 / 3%)',
    md: '0 4px 8px rgb(16 24 40 / 10%), 0 2px 4px rgb(16 24 40 / 6%)',
    sm: '0 1px 3px rgb(16 24 40 / 10%), 0 1px 2px rgb(16 24 40 / 6%)',
    soft: '0 8px 32px rgb(0 35 128 / 12%)',
    xl: '0 20px 24px rgb(16 24 40 / 8%), 0 8px 8px rgb(16 24 40 / 3%)',
    xs: '0 1px 2px rgb(16 24 40 / 5%)',
  },
  font: {
    family: {
      body: 'Figtree, sans-serif',
    },
    // Keyed by the px value the design team works in; emitted as rem so the
    // scale respects the reader's browser font size.
    size: {
      11: '0.6875rem',
      12: '0.75rem',
      13: '0.8125rem',
      14: '0.875rem',
      16: '1rem',
      18: '1.125rem',
      20: '1.25rem',
      24: '1.5rem',
      28: '1.75rem',
      36: '2.25rem',
      48: '3rem',
    },
    weight: {
      400: '400',
      500: '500',
      600: '600',
    },
  },
  radius: {
    0: '0px',
    2: '2px',
    4: '4px',
    6: '6px',
    8: '8px',
    10: '10px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    full: '9999px',
  },
  space: {
    0: '0px',
    2: '2px',
    4: '4px',
    6: '6px',
    8: '8px',
    10: '10px',
    12: '12px',
    14: '14px',
    16: '16px',
    18: '18px',
    20: '20px',
    24: '24px',
    28: '28px',
    32: '32px',
    36: '36px',
    40: '40px',
    48: '48px',
    56: '56px',
    64: '64px',
    80: '80px',
    96: '96px',
  },
} as const
