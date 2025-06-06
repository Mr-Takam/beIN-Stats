import { createTheme } from '@mui/material/styles';

// Define a custom theme
const theme = createTheme({
  palette: {
    mode: 'light', // Changed to light mode
    primary: {
      main: '#6A1B9A', // Deep purple for primary actions
      light: '#9C4DCC', // Lighter purple
      dark: '#38006B', // Darker purple
    },
    secondary: {
      main: '#7B1FA2', // Purple for secondary elements
      light: '#AE52D4', // Lighter purple
      dark: '#4A148C', // Darker purple
    },
    background: {
      default: '#FFFFFF', // White background
      paper: '#F5F5F5', // Light grey for cards/panels
    },
    text: {
      primary: '#212121', // Dark grey for primary text
      secondary: '#757575', // Medium grey for secondary text
    },
    error: {
      main: '#D32F2F', // Red for errors
    },
    warning: {
      main: '#FFA000', // Amber for warnings
    },
    info: {
      main: '#1976D2', // Blue for info
    },
    success: {
      main: '#388E3C', // Green for success
    },
  },
  typography: {
    fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(','),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF', // White AppBar
          color: '#6A1B9A', // Purple text
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Subtle shadow
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#6A1B9A', // Purple links
          '&:hover': {
            color: '#9C4DCC', // Lighter purple on hover
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Remove uppercase transformation
          borderRadius: 8, // Rounded corners
        },
        contained: {
          boxShadow: 'none', // Remove default shadow
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)', // Add shadow on hover
          }
        }
      }
    }
  }
});

export default theme; 