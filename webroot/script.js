const MODDIR = `/data/adb/modules/playintegrityfix/webroot/common_scripts`;
const PROP = `/data/adb/modules/playintegrityfix/module.prop`;
const BOXBRAIN = `/data/adb/Box-Brain`;

const modalBackdrop = document.getElementById("modal-backdrop");
const modalTitle = document.getElementById("modal-title");
const modalOutput = document.getElementById("modal-output");
const modalClose = document.getElementById("modal-close");

const messageMap = {
  "kill": { success: "DroidGuard has been restarted", type: "info" },
  "user": { start: "Blacklist Unnecessary Apps", type: "info" },
  "stop": { success: "Switched to Blacklist Mode", type: "info" },
  "start": { success: "Switched to Whitelist Mode", type: "info" },
  "xml": { start: "Scanning xml files..", type: "info" },
  "patch": { start: "Opening configuration..", type: "info" },
  "aosp": { success: "Switched to AOSP Keybox", type: "info" },
  "resetprop.sh": { success: "Done, Reopen detector to check", type: "info" },
  "selinux": { success: "Spoofed to Enforcing", type: "info" },
  "piffork": { start: "All changes will be applied immediately", type: "info" },
  "propspoofer": { start: "These will be applied till reboot", type: "info" },
  "nogms": { success: "Reboot to apply changes", type: "info" },
  "yesgms": { start: "Reboot to apply changes", type: "info" },
  "key.sh": { success: "Keybox has been updated ✅", type: "info" },
  "flags": { start: "These requires Reboot / Action", type: "info" },
  "profile": { start: "Good Luck old friend 🌚", type: "info" },
  "ctrl": { start: "For those using ROM inbuilt spoofing", type: "info" },
  "force_override.sh": { start: "Done 👍", type: "info" },
  "pif": { start: "You can update fingerprint without internet", type: "info" },
  "vending": { start: "This will clear data of Play Services & Store", type: "info" },
  "zygisknext": { start: "Whatever you say cutie 😉", type: "info" },
  "cache": { start: "This will delete temporary unnecessary files", type: "info" },
  "hide": { start: "This will hide basic sus paths", type: "info" },
  "scanner": { start: " Click on Run Scan", success: "Detection Complete", type: "info" },
  "support": { start: "Become a Supporter", type: "info" },
  "report": { start: "What's wrong buddy?", type: "info" },
  "assistant": { start: "Let me guide you to the right path", type: "info" },
  "status": { start: "Informs you about keybox & fingerprint validity", type: "info" },
  "hma.sh": { success: "Done ✅", type: "info" },
  "ulock": { success: "Done", type: "info" },
  "faq": { start: "Coming Soon", type: "info" },
  "nuke": { start: "Coming Soon", type: "info" },
  "utility": { success: "These doesn't require reboot", type: "info" },
  "spoofing": { start: "These are for custom ROM users", type: "info" },
  "pilot": { start: "Updates keybox & fp automatically whether a new key is available", type: "info" },
  "hash": { start: "Paste your boot hash buddy", success: "Boot hash operation complete", type: "success" }
};

const inlineMessageMap = {};

function popup(msg, type="info") {
  try {
    if (typeof window.toast === "function") { window.toast(String(msg)); return; }
    if (window.kernelsu && typeof window.kernelsu.toast === "function") { window.kernelsu.toast(String(msg)); return; }
    if (typeof ksu === "object" && typeof ksu.toast === "function") { ksu.toast(String(msg)); return; }
  } catch {}

  const n = document.createElement("div");
  n.className = "webui-popup";
  n.textContent = msg;
  const colors = { error:"#f44336", success:"#4caf50", info:"#1565c0", warn:"#ff8f00" };
  const bg = colors[type] || "#0099FF";
  Object.assign(n.style, {
    position:"fixed",top:"-70px",left:"50%",transform:"translateX(-50%)",
    background:bg,color:"#fff",padding:"0.8rem 1.2rem",borderRadius:"8px",
    boxShadow:"0 6px 18px rgba(0,0,0,0.35)",fontWeight:"600",zIndex:"99999",
    transition:"top 0.36s,opacity 0.36s",opacity:"0"
  });
  document.body.appendChild(n);
  requestAnimationFrame(()=>{ n.style.top="20px"; n.style.opacity="1"; });
  setTimeout(()=>{ n.style.top="-70px"; n.style.opacity="0"; setTimeout(()=>n.remove(),420); },2500);
}

