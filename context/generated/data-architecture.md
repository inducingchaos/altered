# ALTERED Data Architecture

> Generated context file documenting the core data model and architectural decisions for ALTERED's knowledge management system.

---

## Core Philosophy

ALTERED extends the brain by reverse-engineering neurological linking concepts into data manipulation and indexing functions. Key principles:

1. **Flat over Hierarchical**: No directory-based file organization. Use tag-based indexing to reduce organizational overhead.
2. **Data-First**: Generalist approach (like ChatGPT/Google) rather than niche specialization.
3. **Version Control**: Thoughts are versioned with validation timestamps for review/archival.
4. **Minimal Structure**: Reduce organizational overhead by avoiding rigid hierarchies (renaming, re-organizing, ordering).

---

## Entity Hierarchy

```
User
 └── Brain (sub-entity, like an "organization")
      ├── Thoughts (core unit of data)
      ├── Datasets (named labels/tags with schemas)
      ├── Schemas (column definitions for datasets)
      ├── Tags (system-level labels, auto-applied)
      ├── Preferences (tag-indexed KV store)
      ├── Associations (artificial relations)
      └── Data (branded files, linked to thoughts)
```

---

## Table Definitions

### `users`

Standard auth table. Owns brains.

### `brains`

Sub-entity of user. All app data is owned by a brain, not directly by a user.

| Column    | Type      | Notes      |
| --------- | --------- | ---------- |
| id        | varchar   | PK, nanoid |
| userId    | varchar   | FK → users |
| name      | varchar   | Brain name |
| createdAt | timestamp |            |
| updatedAt | timestamp |            |

### `thoughts`

Core data unit. Stores user knowledge fragments.

| Column    | Type       | Notes                                                                |
| --------- | ---------- | -------------------------------------------------------------------- |
| id        | varchar    | PK, nanoid                                                           |
| brainId   | varchar    | FK → brains                                                          |
| content   | varchar    | The thought content                                                  |
| validated | timestamp? | Null = not validated. Timestamp = when validated for version control |
| sensitive | boolean    | Hide from user-facing displays                                       |
| archived  | boolean    | No longer relevant but not deleted                                   |
| createdAt | timestamp  |                                                                      |
| updatedAt | timestamp  |                                                                      |

### `aliases`

Alternate short names for thoughts, datasets, or other entities.

| Column    | Type      | Notes                         |
| --------- | --------- | ----------------------------- |
| id        | varchar   | PK, nanoid                    |
| value     | varchar   | The alias text                |
| thoughtId | varchar?  | FK → thoughts (nullable)      |
| datasetId | varchar?  | FK → datasets (nullable)      |
| order     | varchar   | Fractional index for ordering |
| createdAt | timestamp |                               |

> **Constraint**: At least one of thoughtId/datasetId must be set. Extensible to other entities.

### `tags`

System-level labels. Distinguished by type to control behavior.

| Column    | Type      | Notes                                   |
| --------- | --------- | --------------------------------------- |
| id        | varchar   | PK, nanoid                              |
| brainId   | varchar   | FK → brains                             |
| name      | varchar   | Tag display name                        |
| type      | enum      | `'system'` \| `'dataset'` \| `'user'`   |
| datasetId | varchar?  | FK → datasets (only for type='dataset') |
| createdAt | timestamp |                                         |
| updatedAt | timestamp |                                         |

**Tag Types:**

- `system`: Auto-applied internal tags (hidden from most UIs)
- `dataset`: Represents a dataset (explicitly applied only)
- `user`: User-created custom tags

### `thoughtTags`

Junction table for thought ↔ tag relationships.

| Column    | Type      | Notes         |
| --------- | --------- | ------------- |
| thoughtId | varchar   | FK → thoughts |
| tagId     | varchar   | FK → tags     |
| createdAt | timestamp |               |

### `datasets`

Named labels with schema support. Each dataset has ONE canonical tag.

| Column      | Type      | Notes                                 |
| ----------- | --------- | ------------------------------------- |
| id          | varchar   | PK, nanoid                            |
| brainId     | varchar   | FK → brains                           |
| name        | varchar   | Canonical name                        |
| description | varchar?  | Optional description                  |
| schemaId    | varchar?  | FK → schemas (optional)               |
| tagId       | varchar   | FK → tags (the canonical dataset tag) |
| createdAt   | timestamp |                                       |
| updatedAt   | timestamp |                                       |

> **Note**: Aliases provide alternate names for searching. The dataset's canonical tag is the one tag that links entities to it. Aliases don't create separate tags—they're search aliases only.

### `schemas`

Schema definitions that datasets can adhere to.

| Column    | Type      | Notes       |
| --------- | --------- | ----------- |
| id        | varchar   | PK, nanoid  |
| brainId   | varchar   | FK → brains |
| name      | varchar   | Schema name |
| createdAt | timestamp |             |
| updatedAt | timestamp |             |

### `schemaItems`

Columns within a schema.

