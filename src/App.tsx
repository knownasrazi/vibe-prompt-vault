import { useEffect, useState } from "react";

type Prompt = { id: string; title: string; body: string; tag: string; createdAt: number };

export default function App() {
  const [prompts, setPrompts] = useState<Prompt[]>(() => {
    try { return JSON.parse(localStorage.getItem("vibe-prompts") || "[]"); } catch { return []; }
  });
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("general");

  useEffect(() => {
    localStorage.setItem("vibe-prompts", JSON.stringify(prompts));
  }, [prompts]);

  const filtered = prompts.filter(p =>
    (p.title + p.body + p.tag).toLowerCase().includes(q.toLowerCase())
  );

  function addPrompt() {
    if (!title.trim() || !body.trim()) return;
    const next: Prompt = { id: crypto.randomUUID(), title: title.trim(), body: body.trim(), tag, createdAt: Date.now() };
    setPrompts([next, ...prompts]);
    setTitle(""); setBody("");
  }

  return (
    <main className="min-h-screen bg-[#fdfcfa] text-[#1a1a1a]">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-light">vibe-prompt-vault</h1>
        <p className="text-sm text-[#9a9590]">Capture once, vibe forever — local, no account.</p>

        <div className="mt-6 rounded-2xl border border-[#ebe7e0] bg-white p-4">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Prompt title" className="w-full rounded-xl border border-[#ebe7e0] px-3 py-2 text-sm" />
          <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Prompt body — e.g. 'Build a landing with...'" rows={3} className="mt-2 w-full rounded-xl border border-[#ebe7e0] px-3 py-2 text-sm" />
          <div className="mt-2 flex gap-2">
            <select value={tag} onChange={e=>setTag(e.target.value)} className="rounded-xl border border-[#ebe7e0] px-3 py-2 text-sm">
              <option>general</option><option>code</option><option>design</option><option>writing</option>
            </select>
            <button onClick={addPrompt} className="rounded-xl bg-[#1a1a1a] px-4 py-2 text-sm text-white">Save</button>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" className="ml-auto rounded-xl border border-[#ebe7e0] px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {filtered.map(p => (
            <div key={p.id} className="rounded-2xl border border-[#ebe7e0] bg-white p-4">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{p.title}</h3>
                <span className="rounded-full bg-[#fdfcfa] px-2 py-0.5 text-xs text-[#9a9590]">{p.tag}</span>
                <button onClick={()=>navigator.clipboard.writeText(p.body)} className="ml-auto text-xs text-[#9a9590] hover:text-[#1a1a1a]">Copy</button>
                <button onClick={()=>setPrompts(prompts.filter(x=>x.id!==p.id))} className="text-xs text-[#9a9590]">Delete</button>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-[#5a5754]">{p.body}</p>
            </div>
          ))}
          {filtered.length===0 && <p className="text-sm text-[#9a9590]">No prompts yet — add your first.</p>}
        </div>
      </div>
    </main>
  );
}
