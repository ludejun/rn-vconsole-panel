export const jsonParse = (data: any) => {
  let body = null;
  try {
    body = JSON.parse(data);
  } catch (e) {
    body = data;
  }
  return body;
};

export const extractHost = (url: string) => {
  // const host = url.split('//')[1]?.split(':')[0]?.split('/')[0] || undefined;
  const host = url.split('//')[1]?.split('/')[0] || undefined;

  return host;
};

export const fromEntries = (arr: any[]) =>
  arr.reduce((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, {});

export const splitString = (str: string, length: number = 200) => {
  return str.length > length ? `${str.substring(0, length)}...` : str;
};
