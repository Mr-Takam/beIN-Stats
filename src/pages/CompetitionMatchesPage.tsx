import { useParams } from "react-router-dom";
import { useGetMatchesByCompetitionIdQuery } from "../store/slices/apiSlice";
import { Typography, Box, Grid, Card, CardContent, Stack, Chip, Divider, Paper } from "@mui/material";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function Component() {
  const { competitionId } = useParams<{ competitionId: string }>();
  const id = parseInt(competitionId as string, 10);

  const { data: matchesData, isLoading, isError } = useGetMatchesByCompetitionIdQuery(id, { skip: !id });

  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography variant="h6">Chargement des matchs...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography variant="h6" color="error">Erreur lors du chargement des matchs.</Typography>
      </Box>
    );
  }

  const matches = matchesData?.matches || [];

  if (!matches || matches.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Aucun match trouvé pour cette compétition.</Typography>
      </Box>
    );
  }

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'LIVE':
        return <Chip label="EN DIRECT" color="error" size="small" />;
      case 'FINISHED':
        return <Chip label="TERMINÉ" color="success" size="small" />;
      case 'SCHEDULED':
        return <Chip label="PROGRAMMÉ" color="primary" size="small" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Matchs - {matchesData?.competition?.name || 'Compétition'}
      </Typography>
      <Grid container spacing={3}>
        {matches.map((match: any) => (
          <Grid item xs={12} sm={6} md={4} key={match.id}>
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
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {format(new Date(match.utcDate), "dd/MM/yyyy HH:mm", { locale: fr })}
                      </Typography>
                      {getStatusChip(match.status)}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        {match.homeTeam.crest && (
                          <Box
                            component="img"
                            src={match.homeTeam.crest}
                            alt={match.homeTeam.name}
                            sx={{ width: 40, height: 40, objectFit: 'contain' }}
                          />
                        )}
                        <Typography variant="body1" noWrap>{match.homeTeam.name}</Typography>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mx: 2,
                        minWidth: '60px',
                        justifyContent: 'center'
                      }}>
                        {match.score && match.score.fullTime ? (
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {match.score.fullTime.home} - {match.score.fullTime.away}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            VS
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
                        <Typography variant="body1" noWrap>{match.awayTeam.name}</Typography>
                        {match.awayTeam.crest && (
                          <Box
                            component="img"
                            src={match.awayTeam.crest}
                            alt={match.awayTeam.name}
                            sx={{ width: 40, height: 40, objectFit: 'contain' }}
                          />
                        )}
                      </Box>
                    </Box>

                    <Divider />
                    
                    {match.status === 'LIVE' && (
                      <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>
                        {match.minute}' minute
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

Component.displayName = "CompetitionMatchesPage"; 