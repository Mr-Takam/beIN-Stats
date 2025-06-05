import Stack from "@mui/material/Stack";
import { useGetUpcomingMatchesQuery, useGetCompetitionsQuery } from "src/store/slices/apiSlice";
import { Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

export function Component() {
  const { data: matches, isLoading: isLoadingMatches, isError: isErrorMatches } = useGetUpcomingMatchesQuery();
  const { data: competitionsData, isLoading: isLoadingCompetitions, isError: isErrorCompetitions } = useGetCompetitionsQuery();

  const topLeagues = ['PL', 'PD', 'SA', 'BL1', 'FL1'];

  const filteredCompetitions = competitionsData?.competitions?.filter((comp: any) =>
    topLeagues.includes(comp.code)
  );

  if (isLoadingMatches || isLoadingCompetitions) {
    return <Typography>Chargement des données football...</Typography>;
  }

  if (isErrorMatches || isErrorCompetitions) {
    return <Typography color="error">Erreur lors du chargement des données football.</Typography>;
  }

  const upcomingMatches = matches?.matches;

  return (
    <Stack spacing={4} sx={{ px: { xs: "30px", sm: "60px" }, pt: "150px" }}>
      <Typography variant="h4" sx={{ color: "text.primary" }}>Prochains Matchs</Typography>
      <Stack spacing={2}>
        {(!upcomingMatches || upcomingMatches.length === 0) ? (
          <Typography>Aucun match à venir trouvé.</Typography>
        ) : (
          upcomingMatches.map((match: any) => (
            <Box key={match.id} sx={{ p: 2, border: '1px solid grey' }}>
              <Typography variant="h6">{match.homeTeam.name} vs {match.awayTeam.name}</Typography>
              <Typography variant="body2">Date: {new Date(match.utcDate).toLocaleString()}</Typography>
              <Typography variant="body2">Compétition: {match.competition.name}</Typography>
            </Box>
          ))
        )}
      </Stack>

      <Typography variant="h4" sx={{ color: "text.primary" }}>Top 5 Ligues Européennes</Typography>
      <Stack spacing={2}>
        {(!filteredCompetitions || filteredCompetitions.length === 0) ? (
           <Typography>Aucune compétition trouvée.</Typography>
        ) : (
          filteredCompetitions.map((comp: any) => (
            <Box key={comp.id} sx={{ p: 1, border: '1px solid #333' }}>
              <Typography variant="h6" sx={{ color: "text.secondary" }}>
                {comp.name}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Link to={`/competitions/${comp.id}/standings`} style={{ color: 'lightblue', textDecoration: 'none' }}>
                  Classement
                </Link>
                <Link to={`/competitions/${comp.id}/teams`} style={{ color: 'lightblue', textDecoration: 'none' }}>
                  Équipes
                </Link>
                <Link to={`/competitions/${comp.id}/matches`} style={{ color: 'lightblue', textDecoration: 'none' }}>
                  Matchs
                </Link>
              </Stack>
            </Box>
          ))
        )}
      </Stack>
    </Stack>
  );
}

Component.displayName = "HomePage";
