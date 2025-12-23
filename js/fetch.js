const Urls = {
  GET:'https://29.javascript.htmlacademy.pro/kekstagram/data',
  POST:'https://29.javascript.htmlacademy.pro/kekstagram',
};


const sendRequest = (onSuccess,onError,method,body)=>{
  fetch(
    Urls[method],
    {
      method:method,
      body:body,
    }
  )
    .then((response) => response.json())
    .then((data) => onSuccess(data))
    .catch((err) => onError(err));
};

const loadData = (onSuccess,onError,method='GET') => sendRequest(onSuccess,onError,method);

const uploadData = (onSuccess,onError,method='POST',body) => sendRequest(onSuccess,onError,method, body);

export{ loadData,uploadData };


