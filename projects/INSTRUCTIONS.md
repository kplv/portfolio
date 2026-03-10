# Project Markdown Files — Instructions for Claude

Each `.md` file in this folder is the **content source of truth** for one portfolio project.
When the user asks to add or update a project, read the corresponding `.md` file and sync
its contents into `src/data/projects.ts`.

---

## File format

```
url: <slug>
Thumbnail: <absolute path to the main page card image>
Accent Color: <OKLCH color, e.g. oklch(70% 0.1 186)>
Accent Gradient: <CSS gradient string>

Name: <project name>
Description: <short tagline for the project card>
Intro Text: <longer intro paragraph for the project modal header>

Role: <job title>
When: <year range, e.g. 2023–24>
What: <contribution type, e.g. Product Design, Frontend>

### <Section Title>

<label for first item>
<absolute path to media file> [cover]

<label for second item>
<absolute path to media file>

...
```

- Sections start with `### Title` and contain pairs of **label** + **media path**, separated by blank lines.
- Media paths are absolute filesystem paths rooted at the repo (`/Users/.../public/images/...`).
- A media path may end with `[cover]` to make the image/video fill its container (`object-fit: cover`). Without it, the default "peek" layout is used (`object-fit: contain`).
- A file can have multiple `### Section` blocks.

---

## Field mapping to `src/data/projects.ts`

| `.md` field | `Project` property | Notes |
|---|---|---|
| `url` | `slug` | URL-safe identifier |
| `Thumbnail` | `image` | Hero/thumbnail shown on the main page card |
| `Accent Color` | `accentColor` | OKLCH accent color |
| `Accent Gradient` | `accentGradient` | CSS gradient for modal header |
| `Name` | `name` | Display name |
| `Description` | `description` | Short tagline on project card |
| `Intro Text` | `intro` | Longer text in modal header |
| `Role` | `role` | Job title |
| `When` | `year` | Year range string |
| `What` | `contribution` | Contribution type |
| `### Title` | `sections[].title` | Section heading |
| label + path pairs | `sections[].items[]` | `label` + `media` |

### Media type detection

Derive `media.type` from the file extension:
- `.png`, `.jpg`, `.jpeg`, `.webp` → `{ type: 'image', src: '<web path>' }`
- `.mp4`, `.webm` → `{ type: 'video', src: '<web path>' }`

If the path ends with ` [cover]`, strip the suffix and set `cover: true` on the media object, e.g.:
`/Users/.../trade-1.png [cover]` → `{ type: 'image', src: '/images/projects/trade/trade-1.png', cover: true }`

Convert absolute filesystem paths to web-relative paths by stripping everything
up to and including `/public`, e.g.:
`/Users/deniskplv/dev/portfolio/public/images/projects/trade/trade-1.png` → `/images/projects/trade/trade-1.png`

---

## Fields managed only in TypeScript

These fields do **not** appear in `.md` files. Keep them in `projects.ts` directly:

| Property | Purpose |
|---|---|
| `id` | Unique numeric string (`'1'`, `'2'`, …) |
| `images` | Carousel images for the project card |
| `team` | Array of `{ name, avatar, href }` |
| `fullWidth` | Per-item layout flag on `SectionItem` |

---

## How to sync a `.md` file → `projects.ts`

1. Read the `.md` file from `projects/`.
2. Parse each field using the mapping table above.
3. Find the matching project in the `projects` array by `slug`.
   - If it doesn't exist, create a new entry with a unique `id` and ask the user
     for `team`.
4. Update `name`, `description`, `intro`, `role`, `year`, `contribution`, `accentColor`, `accentGradient`.
5. Set `image` from the `Thumbnail` field (convert to web-relative path).
6. Rebuild `sections` from the `### Section` blocks:
   - For each label + path pair, create a `SectionItem` with the correct `media.type`.
   - When the path has a `[cover]` suffix, set `media.cover: true`.
   - Preserve any existing `fullWidth` flags from the current TS data.
7. Update `images` to include all unique image sources (skip videos).
8. Leave `team` and `id` unchanged.

---

## How to create a `.md` for a new project

1. Copy the format above.
2. Set `url` to the desired slug (lowercase, hyphenated).
3. Fill in all text fields.
4. Add `### Features` (or other section titles) with label + media path pairs.
5. Place media files under `public/images/projects/<slug>/`.
6. Save as `projects/<slug>.md`.
