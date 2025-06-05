import { useParams } from "react-router-dom";
import { useGetTeamsByCompetitionIdQuery } from "../store/slices/apiSlice";
import { Typography, Container, Box, List, ListItem, ListItemText } from "@mui/material";

export function Component() {
  const { competitionId } = useParams<{ competitionId: string }>();
  const id = parseInt(competitionId as string, 10);

  const { data: teamsData, isLoading, isError } = useGetTeamsByCompetitionIdQuery(id, { skip: !id });

  if (isLoading) {
    return <Typography>Chargement des équipes...</Typography>;
  }

  if (isError) {
    return <Typography color="error">Erreur lors du chargement des équipes.</Typography>;
  }

  // Supposons que l'API retourne les équipes dans un tableau 'teams'
  const teams = teamsData?.teams;

  if (!teams || teams.length === 0) {
    return <Typography>Aucune équipe trouvée pour cette compétition.</Typography>;
  }

  return (
    <Container sx={{ pt: "150px" }}>
      <Typography variant="h4" gutterBottom>Équipes - {teamsData?.competition?.name || 'Compétition'}</Typography>
      <List>
        {teams.map((team: any) => (
          <ListItem key={team.id}>
            <ListItemText primary={team.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

Component.displayName = "CompetitionTeamsPage"; 