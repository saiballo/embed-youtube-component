/**
* @preserve
* Filename: embed-youtube.js
*
* Created: 05/05/2025 (12:08:23)
* Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Last update: 06/05/2025 (17:51:08)
* Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Copyleft: 2025 - Tutti i diritti riservati
*
* Comments:
*/

import { defaultConfig } from "./include/config.js";
import { initShadowDom } from "./include/initShadowDom.js";
import { preloadConnection, injectSchema, setLabel } from "./include/util.js";

(() => {

	"use strict";

	// prendo il currentScript per leggere alcuni parametri globali ma solo se non è type="module" atrlimenti leggo il body
	const globalParamHook = document.currentScript || document.getElementsByTagName("body")[0];

	class embedYouTube extends HTMLElement {

		constructor() {

			super();

			// merge della possibile configurazione globale con quella di default
			this.config = {
				...defaultConfig,
				...window.embedYouTubeConfig || {}
			};

			this.scheduleUpdate;
			this.isIframeLoaded = false;
			this.globalParam = globalParamHook;
			// inizializzo il codice e gli stili css
			initShadowDom(this);
		}

		static get observedAttributes() {

			return ["video-id", "playlist-id", "video-title", "play-text", "poster-url", "poster-fallback", "short"];
		}

		connectedCallback() {

			// se non c'è l'id del video allora non carico il component
			if (!this.videoId || this.videoId === "") {

				this.domContainer.textContent = "";

				const h2 = document.createElement("h2");
				h2.id = "error-message";
				h2.textContent = this.config.textMissingVideoId;
				this.domContainer.appendChild(h2);

				return false;
			}

			// setup del componente
			this.setupComponent();

			// evento click per creare l'iframe
			this.addEventListener("click", () => {

				this.loadIframe();
			});

			// preload delle connessioni
			this.addEventListener("pointerover", () => {

				preloadConnection(this);

			}, {

				"once": true
			});
		}

		// attributi globali
		get globalAutoLoad() {
			return this.globalParam.hasAttribute("data-autoload");
		}

		get globalAutoPlay() {
			return this.globalParam.hasAttribute("data-autoplay");
		}

		get globalAutoPause() {
			return this.globalParam.hasAttribute("data-autopause");
		}

		get globalNoPreconnect() {
			return this.globalParam.hasAttribute("data-no-preconnect");
		}

		get globalNoSchema() {
			return this.globalParam.hasAttribute("data-no-schema");
		}
		// attributi globali

		// get attributi locali del component
		get videoId() {
			return encodeURIComponent(this.getAttribute("video-id") || "");
		}

		get playlistId() {
			return encodeURIComponent(this.getAttribute("playlist-id") || "");
		}

		get videoTitle() {
			return this.getAttribute("video-title") || this.config.textVideoTitle;
		}

		get description() {
			return this.getAttribute("description");
		}

		get playText() {

			return this.getAttribute("play-text");
		}

		get videoStartAt() {
			return this.getAttribute("video-start-at") || this.config.videoStartAt;
		}

		get autoLoadMargin() {
			return this.getAttribute("autoload-margin");
		}

		get posterUrl() {
			return this.getAttribute("poster-url");
		}

		get posterQuality() {
			return this.getAttribute("poster-quality") || this.config.posterQuality;
		}

		get paramList() {
			return this.getAttribute("param-list");
		}

		isYouTubeShort() {
			return this.getAttribute("short") === "" && window.matchMedia("(max-width: 40em)").matches;
		}
		// get attributi locali del component

		// has attributi locali del component
		get autoLoad() {
			return this.hasAttribute("autoload");
		}

		get autoPlay() {
			return this.hasAttribute("autoplay");
		}

		get autoPause() {
			return this.hasAttribute("autopause");
		}

		get noCookie() {
			return this.hasAttribute("no-cookie");
		}

		get noLazyLoad() {
			return this.hasAttribute("no-lazyload");
		}

		get noSchema() {
			return this.hasAttribute("no-schema");
		}

		get noPreconnect() {
			return this.hasAttribute("no-preconnect");
		}

		get posterFallback() {
			return this.hasAttribute("poster-fallback");
		}
		// has attributi locali del component

		/**
		 * The `setupComponent` sets up various properties and behaviors for a video component, including setting labels, custom posters, auto-loading iframes etc.
		 */
		setupComponent() {

			// costruisco la label a seconda dei dati presenti
			const label = setLabel(this);

			// imposto la label sul bottone e sul component
			this.domPlayButton.setAttribute("aria-label", label);
			this.setAttribute("title", label);
			// ottimizzazione per quando viene impostato il poster-url esternamente dopo il caricamento del component. evita un effetto fout
			this.domImgPoster.src = "";
			this.domPlayButton.hidden = false;

			// custom fallback svg
			if (this.posterFallback) {

				this.setPosterFallback();

			// imposto il custom poster
			} else if (this.posterUrl) {

				this.setPosterCustom();

			// utilizzo le immagini del video
			} else {

				this.setPoster();
			}

			// autocaricamento iframe
			if (this.autoLoad || this.globalAutoLoad || this.isYouTubeShort()) {

				this.autoLoadIframe();
			}

			// autopausa
			if (this.autoPause || this.globalAutoPause) {

				this.autoPauseVideo();
			}

			// creazione schema json per seo
			if (!this.noSchema && !this.globalNoSchema) {

				injectSchema(this);
			}
		}

		/**
		 * The function `createIframe()` generates an iframe code for embedding a YouTube video with specified parameters and options.
		 * @returns it returns a string containing an HTML `<iframe>` element with attributes.
		 * The src attribute is dynamically generated based on the parameters set within the function.
		 */
		createIframe() {

			const noCookieDomain = this.noCookie ? "-nocookie" : "";
			const embedTarget = this.playlistId ? `?listType=playlist&list=${this.playlistId}&` : `${this.videoId}?`;

			let videoParam;

			// se ci sono parametri custom tutti i default vengono azzerati
			if (this.paramList && this.paramList !== "") {

				videoParam = this.paramList;

			} else {

				// gestione parametri
				const enableApi = this.autoPlay || this.globalAutoPlay || this.autoPause || this.globalAutoPause || this.isYouTubeShort() ? 1 : 0;
				const autoplay = (this.autoPlay || this.globalAutoPlay) && (this.autoLoad || this.globalAutoLoad) ? 1 : 0;
				const mute = autoplay ? 1 : 0;
				const startAt = this.videoStartAt;

				videoParam = `enablejsapi=${enableApi}&start=${startAt}`;

				if (autoplay) {

					videoParam = `${videoParam}&autoplay=${autoplay}&mute=${mute}`;

				} else {

					videoParam = `${videoParam}&autoplay=1&mute=0`;
				}

				if (this.isYouTubeShort()) {

					videoParam = `${videoParam}&loop=1&modestbranding=1&playsinline=1&rel=0&playlist=${this.videoId}`;
				}
			}

			const iframeCode = `
				<iframe title="${this.videoTitle}" credentialless allow="accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture" allowfullscreen src="https://www.youtube${noCookieDomain}.com/embed/${embedTarget}${videoParam}"></iframe>
			`;

			return iframeCode;
		}

		/**
		 * The function `loadIframe` checks if an iframe is already loaded, creates and inserts an iframe if not, and dispatches a custom event once the iframe is loaded.
		 */
		loadIframe() {

			if (!this.isIframeLoaded) {

				const iframeCode = this.createIframe();
				this.domContainer.insertAdjacentHTML("beforeend", iframeCode);
				this.domContainer.classList.add(this.config.activeIframeClass);
				this.isIframeLoaded = true;

				this.dispatchEvent(new CustomEvent("embedYoutubeLoaded", {
					"detail": {
						"videoId": this.videoId,
						"playlistId": this.playlistId,
						"videoTitle": this.videoTitle,
						"posterUrl": this.posterUrl
					},
					"bubbles": true,
					"cancelable": true
				}));
			}
		}

		/**
		 * `autoLoadIframe` sets up an IntersectionObserver to monitor when an iframe element becomes visible in the viewport.
		 * When the iframe intersects with the viewport and has not been loaded yet, it triggers `preloadConnection` and `loadIframe(true)` to load the iframe content.
		 * Once the iframe is loaded, the observer stops observing the iframe element.
		 */
		autoLoadIframe() {

			const options = {
				"root": null,
				"rootMargin": this.autoLoadMargin && this.autoLoadMargin !== "" ? this.autoLoadMargin : "0px",
				"threshold": 0
			};

			const observerIframe = new IntersectionObserver((entryList, observer) => {

				entryList.forEach((entry) => {

					if (entry.isIntersecting && !this.isIframeLoaded) {

						preloadConnection(this);
						this.loadIframe(true);
						observer.unobserve(this);
					}
				});

			}, options);

			observerIframe.observe(this);
		}

		/**
		 * `autoPauseVideo` uses the Intersection Observer API to automatically pause a video when it is not in the viewport.
		 */
		autoPauseVideo() {

			const observerVideo = new IntersectionObserver((entryList) => {

				entryList.forEach((entry) => {

					if (!entry.isIntersecting) {

						this.shadowRoot.querySelector("iframe")?.contentWindow?.postMessage("{\"event\":\"command\",\"func\":\"pauseVideo\",\"args\":\"\"}", "*");
					}
				});

			}, {
				"threshold": 0
			});

			observerVideo.observe(this);
		}

		/**
		 * The function `setPosterFallback` removes loading attribute, hides play button, and sets a custom SVG image as the poster fallback.
		 */
		setPosterFallback() {

			const svg = `
				<svg part="poster-fallback" xmlns="http://www.w3.org/2000/svg" viewBox="0 48 294 198" width="294" height="198">
				<path d="M294,48 c0-8.284-6.716-15-15-15H15 C6.716,33,0,39.716,0,48v198 c0,8.284,6.716,15,15,15h264 c8.284,0,15-6.716,15-15V48z" fill="red"/>
				<path transform="translate(0,6)" d="M124,113.134 c0-2.68,1.596-5.155,3.917-6.495 c2.32-1.34,5.263-1.34,7.583,0 l37.046,21.364 c2.32,1.34,3.771,3.815,3.771,6.495 s-1.419,5.155-3.74,6.495 l-36.999,21.364 c-1.16,0.67-2.452,1.005-3.747,1.005 s-2.755-0.335-3.915-1.005 c-2.32-1.34-3.915-3.815-3.915-6.495V113.134z" fill="white"/>
				<path transform="translate(0,-30)" d="M263.333,232H89v1 c0,4.143-3.357,7.5-7.5,7.5 S74,237.143,74,233v-1 H30.333 c-4.143,0-7.5-3.357-7.5-7.5 s3.357-7.5,7.5-7.5h44 c0-4.143,3.357-7.5,7.5-7.5 s7.5,3.357,7.5,7.5h174 c4.143,0,7.5,3.357,7.5,7.5 S267.476,232,263.333,232z" fill="white"/> <text x="147" y="95" fill="white" font-family="Verdana, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" alignment-baseline="middle">Play video</text>
				</svg>
			`;

			const uri = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

			this.domImgPoster.src = uri;
			this.domImgPoster.removeAttribute("loading");
			this.domImgPoster.setAttribute("alt", "");
			this.domPlayButton.hidden = true;
			this.domPlayButton.setAttribute("aria-hidden", "true");
		}

		/**
		 * The function `setPosterCustom` sets the `src` and `alt` attributes of an image element based on the provided `posterUrl` and `videoTitle` properties.
		 */
		setPosterCustom() {

			if (this.noLazyLoad) {

				this.domImgPoster.removeAttribute("loading");
			}

			this.domImgPoster.src = this.posterUrl;

			this.domImgPoster.onload = () => {

				// siccome in setPosterFallback cambio il src e quindi scatta un nuovo load dopo l’error allora faccio un controllo per evitare di sovrascrivere "alt"
				if (this.domImgPoster.src === this.posterUrl) {

					this.domImgPoster.setAttribute("alt", this.videoTitle);
				}
			};

			this.domImgPoster.onerror = () => {

				if (this.posterUrl) {

					this.setPosterFallback();
				}
			};
		}

		/**
		 * The `setPoster` function dynamically sets the poster image for a video element by checking for the availability of webp image and adjusting the quality accordingly.
		 */
		setPoster() {

			// url immagini webp e jpg da scaricare
			const webpUrl = `https://i.ytimg.com/vi_webp/${this.videoId}/${this.posterQuality}.webp`;
			const jpgUrl = `https://i.ytimg.com/vi/${this.videoId}/${this.posterQuality}.jpg`;

			// rimuovo attributo lazy se necessario
			if (this.noLazyLoad) {

				this.domImgPoster.removeAttribute("loading");
			}

			// test immagine webp perchè se si richiede un file non esistente (es. hqdefault.webp), youtube restituisce una miniatura di default di dimensioni fisse: 120x90px
			// youtube non restituisce mai 404
			const img = new Image();
			img.fetchPriority = "low";
			img.referrerPolicy = "origin";
			img.src = webpUrl;
			// solo dopo img.src scatta onload
			img.onload = () => {

				// natutalW e naturalH: dimensioni intrinseche dell'immagine, cioè quelle originali del file
				const is404Poster = img.naturalWidth === 120 && img.naturalHeight === 90;

				if (is404Poster) {

					return this.setPosterFallback();
				}

				// se non è un fallback poster creo i source necessari
				const sourceWebp = document.createElement("source");
				sourceWebp.id = "img-webp";
				sourceWebp.setAttribute("type", "image/webp");

				const sourceJpg = document.createElement("source");
				sourceJpg.id = "img-jpg";
				sourceJpg.setAttribute("type", "image/jpeg");

				// li aggiungo in ordine corretto prima del tag img src già presente
				this.domPosterContainer.prepend(sourceWebp, sourceJpg);
				// imposto le url per le immagini
				this.domPosterContainer.querySelector("#img-webp").srcset = webpUrl;
				this.domPosterContainer.querySelector("#img-jpg").srcset = jpgUrl;
				this.domImgPoster.src = jpgUrl;
			};
		}

		/**
		 * The attributeChangedCallback handles attribute changes by updating the component accordingly, including cancelling any scheduled updates and reinitializing the component.
		 * @param attrname -it represents the name of the attribute that was changed on the custom element to which the callback is attached.
		 * It helps you identify which attribute triggered the callback so that you can perform specific actions based on that attribute's change.
		 * @param oldvalue -it represents the previous value of the attribute that was changed.
		 * It is compared with the `newvalue` parameter to determine what has changed in the element's attributes. If `oldvalue` is `null`, it means that the attribute
		 * @param newvalue -It  represents the new value of the attribute that triggered the callback.
		 * It is the updated value of the attribute that was changed in the element. In the provided code snippet, `newvalue` is used to check if the attribute value has
		 *
		 * metodo nativo dei web component. serve per intercettare i cambiamenti agli attributi di un elemento personalizzato.
		 */
		attributeChangedCallback(attrname, oldvalue, newvalue) {

			// al primo carimento oldvalue è sempre null
			if (oldvalue === null || oldvalue === newvalue) return;

			// annulla eventuale aggiornamento già programmato
			if (this.scheduleUpdate) cancelAnimationFrame(this.scheduleUpdate);

			// se viene cambiato l'attributo videoid allora prendo il valore prima del cambiamento
			// se viene cambiato un attributo che non è videoid allora prendo il valore presente nel codice
			// questo si è reso necessario perchè viene usato requestAnimationFrame che accorpa tutte le modifiche in una volta sola
			const videoId = attrname === "video-id" ? oldvalue : this.videoId;

			// cancello eventuali json. lo faccio sempre perchè non so quale attributo possa essere cambiato. in ogni caso viene richiamata la setup che lo riscrive
			if (!this.noSchema && !this.globalNoSchema && this.querySelector(`#json-${videoId}`)) {

				this.querySelector(`#json-${videoId}`).remove();
			}

			// programma il nuovo aggiornamento
			this.scheduleUpdate = requestAnimationFrame(() => {

				if (this.domContainer.classList.contains(this.config.activeIframeClass)) {

					this.domContainer.classList.remove(this.config.activeIframeClass);
					this.shadowRoot.querySelector("iframe").remove();
					this.isIframeLoaded = false;
				}

				// rilancio setup
				this.setupComponent();
			});
		}
	}

	customElements.define("embed-youtube", embedYouTube);

})();
