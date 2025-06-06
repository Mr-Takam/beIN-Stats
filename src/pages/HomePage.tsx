import Stack from "@mui/material/Stack";
import { useGetUpcomingMatchesQuery, useGetCompetitionsQuery } from "src/store/slices/apiSlice";
import { Typography, Box, Card, CardContent, Grid, Chip, Divider, Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function Component() {
  const { data: matches, isLoading: isLoadingMatches, isError: isErrorMatches } = useGetUpcomingMatchesQuery();
  const { data: competitionsData, isLoading: isLoadingCompetitions, isError: isErrorCompetitions } = useGetCompetitionsQuery();

  const topLeagues = ['PL', 'PD', 'SA', 'BL1', 'FL1'];

  const filteredCompetitions = competitionsData?.competitions?.filter((comp: any) =>
    topLeagues.includes(comp.code)
  );

  if (isLoadingMatches || isLoadingCompetitions) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography variant="h6">Chargement des données football...</Typography>
      </Box>
    );
  }

  if (isErrorMatches || isErrorCompetitions) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography variant="h6" color="error">Erreur lors du chargement des données football.</Typography>
      </Box>
    );
  }

  const upcomingMatches = matches?.matches;

  return (
    <Stack spacing={4} sx={{ px: { xs: "30px", sm: "60px" }, pt: "150px" }}>
      <Typography variant="h4" sx={{ color: "text.primary", fontWeight: 'bold', mb: 2 }}>
        Prochains Matchs
      </Typography>
      
      <Grid container spacing={3}>
        {(!upcomingMatches || upcomingMatches.length === 0) ? (
          <Grid item xs={12}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Aucun match à venir pour le moment.
              </Typography>
            </Box>
          </Grid>
        ) : (
          upcomingMatches.map((match: any) => (
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
                        <Chip label="PROGRAMMÉ" color="primary" size="small" />
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

                        <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
                          VS
                        </Typography>

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
                      
                      <Typography variant="caption" color="text.secondary">
                        {match.competition?.name}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      <Typography variant="h4" sx={{ color: "text.primary", fontWeight: 'bold', mt: 4, mb: 2 }}>
        Top 5 Ligues Européennes
      </Typography>
      
      <Grid container spacing={3}>
        {(!filteredCompetitions || filteredCompetitions.length === 0) ? (
          <Grid item xs={12}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Aucune compétition trouvée.
              </Typography>
            </Box>
          </Grid>
        ) : (
          filteredCompetitions.map((comp: any) => (
            <Grid item xs={12} sm={6} md={4} key={comp.id}>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {comp.emblem && (
                          <Box
                            component="img"
                            src={comp.emblem}
                            alt={comp.name}
                            sx={{ width: 40, height: 40, objectFit: 'contain' }}
                          />
                        )}
                        <Typography variant="h6" sx={{ color: "text.primary" }}>
                          {comp.name}
                        </Typography>
                      </Box>

                      <Divider />

                      <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
                        <Button
                          component={Link}
                          to={`/competitions/${comp.id}/standings`}
                          variant="outlined"
                          size="small"
                        >
                          Classement
                        </Button>
                        <Button
                          component={Link}
                          to={`/competitions/${comp.id}/teams`}
                          variant="outlined"
                          size="small"
                        >
                          Équipes
                        </Button>
                        <Button
                          component={Link}
                          to={`/competitions/${comp.id}/matches`}
                          variant="outlined"
                          size="small"
                        >
                          Matchs
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>
    </Stack>
  );
}

Component.displayName = "HomePage";
