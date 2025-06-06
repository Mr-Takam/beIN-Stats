import { useParams } from "react-router-dom";
import { useGetTeamsByCompetitionIdQuery } from "../store/slices/apiSlice";
import { Typography, Box, Grid, Card, CardContent, Stack, Chip, Divider, Paper } from "@mui/material";

export function Component() {
  const { competitionId } = useParams<{ competitionId: string }>();
  const id = parseInt(competitionId as string, 10);

  const { data: teamsData, isLoading, isError } = useGetTeamsByCompetitionIdQuery(id, { skip: !id });

  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography variant="h6">Chargement des équipes...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography variant="h6" color="error">Erreur lors du chargement des équipes.</Typography>
      </Box>
    );
  }

  const teams = teamsData?.teams || [];

  if (!teams || teams.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Aucune équipe trouvée pour cette compétition.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Équipes - {teamsData?.competition?.name || 'Compétition'}
      </Typography>
      <Grid container spacing={3}>
        {teams.map((team: any) => (
          <Grid item xs={12} sm={6} md={4} key={team.id}>
            <Paper 
              elevation={3}
              sx={{ 
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <Card>
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <Box
                      component="img"
                      src={team.crest}
                      alt={team.name}
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        objectFit: 'contain',
                        filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                      }}
                    />
                    <Divider sx={{ width: '100%' }} />
                    <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
                      {team.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <Chip 
                        label={team.tla} 
                        size="small" 
                        sx={{ backgroundColor: 'primary.light', color: 'white' }} 
                      />
                      {team.venue && (
                        <Chip 
                          label={team.venue} 
                          size="small" 
                          variant="outlined" 
                        />
                      )}
                    </Box>
                    {team.address && (
                      <Typography variant="caption" color="text.secondary" align="center">
                        {team.address}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

Component.displayName = "CompetitionTeamsPage"; 