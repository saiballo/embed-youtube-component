# Embed YouTube Web Component

> Un Web Component per includere video YouTube nel proprio sito rispettando la normativa GDPR. Impostando alcuni parametri specifici è possibile non scaricare nulla dai server Google fin quando l'utente non clicca Play sul video.
>
>

&nbsp;
![](https://img.shields.io/badge/Made%20with%20love%20and-javascript-blue)
[![MIT license](https://img.shields.io/badge/License-MIT-green.svg)](https://lbesson.mit-license.org/)

## Sommario

- [Demo](#demo)
- [Caratteristiche](#caratteristiche)
- [Installazione](#installazione)
- [Parametri globali](#parametri-globali)
- [Utilizzo web component](#utilizzo-web-component)
- [Lista parametri](#lista-parametri)
- [Configurazione di default](#configurazione-di-default)
- [GDPR](#gdpr)
- [Eventi](#eventi)
- [Stili CSS](#stili-css)
- [DevTeam](#devteam)
- [Licenza](#license)

## Demo

[Pagina demo](https://saiballo.github.io/embed-youtube-component/)

## Caratteristiche

* Web Component senza dipendenze esterne.
* Possibilità di personalizzare l'erogazione del video utilizzando la lista dei parametri disponibili. Alcuni di questi possono essere impostati globalmente senza bisogno di doverli ripetere su ogni webcomponent.
* Codice ottimizzato per il SEO / Rich Results attraverso l'erogazione di uno snippet Schema.org (JSON-LD).
* Codice incapsulato per non interferire con il sito ospite.
* Possibilità di scegliere se caricare il video dal dominio "https://www.youtube-nocookie.com" per aumentare la privacy.
* Video responsive in formato 16:9
* Possibilità di mostrare una immagine personalizzata (poster) per ogni video al posto di quella originale YouTube. In caso di errore verrà mostrata una immagine di default in formato svg.

### Installazione

È possibile installare lo script in 3 modi diversi. Per i dettagli sui parametri globali vedi sezione "Parametri globali".

1) Script in pagina del file compilato. In questo caso è possibile aggiungere alcuni data-* che verranno utilizzati come parametri globali.
```
<script src="embed-youtube.min.js"></script>
```

2) Script in pagina del file sorgente con type "module". In questo caso non sarà possibile aggiungere data-* allo script come parametri globali ma potrà essere raggiunto lo stesso risultato aggiungendoli al tag **body** della vostra pagina.

**N.B.** Utilizzando il file come modulo è necessario mettere nella stesso path del file anche la cartella "include". (vedi cartella /docs/assets/js/module)
```
<script type="module" src="module/embed-youtube.js"></script>
```

3) Importare lo script, come **"side-effect import"**, in qualsiasi altro entrypoint javascript. In questo caso i parametri globali andranno impostati sullo script "entrypoint" se non si utilizza type "module" oppure sul tag **body** se si imposta type "module".
```
// script master.js
import './embed-youtube.js';
```
### Parametri globali

Sono disponibili i seguenti parametri globali da inserire come data-*:

* **data-autoload**: istanzia automaticamente l'iframe YouTube per ogni video presente in pagina. GDPR compliant: No.
* **data-autoplay**: funziona solo se **data-autoload** è impostato. Fa partire il video al caricamento della pagina in modalità muta (obbligatorio). GDPR compliant: No.
* **data-autopause**: blocca il video quando il player esce dal viewport della pagina (esemmpio: scrollando la pagina).
* **data-no-preconnect**: di default vengono inseriti dei tag "preconnect" per le risorse YouTube. Con questo parametro i tag non vengono aggiunti (utile in quei casi in cui i codici sono già presenti nel codice del sito)
* **data-no-schema**: non stampa lo schema JSON-LD per ogni video. Lo schema è utile sia per finalità SEO che di accessibilità.

Esempio di script con i parametri globali impostati:

```
<!DOCTYPE html>
<html lang="it">

	<head>

		<script defer src="embed-youtube.min.js" data-autoload data-autoplay data-autopause></script>

	</head>

	<body>

		<embed-youtube video-id="kTwPG53ZAIg"></embed-youtube>

	</body>
</html>
```

Nel caso di script type "module" i parametri vanno impostati sul body della pagina:

```
<!DOCTYPE html>
<html lang="it">

	<head>

		<script type="module" src="module/embed-youtube.js"></script>

	</head>

	<body data-autoload data-autoplay data-autopause data-no-preconnect data-no-schema>

		<embed-youtube video-id="kTwPG53ZAIg"></embed-youtube>

	</body>
</html>
```

### Utilizzo web component

Una volta caricato il javascript principale si può inserire uno o più web component in pagina. L'unico dato realmente obbligatorio è l'ID del video:

```
<embed-youtube video-id="kTwPG53ZAIg"></embed-youtube>
```

In questo caso specifico verrà mostrata la copertina ufficiale del video ma non verrà creato automaticamente l'iframe di YouTube. Anche se al caricamento della pagina non c'è interazione dell'utente con il video, in questa modalità non si avrà piena adesione al GDPR perchè il poster del video è comunque scaricato dai server di Google.

Per avere una piena e totale compatibilità con la normativa GDPR si può impostare il tag "embed-youtube" in questa maniera:

```
<embed-youtube video-id="kTwPG53ZAIg" poster-url="path/to/custom-poster.jpg"></embed-youtube>
```

In questo caso viene visualizzata una immagine custom. Se non si ha a disposizione una immagine per ogni video si può raggiungere lo stesso risultato in questa maniera:

```
<embed-youtube video-id="kTwPG53ZAIg" poster-fallback></embed-youtube>
```

Al posto del poster originale del video viene mostrata una immagine SVG già presente nel component.
In tutti e due i casi appena visti, una volta che l'utente clicca "Play" si verifica una interazione consapevole e il video parte come in qualsiasi altro caso.

Un'altra opzione disponibile per migliorare ulteriormente la privacy dell'utente è utilizzare il dominio "no-cookie" messo a disposizione da YouTube:

```
<embed-youtube video-id="kTwPG53ZAIg" poster-url="path/to/custom-poster.jpg" no-cookie></embed-youtube>
```

In questo caso il dominio da cui saranno scaricati i video sarà **https://www.youtube-nocookie.com** che non installa mai script traccianti.

Di default i parametri dll'iframe passati a YouTube sono gestiti in automatico dallo script. In caso si volesse utilizzare una lista parametri totalmente custom si può inserire l'attributo "param-list":

```
<embed-youtube video-id="kTwPG53ZAIg" param-list="enablejsapi=1&autoplay=1&mute=0"></embed-youtube>
```

Questo potrebbe interferire con alcuni attributi come "autoload" e "autoplay" che non avrebbero effetto.

### Lista parametri

<table style="width:100%; border-collapse: collapse;">
	<thead>
		<tr>
			<th style="border: 1px solid #ddd; padding: 8px;">Parametro</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Descrizione</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Default</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">video-id</td>
			<td style="border: 1px solid #ddd; padding: 8px;">ID del video YouTube da includere. Parametro obbligaotrio. Se vuoto o mancante verrà mostrato un messaggio di errore.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">""</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">playlist-id</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indica la playlist a cui appartiene il primo video caricato.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">video-title</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indica il titolo del video. Viene utilizzato sul testo del bottone e nello snippet di Schema.org.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"Video YouTube"</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">description</td>
			<td style="border: 1px solid #ddd; padding: 8px;">La descrizione del video. Viene utilizzato nello snippet di Schema.org.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"Guarda questo video incorporato nel sito da YouTube"</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">play-text</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indica il testo alternativo e l'attributo "aria-label" sul bottone Play.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"Riproduci"</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">video-start-at</td>
			<td style="border: 1px solid #ddd; padding: 8px;">I secondo da cui far iniziare il video.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">0</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autoload</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Se impostato questo parametro, l'iframe YouTube verrà inizializzato al caricamento della pagina. Il controllo viene fatto con un Observer. Se il video sarà fuori dal viewport della pagina verrà istanziato solo una volta visibile.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autoload-margin</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indica la distanza, in pixel o percentuale, per attivare l'Observer. Più la misura è grande (es. 1000px) e prima verrà attivato l'iframe del video quando ci si avvicina al component.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">0</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autoplay</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Avvia il video al caricamento della pagina ma solo se è impostato anche l'attributo "autoload". Il video verrà sempre attivato senza audio.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autopause</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Se il video è in riproduzione, questo parametro blocca automaticamente lo streaming se l'utente, scrollando la pagina, fa uscire il player dal viewport.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">no-lazyload</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Disabilita il caricamento "lazy" delle immagini originali del video (poster) oppure di quelle custome.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">no-schema</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Disabilita il caricamento dello snippet Schema.org.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">no-preconnect</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Disabilita l'inserimento dei tag "preconnect" legati ai domini YouTube quando ci si sposta con il mouse sopra uno qualsiasi dei video.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">poster-fallback</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Se impostato mostra una SVG come poster per il video. Il parametro ha priorità anche se viene impostato "poster-url"</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">poster-url</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Utilizza l'immagine passata come poster al posto di quelle originali del video. Può essere inserito un path o un url assoluto.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">poster-quality</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indica la qualità di default da utilzzare per le immagini originali del video. Non ha effetto se viene impostato "poster-url" oppure "poster-fallback". Se l'immagine non viene trovata verrà utilizzato il poster SVG di default.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"hqdefault"</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">param-list</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Azzera la lista dei parametri utilizzati dallo script e passati a YouTube in favore di quelli inseriti nell'attributo.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">short</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Se presente farà in modo di visualizzare il video in verticale se la risoluzione è inferiore (o uguale) a 640 pixel</td>
			<td style="border: 1px solid #ddd; padding: 8px;">non impostato</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">spinnerColor</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Indica il colore dello spinner</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"#ff0000"</td>
		</tr>
	</tbody>
</table>

### Configurazione di default

Alcuni parametri di default, nella maggior parte dei casi sono testi, possono essere sovrascritti creando una variabile globale chiamata "embedYoutubeConfig". La lista dei parametri che possono essere sovrascritti è la seguente:

```
<script>
	window.embedYoutubeConfig = {
		"activeIframeClass": "isactive",
		"textVideoTitle": "Video YouTube",
		"textVideoDescription": "Guarda questo video incorporato nel sito da YouTube",
		"textMissingVideoId": "ID video mancante",
		"textBtn": "Riproduci",
		"textVideo": "video",
		"videoStartAt": 0,
		"spinnerColor": "#ff0000",
		"posterQuality": "hqdefault"
	};
</script>
```

### GDPR

Per essere completamente aderenti alla normativa GDPR (quando l'utente non ha ancora dato il consenso o lo ha rifiutato) è necessario non utilizzare **mai** il parametro "autoload" e non scaricare mai le immagini dal sito YouTube. Per esempio questi 2 component sono validi anche senza consenso:

```
<embed-youtube video-id="kTwPG53ZAIg" poster-url="path/to/custom-poster.jpg"></embed-youtube>

<embed-youtube video-id="kTwPG53ZAIg" poster-fallback></embed-youtube>
```

### Eventi

Quando viene creato l'iframe di un video (anche in modalità autload) viene emesso un evento con i seguenti dati relativi al video:

* videoId
* playlistId
* videoTitle
* posterUrl

Può essere intercettato con un eventListener delegato. Ciò significa che vale per 1 o più video nella stessa pagina:

```
<script>
	document.addEventListener("embedYoutubeLoaded", (e) => {
		console.log(e.target);
		console.log("VideoId:", e.detail.videoId, "PlayListId:", e.detail.playlistId, "videoTitle:", e.detail.videoTitle, "posterUrl:", e.detail.posterUrl);
	});
</script>
```

È possibile aggiornare dinamicamente i componenti video modificando uno o più attributi in questa lista: "video-id", "playlist-id", "video-title", "play-text", "poster-url", "poster-fallback", "short". Esempio:

```
<script>
	setTimeout(() => {
		const videoEl = document.getElementById("myVideo1");
		// cambia id del video
		videoEl.setAttribute("video-id", "dQw4w9WgXcQ");
		// rimuove eventuali copertine di youtube e imposta il poster SVG
		videoEl.setAttribute("poster-fallback", "");
		console.log("video aggiornato");
	}, 1000);
</script>
```

### Stili CSS

Due elementi del component sono disponibili per eventuali personalizzazioni CSS:

```
<style>
	/* immagine poster del video */
	embed-youtube::part(poster)
	{
		object-fit: contain;
	}

	/* bottone play */
	embed-youtube::part(play-button)
	{
		margin-block: 1rem;
	}

	/* spinner color */
	embed-youtube::part(spinner)
	{
		display: none;
	}
</style>
```

## DevTeam

### ARMADA 429
<img src="https://raw.githubusercontent.com/saiballo/saiballo/refs/heads/master/armada429.png" width="80" height="80">
<br><br>

**Lorenzo "Saibal" Forti**

## License

[![MIT license](https://img.shields.io/badge/License-MIT-green.svg)](https://lbesson.mit-license.org/)
![](https://img.shields.io/badge/License-Copyleft%20Saibal%20--%20All%20Rights%20Reserved-red)
