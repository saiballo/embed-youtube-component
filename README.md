> ### [Italian Version](./README-it.md)

# Embed YouTube Web Component

> A Web Component for embedding YouTube videos on your site in a GDPR-compliant way. By setting certain parameters, nothing is fetched from Google’s servers until the user clicks Play on the video.

![](https://img.shields.io/badge/Made%20with%20love%20and-javascript-blue)
[![MIT license](https://img.shields.io/badge/License-MIT-green.svg)](https://lbesson.mit-license.org/)

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Global Parameters](#global-parameters)
- [Using the Web Component](#using-the-web-component)
- [Parameter List](#parameter-list)
- [Default Configuration](#default-configuration)
- [GDPR Compliance](#gdpr-compliance)
- [Events](#events)
- [CSS Custom Properties](#css-custom-properties)
- [Dev Team](#dev-team)
- [License](#license)

## Demo

[Demo page](https://saiballo.github.io/embed-youtube-component/)

## Features

* Pure Web Component with no external dependencies.
* Ability to customize video delivery using the available parameter list. Some parameters can be set globally so you don’t have to repeat them on every component.
* SEO / Rich Results optimized via a Schema.org (JSON-LD) snippet.
* Encapsulated code that doesn’t interfere with the host site.
* Option to load the video from the “https://www.youtube-nocookie.com” domain for increased privacy.
* Responsive 16:9 video layout.
* Ability to display a custom poster image for each video instead of the original YouTube thumbnail; falls back to an SVG image on error.

### Installation

You can install the script in three ways. For details on global parameters, see [Global Parameters](#global-parameters).

1. **Compiled script in page**

Simply include the minified file. You can add `data-*` attributes on the `<script>` tag for global parameters:
```
<script src="embed-youtube.min.js"></script>
```

2. **Source module in page**

Use the uncompiled file with `type="module"`. In this mode you can’t add `data-*` on the `<script>` tag, but you can place them on the `<body>` instead. You must also include the `include/` folder alongside the module file (see `/docs/assets/js/module`):
```
<script type="module" src="module/embed-youtube.js"></script>
```

3. **Side-effect import**

Import the component in any other JavaScript entry point. Global parameters apply to the entry-point script (`<script>` tag) or the `<body>` if using `type="module`:
```
// master.js
import './embed-youtube.js';
```

## Global Parameters

You can set the following global parameters via `data-*` on the `<script>` or `<body>` tag:

* **`data-autoload`**: Automatically instantiate the YouTube iframe for every video on the page. _GDPR compliant: No._
* **`data-autoplay`**: Only works if `data-autoload` is set. Starts the video muted on page load. _GDPR compliant: No._
* **`data-autopause`**: Pauses the video when the player leaves the viewport (e.g. on scroll).
* **`data-mute`**: Mutes the audio when the user manually plays the video.
* **`data-no-preconnect`**: By default, `<link rel="preconnect">` tags are inserted for YouTube resources. This disables them (useful if your site already includes them).
* **`data-no-schema`**: Disables the JSON-LD Schema.org snippet (used for SEO and accessibility).

**Example with global parameters on the script tag:**

```
<!DOCTYPE html>
<html lang="it">

	<head>

		<script defer src="embed-youtube.min.js" data-autoload data-autoplay data-autopause></script>

	</head>

	<body>

		<embed-youtube video-id="kTwPG53ZAIg"></embed-youtube>
		<!-- you can use also full url. e.g.: https://youtu.be/kTwPG53ZAIg?si=P1KzvrzLOKE2SDHB -->

	</body>
</html>
```

**Example with `type="module"` and globals on the `<body>`:**

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

## Using the Web Component

Once the main script is loaded, you can use one or more instances on the page. The **only required** attribute is the video ID:

```
<embed-youtube video-id="kTwPG53ZAIg"></embed-youtube>
```

This will display the official video thumbnail but won’t create the YouTube iframe until the user interacts. Note that the thumbnail itself is still fetched from Google servers, so this mode is **not** fully GDPR-compliant.

To be fully GDPR-compliant (no Google servers contacted before user consent), use a custom poster:

```
<embed-youtube video-id="kTwPG53ZAIg" poster-url="path/to/custom-poster.jpg"></embed-youtube>
```

Or fall back to the built-in SVG placeholder:

```
<embed-youtube video-id="kTwPG53ZAIg" poster-fallback></embed-youtube>
```

Either way, once the user clicks “Play,” the video iframe is created normally.

For enhanced privacy, you can also use YouTube’s no-cookie domain:

```
<embed-youtube video-id="kTwPG53ZAIg" poster-url="path/to/custom-poster.jpg" no-cookie></embed-youtube>
```

This will load the iframe from **https://www.youtube-nocookie.com**.

If you need fully custom iframe parameters, use the `param-list` attribute:

```
<embed-youtube video-id="kTwPG53ZAIg" param-list="enablejsapi=1&autoplay=1&mute=0"></embed-youtube>
```

> **Note:** Using `param-list` overrides built-in handling of attributes like `autoload` and `autoplay`.

## Parameter List

<table style="width:100%; border-collapse: collapse;">
	<thead>
		<tr>
			<th style="border: 1px solid #ddd; padding: 8px;">Parameter</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Description</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Default</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">video-id</td>
			<td style="border: 1px solid #ddd; padding: 8px;">YouTube video ID to embed (or full url). Required. Shows an error if empty or missing.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">""</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">playlist-id</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Playlist ID for the initial video.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">video-title</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Video title (used for the button text and Schema.org snippet).</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"Video YouTube"</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">description</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Video description (used in the Schema.org snippet).</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"Guarda questo video incorporato nel sito da YouTube" ("Watch this embedded video from YouTube")</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">play-text</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Alternative text / `aria-label` for the Play button.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"Riproduci" ("Play")</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">video-start-at</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Start time in seconds.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">0</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autoload</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Automatically initializes the iframe when the component enters the viewport (IntersectionObserver).</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autoload-margin</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Margin (px or %) to trigger the IntersectionObserver. Larger values load the iframe earlier as you approach the component.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">0</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autoplay</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Starts the video on page load (muted). Only works if `autoload` is also set. </td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">autopause</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Pauses the video if the user scrolls it out of view.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">mute</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Mutes the audio when the user manually plays the video.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">no-lazyload</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Disables lazy-loading of poster images (original or custom).</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">no-schema</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Disables the JSON-LD Schema.org snippet.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">no-preconnect</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Disables insertion of `preconnect` tags for YouTube domains on hover.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">poster-fallback</td>
			<td style="border: 1px solid #ddd; padding: 8px;">If set, shows the built-in SVG placeholder (even if `poster-url` is also set).</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">poster-url</td>
			<td style="border: 1px solid #ddd; padding: 8px;">URL or path to a custom poster image.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">poster-quality</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Default quality for YouTube thumbnails. Ignored if `poster-url` or `poster-fallback` is set. Falls back to SVG on error.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"hqdefault"</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">param-list</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Overrides all built-in parameters passed to YouTube in favor of the provided list.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">short</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Displays the video in vertical format if viewport width <= 640 px.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">not set</td>
		</tr>
		<tr>
			<td style="border: 1px solid #ddd; padding: 8px;">spinnerColor</td>
			<td style="border: 1px solid #ddd; padding: 8px;">Color of the loading spinner.</td>
			<td style="border: 1px solid #ddd; padding: 8px;">"#ff0000"</td>
		</tr>
	</tbody>
</table>

## Default Configuration

You can override defaults by defining a global `embedYoutubeConfig` object before loading the script:

```
<script>
	window.embedYoutubeConfig = {
		"activeIframeClass": "isactive",
		"textVideoTitle": "Video YouTube",
		"textVideoDescription": "Guarda questo video incorporato nel sito da YouTube",
		"textMissingVideoId": "ID video errato o mancante",
		"textBtn": "Riproduci",
		"textVideo": "video",
		"videoStartAt": 0,
		"spinnerColor": "#ff0000",
		"posterQuality": "hqdefault"
	};
</script>
```

## GDPR Compliance

To fully comply with GDPR (when the user has not yet consented), **never** use `autoload` and **never** load any YouTube resources before user interaction. For example, these two components are valid without consent:

```
<embed-youtube video-id="kTwPG53ZAIg" poster-url="path/to/custom-poster.jpg"></embed-youtube>

<embed-youtube video-id="kTwPG53ZAIg" poster-fallback></embed-youtube>
```

## Events

When an iframe is created (manually or via `autoload`), an `embedYoutubeLoaded` event is dispatched with these details:

* `videoId`
* `playlistId`
* `videoTitle`
* `posterUrl`

You can listen globally:

```
<script>
	document.addEventListener("embedYoutubeLoaded", (e) => {
		console.log(e.target);
		console.log("VideoId:", e.detail.videoId, "PlayListId:", e.detail.playlistId, "videoTitle:", e.detail.videoTitle, "posterUrl:", e.detail.posterUrl);
	});
</script>
```

Components can be updated dynamically by changing one or more attributes from this list: `video-id`, `playlist-id`, `video-title`, `play-text`, `poster-url`, `poster-fallback`, `short`, `mute`. Example:

```
<script>
	setTimeout(() => {
		const videoEl = document.getElementById("myVideo1");
		// cambia id del video
		videoEl.setAttribute("video-id", "dQw4w9WgXcQ");
		// imposta la modalità muta
		videoEl.setAttribute("mute", "");
		// rimuove eventuali copertine di youtube e imposta il poster SVG
		videoEl.setAttribute("poster-fallback", "");
		console.log("video aggiornato");
	}, 1000);
</script>
```

## CSS Custom Properties

You can style parts of the component via CSS shadow parts:

```css
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
