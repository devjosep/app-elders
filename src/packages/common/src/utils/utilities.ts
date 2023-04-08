const arrayToObject = <T extends string | number, R extends boolean>(
  array: T[],
  setValues: R
) => {
  return array.reduce(
    (accumulator, item) => ({ ...accumulator, [item]: setValues }),
    {}
  );
};

const uriToBlob = (uri: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new Error('uriToBlob failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};

export { arrayToObject, uriToBlob };
