exports.parseParam = function parseParam(param) {
  if(param === '') param = '*'
  else if(!param) return []
  return param.split(/,/g)
}
