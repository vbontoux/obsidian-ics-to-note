import { Notice, Plugin, TFile } from "obsidian";
import { convertIcsCalendar, type IcsCalendar, type IcsAttendee, type IcsEvent } from "ts-ics";

export default class IcsToNotePlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: "import-ics",
			name: "Import ICS file as notes",
			callback: () => this.importIcs(),
		});
	}

	private async importIcs() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".ics";
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;

			const text = await file.text();
			let calendar: IcsCalendar;
			try {
				calendar = convertIcsCalendar(undefined, text);
			} catch (e) {
				new Notice("Failed to parse ICS file.");
				return;
			}

			const events = calendar.events;
			if (!events?.length) {
				new Notice("No events found in ICS file.");
				return;
			}

			for (const event of events) {
				await this.createNote(event);
			}

			new Notice(`Created ${events.length} note(s) from ICS.`);
		};
		input.click();
	}

	private formatDate(d: Date): string {
		return d.toISOString().replace("T", " ").slice(0, 16);
	}

	private formatPerson(p: { name?: string; email: string }): string {
		return p.name ? `${p.name} <${p.email}>` : p.email;
	}

	private formatAttendee(a: IcsAttendee): string {
		const status = a.partstat ? ` (${a.partstat})` : "";
		return `${this.formatPerson(a)}${status}`;
	}

	private async createNote(event: IcsEvent) {
		const title = (event.summary ?? "Untitled Event").replace(/[\\/:*?"<>|]/g, "-");
		const start = event.start?.date ? this.formatDate(new Date(event.start.date)) : "";
		const end = event.end?.date ? this.formatDate(new Date(event.end.date)) : "";

		const date = event.start?.date ? new Date(event.start.date).toISOString().slice(0, 10) : "";

		const lines = ["---", `title: "${title}"`];
		if (date) lines.push(`date: ${date}`);
		if (start) lines.push(`start: "${start}"`);
		if (end) lines.push(`end: "${end}"`);
		if (event.location) lines.push(`location: "${event.location}"`);
		if (event.status) lines.push(`status: "${event.status}"`);
		if (event.organizer) lines.push(`organizer: "${this.formatPerson(event.organizer)}"`);
		lines.push("tags:\n  - type/meeting");
		lines.push("---");

		const parts = [lines.join("\n"), ""];
		const hasAttendees = event.organizer || event.attendees?.length;
		if (hasAttendees) {
			parts.push("## Attendees", "");
			if (event.organizer) {
				parts.push(`- [ ] ${this.formatPerson(event.organizer)} (Organizer)`);
			}
			for (const a of event.attendees ?? []) {
				parts.push(`- [ ] ${this.formatAttendee(a)}`);
			}
			parts.push("");
		}
		if (event.description) parts.push(event.description);

		const content = parts.join("\n");
		const fileName = `${title}.md`;

		const existing = this.app.vault.getAbstractFileByPath(fileName);
		if (existing instanceof TFile) {
			await this.app.vault.modify(existing, content);
		} else {
			await this.app.vault.create(fileName, content);
		}
	}
}
