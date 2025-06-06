import { Box, Typography, Stack, Card, CardContent, Grid, Chip, Divider, Paper, FormControl, InputLabel, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import { useGetAllMatchesQuery, useGetCompetitionsQuery, useGetMatchesByCompetitionIdQuery } from "src/store/slices/apiSlice";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState, useEffect } from "react";
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useSearchParams } from 'react-router-dom';

export function Component() {
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get('matchId');
  
  const { data: allMatchesData, isLoading: isLoadingAllMatches, error: allMatchesError } = useGetAllMatchesQuery();
  const { data: competitionsData, isLoading: isLoadingCompetitions, error: competitionsError } = useGetCompetitionsQuery();
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  // Set Bundesliga as default competition
  useEffect(() => {
    if (competitionsData?.competitions) {
      const bundesliga = competitionsData.competitions.find((comp: any) => comp.code === 'BL1');
      if (bundesliga) {
        setSelectedCompetition(bundesliga.id.toString());
      }
    }
  }, [competitionsData]);

  // Si un matchId est présent dans l'URL, ouvrir le dialogue des résumés
  useEffect(() => {
    if (matchId && allMatchesData?.matches) {
      const match = allMatchesData.matches.find((m: any) => m.id.toString() === matchId);
      if (match) {
        handleOpenHighlights(match);
      }
    }
  }, [matchId, allMatchesData]);

  // Fetch matches by competition only when a competition is selected
  const { data: competitionMatchesData, isLoading: isLoadingCompetitionMatches, error: competitionMatchesError } = useGetMatchesByCompetitionIdQuery(parseInt(selectedCompetition), { skip: !selectedCompetition });

  // Combine loading and error states from both queries
  const isLoading = isLoadingAllMatches || isLoadingCompetitions || (selectedCompetition && isLoadingCompetitionMatches);
  const error = allMatchesError || competitionsError || competitionMatchesError;

  useEffect(() => {
    if (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography variant="h6">Chargement des matchs...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography variant="h6" color="error">
          Erreur lors du chargement des données. Veuillez vérifier votre connexion et réessayer.
        </Typography>
      </Box>
    );
  }

  const allMatches = allMatchesData?.matches || [];
  const competitions = competitionsData?.competitions || [];

  // Use matches from the competition-specific query if a competition is selected, otherwise use all matches
  const matchesToDisplay = selectedCompetition ? competitionMatchesData?.matches || [] : allMatches;

  // Separate matches to display by status for rendering
  const liveMatches = matchesToDisplay.filter((match: any) => match.status === 'LIVE');
  const finishedMatches = matchesToDisplay.filter((match: any) => match.status === 'FINISHED');
  const scheduledMatches = matchesToDisplay.filter((match: any) => match.status === 'SCHEDULED');

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

  const getOfficialChannelId = (competitionName: string) => {
    const channels: { [key: string]: string } = {
      'Premier League': 'UCqZQJ4600a9wIfMPbYc60OQ',
      'La Liga': 'UCWJ0dxN4krGqFJxQwJQvX5A',
      'Bundesliga': 'UCbquwqJx0f6rZf7Yyf9ZQZw',
      'Serie A': 'UC8f5b4zQnY7U6Gm8ZQJ5Y5Q',
      'Ligue 1': 'UCQFCbQJQzXxGXxQwQ5Q5Q5Q',
    };
    return channels[competitionName] || null;
  };

  const handleOpenHighlights = async (match: any) => {
    setSelectedMatch(match);
    setOpenDialog(true);
    setIsLoadingVideo(true);
    setVideoId(null);

    try {
      // Simplifier encore plus la recherche
      const searchQuery = `${match.homeTeam.name} vs ${match.awayTeam.name}`;
      console.log('Recherche YouTube:', searchQuery);
      
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=1&key=${import.meta.env.VITE_APP_YOUTUBE_API_KEY}`);
      const data = await response.json();
      console.log('Réponse YouTube:', data);
      
      if (data.items && data.items.length > 0) {
        console.log('Vidéo trouvée:', data.items[0]);
        setVideoId(data.items[0].id.videoId);
      } else {
        console.log('Aucune vidéo trouvée dans la réponse');
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
    } finally {
      setIsLoadingVideo(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMatch(null);
  };

  const renderMatches = (matchList: any[], title: string) => (
    matchList.length > 0 ? (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h5">{title}</Typography>
          <Chip 
            label={matchList.length} 
            size="small" 
            sx={{ backgroundColor: 'primary.main', color: 'white' }} 
          />
        </Box>
        <Grid container spacing={3}>
          {matchList.map((match: any) => (
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
                          {match.utcDate ? format(new Date(match.utcDate), "dd/MM/yyyy HH:mm", { locale: fr }) : 'Date non disponible'}
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
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {match.competition?.name}
                        </Typography>
                        {match.status === 'LIVE' && (
                          <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>
                            {match.minute}' minute
                          </Typography>
                        )}
                        {match.status === 'FINISHED' && (
                          <Button
                            startIcon={<YouTubeIcon />}
                            size="small"
                            onClick={() => handleOpenHighlights(match)}
                            sx={{ color: 'error.main' }}
                          >
                            Résumé
                          </Button>
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    ) : null
  );

  return (
    <Box sx={{ p: 3, pt: 14 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Matchs</Typography>
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
              <em>Toutes les compétitions</em>
            </MenuItem>
            {competitions.map((competition: any) => (
              <MenuItem key={competition.id} value={competition.id}>
                {competition.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {renderMatches(liveMatches, 'Matchs en Direct')}
      {renderMatches(scheduledMatches, 'Matchs Programmés')}
      {renderMatches(finishedMatches, 'Matchs Terminés')}

      {!isLoadingCompetitionMatches && selectedCompetition && (!matchesToDisplay || matchesToDisplay.length === 0) ? (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
           <Typography variant="h6">Aucun match trouvé pour cette compétition.</Typography>
         </Box>
       ) : !selectedCompetition && (!matchesToDisplay || matchesToDisplay.length === 0) ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <Typography variant="h6">Aucun match trouvé pour le moment.</Typography>
          </Box>
       ) : null}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Résumé du match : {selectedMatch?.homeTeam?.name} vs {selectedMatch?.awayTeam?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {isLoadingVideo ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <CircularProgress />
              </Box>
            ) : videoId ? (
              <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Résumé du match"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" gutterBottom>
                  Aucune vidéo trouvée pour ce match.
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<YouTubeIcon />}
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    `${selectedMatch?.homeTeam?.name} vs ${selectedMatch?.awayTeam?.name} ${selectedMatch?.competition?.name} highlights ${selectedMatch?.utcDate ? format(new Date(selectedMatch.utcDate), "yyyy-MM-dd", { locale: fr }) : ''}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 2 }}
                >
                  Rechercher sur YouTube
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

Component.displayName = "MatchesPage"; 