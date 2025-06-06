import { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useGetAllMatchesQuery, useGetCompetitionsQuery, useGetAllTeamsQuery } from "src/store/slices/apiSlice";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  cursor: "pointer",
  padding: theme.spacing(0, 1),
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.primary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  "& .NetflixInputBase-input": {
    width: 0,
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.complex,
      easing: theme.transitions.easing.easeIn,
    }),
    "&:focus": {
      width: "auto",
    },
  },
}));

const SearchResults = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: 1000,
  maxHeight: "400px",
  overflowY: "auto",
  marginTop: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius,
}));

const ResultItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function SearchBox() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();

  const { data: matchesData } = useGetAllMatchesQuery();
  const { data: competitionsData } = useGetCompetitionsQuery();
  const { data: teamsData } = useGetAllTeamsQuery();

  const handleClickSearchIcon = () => {
    if (!isFocused) {
      searchInputRef.current?.focus();
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setShowResults(true);
  };

  const handleResultClick = (type: string, id: string) => {
    console.log('Click sur résultat:', { type, id });
    setShowResults(false);
    setSearchQuery("");

    let path = '';
    switch (type) {
      case "match":
        path = `/matches?matchId=${id}`;
        break;
      case "competition":
        path = `/competitions/${id}/matches`;
        break;
      case "team":
        path = `/teams?teamId=${id}`;
        break;
    }
    console.log('Navigation vers:', path);
    navigate(path);
  };

  const filteredResults = () => {
    if (!searchQuery) return [];

    const query = searchQuery.toLowerCase();
    const results = [];

    // Recherche dans les matchs
    if (matchesData?.matches) {
      const matches = matchesData.matches.filter((match: any) =>
        match.homeTeam.name.toLowerCase().includes(query) ||
        match.awayTeam.name.toLowerCase().includes(query)
      );
      results.push(...matches.map((match: any) => ({
        type: "match",
        id: match.id,
        title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
        subtitle: match.competition?.name
      })));
    }

    // Recherche dans les compétitions
    if (competitionsData?.competitions) {
      const competitions = competitionsData.competitions.filter((comp: any) =>
        comp.name.toLowerCase().includes(query)
      );
      results.push(...competitions.map((comp: any) => ({
        type: "competition",
        id: comp.id,
        title: comp.name,
        subtitle: comp.area?.name
      })));
    }

    // Recherche dans les équipes
    if (teamsData?.teams) {
      const teams = teamsData.teams.filter((team: any) =>
        team.name.toLowerCase().includes(query)
      );
      results.push(...teams.map((team: any) => ({
        type: "team",
        id: team.id,
        title: team.name,
        subtitle: team.venue
      })));
    }

    return results.slice(0, 5);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Search
      sx={{
        border: isFocused ? "1px solid" : "none",
        borderColor: "primary.main",
      }}
    >
      <SearchIconWrapper onClick={handleClickSearchIcon}>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        inputRef={searchInputRef}
        placeholder="Rechercher un match, une équipe..."
        value={searchQuery}
        onChange={handleSearch}
        inputProps={{
          "aria-label": "search",
          onFocus: () => {
            setIsFocused(true);
            setShowResults(true);
          },
          onBlur: () => {
            setIsFocused(false);
          },
        }}
      />
      {showResults && searchQuery && (
        <SearchResults>
          {filteredResults().length > 0 ? (
            filteredResults().map((result) => (
              <ResultItem
                key={`${result.type}-${result.id}`}
                onClick={() => {
                  console.log('Click sur item:', result);
                  handleResultClick(result.type, result.id);
                }}
              >
                <Typography variant="subtitle1" color="text.primary">
                  {result.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {result.subtitle}
                </Typography>
              </ResultItem>
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography color="text.secondary">
                Aucun résultat trouvé
              </Typography>
            </Box>
          )}
        </SearchResults>
      )}
    </Search>
  );
}
