/**
* Filename: setStyle.js
*
* Created: 30/04/2025 (16:26:32)
* Created by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Last update: 16/07/2025 (16:32:28)
* Updated by: Lorenzo Saibal Forti <lorenzo.forti@gmail.com>
*
* Copyleft: 2024 - Tutti i diritti riservati
*
* Comments:
*/

"use strict";

export const setStyle = () => {

	const stylesheet = new CSSStyleSheet();

	stylesheet.replaceSync(`

		:host,
		:host *,
		:host *::before,
		:host *::after
		{
			box-sizing: border-box;
		}

		:host
		{
			contain: content;
			display: block;
			width: 100%;
			aspect-ratio: var(--aspect-ratio);
			--aspect-ratio: var(--embed-youtube-aspect-ratio, 16 / 9);
			--aspect-ratio-short: var(--embed-youtube-aspect-ratio-short, 9 / 16);
		}

		@media (max-width: 40em)
		{
			:host([short])
			{
				aspect-ratio: var(--aspect-ratio-short);
			}
		}

		#embed-container
		{
			position: relative;
			width: 100%;
			height: 100%;
			aspect-ratio: 16 / 9;
			overflow: hidden;
			cursor: pointer;
		}

		#embed-container.isactive::before,
		#embed-container.isactive > #btn-play
		{
			display: none;
		}

		iframe,
		#poster-img
		{
			position: absolute;
			width: 100%;
			height: 100%;
			inset: 0;
		}

		iframe
		{
			border: 0;
		}

		#poster-img
		{
			object-fit: cover;
			box-sizing: border-box;
		}

		#btn-play
		{
			width: 68px;
			height: 48px;
			z-index: 1;
			border: 0;
			background-color: transparent;
			background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/><path d="M45 24 27 14v20" fill="white"/></svg>');
			background-repeat: no-repeat;
  			background-position: center;
  			background-size: 100% 100%;
		}

		#btn-play:before
		{
			content: "";
			border-style: solid;
			border-width: 10px 0 10px 16px;
			border-color: transparent transparent transparent #fff;
		}

		#btn-play,
		#btn-play:before,
		#error-message
		{
			position: absolute;
			top: 50%;
			left: 50%;
			text-align: center;
			transform: translate3d(-50%, -50%, 0);
			cursor: inherit;
		}

		#error-message
		{
			width: 100%;
		}

		.isactive
		{
			cursor: unset;
		}

		#spinner-container
		{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate3d(-50%, -50%, 0);
		}
	`);

	return stylesheet;
};
