# What is a file? (in ofsf)

A file in ofsf is a collection of 14 data points, used by the system to handle the file.

***

#### **1. Type**

Represents the file type, indicated by its extension (e.g., `.osl`, `.icn`, `.txt`).

#### **2. Name**

The name of the file, stored as a string.

in a file called "hello.txt" this would be "hello"

#### **3. Location**

The file's location in the system, expressed as a file path.

Examples of the location might be "origin/(c) users/mist/documents" that describes the file is in the user's documents folder

#### **4. Data**

The main storage field for the file's content:

* For `.osl` scripts, this stores the program data.
* For folders, this is an array of file uuids contained within the folder.
* For other file types, this holds the primary data.

#### 5. null

Currently redundant storage slot, but may be used in the future

#### **6. X**

A flexible field for miscellaneous data associated with the file. Normally used to store the x position of a file in its parent folder (used for things like the position on the desktop)

#### **7. Y**

Another field for additional data, similar to `X`.

#### 8. null

Used to be a unique id, now is unnecessary due to field 14

#### **9. Created**

The timestamp (in Unix format) marking when the file was created.

#### **10. Edited**

The timestamp (in Unix format) indicating the last time the file was edited.

#### **11. Icon**

The icn code that represents the file's icon, used for display purposes.

#### **12. Size**

The size of the file in characters.

For folders this will contain the number of files inside the folder

#### **13. Permissions**

The access permissions required for applications or users to interact with the file.

Example: \["file editor"]

#### **14. UUID**

A system-generated unique identifier for each file. This is managed internally and does not require user interaction.
