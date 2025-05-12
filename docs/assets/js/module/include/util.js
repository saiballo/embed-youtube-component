/**
* Filename: util.js
*
* Created: 30/04/2025 (17:20:44)
* Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Last update: 12/05/2025 (11:44:31)
* Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Copyleft: 2025 - sss diritti riservati
*
* Comments:
*/

/**
 * The `preloadConnection` function is a module that preloads specific URLs for YouTube videos.
 * It uses a module pattern with a closure to encapsulate the `isPreconnected` variable and the `addPrefetch` function.
 * When the function is called with a `context` parameter, it checks certain conditions before preloading the URLs using the `addPrefetch` function.
 * Once the preloading is done, it sets the `isPreconnected` flag to true to prevent duplicate preloading.
 *
 * uso modulo + closure. è l'equivalente della iife classica in js. usata perchè c'è isPreconnected altrimenti si poteva evitare e mettere fuori sempre in questo file.
 */
export const preloadConnection = (() => {

	let isPreconnected = false;

	const addPrefetch = (type, url) => {

		const linkElem = document.createElement("link");
		linkElem.rel = type;
		linkElem.href = url;
		linkElem.crossOrigin = "true";
		document.head.append(linkElem);
	};

	return (context) => {

		if (isPreconnected || context.noPreconnect || context.globalNoPreconnect) return;

		addPrefetch("preconnect", "https://i.ytimg.com/");
		addPrefetch("preconnect", "https://s.ytimg.com");

		if (!context.noCookie) {

			addPrefetch("preconnect", "https://www.youtube.com");
			addPrefetch("preconnect", "https://www.google.com");
			addPrefetch("preconnect", "https://googleads.g.doubleclick.net");
			addPrefetch("preconnect", "https://static.doubleclick.net");

		} else {

			addPrefetch("preconnect", "https://www.youtube-nocookie.com");
		}

		isPreconnected = true;
	};

})();

/**
 * The function `missingVideoId` checks if a video ID is provided and displays an error message if it is missing.
 * @param context - it contains information related to the current state or environment of the application.
 * @returns it returns a boolean value. It returns `true` if there is no `videoId` in the `context` object or if the `videoId` is an empty string, and it returns `false` otherwise.
 */
export const missingVideoId = (context) => {

	// se non c'è l'id del video allora non carico il component
	if (!context.videoId || context.videoId === "") {

		hideElem(context.shadowRoot.getElementById(context.config.idSpinnerContainer), true);

		const h2 = document.createElement("h2");
		h2.id = "error-message";
		h2.textContent = context.config.textMissingVideoId;
		context.domContainer.appendChild(h2);

		return true;
	}

	return false;
}

/**
 * The `injectSchema` function creates a JSON-LD script element for embedding YouTube videos with schema.org metadata.
 * @param context - The `context` parameter in the `injectSchema` function contains the following properties:
 *
 * usata principalmente per indicizzazione
 */
export const injectSchema = (context) => {

	const { config } = context;
	const { videoId } = context;

	const videoTitle = context.videoTitle || config.textVideoTitle;
	const description = context.description || config.textVideoDescription;
	const embedTarget = context.playlistId ? `?listType=playlist&list=${context.playlistId}` : `${videoId}`;

	const script = document.createElement("script");
	script.id = `json-${videoId}`;
	script.type = "application/ld+json";
	script.text = JSON.stringify({
		"@context": "https://schema.org",
		"@type": "VideoObject",
		"name": `${videoTitle}`,
		"description": `${description}`,
		"thumbnailUrl": `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
		"contentUrl": `https://www.youtube.com/watch?v=${videoId}`,
		"embedUrl": `https://www.youtube.com/embed/${embedTarget}`
	});

	context.prepend(script);
};

/**
 * The `setLabel` function concatenates two input strings with a default text if one of the inputs is missing.
 * @param playtext - it is the text that will be displayed on a button or link to play a video.
 * @param titletext - The `titletext` parameter is a string that represents the title of a video.
 * @returns it returns a string based on the provided `playtext` and `titletext` parameters.
 * If both `playtext` and `titletext` are provided, it returns a combination of the two. If only `playtext` is provided, it returns `playtext`.
 * If only `titletext` is provided, it returns a combination of "Riproduci".
 */
export const setLabel = (context) => {

	const { config } = context;

	if (context.playText && context.videoTitle) {

		return `${context.playText} ${context.videoTitle}`;
	}

	if (context.playText) {

		return context.playText;
	}

	if (context.videoTitle) {

		return `${config.textBtn} ${context.videoTitle}`;
	}

	return `${config.textBtn} ${config.textVideo}`;
};

/**
 * `hideElem` that takes a boolean parameter `hide`. Inside the function, it checks the value of `hide`.
 * If `hide` is true, it sets the `hidden` property of the `domPlayButton` element to true, effectively hiding the play button.
 * If `hide` is false, it sets a timeout of 250 milliseconds before setting the `hidden` property of the `domPlayButton` element to false
 */
export const hideElem = (btn, hide = true, timeout = 250) => {

	if (hide) {

		btn.hidden = true;

	} else {

		setTimeout(() => {
			btn.hidden = false;
		}, timeout);
	}
};
