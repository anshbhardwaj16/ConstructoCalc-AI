import { useEffect, useState } from "react";
import api from "../api/client";
import ChatWindow from "../components/ChatWindow";

const AIChatPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSessions = async () => {
    try {
      const response = await api.get("/ai/chat");
      setSessions(response.data);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load chat history.");
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleSend = async (prompt, sessionId) => {
    setLoading(true);
    setError("");
    try {
      const latestEstimate = sessionStorage.getItem("constructocalc_latest");
      const projectContext = latestEstimate ? JSON.parse(latestEstimate) : null;
      const response = await api.post("/ai/chat", { prompt, sessionId, projectContext });
      setSessions((current) => {
        const others = current.filter((item) => item._id !== response.data.session._id);
        return [response.data.session, ...others];
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.details ||
          requestError.response?.data?.message ||
          "AI chat is unavailable right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return <ChatWindow sessions={sessions} onSend={handleSend} loading={loading} error={error} />;
};

export default AIChatPage;
