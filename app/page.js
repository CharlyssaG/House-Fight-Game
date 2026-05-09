'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // inject Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <>
      <style>{`
        :root {
          --black:#0a0a0a;--white:#f5f0e8;--red:#e63329;
          --yellow:#f5c842;--green:#1db954;
          --purple:#7c3aed;--pl:#a78bfa;
          --cb:#141414;--border:#2a2a2a;--dim:#888;--r:12px;
        }
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:var(--black);color:var(--white);font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden;}
        h1,h2,h3{font-family:'Bebas Neue',sans-serif;letter-spacing:.04em;}
        .screen{display:none;min-height:100vh;flex-direction:column;}
        .screen.active{display:flex;}
        .wrap{max-width:520px;margin:0 auto;padding:1.25rem;width:100%;}
        .btn{display:block;width:100%;padding:.9rem 1.5rem;font-family:'Bebas Neue',sans-serif;font-size:1.3rem;letter-spacing:.08em;border:none;border-radius:var(--r);cursor:pointer;transition:transform .1s,opacity .15s;}
        .btn:active{transform:scale(.97);}
        .btn:disabled{opacity:.35;cursor:not-allowed;}
        .br{background:var(--red);color:var(--white);}
        .br:hover:not(:disabled){background:#f04038;}
        .bw{background:var(--white);color:var(--black);}
        .bp{background:var(--purple);color:var(--white);}
        .bp:hover:not(:disabled){background:#6d28d9;}
        .bg{background:transparent;color:var(--white);border:1.5px solid #333;font-family:'DM Sans',sans-serif;font-size:.875rem;letter-spacing:0;padding:.65rem 1.25rem;}
        .bg:hover{border-color:#555;}
        input[type=text],input[type=number]{width:100%;background:var(--cb);border:1.5px solid var(--border);border-radius:var(--r);color:var(--white);font-family:'DM Sans',sans-serif;font-size:1rem;padding:.8rem 1rem;outline:none;transition:border-color .15s;}
        input:focus{border-color:var(--red);}
        input::placeholder{color:#555;}
        label{display:block;font-size:.72rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);margin-bottom:.45rem;}
        .field{margin-bottom:1.1rem;}
        #s-title{justify-content:center;align-items:center;text-align:center;position:relative;overflow:hidden;}
        .tbg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,#3a0a0a 0%,transparent 65%);pointer-events:none;}
        .tc{position:relative;z-index:1;padding:2.5rem 1.5rem;max-width:420px;}
        .eye{font-size:.68rem;letter-spacing:.25em;text-transform:uppercase;color:var(--red);margin-bottom:.75rem;font-weight:500;}
        .gt{font-family:'Bebas Neue',sans-serif;font-size:clamp(3rem,14vw,5rem);line-height:.92;color:var(--white);margin-bottom:.5rem;}
        .gt span{color:var(--red);}
        .gsub{font-size:.875rem;color:var(--dim);margin-bottom:1.75rem;line-height:1.6;}
        .badge{display:inline-flex;align-items:center;gap:6px;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:99px;padding:5px 13px;font-size:.72rem;color:var(--dim);margin-bottom:1.75rem;}
        .badge .dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse 2s infinite;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .mcards{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .mc{background:var(--cb);border:1.5px solid var(--border);border-radius:var(--r);padding:1rem;cursor:pointer;text-align:left;transition:border-color .15s;}
        .mc:hover{border-color:#555;}
        .mc.rand{border-color:#3b1a7a;background:#120d1f;}
        .mc.rand:hover{border-color:var(--pl);}
        .mi{font-size:1.4rem;margin-bottom:.4rem;}
        .mt{font-family:'Bebas Neue',sans-serif;font-size:.95rem;letter-spacing:.06em;margin-bottom:3px;}
        .md{font-size:.7rem;color:var(--dim);line-height:1.4;}
        #s-setup{background:var(--black);}
        .shd{padding:1.25rem 1.25rem 0;max-width:520px;margin:0 auto;width:100%;}
        .bk{background:none;border:none;color:var(--dim);font-family:'DM Sans',sans-serif;font-size:.875rem;cursor:pointer;display:flex;align-items:center;gap:6px;padding:0;margin-bottom:1.25rem;}
        .bk:hover{color:var(--white);}
        .dots{display:flex;gap:5px;margin-bottom:1.75rem;}
        .dot2{height:3px;border-radius:2px;flex:1;background:var(--border);transition:background .3s;}
        .dr{background:var(--red);}
        .dp{background:var(--purple);}
        .sh2{font-family:'Bebas Neue',sans-serif;font-size:2.25rem;line-height:1;margin-bottom:.45rem;}
        .ss{font-size:.875rem;color:var(--dim);margin-bottom:1.75rem;line-height:1.6;}
        .cg{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-bottom:1.25rem;}
        .cb2{aspect-ratio:1;background:var(--cb);border:1.5px solid var(--border);border-radius:9px;color:var(--white);font-family:'Bebas Neue',sans-serif;font-size:1.4rem;cursor:pointer;transition:all .15s;}
        .cb2:hover{border-color:#555;}
        .csr{background:var(--red);border-color:var(--red);}
        .csp{background:var(--purple);border-color:var(--purple);}
        #s-random{background:var(--black);justify-content:center;align-items:center;text-align:center;position:relative;overflow:hidden;}
        .rbg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,#1a0a3a 0%,transparent 65%);pointer-events:none;}
        .rc{position:relative;z-index:1;padding:2.5rem 1.5rem;max-width:440px;width:100%;}
        .reye{font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:var(--pl);margin-bottom:.75rem;font-weight:500;}
        .slot{background:#0e0a1a;border:2px solid #3b1a7a;border-radius:var(--r);padding:1.5rem 1.25rem;margin-bottom:1.1rem;min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;}
        .sorg{font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:var(--pl);margin-bottom:.4rem;}
        .sname2{font-family:'Bebas Neue',sans-serif;font-size:clamp(1.8rem,8vw,2.6rem);line-height:1.1;color:var(--white);}
        .sdesc{font-size:.78rem;color:var(--dim);margin-top:.4rem;line-height:1.5;}
        .rsub{font-size:.85rem;color:var(--dim);margin-bottom:1.1rem;line-height:1.6;}
        .rrbtn{background:none;border:1.5px solid #3b1a7a;border-radius:99px;color:var(--pl);font-family:'DM Sans',sans-serif;font-size:.78rem;padding:5px 14px;cursor:pointer;margin-bottom:1.1rem;display:inline-block;}
        .rrbtn:hover{border-color:var(--pl);}
        #s-hs{background:var(--black);}
        .hshd{padding:1.25rem;max-width:520px;margin:0 auto;width:100%;}
        .hsc{background:linear-gradient(180deg,#1a0505 0%,transparent 100%);}
        .hsp2{background:linear-gradient(180deg,#0d0a1a 0%,transparent 100%);}
        .tr{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;}
        .pb{border-radius:99px;padding:5px 13px;font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;}
        .tc2{font-size:.78rem;color:var(--dim);}
        .vss{background:var(--cb);border:1px solid var(--border);border-radius:var(--r);padding:.9rem 1.1rem;margin-bottom:1.25rem;display:flex;align-items:center;gap:11px;}
        .ac{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:.85rem;flex-shrink:0;}
        .vl{font-size:.68rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);margin-bottom:2px;}
        .vn{font-size:.95rem;font-weight:500;}
        .vt{font-size:.72rem;color:var(--dim);}
        .pb2{background:#111;border:1px dashed #333;border-radius:var(--r);padding:1.1rem;text-align:center;margin-bottom:1.25rem;}
        .pe{font-size:1.5rem;margin-bottom:.35rem;}
        .pt{font-size:.85rem;color:var(--dim);line-height:1.6;}
        .pt strong{color:var(--white);}
        .dl{margin-bottom:1.25rem;}
        .di{display:flex;align-items:center;gap:9px;padding:.65rem .9rem;background:var(--cb);border:1px solid var(--border);border-radius:8px;margin-bottom:5px;}
        .dn{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.72rem;flex-shrink:0;}
        .dname{font-size:.875rem;flex:1;}
        .dby{font-size:.68rem;color:var(--dim);}
        #s-sim{background:var(--black);align-items:center;justify-content:center;text-align:center;}
        .si{padding:2.5rem 1.5rem;max-width:400px;}
        .spinner{width:60px;height:60px;border:3px solid #222;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 1.25rem;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .stitle{font-family:'Bebas Neue',sans-serif;font-size:1.85rem;margin-bottom:.4rem;}
        .ssub2{font-size:.85rem;color:var(--dim);}
        .sbw{height:3px;background:#222;border-radius:2px;overflow:hidden;margin:1.25rem 0 .65rem;}
        .sbf{height:100%;border-radius:2px;transition:width .5s ease;}
        .slbl{font-size:.78rem;color:var(--dim);font-style:italic;}
        #s-res{background:var(--black);}
        .rh{padding:1.25rem 1.25rem 0;max-width:520px;margin:0 auto;width:100%;}
        .mpill{display:inline-block;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 9px;border-radius:99px;margin-bottom:.65rem;}
        .pilr{background:#2a0a0a;color:var(--red);border:1px solid var(--red);}
        .pilp{background:#1a0a2a;color:var(--pl);border:1px solid var(--purple);}
        .ah{background:var(--cb);border:1px solid var(--border);border-radius:var(--r);padding:1.1rem;margin-bottom:1.1rem;display:flex;align-items:center;gap:12px;}
        .ahc{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:1rem;flex-shrink:0;}
        .rcard{background:var(--cb);border:1px solid var(--border);border-radius:var(--r);padding:.9rem 1rem;margin-bottom:.65rem;animation:su .4s ease both;}
        .rcard.won{border-color:var(--green);}
        .rcard.lost{opacity:.75;}
        @keyframes su{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .rch{display:flex;align-items:center;gap:9px;margin-bottom:.75rem;}
        .rav{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:.8rem;flex-shrink:0;}
        .rn{font-size:.9rem;font-weight:500;flex:1;}
        .rb{font-size:.72rem;color:var(--dim);}
        .wlb{font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 7px;border-radius:4px;flex-shrink:0;}
        .ww{background:#0f3320;color:var(--green);}
        .wl{background:#2a1010;color:#c04040;}
        .prow{display:flex;align-items:baseline;gap:7px;margin-bottom:.45rem;}
        .pb3{font-family:'Bebas Neue',sans-serif;font-size:1.85rem;line-height:1;}
        .plb{font-size:.72rem;color:var(--dim);}
        .srows{margin-bottom:.65rem;}
        .sr{display:flex;align-items:center;gap:7px;margin-bottom:4px;}
        .sl{font-size:.68rem;color:var(--dim);width:85px;flex-shrink:0;}
        .st{flex:1;height:4px;background:#222;border-radius:2px;overflow:hidden;}
        .sf{height:100%;border-radius:2px;}
        .sv{font-size:.68rem;font-weight:600;width:22px;text-align:right;color:var(--dim);}
        .vsb{display:flex;height:5px;border-radius:3px;overflow:hidden;margin-bottom:.65rem;}
        .qbox{border-radius:9px;padding:.9rem 1rem;border-left:3px solid #333;background:#0c0c0c;}
        .qbox.qw{border-left-color:var(--green);}
        .qbox.ql{border-left-color:#3a1212;}
        .qlbl{font-size:.6rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin-bottom:.5rem;display:flex;align-items:center;gap:5px;}
        .qtxt{font-size:.88rem;line-height:1.65;color:var(--white);font-weight:400;}
        .qverd{font-size:.74rem;color:#777;font-style:italic;margin-top:.5rem;padding-top:.5rem;border-top:1px solid #1e1e1e;}
        .sb2{background:var(--cb);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;margin-bottom:1.1rem;}
        .sbh{background:#1a1a1a;padding:.65rem 1rem;font-family:'Bebas Neue',sans-serif;font-size:.95rem;letter-spacing:.06em;color:var(--dim);display:flex;justify-content:space-between;}
        .sbr{display:flex;align-items:center;gap:11px;padding:.65rem 1rem;border-top:1px solid var(--border);}
        .sbrk{font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:var(--dim);width:18px;}
        .sbrk.gold{color:var(--yellow);}
        .sbn{flex:1;font-weight:500;font-size:.875rem;}
        .sbp{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;}
        .sbpl{font-size:.68rem;color:var(--dim);}
        .brow{display:flex;gap:9px;margin-top:.45rem;}
        .brow .btn{flex:1;}
        #s-champ{background:var(--black);align-items:center;justify-content:center;text-align:center;position:relative;overflow:hidden;}
        .chbg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,#1a3a10 0%,transparent 65%);pointer-events:none;}
        .chc{position:relative;z-index:1;padding:2.5rem 1.5rem;max-width:400px;}
        .troph{font-size:4.5rem;margin-bottom:.875rem;animation:float 3s ease-in-out infinite;}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        .chl{font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:var(--green);margin-bottom:.45rem;font-weight:600;}
        .chn{font-family:'Bebas Neue',sans-serif;font-size:2.75rem;line-height:1;margin-bottom:.45rem;}
        .chs{font-size:.85rem;color:var(--dim);margin-bottom:1.75rem;line-height:1.6;}
        .chg{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:1.75rem;}
        .chst{background:var(--cb);border:1px solid var(--border);border-radius:10px;padding:.875rem;}
        .chsv{font-family:'Bebas Neue',sans-serif;font-size:1.85rem;color:var(--green);margin-bottom:2px;}
        .chsl{font-size:.68rem;color:var(--dim);text-transform:uppercase;letter-spacing:.08em;}
        .cp{position:fixed;border-radius:2px;animation:cf linear forwards;pointer-events:none;z-index:999;}
        @keyframes cf{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      `}</style>

      <div id="s-title" className="screen active">
        <div className="tbg"></div>
        <div className="tc">
          <p className="eye">AI-Powered Party Game</p>
          <h1 className="gt">The<br /><span>House</span><br />Fight<br />Game</h1>
          <p className="gsub">One fighter. Everyone picks a challenger.<br />The AI runs the numbers. Someone wins.</p>
          <div className="badge"><span className="dot"></span>Powered by Claude AI</div>
          <div className="mcards">
            <div className="mc" onClick={() => window.startClassic && window.startClassic()}>
              <div className="mi">⚔️</div>
              <div className="mt">Classic Mode</div>
              <div className="md">You pick the anchor. Everyone challenges it.</div>
            </div>
            <div className="mc rand" onClick={() => window.startRandom && window.startRandom()}>
              <div className="mi">🎲</div>
              <div className="mt" style={{color:'var(--pl)'}}>Random Fighter</div>
              <div className="md">AI picks a surprise fighter. Nobody knows until the reveal.</div>
            </div>
          </div>
        </div>
      </div>

      <div id="s-setup" className="screen">
        <div className="shd">
          <button className="bk" onClick={() => window.goHome && window.goHome()}>← Back</button>
          <div className="dots" id="dots"></div>
        </div>
        <div className="wrap">
          <div id="step-a" style={{display:'none'}}>
            <h2 className="sh2">Who's the<br />anchor fighter?</h2>
            <p className="ss">This is who everyone challenges. Make it interesting.</p>
            <div className="field"><label>Fighter name</label><input type="text" id="an" placeholder="e.g. Darth Vader" maxLength="60" /></div>
            <div className="field"><label>Description (optional)</label><input type="text" id="ad" placeholder="e.g. Sith Lord, Force choke, lightsaber" maxLength="120" /></div>
            <button className="btn br" onClick={() => window.onAnext && window.onAnext()}>Next →</button>
          </div>
          <div id="step-c" style={{display:'none'}}>
            <h2 className="sh2">How many<br />players?</h2>
            <p className="ss">Each player picks one challenger. Pass the device around.</p>
            <div className="cg" id="cg"></div>
            <div className="field"><label>Or type a number</label><input type="number" id="cn" min="2" max="20" placeholder="2 – 20" /></div>
            <button className="btn br" id="bcn" onClick={() => window.onCnext && window.onCnext()}>Next →</button>
          </div>
          <div id="step-n" style={{display:'none'}}>
            <h2 className="sh2">Player<br />names</h2>
            <p className="ss">Names appear on scoreboard and result cards.</p>
            <div id="nf"></div>
            <button className="btn br" id="bnn" onClick={() => window.onNnext && window.onNnext()}>Let's fight →</button>
          </div>
        </div>
      </div>

      <div id="s-random" className="screen">
        <div className="rbg"></div>
        <div className="rc">
          <p className="reye">🎲 Random Fighter Mode</p>
          <h2 className="sh2" style={{fontSize:'1.85rem',marginBottom:'.875rem'}}>The AI has chosen<br />your opponent</h2>
          <div className="slot" id="slot">
            <p className="sorg">Generating…</p>
            <p className="sname2" id="sn" style={{opacity:.3}}>???</p>
          </div>
          <p className="rsub" id="rsub" style={{display:'none'}}>Everyone sees the fighter. Pass the phone — each player picks their challenger.</p>
          <div id="rbtns" style={{display:'none'}}>
            <button className="rrbtn" onClick={() => window.genFighter && window.genFighter()}>🎲 Reroll fighter</button>
            <button className="btn bp" onClick={() => window.confirmFighter && window.confirmFighter()}>This is the one →</button>
          </div>
        </div>
      </div>

      <div id="s-hs" className="screen">
        <div className="hshd hsc" id="hshd">
          <div className="tr">
            <div className="pb" id="hsbadge">P1's turn</div>
            <span className="tc2" id="hscnt">1 of 4</span>
          </div>
          <div className="vss">
            <div className="ac" id="hsav" style={{background:'var(--red)',color:'var(--white)'}}>??</div>
            <div>
              <p className="vl">Fighting against</p>
              <p className="vn" id="hsan">—</p>
              <p className="vt" id="hsat">—</p>
            </div>
          </div>
          <div className="pb2">
            <div className="pe">📱</div>
            <p className="pt">Pass the phone to <strong id="hsp">Player 1</strong>.<br />Don't show anyone else what you type.</p>
          </div>
        </div>
        <div className="wrap">
          <div className="dl" id="dl" style={{display:'none'}}></div>
          <div className="field"><label id="hslbl">Your challenger</label><input type="text" id="cn2" placeholder="e.g. Pootie Tang" maxLength="60" /></div>
          <div className="field"><label>Description (optional)</label><input type="text" id="cd" placeholder="e.g. Belt master, sa da tay" maxLength="120" /></div>
          <button className="btn br" id="bsub" onClick={() => window.subChall && window.subChall()}>Submit challenger</button>
        </div>
      </div>

      <div id="s-sim" className="screen">
        <div className="si">
          <div className="spinner" id="ssp" style={{borderTopColor:'var(--red)'}}></div>
          <h2 className="stitle">Running the<br />simulation</h2>
          <p className="ssub2">The AI is deciding who walks away.</p>
          <div className="sbw"><div className="sbf" id="sbf" style={{width:'0%',background:'var(--red)'}}></div></div>
          <p className="slbl" id="slbl">Preparing…</p>
        </div>
      </div>

      <div id="s-res" className="screen">
        <div className="rh">
          <div id="rpill"></div>
          <h2 className="sh2" id="rrl" style={{marginBottom:'1.1rem'}}>Round Results</h2>
          <div className="ah">
            <div className="ahc" id="rav" style={{background:'var(--red)'}}>??</div>
            <div>
              <div style={{fontSize:'.68rem',color:'var(--dim)',marginBottom:'2px',letterSpacing:'.08em',textTransform:'uppercase'}} id="reye2">Anchor fighter</div>
              <div style={{fontSize:'1rem',fontWeight:500}} id="ran">—</div>
              <div style={{fontSize:'.72rem',color:'var(--dim)'}} id="rad">—</div>
            </div>
          </div>
        </div>
        <div className="wrap" id="rcards"></div>
        <div className="wrap" style={{paddingTop:0}}>
          <div className="sb2" id="scoreboard"></div>
          <div className="brow">
            <button className="btn bg" onClick={() => window.doNewRound && window.doNewRound()}>New round</button>
            <button className="btn br" onClick={() => window.crownChamp && window.crownChamp()}>Crown champion →</button>
          </div>
        </div>
      </div>

      <div id="s-champ" className="screen">
        <div className="chbg"></div>
        <div className="chc">
          <div className="troph">🏆</div>
          <p className="chl">Tournament Champion</p>
          <h2 className="chn" id="chname">—</h2>
          <p className="chs" id="chsub">—</p>
          <div className="chg">
            <div className="chst"><div className="chsv" id="chw">0</div><div className="chsl">Rounds won</div></div>
            <div className="chst"><div className="chsv" id="chr">0</div><div className="chsl">Rounds played</div></div>
          </div>
          <button className="btn bw" style={{marginBottom:'11px'}} onClick={() => window.newGame && window.newGame()}>Play again</button>
          <button className="btn bg" onClick={() => window.doNewRound && window.doNewRound()}>One more round</button>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{__html: `
        var CLR=['#e63329','#f5c842','#1db954','#3b82f6','#a855f7','#f97316','#ec4899','#06b6d4','#84cc16','#f43f5e','#8b5cf6','#14b8a6','#fb923c','#60a5fa','#e879f9','#4ade80','#facc15','#fb7185','#38bdf8','#c084fc'];
        var G={mode:'classic',anchor:{name:'',desc:''},players:[],challengers:[],turn:0,results:[],scores:{},round:0};
        function show(id){document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});document.getElementById(id).classList.add('active');}
        window.goHome=function(){show('s-title');};
        function ini(n){return n.split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase();}
        function setDots(total,done,isP){var h='';for(var i=0;i<total;i++){var c='dot2'+(i<done?(isP?' dp':' dr'):'');h+='<div class="'+c+'"></div>';}document.getElementById('dots').innerHTML=h;}
        function buildGrid(isP){var h='';for(var n=2;n<=10;n++){h+='<button class="cb2" id="cb'+n+'" onclick="selN('+n+','+(isP?'true':'false')+')">'+n+'</button>';}document.getElementById('cg').innerHTML=h;document.getElementById('cn').value='';}
        function selN(n,isP){document.querySelectorAll('.cb2').forEach(function(b){b.className='cb2';});var b=document.getElementById('cb'+n);if(b)b.classList.add(isP?'csp':'csr');document.getElementById('cn').value=n;}
        window.startClassic=function(){G.mode='classic';G.round=(G.round||0)+1;document.getElementById('step-a').style.display='block';document.getElementById('step-c').style.display='none';document.getElementById('step-n').style.display='none';document.getElementById('an').value='';document.getElementById('ad').value='';document.getElementById('bcn').style.background='var(--red)';setDots(3,1,false);show('s-setup');};
        window.onAnext=function(){var n=document.getElementById('an').value.trim();if(!n){document.getElementById('an').focus();return;}G.anchor={name:n,desc:document.getElementById('ad').value.trim()};document.getElementById('step-a').style.display='none';buildGrid(false);document.getElementById('step-c').style.display='block';setDots(3,2,false);};
        window.startRandom=function(){G.mode='random';G.round=(G.round||0)+1;G.anchor={name:'',desc:''};document.getElementById('step-a').style.display='none';document.getElementById('step-n').style.display='none';buildGrid(true);document.getElementById('cn').value='';document.getElementById('bcn').style.background='var(--purple)';document.getElementById('step-c').style.display='block';setDots(2,1,true);show('s-setup');};
        window.onCnext=function(){var n=parseInt(document.getElementById('cn').value);if(!n||n<2||n>20){alert('Pick between 2 and 20 players.');return;}G.playerCount=n;document.getElementById('step-c').style.display='none';buildNF();document.getElementById('step-n').style.display='block';if(G.mode==='random'){document.getElementById('bnn').style.background='var(--purple)';setDots(2,2,true);}else setDots(3,3,false);};
        window.onNnext=function(){collectNames();if(G.mode==='random'){show('s-random');resetReveal();window.genFighter();}else startHS();};
        function buildNF(){var h='';for(var i=0;i<G.playerCount;i++){h+='<div class="field"><label style="color:'+CLR[i]+'">Player '+(i+1)+'</label><input type="text" id="pn'+i+'" placeholder="Player '+(i+1)+'" maxlength="30"></div>';}document.getElementById('nf').innerHTML=h;document.getElementById('bnn').style.background='var(--red)';}
        function collectNames(){G.players=[];G.scores=G.scores||{};for(var i=0;i<G.playerCount;i++){var el=document.getElementById('pn'+i);var name=el?el.value.trim():'';if(!name)name='Player '+(i+1);G.players.push({name:name,color:CLR[i]});if(G.scores[name]===undefined)G.scores[name]=0;}}
        var _ri=null;
        function resetReveal(){document.getElementById('rsub').style.display='none';document.getElementById('rbtns').style.display='none';document.getElementById('slot').innerHTML='<p class="sorg">Generating…</p><p class="sname2" id="sn" style="opacity:.3">???</p>';}
        window.genFighter=async function(){resetReveal();if(_ri)clearInterval(_ri);var rolls=['Dracula','Godzilla','Gandalf','Shrek','Thanos','Elmo','Merlin','Cruella','Hercules','Yzma'];var ri=0;_ri=setInterval(function(){var el=document.getElementById('sn');if(el)el.textContent=rolls[ri%rolls.length];ri++;},100);
          try{var r=await fetch('/api/random-fighter');var f=await r.json();clearInterval(_ri);revealFighter(f);}catch(e){clearInterval(_ri);revealFighter({name:'Yzma',desc:'Evil sorceress, transforms people, wildly underestimated',origin:"Emperor's New Groove"});}};
        function revealFighter(f){G.anchor={name:f.name,desc:f.desc||''};var sm=document.getElementById('slot');sm.innerHTML='<p class="sorg">'+(f.origin||'Random Fighter')+'</p><p class="sname2" id="sn" style="opacity:0;transition:opacity .5s">'+f.name+'</p>'+(f.desc?'<p class="sdesc">'+f.desc+'</p>':'');setTimeout(function(){var el=document.getElementById('sn');if(el)el.style.opacity='1';},60);document.getElementById('rsub').style.display='block';document.getElementById('rbtns').style.display='block';}
        window.confirmFighter=function(){G.challengers=[];G.turn=0;startHS();};
        function startHS(){G.challengers=[];G.turn=0;renderHS();var isR=G.mode==='random';document.getElementById('hshd').className='hshd '+(isR?'hsp2':'hsc');document.getElementById('hsav').style.background=isR?'var(--purple)':'var(--red)';document.getElementById('bsub').className='btn '+(isR?'bp':'br');show('s-hs');}
        function renderHS(){var p=G.players[G.turn];document.getElementById('hsbadge').textContent=p.name+"'s turn";document.getElementById('hsbadge').style.background=p.color;document.getElementById('hscnt').textContent=(G.turn+1)+' of '+G.players.length;document.getElementById('hsp').textContent=p.name;document.getElementById('hsav').textContent=ini(G.anchor.name);document.getElementById('hsan').textContent=G.anchor.name;document.getElementById('hsat').textContent=G.anchor.desc||'The anchor fighter';document.getElementById('hslbl').textContent='Your challenger vs '+G.anchor.name;document.getElementById('cn2').value='';document.getElementById('cd').value='';document.getElementById('cn2').focus();var dl=document.getElementById('dl');if(G.challengers.length>0){dl.style.display='block';dl.innerHTML=G.challengers.map(function(c,i){var pl=G.players[c.pi];return '<div class="di"><div class="dn" style="background:'+pl.color+'22;color:'+pl.color+'">'+(i+1)+'</div><div><div class="dname">'+c.name+'</div><div class="dby">by '+pl.name+'</div></div><span style="color:var(--green)">✓</span></div>';}).join('');}else dl.style.display='none';}
        window.subChall=function(){var name=document.getElementById('cn2').value.trim();if(!name){document.getElementById('cn2').focus();return;}G.challengers.push({name:name,desc:document.getElementById('cd').value.trim(),pi:G.turn});G.turn++;if(G.turn>=G.players.length)runSim();else renderHS();};
        async function runSim(){show('s-sim');var isR=G.mode==='random';var col=isR?'var(--pl)':'var(--red)';document.getElementById('ssp').style.borderTopColor=col;document.getElementById('sbf').style.background=col;G.results=[];
          for(var i=0;i<G.challengers.length;i++){var c=G.challengers[i];document.getElementById('sbf').style.width=Math.round((i/G.challengers.length)*100)+'%';document.getElementById('slbl').textContent='Simulating: '+G.anchor.name+' vs '+c.name+'…';
            try{var r=await fetch('/api/fight',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({anchor:G.anchor,challenger:c})});var res=await r.json();G.results.push({c:c,winner:res.winner,pct:res.winnerPct,stats:res.stats,verdict:res.verdict,quip:res.quip});if(res.winner==='b'){var pl=G.players[c.pi];G.scores[pl.name]=(G.scores[pl.name]||0)+1;}}
            catch(e){G.results.push({c:c,winner:Math.random()>.5?'b':'a',pct:65,stats:[{name:'Raw power',a:50,b:50},{name:'Chaos',a:50,b:50},{name:'Threat',a:50,b:50}],verdict:'API error',quip:'Something went wrong — check your API key in Vercel.'});}}
          document.getElementById('sbf').style.width='100%';await new Promise(function(r){setTimeout(r,300);});showResults();}
        function showResults(){show('s-res');var isR=G.mode==='random';var ac=isR?'var(--purple)':'var(--red)';document.getElementById('rrl').textContent='Round '+G.round+' Results';document.getElementById('rpill').innerHTML=isR?'<span class="mpill pilp">🎲 Random Fighter Mode</span>':'<span class="mpill pilr">⚔️ Classic Mode</span>';var av=document.getElementById('rav');av.textContent=ini(G.anchor.name);av.style.background=isR?'var(--purple)':'var(--red)';document.getElementById('reye2').textContent=isR?'Random fighter':'Anchor fighter';document.getElementById('ran').textContent=G.anchor.name;document.getElementById('rad').textContent=G.anchor.desc||'';
          var sorted=G.results.slice().sort(function(a,b){var aw=a.winner==='b'?1:0,bw=b.winner==='b'?1:0;if(bw!==aw)return bw-aw;var ap=a.winner==='b'?a.pct:100-a.pct,bp=b.winner==='b'?b.pct:100-b.pct;return bp-ap;});
          var html='';sorted.forEach(function(res,i){var c=res.c,pl=G.players[c.pi],isW=res.winner==='b';var cPct=Math.round(isW?res.pct:100-res.pct),aPct=100-cPct;var stats='';if(res.stats)res.stats.forEach(function(s){var bp=Math.round(s.b/(s.a+s.b)*100);stats+='<div class="sr"><span class="sl">'+s.name+'</span><div class="st"><div class="sf" style="width:'+bp+'%;background:'+pl.color+'"></div></div><span class="sv">'+s.b+'</span></div>';});html+='<div class="rcard '+(isW?'won':'lost')+'" style="animation-delay:'+(i*.1)+'s"><div class="rch"><div class="rav" style="background:'+pl.color+'22;color:'+pl.color+'">'+ini(c.name)+'</div><div style="flex:1"><div class="rn">'+c.name+'</div><div class="rb">Picked by '+pl.name+'</div></div><span class="wlb '+(isW?'ww':'wl')+'">'+(isW?'WIN':'LOSS')+'</span></div><div class="prow"><span class="pb3" style="color:'+(isW?'#1db954':'#c04040')+'">'+cPct+'%</span><span class="plb">win probability vs '+G.anchor.name+'</span></div><div class="srows">'+stats+'</div><div class="vsb"><div style="width:'+cPct+'%;background:'+pl.color+'"></div><div style="width:'+aPct+'%;background:'+ac+'"></div></div><div class="qbox '+(isW?'qw':'ql')+'"><p class="qlbl">'+(isW?'🏆':'💀')+' How it went down</p><p class="qtxt">'+(res.quip||res.verdict||'The simulation has concluded.')+'</p>'+(res.verdict?'<p class="qverd">'+res.verdict+'</p>':'')+  '</div></div>';});
          document.getElementById('rcards').innerHTML=html;
          var sb=Object.entries(G.scores).sort(function(a,b){return b[1]-a[1];});var h='<div class="sbh"><span>Scoreboard</span><span>Round '+G.round+'</span></div>';sb.forEach(function(e,i){var name=e[0],wins=e[1];var pl=G.players.find(function(p){return p.name===name;});var col=pl?pl.color:'#888';h+='<div class="sbr"><span class="sbrk'+(i===0?' gold':'')+'">'+(i===0?'👑':(i+1))+'</span><span class="sbn" style="color:'+col+'">'+name+'</span><div><span class="sbp" style="color:'+col+'">'+wins+'</span><span class="sbpl"> pts</span></div></div>';});document.getElementById('scoreboard').innerHTML=h;}
        window.doNewRound=function(){show('s-title');};
        window.crownChamp=function(){var sorted=Object.entries(G.scores).sort(function(a,b){return b[1]-a[1];});if(!sorted.length)return;var name=sorted[0][0],wins=sorted[0][1];var pl=G.players.find(function(p){return p.name===name;});document.getElementById('chname').textContent=name;document.getElementById('chname').style.color=pl?pl.color:'var(--green)';document.getElementById('chsub').textContent='Winner after '+G.round+' round'+(G.round!==1?'s':'')+' of The House Fight Game';document.getElementById('chw').textContent=wins;document.getElementById('chr').textContent=G.round;show('s-champ');doConfetti(pl?pl.color:'#1db954');};
        function doConfetti(color){var cols=[color,'#f5c842','#ffffff','#e63329','#1db954'];for(var i=0;i<55;i++){(function(i){setTimeout(function(){var el=document.createElement('div');el.className='cp';el.style.left=(Math.random()*100)+'vw';el.style.background=cols[Math.floor(Math.random()*cols.length)];el.style.animationDuration=(2+Math.random()*2)+'s';el.style.animationDelay=(Math.random()*.5)+'s';var sz=(6+Math.random()*6)+'px';el.style.width=sz;el.style.height=sz;document.body.appendChild(el);setTimeout(function(){el.remove();},4500);},i*40);})(i);}}
        window.newGame=function(){G={mode:'classic',anchor:{name:'',desc:''},players:[],challengers:[],turn:0,results:[],scores:{},round:0};show('s-title');};
      `}} />
    </>
  );
}
