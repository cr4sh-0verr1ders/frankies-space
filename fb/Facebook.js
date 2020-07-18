const FB = require("fb").default;
FB.setAccessToken("2693873687550953|9M8I5tk0Rhrj3UgfN7kQyzNTVog");

exports.identify = function identify(token){
  FB.api(
    `/debug_token?input_token=${token}`,
    function(response){
      if(response && !response.error){
        console.log(response);
        return response;
      }
    }
  );
  return null;
}

exports.debug = function debug(){
  FB.api(
    "/me",
    "GET",
    {},
    function(response){
      console.log(response);
    }

  );
}
