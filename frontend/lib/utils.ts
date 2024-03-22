export const deepURIDecode = (URI: string) => {
  let URICopy: string = URI;
  while (decodeURIComponent(URICopy) !== URICopy) {
    URICopy = decodeURIComponent(URICopy);
  }
  return URICopy;
};
