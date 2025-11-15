export const DESIGN_SYSTEM = {
  palette: {
    background: {
      primary: '#0d1117',
      secondary: '#161b22',
      tertiary: '#1f242c',
      overlay: 'rgba(22, 27, 34, 0.8)',
    },
    text: {
      primary: '#e6edf3',
      secondary: '#8b949e',
      tertiary: '#6e7681',
      link: '#58a6ff',
      linkHover: '#79c0ff',
    },
    border: {
      default: '#30363d',
      muted: '#21262d',
    },
    accents: {
      primary: {
        main: '#238636',
        contrastText: '#ffffff',
        border: '#2ea043',
      },
      default: {
        main: '#21262d',
        contrastText: '#e6edf3',
        border: 'rgba(240, 246, 252, 0.1)',
      },
      danger: {
        main: '#da3633',
        contrastText: '#ffffff',
        border: '#f85149',
      },
      warning: {
        main: '#e3b341',
        contrastText: '#0d1117',
      },
      info: {
        main: '#388bfd',
        contrastText: '#ffffff',
      },
      success: {
        main: '#238636',
        contrastText: '#ffffff',
      },
      merged: {
        main: '#8957e5',
        contrastText: '#ffffff',
      },
      openIcon: '#2da44e',
      closedIcon: '#e1575a',
      mergedIcon: '#8250df',
    },
  },
  typography: {
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
    baseFontSize: '14px',
    lineHeight: 1.5,
    headings: {
      h1: {
        fontSize: '24px',
        fontWeight: 600,
      },
      h2: {
        fontSize: '20px',
        fontWeight: 600,
      },
      h3: {
        fontSize: '16px',
        fontWeight: 600,
      },
    },
  },
  layout: {
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    borderRadius: {
      small: '4px',
      medium: '6px',
      large: '8px',
      pill: '9999px',
      circle: '50%',
    },
    pageStructure: {
      headerHeight: '60px',
      mainContentMaxWidth: '1280px',
      sidebarWidth: '296px',
      contentPadding: '16px',
    },
  },
} as const;

