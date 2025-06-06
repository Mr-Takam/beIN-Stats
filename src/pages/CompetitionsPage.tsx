import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Grid, Typography, Stack, Button } from "@mui/material";
import { useGetCompetitionsQuery } from "src/store/slices/apiSlice";

export function Component() {
  const { data: competitions, isLoading, error } = useGetCompetitionsQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return <Typography>Chargement des compétitions...</Typography>;
  }

  if (error) {
    return <Typography>Erreur lors du chargement des compétitions.</Typography>;
  }

  if (!competitions || !competitions.competitions || competitions.competitions.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Aucune compétition trouvée.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Compétitions</Typography>
      <Grid container spacing={3}>
        {competitions.competitions.map((competition: any) => (
          <Grid item xs={12} sm={6} md={4} key={competition.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3
                }
              }}
              // onClick={() => navigate(`/competitions/${competition.id}/standings`)} // Navigation via boutons
            >
              <CardContent>
                <Stack spacing={2}>
                  <Box
                    component="img"
                    src={competition.emblem}
                    alt={competition.name}
                    sx={{ width: 60, height: 60, objectFit: 'contain' }}
                  />
                  <Typography variant="h6">{competition.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {competition.area.name}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button size="small" onClick={() => navigate(`/competitions/${competition.id}/standings`)}>
                      Classement
                    </Button>
                    <Button size="small" onClick={() => navigate(`/competitions/${competition.id}/teams`)}>
                      Équipes
                    </Button>
                    <Button size="small" onClick={() => navigate(`/competitions/${competition.id}/matches`)}>
                      Matchs
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

Component.displayName = "CompetitionsPage"; 