function trimSpaces(str) {
  let retStr = str;
  if (retStr[0] === " ") {
    retStr = retStr.slice(1, retStr.length - 1)
  }
  if (retStr[retStr.length - 1] === " ") {
    retStr = retStr.slice(retStr.length - 2)
  }
  return retStr;
}

export default trimSpaces
