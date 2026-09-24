/**
 * ============================================================
 * YOUTUBE-TRANSCRIPT.JS — Extension KIROV5
 * ============================================================
 * Extraction de transcription YouTube via le Service Worker.
 * Avantage vs Node.js : le SW tourne dans un vrai navigateur Chrome
 * → pas de blocage User-Agent, pas de CORS, cookies du navigateur disponibles.
 * ============================================================
 */

const YouTubeTranscript = (() => {

  /**
   * Extrait l'ID YouTube depuis une URL (tous formats supportés)
   */
  function extractVideoId(url) {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.replace(/^www\./, '');
      if (hostname === 'youtu.be') return parsed.pathname.slice(1).split('?')[0] || null;
      if (hostname === 'youtube.com') {
        if (parsed.pathname.startsWith('/watch')) return parsed.searchParams.get('v');
        if (parsed.pathname.startsWith('/shorts/')) return parsed.pathname.split('/shorts/')[1]?.split('?')[0] || null;
        if (parsed.pathname.startsWith('/embed/')) return parsed.pathname.split('/embed/')[1]?.split('?')[0] || null;
        if (parsed.pathname.startsWith('/v/')) return parsed.pathname.split('/v/')[1]?.split('?')[0] || null;
      }
    } catch (_) {}
    return null;
  }

  /**
   * Vérifie si une URL est YouTube
   */
  function isYouTubeUrl(url) {
    if (!url || typeof url !== 'string') return false;
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.replace(/^www\./, '');
      return hostname === 'youtube.com' || hostname === 'youtu.be';
    } catch (_) { return false; }
  }

  /**
   * Transforme un XML de transcript YouTube en texte brut.
   */
  function parseTranscriptXml(xml) {
    const matches = xml.match(/<text[^>]*>([\s\S]*?)<\/text>/g) || [];
    return matches
      .map(tag => {
        let txt = tag.replace(/<[^>]+>/g, '');
        return txt
          .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'")
          .replace(/\n/g, ' ').trim();
      })
      .filter(t => t.length > 0)
      .join(' ');
  }

  /**
   * Extraction principale : télécharge la page YouTube, trouve les sous-titres, les parse.
   * @param {string} youtubeUrl — URL complète de la vidéo YouTube
   * @returns {Promise<{title, description, transcript, fullContext, videoId}>}
   */
  async function extract(youtubeUrl) {
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) throw new Error(`ID vidéo introuvable pour : ${youtubeUrl}`);

    console.log(`[YT-TRANSCRIPT] 🎬 Extraction pour Video ID: ${videoId}`);

    // 1. Télécharger la page HTML YouTube
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Erreur HTTP YouTube : ${res.status}`);
    const pageHtml = await res.text();
    console.log(`[YT-TRANSCRIPT] ✅ Page téléchargée (${Math.round(pageHtml.length / 1024)}Ko)`);

    // 2. Extraire le titre
    let title = 'Titre inconnu';
    const titleMatch = pageHtml.match(/"title":\{"runs":\[\{"text":"([^"]+)"\}\]/);
    if (titleMatch) title = titleMatch[1];
    else {
      const ogTitle = pageHtml.match(/<meta property="og:title" content="([^"]+)"/i);
      if (ogTitle) title = ogTitle[1];
    }
    console.log(`[YT-TRANSCRIPT] 📝 Titre : ${title}`);

    // 3. Extraire la description
    let description = '';
    const descMatch = pageHtml.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/);
    if (descMatch) {
      description = descMatch[1]
        .replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\')
        .slice(0, 2000);
    }

    // 4. Trouver les caption tracks
    let transcriptText = '';
    const captionsMatch = pageHtml.match(/"captionTracks":\[(.*?)\]/s);

    if (captionsMatch) {
      const captionsBlock = captionsMatch[1];
      const trackMatches = captionsBlock.match(/"baseUrl":"([^"]+)"[^}]*?"languageCode":"([^"]+)"/g) || [];

      let selectedTrack = null;
      for (const track of trackMatches) {
        const urlMatch = track.match(/"baseUrl":"([^"]+)"/);
        const langMatch = track.match(/"languageCode":"([^"]+)"/);
        if (!urlMatch) continue;
        const rawUrl = urlMatch[1].replace(/\\u0026/g, '&');
        const lang = langMatch ? langMatch[1] : 'xx';
        if (!selectedTrack) selectedTrack = { url: rawUrl, lang };
        if (lang === 'fr') { selectedTrack = { url: rawUrl, lang }; break; }
        if (lang === 'en' && selectedTrack.lang !== 'fr') selectedTrack = { url: rawUrl, lang };
      }

      if (selectedTrack) {
        console.log(`[YT-TRANSCRIPT] 📜 Piste sous-titres trouvée (${selectedTrack.lang})`);
        try {
          const xmlRes = await fetch(selectedTrack.url, { signal: AbortSignal.timeout(15000) });
          if (xmlRes.ok) {
            const xmlContent = await xmlRes.text();
            transcriptText = parseTranscriptXml(xmlContent);
            // Limiter à 8000 mots
            const words = transcriptText.split(/\s+/);
            if (words.length > 8000) {
              transcriptText = words.slice(0, 8000).join(' ') + '... [Tronqué]';
            }
            console.log(`[YT-TRANSCRIPT] ✅ Transcript extrait : ~${words.length} mots`);
          }
        } catch (e) {
          console.warn(`[YT-TRANSCRIPT] ⚠️ Erreur XML sous-titres : ${e.message}`);
        }
      } else {
        console.warn('[YT-TRANSCRIPT] ⚠️ Aucune piste sous-titres disponible.');
      }
    } else {
      console.warn('[YT-TRANSCRIPT] ⚠️ Aucune captionTrack dans le HTML.');
    }

    // 5. Construire le contexte complet
    const fullContext = [
      '=== DONNÉES EXTRAITES DE LA VIDÉO YOUTUBE ===',
      `URL : ${youtubeUrl}`,
      `TITRE : ${title}`,
      '',
      'DESCRIPTION :',
      description || '(pas de description)',
      '',
      'TRANSCRIPTION COMPLÈTE (paroles exactes) :',
      transcriptText || '(sous-titres non disponibles — utiliser titre + description)',
      '=============================================',
    ].join('\n');

    return { title, description, transcript: transcriptText, fullContext, videoId };
  }

  return { extract, isYouTubeUrl, extractVideoId };
})();
