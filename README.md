# Alt Text Generator AI for Umbraco

<img src="https://raw.githubusercontent.com/balt1794/umbraco-package-alt-text-generator/main/icon.png" alt="Alt Text Generator logo" width="64" />

Write SEO-friendly alt text for the images in your Umbraco media library. Generate it for one image, for a selection or for every image that is missing it, review it, and save. 131 languages.

[Get a free API key](https://alttextgeneratorai.com/dashboard)

## What you get

- **A dashboard in the Media section.** **Alt Text Generator AI** sits next to the media tree. It lists your images with a preview, shows the ones with no alt text, and writes it for all of them or only the ones you tick.
- **A Generate button on every image.** Open any image in the media tree and the **Alt text** field has its own **Generate** button, for writing one description on the spot.
- **Review before saving.** Edit any text, then save everything at once. The text goes into the **Alt text** property of each image.
- **131 languages** for the text, including English, Spanish, French, German, Italian, Portuguese, Dutch, Russian, Chinese, Japanese, Korean, Arabic and Hindi.
- **Credits shown in the dashboard.** One credit writes alt text for one image. New accounts get free credits.
- **Your key stays on your server.** The API key is only used by Umbraco's server code and never reaches the browser.

## Requirements

- Umbraco 17 or newer
- An Alt Text Generator API key ([get one free](https://alttextgeneratorai.com/dashboard))

## Install

```sh
dotnet add package AltTextGeneratorAI.Umbraco
```

Run your site, open the **Media** section and choose **Alt Text Generator AI**. Paste your API key and click **Save key**. Only administrators can change the key.

To set the key in a deployment instead, add it to `appsettings.json`. A key saved in the dashboard takes priority:

```json
{
  "AltTextGeneratorAI": {
    "ApiKey": "your-key"
  }
}
```

## Use it

1. Open **Alt Text Generator AI** in the Media section. It lists your images and shows your credits.
2. **Missing** shows the images with no alt text. **All** shows everything.
3. Pick the **language of the alt text**.
4. Tick the images you want, or leave them all unticked, then click **Generate selected** or **Generate all missing**. Each image uses 1 credit.
5. Read the results, change anything you like, then click **Save changes**.

**Generate all missing** skips images that already have alt text. Tick an image to generate it anyway, or tick **Overwrite images that already have alt text**.

## Show the alt text on your site

The package adds an **Alt text** property (alias `altText`) to the **Image** media type the first time you open the dashboard, with a data type called **Alt Text Generator AI** that shows the Generate button. Use it where you render images:

```csharp
@using AltTextGeneratorAI.Umbraco

@* an image from a media picker *@
<img src="@image.Url()" alt="@image.Content.GetAltText()" />

@* any published media item *@
<img src="@media.Url()" alt="@media.GetAltText()" />
```

`GetAltText()` returns an empty string when an image has none, so the template does not print the file name by accident.

## Good to know

- Images are shrunk to 1024 px on the long side before they are sent.
- SVG files cannot be described and are skipped with a message.
- Only images of the **Image** media type are listed.
- The alt text is stored once per image, so it is not translated per language of the site. Choose the language you need before you generate.

## Development

```sh
cd Client
npm install
npm run build
```

The build puts the dashboard in `wwwroot/App_Plugins/AltTextGeneratorAI`. Add this project to an Umbraco site as a project reference to try it.

## License

MIT. See [LICENSE](LICENSE).
