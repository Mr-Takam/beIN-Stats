import { useParams } from "react-router-dom";
import { useGetMatchesByCompetitionIdQuery } from "../store/slices/apiSlice";
import { Typography, Container, Box, List, ListItem, ListItemText } from "@mui/material";

export function Component() {
  const { competitionId } = useParams<{ competitionId: string }>();
  const id = parseInt(competitionId as string, 10);

  const { data: matchesData, isLoading, isError } = useGetMatchesByCompetitionIdQuery(id, { skip: !id });

  if (isLoading) {
    return <Typography>Chargement des matchs...</Typography>;
  }

  if (isError) {
    return <Typography color="error">Erreur lors du chargement des matchs.</Typography>;
  }

  // Supposons que l'API retourne les matchs dans un tableau 'matches'
  const matches = matchesData?.matches;

  if (!matches || matches.length === 0) {
    return <Typography>Aucun match trouvé pour cette compétition.</Typography>;
  }

  return (
    <Container sx={{ pt: "150px" }}>
      <Typography variant="h4" gutterBottom>Matchs - {matchesData?.competition?.name || 'Compétition'}</Typography>
      <List>
        {matches.map((match: any) => (
          <ListItem key={match.id} sx={{ borderBottom: '1px dashed #555' }}>
            <ListItemText
              primary={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
              secondary={`Date: ${new Date(match.utcDate).toLocaleString()} - Status: ${match.status}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

Component.displayName = "CompetitionMatchesPage"; 