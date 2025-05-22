export function handleSubmit320p(videoId) {
  window.location.href = `http://localhost:8000/download-320kb/${videoId}`;
}

export function handleSubmit256p(videoId) {
  window.location.href = `http://localhost:8000/download-256kb/${videoId}`;
}

export function handleSubmit128p(videoId) {
  window.location.href = `http://localhost:8000/download-128kb/${videoId}`;
}

export function handleSubmit64p(videoId) {
  window.location.href = `http://localhost:8000/download-64kb/${videoId}`;
}
