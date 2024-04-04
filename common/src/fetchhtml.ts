let lastRequestTime = 0;

export const rateLimitFetchHtml = (
  url: string,
  delayMS: number = 1000,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        fetch(url)
          .then((response) => {
            return response.text();
          })
          .then((htmlData) => {
            resolve(htmlData);
          });
        lastRequestTime = Date.now();
      },
      lastRequestTime - Date.now() + delayMS,
    );
  });
};

export const fetchHtml = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        return response.text();
      })
      .then((htmlData) => {
        resolve(htmlData);
      });
  });
};
