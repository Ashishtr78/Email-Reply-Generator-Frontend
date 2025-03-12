import { useState } from "react";
import axios from "axios";
import {
  Container,
  FormControl,
  InputLabel,
  TextField,
  Typography,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import "./App.css";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSumit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:8082/api/email/generate",
        {
          emailContent,
          tone,
        }
      );
      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (error) {
      setError("Something went wrong, please try again later.");
      console.log(error);
    } finally {
      setLoading(false);
    }
    console.log(emailContent);
    console.log(tone);
  };

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Email Reply Generator
        </Typography>

        <Box sx={{ mx: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Original Email Content"
            value={emailContent || ""}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth mb={2}>
            <InputLabel htmlFor="tone">Tone</InputLabel>
            <Select
              value={tone || ""}
              label={"Tone (optional)"}
              onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="friendly">Friendly</MenuItem>
              <MenuItem value="Casually">Casually</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleSumit}
            disabled={!emailContent || loading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Generate Reply"}
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {generatedReply && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Generated Reply
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              label="Generated Reply"
              value={generatedReply || ""}
              inputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              sx={{
                mt: 7,
              }}
              onClick={() => navigator.clipboard.writeText(generatedReply)}
            >
              Copy to clipboard
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
}

export default App;
