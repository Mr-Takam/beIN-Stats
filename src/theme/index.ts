import { createTheme } from '@mui/material/styles';

// Define a custom theme
const theme = createTheme({
  palette: {
    mode: 'dark', // Start with a dark theme base
    primary: {
      main: '#4CAF50', // A shade of green for primary actions
    },
    secondary: {
      main: '#2196F3', // A shade of blue for secondary elements
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1E1E1E', // Slightly lighter dark background for cards/panels
    },
    text: {
      primary: '#E0E0E0', // Light grey text for readability
      secondary: '#B0B0B0', // Slightly darker grey for secondary text
    },
    error: {
      main: '#F44336', // Standard red for errors
    },
    warning: {
      main: '#FF9800', // Standard orange for warnings
    },
    info: {
      main: '#2196F3', // Standard blue for info
    },
    success: {
      main: '#4CAF50', // Standard green for success
    },
  },
  typography: {
    fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(','),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E', // Match AppBar background to paper or default
        },
      },
    },
    MuiLink: {
        styleOverrides: {
            root: {
                color: '#2196F3', // Ensure links use the secondary color
            }
        }
    }
  }
});

export default theme; 