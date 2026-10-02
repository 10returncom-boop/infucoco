/* ============================================================
   INFUCOCO 療癒宇宙 — 遊戲引擎（10 玩法）
   每個引擎回傳 { start(stage,onScore,onEnd) }
   ============================================================ */
window.GameEngines=(function(){
  const $=function(stage,html){stage.innerHTML=html};
  const emo=["🌙","⭐","🌸","☁️","🦋","🌈","🍬","✨","🐾","🎈"];

  /* 共用結束畫面 */
  function endScreen(stage,score,msg){
    if(window.confetti)confetti({count:80});
    $(stage,`<div class="game-start"><div style="font-size:3rem">🎉</div><h3>${msg||"太棒了！"}</h3><p>你得了 <b style="color:var(--accent)">${score}</b> 分<br>再玩一次，刷新最佳紀錄吧！</p><button class="btn" onclick="this.closest('.game-stage').__replay&&this.closest('.game-stage').__replay()">🔄 再玩一次</button></div>`);
  }

  /* catch 接物 */
  function catchGame(g){
    return {start(stage,onScore,onEnd){
      let score=0,t=0;
      const run=()=>{
        $(stage,`<div class="g-toolbar"><span class="g-info">🎯 ${g.t}</span><span class="score">🏆 ${score}</span></div><div class="game-stage-inner" style="position:relative;width:100%;max-width:520px;height:360px;border-radius:20px;overflow:hidden;background:var(--bg2)"></div>`);
        const box=stage.querySelector(".game-stage-inner");
        const mk=()=>{
          const el=document.createElement("div");el.style.cssText="position:absolute;font-size:1.8rem;cursor:pointer;user-select:none;transition:transform .12s";
          el.textContent=emo[Math.floor(Math.random()*emo.length)];
          el.style.left=Math.random()*88+"%";el.style.top="-8%";
          box.appendChild(el);
          let y=-8,vy=1+Math.random()*1.6;
          const iv=setInterval(()=>{
            y+=vy;
            if(y>100){clearInterval(iv);el.remove();}
            el.style.top=y+"%";
          },40);
          el.onclick=()=>{score++;onScore(score);el.remove();clearInterval(iv);el.style.transform="scale(1.6)";
            setTimeout(()=>{},50)};
        };
        const iv2=setInterval(()=>{t++;if(t>120){clearInterval(iv2);endScreen(stage,score,"🎉 全部接住了！");onEnd(score);return}mk()},900);
        stage.__replay=run;
      };
      run();
    }};
  }

  /* whack 打地鼠 */
  function whackGame(g){
    return {start(stage,onScore,onEnd){
      let score=0,t=0;const run=()=>{
        $(stage,`<div class="g-toolbar"><span class="g-info">🔨 ${g.t}</span><span class="score">🏆 ${score}</span></div><div class="g-holes" style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;max-width:380px;width:100%"></div>`);
        const holes=stage.querySelector(".g-holes");
        const cells=[];for(let i=0;i<9;i++){const c=document.createElement("div");c.style.cssText="aspect-ratio:1;border-radius:18px;background:var(--chip);display:grid;place-items:center;font-size:1.6rem;cursor:pointer";holes.appendChild(c);cells.push(c);}
        const iv=setInterval(()=>{
          t++;cells.forEach(c=>c.textContent="");
          if(t>100){clearInterval(iv);endScreen(stage,score,"⚡ 反應超快！");onEnd(score);return}
          const i=Math.floor(Math.random()*9);cells[i].textContent="🐭";cells[i].style.background="var(--grad)";
        },750);
        holes.addEventListener("click",e=>{
          if(e.target.textContent==="🐭"){score++;onScore(score);e.target.textContent="";e.target.style.background="var(--chip)";e.target.style.transform="scale(.9)";setTimeout(()=>e.target.style.transform="",120)}
        });
        stage.__replay=run;
      };run();
    }};
  }

  /* memory 配對 */
  function memoryGame(g){
    return {start(stage,onScore,onEnd){
      const pairs=6;const set=[...emo.slice(0,pairs),...emo.slice(0,pairs)].sort(()=>Math.random()-.5);
      let open=[],score=0,moves=0;const run=()=>{
        $(stage,`<div class="g-toolbar"><span class="g-info">🃏 ${g.t}</span><span class="score">🏆 ${score}</span></div><div class="g-cards" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:420px;width:100%"></div>`);
        const gd=stage.querySelector(".g-cards");open=[];score=0;moves=0;
        const cells=set.map((v,i)=>{
          const d=document.createElement("div");d.style.cssText="aspect-ratio:1;border-radius:14px;background:var(--grad);display:grid;place-items:center;font-size:1.6rem;cursor:pointer;color:transparent";d.dataset.v=v;d.dataset.i=i;
          d.onclick=()=>{
            if(d.classList.contains("ok")||open.includes(d))return;
            d.textContent=v;d.style.color="#fff";d.style.background="var(--card)";open.push(d);moves++;
            if(open.length===2){
              if(open[0].dataset.v===open[1].dataset.v){open.forEach(x=>x.classList.add("ok"));score++;onScore(score);if(score===pairs)endScreen(stage,score,"🧠 記憶力超強！"),onEnd(score);}
              else{setTimeout(()=>{open.forEach(x=>{x.textContent="";x.style.color="transparent";x.style.background="var(--grad)";});},600);}
              open=[];
            }
          };
          gd.appendChild(d);return d;
        });
        stage.__replay=run;
      };run();
    }};
  }

  /* quiz 問答 */
  function quizGame(g){
    const Q=[
      {q:"infucoco 的髮型是？",a:["雙丸子頭","單馬尾","短髮"],r:0},
      {q:"infucoco 最喜歡的天氣是？",a:["下雨天","星空夜","大晴天"],r:1},
      {q:"下面哪個是 infucoco 的療癒動作？",a:["抱抱自己","尖叫","跺腳"],r:0},
      {q:"infucoco 的招牌顏色是？",a:["紅白橫紋","全黑","豹紋"],r:0},
      {q:"infucoco 陪你做什麼最療癒？",a:["一起數星星","一起加班","一起吵架"],r:0},
      {q:"累了應該？",a:["好好休息","繼續硬撐","熬夜"],r:0}
    ];
    return {start(stage,onScore,onEnd){
      let qn=0,score=0;const run=()=>{
        if(qn>=Q.length){endScreen(stage,score,"💡 療癒達人！");onEnd(score);return}
        const q=Q[qn];
        const opts=q.a.map((x,i)=>`<button ${i===q.r?"data-r":""}>${x}</button>`).join("");
        $(stage,`<div class="g-toolbar"><span class="g-info">❓ ${g.t}</span><span class="score">🏆 ${score}</span></div><div style="text-align:center;max-width:500px"><div style="font-size:1.2rem;font-weight:800;margin-bottom:16px">${q.q}</div><div class="g-opt">${opts}</div></div>`);
        stage.querySelector(".g-opt").addEventListener("click",e=>{
          const b=e.target.closest("button");if(!b)return;
          const correct=b.hasAttribute("data-r");
          if(correct){score++;onScore(score);b.classList.add("correct")}else{b.classList.add("wrong");stage.querySelector("[data-r]").classList.add("correct")}
          setTimeout(()=>{qn++;run()},800);
        });
      };run();
    }};
  }

  /* timing 時機 */
  function timingGame(g){
    return {start(stage,onScore,onEnd){
      let score=0,pos=0,dir=1,t=0;const run=()=>{
        $(stage,`<div class="g-toolbar"><span class="g-info">⏱️ ${g.t}</span><span class="score">🏆 ${score}</span></div><div style="text-align:center"><div style="position:relative;width:100%;max-width:420px;height:46px;border-radius:24px;background:var(--chip);overflow:hidden"><div class="g-dot" style="position:absolute;top:0;width:30px;height:46px;border-radius:24px;background:var(--grad)"></div><div style="position:absolute;top:0;left:50%;width:8px;height:46px;background:#fff;opacity:.9"></div></div><p style="margin-top:14px;color:var(--soft-txt)">在星星標記時按下！</p><button class="btn" style="margin-top:16px">⏱️ 現在！</button></div>`);
        const dot=stage.querySelector(".g-dot");const btn=stage.querySelector(".btn");
        const iv=setInterval(()=>{pos+=dir*3.4;if(pos>92||pos<0){dir*=-1;pos=Math.max(0,Math.min(92,pos))}dot.style.left=pos+"%"},26);
        btn.onclick=()=>{t++;const center=Math.abs(pos-46);if(center<8){score++;onScore(score);}if(t>=15){clearInterval(iv);endScreen(stage,score,"🎯 節奏大師！");onEnd(score)}};
        stage.__replay=run;
      };run();
    }};
  }

  /* reaction 反應 */
  function reactionGame(g){
    return {start(stage,onScore,onEnd){
      let score=0,t=0;const run=()=>{
        $(stage,`<div class="g-toolbar"><span class="g-info">⚡ ${g.t}</span><span class="score">🏆 ${score}</span></div><div class="g-arena2" style="position:relative;width:100%;max-width:460px;height:320px;border-radius:20px;background:var(--bg2);overflow:hidden"></div>`);
        const box=stage.querySelector(".g-arena2");
        const iv=setInterval(()=>{
          t++;if(t>90){clearInterval(iv);endScreen(stage,score,"⚡ 反應超快！");onEnd(score);return}
          box.innerHTML="";
          const el=document.createElement("div");el.style.cssText="position:absolute;font-size:2rem;cursor:pointer";
          el.textContent=["⭐","🌸","🌈","🍬"][Math.floor(Math.random()*4)];
          el.style.left=Math.random()*88+"%";el.style.top=Math.random()*84+"%";
          el.onclick=()=>{score++;onScore(score);el.remove()};
          box.appendChild(el);
        },600);
        stage.__replay=run;
      };run();
    }};
  }

  /* count 數數 */
  function countGame(g){
    return {start(stage,onScore,onEnd){
      let score=0,qn=0;const run=()=>{
        if(qn>=8){endScreen(stage,score,"🔢 算數高手！");onEnd(score);return}
        const n=2+Math.floor(Math.random()*6);const set=emo.slice(0,n);
        const wrong=Math.max(1,n+(Math.random()<.5?1:-1));
        $(stage,`<div class="g-toolbar"><span class="g-info">🔢 ${g.t}</span><span class="score">🏆 ${score}</span></div><div style="text-align:center"><div style="font-size:2.2rem;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:16px">${set.map(e=>`<span>${e}</span>`).join("")}</div><div class="g-opt"><button data-n="${n}">${n}</button><button data-n="${wrong}">${wrong}</button></div></div>`);
        stage.querySelector(".g-opt").addEventListener("click",e=>{
          const b=e.target.closest("button");if(!b)return;
          if(+b.dataset.n===n){score++;onScore(score);b.classList.add("correct")}else b.classList.add("wrong");
          setTimeout(()=>{qn++;run()},600);
        });
      };run();
    }};
  }

  /* order 排序 */
  function orderGame(g){
    return {start(stage,onScore,onEnd){
      const seq=[{e:"🌱",n:"種子"},{e:"🌷",n:"開花"},{e:"🌼",n:"盛開"}].sort(()=>Math.random()-.5);
      let score=0,step=0;const run=()=>{
        if(step>=seq.length){endScreen(stage,score,"🧭 順序對了！");onEnd(score);return}
        $(stage,`<div class="g-toolbar"><span class="g-info">🧭 ${g.t}</span><span class="score">🏆 ${score}</span></div><div style="text-align:center"><p style="color:var(--soft-txt);margin-bottom:14px">找到下一個該出現的：<b>${seq[step].n}</b></p><div class="g-emojis">${seq.map((s,i)=>`<span class="g-item" data-i="${i}">${s.e}</span>`).join("")}</div></div>`);
        stage.querySelectorAll(".g-item").forEach(x=>x.onclick=()=>{
          if(+x.dataset.i===step){score++;onScore(score);x.style.opacity=".25";step++;setTimeout(run,300)}
        });
      };run();
    }};
  }

  /* match 連連看 */
  function matchGame(g){
    return {start(stage,onScore,onEnd){
      const items=[["🌙","月亮"],["⭐","星星"],["🌸","花朵"],["☁️","雲朵"]].sort(()=>Math.random()-.5);
      let score=0,matched=0,sel=null;const run=()=>{
        $(stage,`<div class="g-toolbar"><span class="g-info">🔗 ${g.t}</span><span class="score">🏆 ${score}</span></div><div class="g-match" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:460px;width:100%"><div class="g-left" style="display:flex;flex-direction:column;gap:10px"></div><div class="g-right" style="display:flex;flex-direction:column;gap:10px"></div></div>`);
        const L=stage.querySelector(".g-left"),R=stage.querySelector(".g-right");
        const larr=items.map(x=>x[0]);const rarr=items.map(x=>x[1]).sort(()=>Math.random()-.5);
        larr.forEach((e,i)=>{const d=document.createElement("div");d.style.cssText="padding:12px;border:2px solid var(--line);border-radius:14px;font-size:2rem;text-align:center;cursor:pointer";d.textContent=e;d.dataset.k=i;L.appendChild(d)});
        rarr.forEach((t,i)=>{const d=document.createElement("div");d.style.cssText="padding:14px;border:2px solid var(--line);border-radius:14px;text-align:center;cursor:pointer;font-weight:700";d.textContent=t;d.dataset.k=rarr.indexOf(t);R.appendChild(d)});
        L.addEventListener("click",e=>{const x=e.target.closest("div[data-k]");if(x){sel=x;x.style.borderColor="var(--accent)"}});
        R.addEventListener("click",e=>{
          const x=e.target.closest("div[data-k]");if(!x||!sel)return;
          if(+x.dataset.k===+sel.dataset.k){x.style.borderColor="#54c98f";sel.style.borderColor="#54c98f";x.style.opacity=".4";sel.style.opacity=".4";score++;onScore(score);matched++;if(matched===items.length)endScreen(stage,score,"🔗 全連上了！"),onEnd(score);}
          else{x.style.borderColor="#ff6b6b";setTimeout(()=>{x.style.borderColor="var(--line)";sel.style.borderColor="var(--line)";sel=null},500)}
        });
      };run();
    }};
  }

  /* sequence 記憶順序 */
  function sequenceGame(g){
    return {start(stage,onScore,onEnd){
      let score=0,round=1;const run=()=>{
        const n=Math.min(round+1,6);const seq=Array.from({length:n},()=>Math.floor(Math.random()*emo.length));
        let play=0,guess=0,lock=true;
        $(stage,`<div class="g-toolbar"><span class="g-info">🎵 ${g.t}</span><span class="score">🏆 ${score}</span></div><div class="g-seq" style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px;max-width:420px;width:100%"></div>`);
        const gd=stage.querySelector(".g-seq");
        const cells=emo.map((e,i)=>{const d=document.createElement("div");d.style.cssText="aspect-ratio:1;border-radius:14px;background:var(--chip);display:grid;place-items:center;font-size:1.6rem;cursor:pointer";d.textContent=e;d.dataset.i=i;gd.appendChild(d);return d});
        const show=()=>{lock=true;play=0;const iv=setInterval(()=>{cells[seq[play]].style.transform="scale(1.15)";cells[seq[play]].style.background="var(--grad)";setTimeout(()=>{cells[seq[play]].style.transform="";cells[seq[play]].style.background="var(--chip)"},250);play++;if(play>=seq.length){clearInterval(iv);setTimeout(()=>lock=false,300)}},600)};
        show();
        gd.addEventListener("click",e=>{
          const x=e.target.closest("div[data-i]");if(!x||lock)return;
          if(+x.dataset.i===seq[guess]){guess++;if(guess>=seq.length){score++;onScore(score);round++;setTimeout(run,500)}}else{endScreen(stage,score,"🎵 記性好強！");onEnd(score)}
        });
      };run();
    }};
  }

  return {catch:catchGame,whack:whackGame,memory:memoryGame,quiz:quizGame,timing:timingGame,reaction:reactionGame,count:countGame,order:orderGame,match:matchGame,sequence:sequenceGame};
})();