async function runShell(cmd) {
  if (!cmd || typeof ksu?.exec !== "function") throw new Error("KSU API unavailable");
  return new Promise((res, rej) => {
    const cb = `cb_${Date.now()}_${Math.random()*10000|0}`;
    window[cb] = (code, stdout, stderr) => {
      delete window[cb];
      code === 0 ? res((stdout||"").replace(/\r/g,"")) : rej(new Error(stderr||stdout||"Shell failed"));
    };
    ksu.exec(cmd, "{}", cb);
  });
}

function enableFullScreen() {
  try {
    if (window.kernelsu?.fullScreen) return window.kernelsu.fullScreen(true);
    if (window.fullScreen) return window.fullScreen(true);
    if (ksu?.fullScreen) return ksu.fullScreen(true);
    document.documentElement.requestFullscreen?.().catch(()=>{});
  } catch {}
}

async function checkGestureConfig() {
  try {
    const rightGesture = await runShell(`[ -f ${BOXBRAIN}/iframe_gesture_right ] && echo "1" || echo "0"`);
    const backButton = await runShell(`[ -f ${BOXBRAIN}/iframe_back_button ] && echo "1" || echo "0"`);
    return {
      gestureRight: rightGesture.trim() === "1",
      backButton: backButton.trim() === "1"
    };
  } catch {
    return { gestureRight: false, backButton: false };
  }
}

function openIframe(url) {
  if (document.getElementById("active-iframe")) return;
  
  const config = { gestureRight: false, backButton: false };
  
  checkGestureConfig().then(cfg => {
    Object.assign(config, cfg);
    createIframeUI(url, config);
  }).catch(() => {
    createIframeUI(url, config);
  });
}

