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
      transformResponse: (response: any) => {
        console.log('Competitions response:', response);
        return response;
      }
    }),
    getAllMatches: build.query<any, void>({
      query: () => "/matches?limit=100",
      transformResponse: (response: any) => {
        console.log('Matches response:', response);
        return response;
      }
    }),
    getStandingsByCompetitionId: build.query<any, number>({
      query: (competitionId) => `/competitions/${competitionId}/standings`,
      transformResponse: (response: any) => {
        console.log('Standings response:', response);
        return response;
      }
    }),
    getTeamsByCompetitionId: build.query<any, number>({
      query: (competitionId) => `/competitions/${competitionId}/teams`,
      transformResponse: (response: any) => {
        console.log('Teams response:', response);
        return response;
      }
    }),
    getMatchesByCompetitionId: build.query<any, number>({
      query: (competitionId) => `/competitions/${competitionId}/matches`,
      transformResponse: (response: any) => {
        console.log('Competition matches response:', response);
        return response;
      }
    }),
    getUpcomingMatches: build.query<any, void>({
      query: () => "/matches?status=SCHEDULED",
      transformResponse: (response: any) => {
        console.log('Upcoming matches response:', response);
        return response;
      }
    }),
    getAllTeams: build.query<any, void>({
      query: () => "/teams",
      transformResponse: (response: any) => {
        console.log('Teams response:', response);
        return response;
      }
    }),
  }),
});

// Exportation des hooks générés par RTK Query
export const {
  useGetCompetitionsQuery,
  useGetAllMatchesQuery,
  useGetStandingsByCompetitionIdQuery,
  useGetTeamsByCompetitionIdQuery,
  useGetMatchesByCompetitionIdQuery,
  useGetUpcomingMatchesQuery,
  useGetAllTeamsQuery,
} = tmdbApi;
