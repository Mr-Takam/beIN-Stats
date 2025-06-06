/// <reference types="vite/client" />

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_KEY = import.meta.env.VITE_APP_FOOTBALL_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      console.log('Préparation des headers pour la requête API');
      headers.set('X-Auth-Token', API_KEY);
      return headers;
    },
  }),
  endpoints: (build) => ({
    getCompetitions: build.query<any, void>({
      query: () => {
        console.log('Requête pour obtenir les compétitions');
        return "/competitions";
      },
      transformResponse: (response: any) => {
        console.log('Réponse des compétitions:', response);
        return response;
      }
    }),
    getAllMatches: build.query<any, void>({
      query: () => {
        console.log('Requête pour obtenir tous les matchs');
        return "/matches?limit=100";
      },
      transformResponse: (response: any) => {
        console.log('Réponse des matchs:', response);
        return response;
      }
    }),
    getStandingsByCompetitionId: build.query<any, number>({
      query: (competitionId) => {
        console.log('Requête pour obtenir le classement de la compétition:', competitionId);
        return `/competitions/${competitionId}/standings`;
      },
      transformResponse: (response: any) => {
        console.log('Réponse du classement:', response);
        return response;
      }
    }),
    getTeamsByCompetitionId: build.query<any, string>({
      query: (competitionId) => {
        console.log('Requête pour obtenir les équipes de la compétition:', competitionId);
        return `/competitions/${competitionId}/teams`;
      },
      transformResponse: (response: any) => {
        console.log('Réponse des équipes:', response);
        return response;
      }
    }),
    getMatchesByCompetitionId: build.query<any, number>({
      query: (competitionId) => {
        console.log('Requête pour obtenir les matchs de la compétition:', competitionId);
        return `/competitions/${competitionId}/matches`;
      },
      transformResponse: (response: any) => {
        console.log('Réponse des matchs de la compétition:', response);
        return response;
      }
    }),
    getUpcomingMatches: build.query<any, void>({
      query: () => {
        console.log('Requête pour obtenir les prochains matchs');
        return "/matches?status=SCHEDULED";
      },
      transformResponse: (response: any) => {
        console.log('Réponse des prochains matchs:', response);
        return response;
      }
    }),
    getAllTeams: build.query<any, void>({
      query: () => {
        console.log('Requête pour obtenir toutes les équipes');
        return "/teams";
      },
      transformResponse: (response: any) => {
        console.log('Réponse de toutes les équipes:', response);
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
