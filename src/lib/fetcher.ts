function updateOptions(options: RequestInit) {
  const update = { ...options };
  update.credentials = 'include';
  return update;
}

export default function fetcher(url: string, options: RequestInit = {}) {
  return fetch(url, updateOptions(options));
}
