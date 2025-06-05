import { Navigate, createBrowserRouter } from "react-router-dom";
import { MAIN_PATH } from "src/constant";

import MainLayout from "src/layouts/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: MAIN_PATH.root,
        element: <Navigate to={`/${MAIN_PATH.browse}`} />,
      },
      {
        path: MAIN_PATH.browse,
        lazy: () => import("src/pages/HomePage"),
      },
      {
        path: "competitions/:competitionId/standings",
        lazy: () => import("src/pages/CompetitionStandingsPage"),
      },
      {
        path: "competitions/:competitionId/teams",
        lazy: () => import("src/pages/CompetitionTeamsPage"),
      },
      {
        path: "competitions/:competitionId/matches",
        lazy: () => import("src/pages/CompetitionMatchesPage"),
      },
      // Routes précédemment liées aux films/séries supprimées
      // {
      //   path: MAIN_PATH.genreExplore,
      //   children: [
      //     {
      //       path: ":genreId",
      //       lazy: () => import("src/pages/GenreExplore"),
      //     },
      //   ],
      // },
      // {
      //   path: MAIN_PATH.watch,
      //   lazy: () => import("src/pages/WatchPage"),
      // },
    ],
  },
]);

export default router;
