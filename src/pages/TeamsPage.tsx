import { Box, Typography, Stack, Card, CardContent, Grid, Paper, Chip, Divider, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useGetCompetitionsQuery, useGetTeamsByCompetitionIdQuery } from "src/store/slices/apiSlice";
import { useState } from "react";
import { useSearchParams } from 'react-router-dom';

export function Component() {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');

  const { data: competitionsData, isLoading: isLoadingCompetitions, error: competitionsError } = useGetCompetitionsQuery();
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');

  // Fetch teams by competition only when a competition is selected
  const { data: competitionTeamsData, isLoading: isLoadingCompetitionTeams, error: competitionTeamsError } = useGetTeamsByCompetitionIdQuery(selectedCompetition, { skip: !selectedCompetition });

  // Combine loading and error states
  const isLoading = isLoadingCompetitions || isLoadingCompetitionTeams;
  const error = competitionsError || competitionTeamsError;

  // Si un teamId est présent dans l'URL, filtrer les équipes
  const teamsToDisplay = teamId && competitionTeamsData?.teams 
    ? competitionTeamsData.teams.filter((team: any) => team.id.toString() === teamId)
    : competitionTeamsData?.teams || [];

  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography variant="h6">Chargement des équipes...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography variant="h6" color="error">Erreur lors du chargement des données.</Typography>
      </Box>
    );
  }

  const competitions = competitionsData?.competitions || [];

  return (
    <Box sx={{ p: 3, pt: 14 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Équipes</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="competition-select-label">Compétition</InputLabel>
          <Select
            labelId="competition-select-label"
            id="competition-select"
            value={selectedCompetition}
            label="Compétition"
            onChange={(e) => setSelectedCompetition(e.target.value)}
          >
            <MenuItem value="">
              <em>Choisissez une compétition</em>
            </MenuItem>
            {competitions.map((competition: any) => (
              <MenuItem key={competition.id} value={competition.id}>
                {competition.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {!selectedCompetition ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Typography variant="h6">Veuillez sélectionner une compétition pour afficher les équipes.</Typography>
        </Box>
      ) : teamsToDisplay.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Typography variant="h6">Aucune équipe trouvée pour cette compétition.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {teamsToDisplay.map((team: any) => (
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
                    {team.runningCompetitions && (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {team.runningCompetitions.map((comp: any) => (
                          <Chip 
                            key={comp.id}
                            label={comp.name} 
                            size="small" 
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

Component.displayName = "TeamsPage";