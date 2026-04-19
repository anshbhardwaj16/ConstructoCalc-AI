import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const ChatWindow = ({ sessions, onSend, loading, error }) => {
  const [prompt, setPrompt] = useState("");
  const activeSession = sessions?.[0];

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    await onSend(prompt, activeSession?._id);
    setPrompt("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">AI Construction Assistant</h2>
          {loading && <LoadingSpinner label="Thinking..." />}
        </div>
        <div className="mb-6 flex h-[420px] flex-col gap-4 overflow-y-auto rounded-2xl bg-slate-950/60 p-4">
          {activeSession?.messages?.length ? (
            activeSession.messages.map((message) => (
              <div
                key={message._id || `${message.role}-${message.createdAt}`}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-orange-500 text-white"
                    : "bg-white/10 text-slate-100"
                }`}
              >
                {message.content}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">
              Ask about costs, materials, estimate accuracy, or construction planning.
            </p>
          )}
        </div>
        {error && (
          <div className="mb-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="How to reduce cost without compromising safety?"
            className="flex-1 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-400"
          >
            Send
          </button>
        </form>
      </section>
      <aside className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white">Saved Conversations</h3>
        <div className="mt-4 space-y-3">
          {sessions?.map((session) => (
            <div key={session._id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="font-semibold text-slate-200">{session.title}</p>
              <p className="mt-1 text-xs text-slate-400">
                {session.messages?.length || 0} messages
              </p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default ChatWindow;
