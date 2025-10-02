let getStringLength=function(string,length){
  if(string.length<=length){
    return true;
  }else{
    return false;
  }
};




let checkPalindrome=function(string){
  let normalized = string.replaceAll(' ', '').toLowerCase();
  let reversed='';
  for(let i=normalized.length-1;i>=0;i--){
     reversed+= normalized[i];
  }
  return reversed === normalized;
};


let extractNumberFromString=function(input){
  let str = typeof input === 'number' ? input.toString() : input;
  let result='';
  for(let i=0;i<=str.length;i++){
    let symbol=str[i];
    if(symbol>='0'&& symbol<='9'){
      result+=symbol;
    }
  }
  if (result.length===0){
    return NaN;
  }
  return parseInt(result,10);
};