function createIframeUI(url, config) {
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.id = "active-iframe";

  Object.assign(iframe.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    border: "none",
    zIndex: 9998,
    background: "black"
  });

  document.body.appendChild(iframe);

  const isRight = config.gestureRight;
  const edgeWidth = "30px";
  
  const edge = document.createElement("div");
  Object.assign(edge.style, {
    position: "fixed",
    top: "0",
    [isRight ? "right" : "left"]: "0",
    width: edgeWidth,
    height: "100vh",
    zIndex: "99999999",
    background: "transparent",
    pointerEvents: "auto",
    touchAction: "none"
  });

  document.body.appendChild(edge);

  const glow = document.createElement("div");
  Object.assign(glow.style, {
    position: "fixed",
    top: "0",
    [isRight ? "right" : "left"]: "0",
    width: "20px",
    height: "100vh",
    zIndex: "99998",
    pointerEvents: "none",
    opacity: "0",
    background: isRight 
      ? "linear-gradient(to left, rgba(255,40,40,0.45), transparent)"
      : "linear-gradient(to right, rgba(255,40,40,0.45), transparent)",
    transition: "opacity 0.2s ease, transform 0.3s ease"
  });

  document.body.appendChild(glow);

  let backBtn = null;
  if (config.backButton) {
    backBtn = document.createElement("div");
    backBtn.innerHTML = "←";
    Object.assign(backBtn.style, {
      position: "fixed",
      top: "20px",
      [isRight ? "left" : "right"]: "20px",
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      background: "rgba(30,30,30,0.8)",
      backdropFilter: "blur(10px)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      fontWeight: "bold",
      zIndex: "99999999",
      cursor: "pointer",
      pointerEvents: "auto",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      transition: "transform 0.2s ease, background 0.2s ease"
    });
    
    backBtn.addEventListener("click", () => {
      closeIframe();
    });
    
    backBtn.addEventListener("touchstart", () => {
      backBtn.style.transform = "scale(0.95)";
      backBtn.style.background = "rgba(50,50,50,0.9)";
    });
    
    backBtn.addEventListener("touchend", () => {
      backBtn.style.transform = "scale(1)";
      backBtn.style.background = "rgba(30,30,30,0.8)";
    });
    
    document.body.appendChild(backBtn);
  }

  let idleTimer;
  const idleDelay = 2000;
  let idle = false;

  const startIdle = () => {
    idle = true;
    glow.style.opacity = "0.15";
    glow.style.transform = "scaleY(0.75)";
  };

  const stopIdle = () => {
    idle = false;
    glow.style.opacity = "0";
    glow.style.transform = "scaleY(1)";
  };

  const resetIdle = () => {
    clearTimeout(idleTimer);
    stopIdle();
    idleTimer = setTimeout(startIdle, idleDelay);
  };

  resetIdle();

  const flashGlow = () => {
    glow.style.opacity = "0.5";
    glow.style.transform = "scaleY(1)";
    setTimeout(() => {
      glow.style.opacity = idle ? "0.15" : "0";
    }, 180);
  };

  let startX = 0;
  let startTime = 0;

  const onStart = (e) => {
    resetIdle();
    const t = e.touches?.[0] || e;
    startX = t.clientX;
    startTime = Date.now();
    glow.style.opacity = "0.35";
    glow.style.transform = "scaleY(1)";
  };

  const onEnd = (e) => {
    resetIdle();
    const t = e.changedTouches?.[0] || e;
    const diff = isRight ? startX - t.clientX : t.clientX - startX;
    const dt = Date.now() - startTime;
    const swipe = diff > 40 && dt < 300;

    if (swipe || Math.abs(diff) < 10) {
      flashGlow();
      closeIframe();
    } else {
      glow.style.opacity = idle ? "0.15" : "0";
    }
  };

  const closeIframe = () => {
    iframe.remove();
    edge.remove();
    glow.remove();
    if (backBtn) backBtn.remove();
    clearTimeout(idleTimer);
  };

  edge.addEventListener("touchstart", onStart, { passive: true });
  edge.addEventListener("touchend", onEnd);
  edge.addEventListener("mousedown", onStart);
  edge.addEventListener("mouseup", onEnd);
}

window.runShellFromIframe = async function (cmd) {
  return await runShell(cmd);
};

