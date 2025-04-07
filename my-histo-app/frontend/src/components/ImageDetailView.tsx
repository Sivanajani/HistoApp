/*
ImageDetailView.tsx zeigt eine Detailansicht eines Bildes mit folgenden Funktionen:
- Bildanzeige mit Zoom-Funktion im Modal
- Mehrsprachige Anzeige von Beschreibung, Tags und Kommentaren
- Hinzufügen und Löschen von Tags (mit Backend-Synchronisierung)
- CRUD-Operationen für Kommentare (globaler Zustand via useAppState)
- Rückkehr zur Übersicht per Back-Button
Die Komponente nutzt Material UI und Keycloak für Authentifizierung.
*/
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  TextField,
  Modal,
  Chip,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import translations from "../translations";
import { useLanguageStore } from "../store/useLanguageStore";
import keycloak from "../keycloak/KeycloakService";
import { useAppState } from "../hooks/useAppState";

// Props für Bilddaten
interface ImageDetailViewProps {
  image: {
    id: string;
    src: string;
    description: string;
  };
}

// Backend-URL für API-Aufrufe
const API_URL = "https://v000564.fhnw.ch/api";

// Hilfsfunktion für Authentifizierte Requests mit Keycloak-Token
const fetchWithAuth = async (
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> => {
  const token = keycloak.token;
  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
};

// Hauptkomponente
const ImageDetailView = ({ image }: ImageDetailViewProps) => {
  const navigate = useNavigate();
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

  // Globale Zustandsfunktionen
  const {
    deleteTagById,
    addNewTag,
    commentsByImageId,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
  } = useAppState();

  const comments = commentsByImageId[image.id] || [];

  // Lokale States
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<{
    id: number;
    text: string;
  } | null>(null);

  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [newTag, setNewTag] = useState("");
  const [openZoom, setOpenZoom] = useState(false);

  // Tags für das aktuelle Bild vom Backend laden
  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await fetchWithAuth(
          `${API_URL}/v1/histotag/tagsforimage/${image.id}`
        );
        if (!response.ok) throw new Error("Fehler beim Laden der Tags");
        const tagsFromBackend = await response.json();
        setTags(tagsFromBackend);
      } catch (err) {
        console.error("Fehler beim Laden der Tags:", err);
      }
    };

    loadTags();
  }, [image.id, language]);

  // Kommentare laden (globaler Zustand wird verwendet)
  useEffect(() => {
    fetchComments(image.id);
  }, [image.id, fetchComments]);

  // Kommentar hinzufügen (Enter-Taste)
  const handleAddComment = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newComment.trim() !== "") {
      await addComment(image.id, newComment.trim());
      setNewComment("");
    }
  };

  // Bearbeiteten Kommentar speichern
  const handleSaveComment = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && editingComment) {
      await updateComment(editingComment.id, image.id, editingComment.text);
      setEditingComment(null);
    }
  };

  // Kommentar löschen
  const handleDeleteComment = async (commentId: number) => {
    await deleteComment(commentId, image.id);
  };

  // Neuen Tag hinzufügen
  const handleAddNewTag = async () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag === "" || tags.some((t) => t.name === trimmedTag)) return;

    try {
      await addNewTag(trimmedTag, image.id);
      const response = await fetchWithAuth(
        `${API_URL}/v1/histotag/tagsforimage/${image.id}`
      );
      const updated = await response.json();
      setTags(updated);
      setNewTag("");
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Tags:", error);
    }
  };

  // Tag löschen
  const handleDeleteTag = async (tagId: number) => {
    try {
      await deleteTagById(tagId, image.id);
      const response = await fetchWithAuth(
        `${API_URL}/v1/histotag/tagsforimage/${image.id}`
      );
      const updated = await response.json();
      setTags(updated);
    } catch (err) {
      console.error("Fehler beim Löschen des Tags:", err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        width: "100vw",
        height: "calc(100vh - 64px - 40px)",
        padding: "20px",
        overflow: "hidden",
      }}
    >
      {/* Zurück-Button */}
      <IconButton onClick={() => navigate(-1)} sx={{ alignSelf: "flex-start" }}>
        <ArrowBackIcon />
      </IconButton>

      {/* Bildbereich mit Zoom-Funktion */}
      <Box
        sx={{
          flex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tooltip title={t.zoomTooltip} arrow>
          <Box
            position="relative"
            sx={{ width: "100%", maxHeight: "80vh", cursor: "zoom-in" }}
            onClick={() => setOpenZoom(true)}
          >
            <Card
              sx={{
                width: "100%",
                height: "auto",
                overflow: "hidden",
                boxShadow: "none",
                border: "none",
                backgroundColor: "transparent",
              }}
            >
              <CardMedia
                component="img"
                src={image.src}
                alt={image.description}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            </Card>
          </Box>
        </Tooltip>
      </Box>

      {/* Seitenleiste mit Beschreibung, Tags und Kommentaren */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: "10px",
          maxWidth: "400px",
          overflowY: "auto",
        }}
      >
        <Typography variant="h5">{image.description}</Typography>

        {/* Tag-Verwaltung */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginBottom: 1,
            }}
          >
            <Typography variant="body1">{t.tagsLabel}</Typography>
            <TextField
              size="small"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder={t.newTagPlaceholder}
              onKeyDown={(e) => e.key === "Enter" && handleAddNewTag()}
              sx={{ flex: 1, maxWidth: "200px" }}
            />
            <IconButton onClick={handleAddNewTag}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Box>

          {/* Tag-Chips */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                onDelete={() => handleDeleteTag(tag.id)}
                deleteIcon={<DeleteIcon />}
              />
            ))}
          </Box>
        </Box>

        {/* Kommentarbereich */}
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            maxHeight: "50vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6">{t.commentsTitle}</Typography>
          <List>
            {comments.map((comment) => (
              <ListItem
                key={comment.id}
                sx={{ display: "flex", alignItems: "center" }}
              >
                {editingComment?.id === comment.id ? (
                  <TextField
                    size="small"
                    value={editingComment.text}
                    onChange={(e) =>
                      setEditingComment({
                        id: comment.id,
                        text: e.target.value,
                      })
                    }
                    onKeyDown={handleSaveComment}
                    onBlur={() => setEditingComment(null)}
                    autoFocus
                  />
                ) : (
                  <ListItemText primary={comment.context} />
                )}
                <IconButton
                  onClick={() =>
                    setEditingComment({ id: comment.id, text: comment.context })
                  }
                >
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteComment(comment.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <TextField
            size="small"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleAddComment}
            placeholder={t.newCommentPlaceholder}
            fullWidth
          />
        </Box>
      </Box>

      {/* Modal für Zoomanzeige */}
      <Modal open={openZoom} onClose={() => setOpenZoom(false)}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Schliessen-Button im Modal */}
          <IconButton
            sx={{ position: "absolute", top: 20, right: 20, color: "white" }}
            onClick={() => setOpenZoom(false)}
          >
            ✖
          </IconButton>

          {/* Bild in Grossansicht */}
          <CardMedia
            component="img"
            src={image.src}
            alt={image.description}
            onClick={() => setOpenZoom(false)}
            sx={{
              maxWidth: "95vw",
              maxHeight: "95vh",
              objectFit: "contain",
              borderRadius: "10px",
              cursor: "zoom-out",
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ImageDetailView;
