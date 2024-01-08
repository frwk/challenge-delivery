function updateOptions(options: RequestInit, credentials: boolean = true) {
  const update = { ...options };
  update.credentials = 'include';
  return update;
}

export default function fetcher(url: string, options: RequestInit = {}) {
  return fetch(url, updateOptions(options));
}