async function updateDashboard() {
  const statusItems = {
    "status-playstore": "dumpsys package com.android.vending | grep versionName | head -n1 | awk -F'=' '{print $2}' | cut -d'-' -f1 | cut -d' ' -f1 | cut -d'.' -f1-3",
    "status-selinux": "getenforce || echo Unknown",
    "status-target": "[ -f /data/adb/tricky_store/target.txt ] && grep -cve '^$' /data/adb/tricky_store/target.txt || echo 0",
    "status-android": "case \"$(getprop ro.system.build.version.release 2>/dev/null)\" in 4*) echo KitKat ;; 5*) echo Lollipop ;; 6*) echo Marshmallow ;; 7*) echo Nougat ;; 8*) echo Oreo ;; 9*) echo Pie ;; 10) echo QuinceTart ;; 11) echo RedVelvet ;; 12*) echo SnowCone ;; 13*) echo Tiramisu ;; 14*) echo UpsideDown ;; 15*) echo 15 ;; 16*) echo Baklava ;; 17*) echo ßeta ;; *) echo Unknown ;; esac",
    "status-pixel": "[ -f /data/adb/modules/playintegrityfix/custom.pif.prop ] && awk -F= '/^MODEL=/{print $2}' /data/adb/modules/playintegrityfix/custom.pif.prop || echo None",
    "status-patch": "getprop ro.build.version.security_patch || echo Unknown",
    "status-zygisk": "[ -f /data/adb/modules/zygisksu/module.prop ] && awk -F= '/^name=/{print $2}' /data/adb/modules/zygisksu/module.prop || ([ -f /data/adb/modules/rezygisk/module.prop ] && echo ReZygisk) || (magisk --sqlite \"SELECT value FROM settings WHERE key='zygisk';\" | grep -q '1' && echo Magisk-Zygisk) || echo None",
    "status-profile": `if [ -f ${BOXBRAIN}/advanced ]; then echo 'Supreme'; elif [ -f ${BOXBRAIN}/pixelify ]; then echo 'Pixelify'; elif [ -f ${BOXBRAIN}/legacy ]; then echo 'Legacy'; elif [ -f ${BOXBRAIN}/wipe ]; then echo 'Meta'; else echo 'None'; fi`,

    "status-whitelist": `
      if ls /data/adb/*/whitelist* >/dev/null 2>&1; then
        echo ENFORCED
        exit
      fi
      val="$(sed 's/[^0-9]//g' /data/adb/zygisksu/denylist_enforce 2>/dev/null)"
      if [ "$val" = "1" ]; then
        echo ENFORCED
      elif [ "$val" = "2" ]; then
        echo UNMOUNT
      else
        echo DISABLED
      fi
    `,

    "status-gms": `
      props=(
        persist.sys.pihooks.disable.gms_key_attestation_block
        persist.sys.pihooks.disable.gms_props
        persist.sys.pihooks.disable
        persist.sys.kihooks.disable
      );
      found_any=0; disabled=0; enabled=0;
      for p in "\${props[@]}"; do
        val=$(getprop "$p" 2>/dev/null);
        if [ -n "$val" ]; then
          found_any=1;
          if [ "$val" = "true" ] || [ "$val" = "1" ]; then
            disabled=$((disabled+1));
          elif [ "$val" = "false" ] || [ "$val" = "0" ]; then
            enabled=$((enabled+1));
          fi;
        fi;
      done;
      if [ $found_any -eq 0 ]; then echo "Meow Box";
      elif [ $enabled -gt 0 ]; then echo "ENABLED";
      else echo "DISABLED"; fi
    `,

    "status-autopilot": `su -c 'if [ -f ${BOXBRAIN}/run_action ]; then echo XTREME; else echo KEYBOX; fi'`,
    "status-LineageProp": `if getprop | grep -iq 'lineage'; then echo FOUND; else echo NONE; fi`
  };

  for (const [id, cmd] of Object.entries(statusItems)) {
    const el = document.getElementById(id);
    if (!el) continue;
    try {
      let out = (await runShell(cmd)).trim();
      if (!out) out = id === "status-zygisk" ? "Scripts Mode" : "Unknown";

      switch (id) {
        case "status-playstore":
        case "status-profile":
        case "status-playservices":
          el.textContent = out;
          el.className = "status-indicator play";
          break;

        case "status-selinux":
          el.textContent = out;
          el.className = `status-indicator ${
            out === "Enforcing" ? "enabled" : out === "Permissive" ? "disabled" : "neutral"
          }`;
          break;

        case "status-target":
            const count = parseInt(out) || 0;
            el.textContent = `${out} apps`;
            el.className = `status-indicator ${count === 0 || count > 50 ? "disabled" : "enabled"}`;
            break;

        case "status-pixel":
        case "status-patch":
          el.textContent = out;
          el.className = "status-indicator enabled";
          break;

        case "status-android":
        case "status-zygisk":
          el.textContent = out;
          el.className = "status-indicator neutral";
          break;

        case "status-gms":
          if (out === "DISABLED") {
            el.textContent = "Neutral";
            el.className = "status-indicator play";
          } else if (out === "ENABLED") {
            el.textContent = "Inbuilt";
            el.className = "status-indicator play";
          } else if (out === "Meow Box") {
            el.textContent = "Meow Box";
            el.className = "status-indicator play";
          } else {
            el.textContent = "Unknown";
            el.className = "status-indicator disabled";
          }
          break;

        case "status-whitelist":
          if (out === "ENFORCED") {
            el.textContent = "Enforce";
            el.className = "status-indicator neutral";
          } else if (out === "UNMOUNT") {
            el.textContent = "Unmount";
            el.className = "status-indicator neutral";
          } else {
            el.textContent = "None";
            el.className = "status-indicator neutral";
          }
          break;

        case "status-autopilot":
          if (out === "XTREME") {
            el.textContent = "Xtreme";
            el.className = "status-indicator neutral";
          } else {
            el.textContent = "Keybox";
            el.className = "status-indicator neutral";
          }
          break;

        case "status-LineageProp":
          if (out === "FOUND") {
            el.textContent = "90% Spoofed";
            el.className = "status-indicator play";
          } else {
            el.textContent = "Spoofed";
            el.className = "status-indicator play";
          }
          break;

        default:
          el.textContent = out;
          el.className = `status-indicator ${out === "Unknown" ? "disabled" : "neutral"}`;
      }
    } catch {
      el.textContent = "Unknown";
      el.className = "status-indicator disabled";
    }
  }
}

