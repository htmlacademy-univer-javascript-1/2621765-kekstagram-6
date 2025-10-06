const getStringLength=function(string,length){
  if(string.length<=length){
    return true;
  }else{
    return false;
  }
};


const checkPalindrome=function(string){
  const normalized = string.replaceAll(' ', '').toLowerCase();
  let reversed='';
  for(let i=normalized.length-1;i>=0;i--){
    reversed+= normalized[i];
  }
  return reversed === normalized;
};


const extractNumberFromString=function(input){
  const str = typeof input === 'number' ? input.toString() : input;
  let result='';
  for(let i=0;i<=str.length;i++){
    const symbol=str[i];
    if(symbol>='0'&& symbol<='9'){
      result+=symbol;
    }
  }
  if (result.length===0){
    return NaN;
  }
  return parseInt(result,10);
};


const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};


getStringLength();
checkPalindrome();
extractNumberFromString();

export{getRandomInteger};
