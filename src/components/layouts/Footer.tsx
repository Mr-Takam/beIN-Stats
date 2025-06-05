import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider"; // No longer needed

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Center horizontally
        justifyContent: "center",
        py: 3, // Add vertical padding
        mt: 5, // Add margin top to separate from content
        bgcolor: "background.paper", // Use paper color from theme
        color: "text.secondary", // Use secondary text color for copyright/info
        px: "60px",
      }}
    >
      <Typography variant="body2" align="center">
        {'Développé par '}
        <Link
          href="https://github.com/Mr-Takam"
          underline="hover"
          color="inherit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mr-Takam
        </Link>{' © '}{new Date().getFullYear()}
      </Typography>
    </Box>
  );
}
