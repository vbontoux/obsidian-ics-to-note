# ICS to Note

An [Obsidian](https://obsidian.md) plugin that imports `.ics` calendar files and creates one note per event.

## Features

- **Import ICS files** – Open the command palette and run **Import ICS file as notes**.
- **YAML frontmatter** – Each note includes title, start/end times, location, status, and organizer.
- **Attendee checklist** – Attendees are listed as checkboxes so you can track responses.
- **Event description** – The full event description is appended to the note body.
- **Idempotent** – Re-importing the same file updates existing notes instead of creating duplicates.

## Installation

### From community plugins (coming soon)

Search for **ICS to Note** in **Settings → Community plugins → Browse**.

### Manual

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/vbontoux/obsidian-ics-to-note/releases/latest).
2. Create a folder `<your-vault>/.obsidian/plugins/ics-to-note/`.
3. Copy the downloaded files into that folder.
4. Reload Obsidian and enable the plugin in **Settings → Community plugins**.

## Usage

1. Open the command palette (`Ctrl/Cmd + P`).
2. Run **Import ICS file as notes**.
3. Select an `.ics` file from your filesystem.
4. One note per event is created in your vault root.

## Development

```bash
npm install
npm run dev    # watch mode
npm run build  # production build
```

## License

[0-BSD](LICENSE)
