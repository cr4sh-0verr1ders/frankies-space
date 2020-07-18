const FB = require("fb").default; 

exports.identify = function identify(token, callback){ 
        let name,id,uri,profile;
        
        FB.setAccessToken(token); // race condition shouldnt be a problem..  
        FB.api(
            "/me",
            {fields: ["id","name"]},
            function(response){
                if(!response || response.error){
                    console.log(!response ? "Error": response.error);
                    return null;
                }
                console.log(response);
                name = response.name; 
                id = response.id;
                uri = `https://graph.facebook.com/${id}/picture`
                //profile = response.link; see - user_link requires app review
                callback({uri:uri, name:name});
            }
        );
        
        //FB.api(
        //    `${id}/picture`,
        //    {},
        //    function(response){
        //        if(!response || response.error){
        //            console.log(!response ? "Error": response.error);
        //        }
        //        console.log(response);
        //        //uri = response.name; 
        //    }
        //);

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
