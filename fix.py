import re
content = open("frontend/src/pages/TeamPage.tsx", "r", encoding="utf-8").read()
old_block = r'''                <div className="flex items-center gap-2">
                  <span className="text-\[11px\] font-mono font-bold px-2\.5 py-0\.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 uppercase tracking-wider">
                    <ShieldCheck className="h-3\.5 w-3\.5 text-emerald-400" /> Active Team
                  </span>
                  <span className="text-xs font-mono text-slate-400">ID #\{team\.id\}</span>
                </div>'''
new_block = '''                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 uppercase tracking-wider">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Active Team
                  </span>
                  <div className="flex items-center gap-1.5 ml-2 bg-surface-elevated/50 px-2 py-1 rounded-md border border-white/10">
                    <span className="text-[11px] font-mono text-slate-400">TEAM ID:</span>
                    <strong className="text-sm font-mono text-white tracking-wider">{team.id}</strong>
                    <button 
                      title="Copy Team ID"
                      onClick={() => {
                        navigator.clipboard.writeText(team.id.toString())
                        setCopiedId(true)
                        setTimeout(() => setCopiedId(false), 2000)
                      }}
                      className="ml-1 p-1 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white"
                    >
                      {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>'''
new_content = re.sub(old_block, new_block, content)
open("frontend/src/pages/TeamPage.tsx", "w", encoding="utf-8").write(new_content)
print("Done!")
