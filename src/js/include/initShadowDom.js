/**
* @preserve
* Filename: initShadowDom.js
*
* Created: 30/04/2025 (16:48:32)
* Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Last update: 06/05/2025 (14:34:19)
* Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Copyleft: 2025 - Tutti i diritti riservati
*
* Comments:
*/

"use strict";

import { setStyle } from "./setStyle.js";

/**
 * The `initShadowDom` function sets up a shadow DOM for a given context and initializes specific elements within it for displaying a video player.
 * @param context - it represents the element to which the Shadow DOM will be attached.
 */
export const initShadowDom = (context) => {

	const { config } = context;

	context.attachShadow({
		"mode": "open"
	});

	// stili css
	context.shadowRoot.adoptedStyleSheets = [setStyle()];

	// codice di partenza prima dell'iframe video
	context.shadowRoot.innerHTML = `

		<div id="${config.idEmbedContainer}">
			<picture id="${config.idPosterContainer}">
				<img part="poster" id="${config.idPosterImg}" referrerpolicy="origin" loading="lazy" fetchpriority="low" alt="">
			</picture>
			<button id="${config.idBtnPlay}" part="play-button"></button>
		</div>
	`;

	context.domContainer = context.shadowRoot.getElementById(config.idEmbedContainer);
	context.domPosterContainer = context.shadowRoot.getElementById(config.idPosterContainer);
	context.domImgPoster = context.shadowRoot.getElementById(config.idPosterImg);
	context.domPlayButton = context.shadowRoot.getElementById(config.idBtnPlay);
};
