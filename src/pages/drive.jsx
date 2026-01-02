

export async function loadFromDrive(folderId) {
  const API_KEY = "AIzaSyDZYGx8vG68QNFC1y85z5HfHACjhcJcuAI";
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents
  &key=${API_KEY}
  &fields=files(id,name,mimeType,webViewLink)
  &orderBy=name`; // ⭐ maintains google drive alphabetical order

  const res = await fetch(url);
  const data = await res.json();

  // ⭐ Folders first, then files (like Drive)
  const sorted = [
    ...data.files.filter(f => f.mimeType === "application/vnd.google-apps.folder"),
    ...data.files.filter(f => f.mimeType !== "application/vnd.google-apps.folder")
  ];

  return sorted.map(file => ({
    id: file.id,
    name: file.name,
    isFolder: file.mimeType === "application/vnd.google-apps.folder",
    link: `https://drive.google.com/file/d/${file.id}/view?usp=sharing`
  }));
}

