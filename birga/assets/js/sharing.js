const Sharing = (() => {
  function siteBase() {
    // Build base URL from current location
    const loc = window.location;
    const path = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.origin + path;
  }
  function quizLink(quizId) { return siteBase() + 'quiz-play.html?id=' + quizId; }

  async function copy(text) {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); ta.remove();
      }
      UI.toast(t('common.copied'), 'success');
      return true;
    } catch (e) {
      UI.toast('Copy failed', 'error');
      return false;
    }
  }

  function telegram(text, url) {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  }

  function whatsapp(text, url) {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  }

  async function webShare({ title = 'BIRGA', text = '', url = '' }) {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return true;
      } catch (e) { return false; }
    }
    return false;
  }

  // Generate a share card as PNG using canvas
  function generateResultCard({ userName, quizTitle, score, total, xp }) {
    const w = 1080, h = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#090B16');
    g.addColorStop(1, '#14182A');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    // Accent circles
    const rg1 = ctx.createRadialGradient(200, 200, 0, 200, 200, 600);
    rg1.addColorStop(0, 'rgba(121,87,255,0.55)'); rg1.addColorStop(1, 'rgba(121,87,255,0)');
    ctx.fillStyle = rg1; ctx.fillRect(0, 0, w, h);

    const rg2 = ctx.createRadialGradient(900, 900, 0, 900, 900, 600);
    rg2.addColorStop(0, 'rgba(34,211,238,0.45)'); rg2.addColorStop(1, 'rgba(34,211,238,0)');
    ctx.fillStyle = rg2; ctx.fillRect(0, 0, w, h);

    // Logo text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 64px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BIRGA', w / 2, 130);

    // Quiz title
    ctx.font = 'bold 56px Inter, sans-serif';
    ctx.fillStyle = '#F8FAFC';
    wrapText(ctx, quizTitle, w / 2, 300, w - 160, 66);

    // Score circle
    const cx = w / 2, cy = h / 2 + 60, r = 190;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(121,87,255,0.15)'; ctx.fill();
    ctx.lineWidth = 12; ctx.strokeStyle = '#7957FF'; ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 140px Inter, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`${score}/${total}`, cx, cy - 10);

    ctx.font = '600 36px Inter, sans-serif';
    ctx.fillStyle = '#A78BFA';
    ctx.fillText('SCORE', cx, cy + 90);

    // XP
    ctx.font = 'bold 52px Inter, sans-serif';
    ctx.fillStyle = '#22D3EE';
    ctx.textAlign = 'center';
    ctx.fillText(`+${xp} XP`, w / 2, h - 260);

    // User
    ctx.font = '600 44px Inter, sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText('@' + userName, w / 2, h - 180);

    // Footer
    ctx.font = '400 32px Inter, sans-serif';
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText('birga.app — play, learn, win!', w / 2, h - 90);

    return canvas;
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text).split(' ');
    let line = ''; let yy = y;
    for (const w of words) {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line.trim(), x, yy);
        line = w + ' '; yy += lineHeight;
      } else line = test;
    }
    if (line) ctx.fillText(line.trim(), x, yy);
  }

  async function shareResultCard(opts) {
    const canvas = generateResultCard(opts);
    return new Promise(resolve => {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'birga-result.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'BIRGA Result',
              text: `I scored ${opts.score}/${opts.total} in "${opts.quizTitle}" on BIRGA!`,
            });
            resolve(true);
          } catch (e) { downloadCanvas(canvas); resolve(false); }
        } else {
          downloadCanvas(canvas);
          resolve(false);
        }
      }, 'image/png');
    });
  }
  function downloadCanvas(canvas) {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'birga-result.png';
    a.click();
    UI.toast('Rasm yuklab olindi', 'success');
  }

  return { siteBase, quizLink, copy, telegram, whatsapp, webShare, shareResultCard, generateResultCard };
})();
window.Sharing = Sharing;