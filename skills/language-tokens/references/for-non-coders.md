# Editing the text: a guide for content owners (no coding needed)

All the words users see in this app live in **one spreadsheet**: `tokens/tokens.csv`.
You can change any wording, fix a typo, or add a translation without touching code.

## Opening the file

Double-click `tokens.csv` to open it in Excel, Numbers, or Google Sheets (File →
Import for Sheets). It looks like this:

| key | description | en | es |
|-----|-------------|----|----|
| common.save | Save button used across all forms | Save | Guardar |
| home.greeting | Greeting on the home page. {name} = the user's first name | Welcome, {name}! | ¡Bienvenido, {name}! |

## What each column means

- **key** — a code name for the text (like `common.save`). **Don't change this.** The
  app finds text by this name. Changing it can make text disappear.
- **description** — a note explaining where the text shows up and what any placeholder
  means. Edit freely; it helps translators. It's never shown to users.
- **en, es, …** — the actual words for each language. **This is what you edit.** Each
  column is one language (`en` = English, `es` = Spanish, `fr` = French, etc.).

## Editing text

Just click a cell in a language column and type. To fix "Save" → "Save changes",
edit the `en` cell. Done.

## Placeholders — leave the `{curly braces}` alone

Some text has a slot like `{name}` that the app fills in (e.g. the person's name).
You can move the words around it, but keep `{name}` exactly as-is:

- ✅ `Welcome back, {name}!`
- ✅ `{name}, welcome back!`
- ❌ `Welcome back, name!` (the app can't fill this in)

## Adding a new language

Add a new column. Put the language's ISO code in the header row (`fr` for French,
`de` for German, `ja` for Japanese). Fill in the translations. Leave a cell blank if
a translation isn't ready — blank cells are reported, not shipped as empty.

## Saving

Save the file as **CSV** (in Excel: File → Save As → CSV UTF-8; in Google Sheets:
File → Download → Comma-separated values). Keep the filename `tokens.csv`.

## Making your changes appear in the app

After saving, someone runs one command (or it happens automatically on build):

```
python tokens/generate.py tokens/tokens.csv --out tokens/locales
```

That's it — the app now shows your updated text. If you're not sure who runs it, ask
whoever set up the project; it takes two seconds.

## Tips

- Don't delete a `key` row unless you know that text is gone from the app.
- If two rows have the same key, the app uses the lower one — avoid duplicates.
- Keep commas inside a sentence as normal; the spreadsheet handles them when it saves.