| Column       | Type      | Notes                                                                                                            |
| ------------ | --------- | ---------------------------------------------------------------------------------------------------------------- |
| id           | varchar   | PK, nanoid                                                                                                       |
| schemaId     | varchar   | FK → schemas                                                                                                     |
| name         | varchar   | Column name                                                                                                      |
| type         | enum      | `'text'` \| `'number'` \| `'boolean'` \| `'date'` \| `'object'` \| `'collection'` \| `'location'` \| `'contact'` |
| order        | varchar   | Fractional index (lexicographic string) for ordering                                                             |
| required     | boolean   | Whether value is required                                                                                        |
| defaultValue | jsonb?    | Default value (type-appropriate)                                                                                 |
| constraints  | jsonb?    | Future: constraint definitions (min, max, precision, etc.)                                                       |
| createdAt    | timestamp |                                                                                                                  |
| updatedAt    | timestamp |                                                                                                                  |

### `associations`

Artificial relations between entities.

| Column     | Type      | Notes                       |
| ---------- | --------- | --------------------------- |
| id         | varchar   | PK, nanoid                  |
| brainId    | varchar   | FK → brains                 |
| type       | varchar   | Association type identifier |
| sourceType | varchar   | Entity type of source       |
| sourceId   | varchar   | ID of source entity         |
| targetType | varchar   | Entity type of target       |
| targetId   | varchar   | ID of target entity         |
| createdAt  | timestamp |                             |

> **Example**: Data (file) → Thought association. When thought is deleted, associated data should be deleted.

### `data`

Branded files. Always linked to a thought via an association.

| Column     | Type      | Notes                     |
| ---------- | --------- | ------------------------- |
| id         | varchar   | PK, nanoid                |
| brainId    | varchar   | FK → brains               |
| name       | varchar   | File name                 |
| mimeType   | varchar   | MIME type                 |
| size       | integer   | File size in bytes        |
| storageKey | varchar   | Reference to file storage |
| createdAt  | timestamp |                           |
| updatedAt  | timestamp |                           |

### `preferences`

Tag-indexed KV store. No traditional "key" column—identified by unique tag combinations.

| Column    | Type      | Notes                                                             |
| --------- | --------- | ----------------------------------------------------------------- |
| id        | varchar   | PK, nanoid                                                        |
| brainId   | varchar?  | FK → brains (nullable, for brain-level prefs)                     |
| userId    | varchar?  | FK → users (nullable, for user-level prefs)                       |
| thoughtId | varchar?  | FK → thoughts (nullable, for thought-level prefs)                 |
| valueType | enum      | Runtime type: `'string'` \| `'number'` \| `'boolean'` \| `'json'` |
| value     | jsonb     | The preference value                                              |
| createdAt | timestamp |                                                                   |
| updatedAt | timestamp |                                                                   |

### `preferenceTags`

Junction table for preference ↔ tag indexing.

| Column       | Type    | Notes            |
| ------------ | ------- | ---------------- |
| preferenceId | varchar | FK → preferences |
| tagId        | varchar | FK → tags        |

> **Usage**: Instead of `config.overrides.environment`, preferences are found by any combination of their tags. Tags can have aliases for flexible searching (e.g., "Config", "Settings", "Preferences" all find the same preference).

---

## Ordering Strategy: Fractional Indexing

For ordered collections (schemaItems, aliases, etc.), we use **fractional indexing**:

- Order values are lexicographic strings (e.g., `"a"`, `"aV"`, `"b"`)
- Insert between any two items without reordering others
- Simple queries: `ORDER BY order ASC`
- Use `fractional-indexing` npm package

**Why not alternatives?**

- Integer order: Requires shifting all subsequent items on insert
- Linked list (prev/next): Complex recursive queries, fragile references
- Array in parent: Must update entire array for any change

---

## Tag-Based Dataset Architecture

**Problem**: Datasets are "branded tags" with more features, but we need to distinguish them from auto-applied system tags.

**Solution**:

1. Each Dataset has ONE canonical Tag (type='dataset')
2. Aliases are search aliases, NOT separate tags
3. When searching, query both tag names AND alias values
4. Dataset tags are explicitly applied only (never auto-applied)
5. The `type` field on tags prevents confusion with system/user tags

**Search Flow**:

```
User searches "ALTERED" →
  1. Match tag.name = "ALTERED"
  2. Match alias.value = "ALTERED" → get associated datasetId → get dataset.tagId
  3. Return all thoughts with matching tagId
```

---

## Constraint System (Future)

SchemaItem constraints will support Zod-like runtime validation:

- **Numbers**: min, max, precision, integer-only
- **Text**: minLength, maxLength, pattern (regex)
- **Dates**: before, after, relative constraints
- **Collections**: minItems, maxItems, unique

Initially stored as JSON in `schemaItems.constraints`. May evolve to dedicated `dataConstraints` table with per-parameter rows.

---

## Version Control Philosophy

- `validated` timestamp on thoughts indicates "approved" state
- Past versions are stored as complete thought duplicates (including validation state)
- No need to track validation history separately—full thought snapshots suffice
- `archived` flag marks thoughts as no longer relevant but preserved

---

## File Reference

| Path                                     | Purpose                    |
| ---------------------------------------- | -------------------------- |
| `apps/web/src/server/data/schema/`       | Drizzle schema definitions |
| `apps/web/src/server/data/access/`       | Data access layer          |
| `apps/web/src/server/api/`               | oRPC API definitions       |
| `context/generated/data-architecture.md` | This file                  |
