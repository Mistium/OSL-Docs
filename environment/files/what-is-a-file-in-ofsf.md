# What is a file? (in ofsf)

### Overview

An **OFSF file record** is a fixed-length collection of **14 ordered fields** describing either a file or a folder. Records are positional (index-based), not keyed.

Unless otherwise stated, all fields are required to exist by position, even if unused.

***

### Field Layout

<table><thead><tr><th width="108.79052734375">#</th><th width="137.4766845703125">Name</th><th>Description</th></tr></thead><tbody><tr><td>1</td><td><strong>Type</strong></td><td>File type identifier. For regular files, this is the file extension (e.g. <code>.txt</code>, <code>.osl</code>, <code>.icn</code>). <strong>Folders MUST use the literal <code>.folder</code>.</strong></td></tr><tr><td>2</td><td><strong>Name</strong></td><td>File name <strong>without extension</strong>, stored as a string. Example: <code>"hello"</code> for <code>hello.txt</code>.</td></tr><tr><td>3</td><td><strong>Location</strong></td><td>Full path of the parent directory, expressed as a string. Example: <code>origin/(c) users/mist/documents</code>.</td></tr><tr><td>4</td><td><strong>Data</strong></td><td>Primary payload. <strong>Meaning depends on whether the record is a file or a folder</strong> (see below).</td></tr><tr><td>5</td><td><strong>Padding A</strong></td><td>Reserved / padding field. May contain <strong>any value</strong> (commonly <code>0</code> or <code>""</code>). Consumers MUST ignore it.</td></tr><tr><td>6</td><td><strong>X</strong></td><td>Auxiliary numeric or scalar field. Typically used for X position in a parent container (e.g. desktop layout).</td></tr><tr><td>7</td><td><strong>Y</strong></td><td>Auxiliary numeric or scalar field, similar to X (e.g. Y position).</td></tr><tr><td>8</td><td><strong>Padding B</strong></td><td>Reserved / padding field. May contain <strong>any value</strong> (commonly <code>0</code> or <code>""</code>). Consumers MUST ignore it.</td></tr><tr><td>9</td><td><strong>Created</strong></td><td>Creation timestamp <strong>in Unix milliseconds</strong>.</td></tr><tr><td>10</td><td><strong>Edited</strong></td><td>Last-edited timestamp <strong>in Unix milliseconds</strong>.</td></tr><tr><td>11</td><td><strong>Icon</strong></td><td>ICN code representing the file's icon.</td></tr><tr><td>12</td><td><strong>Size</strong></td><td>Size metric. For files: character count. For folders: number of contained items.</td></tr><tr><td>13</td><td><strong>Permissions</strong></td><td>JSON-encoded array of permission strings.</td></tr><tr><td>14</td><td><strong>UUID</strong></td><td>System-generated unique identifier. Primary identifier for the record.</td></tr></tbody></table>

### Field 4: Data (Disambiguation)

#### Files

For **all non-folder items**, field 4 stores the file’s primary content.

* No semantic meaning is derived from file type here

Data is a string

#### Folders

For `.folder` items, field 4 represents the folder’s contents.

Allowed encodings:

```js
["uuid1", "uuid2", "uuid3"]
```

or JSON-string-encoded:

```js
"[\"uuid1\", \"uuid2\", \"uuid3\"]"
```

Consumers MUST accept **both representations**.

***

### Permissions Encoding (Field 13)

Permissions are stored as a **JSON-encoded array of strings**:

```js
["file editor", "read"]
```

or encoded as a string:

```js
"[\"file editor\", \"read\"]"
```

Filesystem consumers MUST decode before interpretation.

***

### Padding Fields (5 & 8)

Fields **5** and **8** are padding / legacy fields.

* They **do not need to be `null`**
* Any value is valid
* Implementations MUST NOT rely on their contents

***

### Timestamp Semantics

Fields **9 (Created)** and **10 (Edited)** are:

* Unix timestamps
* **Milliseconds**, not seconds

***

### Notes for Implementers

* OFSF is **positional**, not schema-keyed
* Consumers should be permissive in decoding (stringified JSON vs native arrays)
* UUID (field 14) is the **only authoritative identifier**
* Folderness is determined **solely** by field 1 being `.folder`

