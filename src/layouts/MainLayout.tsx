import { Outlet, useLocation, useNavigation } from "react-router-dom";
import Box from "@mui/material/Box";

import { MAIN_PATH } from "src/constant";
import { Footer, MainHeader } from "src/components/layouts";
import MainLoadingScreen from "src/components/MainLoadingScreen";

export default function MainLayout() {
  const location = useLocation();
  const navigation = useNavigation();
  // console.log("Nav Stat: ", navigation.state);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <MainHeader />
      {navigation.state !== "idle" && <MainLoadingScreen />}
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
