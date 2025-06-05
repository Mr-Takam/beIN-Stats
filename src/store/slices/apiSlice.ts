import { API_ENDPOINT_URL } from "src/constant";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_KEY = import.meta.env.VITE_APP_FOOTBALL_API_KEY;

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      headers.set("X-Auth-Token", API_KEY);
      return headers;
    },
  }),
  endpoints: (build) => ({
    getCompetitions: build.query<any, void>({
      query: () => "/competitions",
    }),
    getUpcomingMatches: build.query<any, void>({
      query: () => "/matches?status=SCHEDULED",
    }),
    getStandingsByCompetitionId: build.query<any, number>({
      query: (competitionId) => `/competitions/${competitionId}/standings`,
    }),
    getTeamsByCompetitionId: build.query<any, number>({
      query: (competitionId) => `/competitions/${competitionId}/teams`,
    }),
    getMatchesByCompetitionId: build.query<any, number>({
      query: (competitionId) => `/competitions/${competitionId}/matches`,
    }),
  }),
});

// Exportation des hooks générés par RTK Query
export const {
  useGetCompetitionsQuery,
  useGetUpcomingMatchesQuery,
  useGetStandingsByCompetitionIdQuery,
  useGetTeamsByCompetitionIdQuery,
  useGetMatchesByCompetitionIdQuery,
} = tmdbApi;
