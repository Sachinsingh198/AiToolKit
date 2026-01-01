export function checkHeading(str) {
  if (!str) return false;
  return /^\s*\*\*.+?\*\*\s*$/.test(str);
}



export function replaceHeadingStars(str) {
  return str
    .replace(/^\s*\*\*/, "")   // remove starting **
    .replace(/\*\*\s*$/, "")   // remove ending **
    .trim();
}

