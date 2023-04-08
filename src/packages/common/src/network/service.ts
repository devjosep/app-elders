const checkService = (CHECK_URL: string) =>
  fetch(CHECK_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });

export { checkService };