function attachButtonListeners() {
  const btns = Array.from(document.querySelectorAll(".btn"));
  
  btns.forEach(btn => {
    if (btn._attached) return;
    btn._attached = true;
    
    btn.addEventListener("click", async () => {
      const script = btn.dataset.script;
      const type = btn.dataset.type;
      const inline = btn.dataset.inline;

      btn.classList.add("loading");

      try {
        if (inline) {
          if (inlineMessageMap[inline]?.success) {
            popup(inlineMessageMap[inline].success, inlineMessageMap[inline].type);
          }
          return;
        }

        if (["scanner","hash","user","flags","cache","nuke","piffork","propspoofer","pif","vending",
             "support","report","profile","assistant","utility","pilot","faq","spoofing","status","tee","xml","hide","patch","ctrl"].includes(type)) {

          const pathMap = {
            scanner:"./Risky/index.html",
            ctrl:"./Control/index.html",
            hash:"./BootHash/index.html",
            flags:"./Flags/index.html",
            piffork:"./PlayIntegrityFork/index.html",
            propspoofer:"./PropSpoofer/index.html",
            pif:"./CustomPIF/index.html",
            vending:"./Certified/index.html",
            support:"./Support/index.html",
            report:"./Report/index.html",
            cache:"./Cache/index.html",
            user:"./TrickyStore/index.html",
            xml:"./KeyboxLoader/index.html",
            hide:"./HideMyFiles/index.html",
            patch:"./Patch/index.html",
            status:"./Status/index.html",
            profile:"./Profile/index.html",
            assistant:"./Assistant/index.html",
            utility:"./Utility/index.html",
            faq:"./Faq/index.html",
            pilot:"./AutoPilot/index.html",
            nuke:"./Nuke/index.html",
            spoofing:"./Spoofing/index.html",
            tee:"./TEEsimulator/index.html"
          };

          const toastKey = (type || script || "").trim().replace(/\.sh$/, "");
          const msg = messageMap[toastKey];

          if (msg?.start) {
            popup(msg.start, msg.type);
          } else {
            popup("Opening…", "info");
          }

          return openIframe(pathMap[type]);
        }

        if (script) {
          if (messageMap[script]?.start)
            popup(messageMap[script].start, messageMap[script].type);

          await runShell(`sh ${MODDIR}/${script}`);
          if (messageMap[script]?.success)
            popup(messageMap[script].success, messageMap[script].type);
        }

      } catch (e) {
        popup(`Error: ${e.message}`, "error");
      } finally {
        btn.classList.remove("loading");
        setTimeout(updateDashboard, 500);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  enableFullScreen();
  attachButtonListeners();
  updateDashboard();
});
