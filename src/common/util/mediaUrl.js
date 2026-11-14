export default (uniqueId, filename) =>
  filename && `api/media/${encodeURIComponent(uniqueId)}/${encodeURIComponent(filename)}`;
