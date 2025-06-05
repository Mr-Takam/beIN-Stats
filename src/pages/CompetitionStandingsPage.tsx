import { useParams } from "react-router-dom";
import { useGetStandingsByCompetitionIdQuery } from "../store/slices/apiSlice";
import { Typography, Container, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export function Component() {
  const { competitionId } = useParams<{ competitionId: string }>();
  const id = parseInt(competitionId as string, 10);

  const { data: standingsData, isLoading, isError } = useGetStandingsByCompetitionIdQuery(id, { skip: !id });

  if (isLoading) {
    return <Typography>Chargement du classement...</Typography>;
  }

  if (isError) {
    return <Typography color="error">Erreur lors du chargement du classement.</Typography>;
  }

  // Supposons que l'API retourne un tableau de standings et que le premier est le classement général (TOTAL)
  const totalStandings = standingsData?.standings?.find((s: any) => s.type === 'TOTAL');

  if (!totalStandings || totalStandings.table.length === 0) {
    return <Typography>Aucun classement trouvé pour cette compétition.</Typography>;
  }

  return (
    <Container sx={{ pt: "150px" }}>
      <Typography variant="h4" gutterBottom>Classement - {standingsData?.competition?.name || 'Compétition'}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Équipe</TableCell>
              <TableCell align="right">Joués</TableCell>
              <TableCell align="right">Gagnés</TableCell>
              <TableCell align="right">Nuls</TableCell>
              <TableCell align="right">Perdus</TableCell>
              <TableCell align="right">Pour</TableCell>
              <TableCell align="right">Contre</TableCell>
              <TableCell align="right">Diff</TableCell>
              <TableCell align="right">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {totalStandings.table.map((row: any) => (
              <TableRow key={row.team.id}>
                <TableCell component="th" scope="row">{row.position}</TableCell>
                <TableCell>{row.team.name}</TableCell>
                <TableCell align="right">{row.playedGames}</TableCell>
                <TableCell align="right">{row.won}</TableCell>
                <TableCell align="right">{row.draw}</TableCell>
                <TableCell align="right">{row.lost}</TableCell>
                <TableCell align="right">{row.goalsFor}</TableCell>
                <TableCell align="right">{row.goalsAgainst}</TableCell>
                <TableCell align="right">{row.goalDifference}</TableCell>
                <TableCell align="right">{row.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

Component.displayName = "CompetitionStandingsPage"; 