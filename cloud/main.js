
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});


Parse.Cloud.afterSave("Message", function(request) {
  var messageText = request.object.get('text');
  var usersReceived = request.object.get('receiverId');
  var sender = request.object.get('senderName');
  var pushQuery = new Parse.Query(Parse.Installation);
  var alertMsg = "You have a new message from " + senderName;
  pushQuery.equalTo('user', usersReceived);
  Parse.Push.send({
    where: pushQuery, // Set our Installation query
    data: {
      title: "New message",
      alert: alertMsg
    }
  }, { useMasterKey: true}).then(() => {
      // Push was successful
      console.log('Push sent succecesfully');
  }, (e) => {
      console.log(e);
  });
});

Parse.Cloud.define("SendPush", function(request, response) {
  var query = new Parse.Query(Parse.Installation);
  var {user, message} = request.params;
  query.equalTo("user",user);
  console.log ("sending push to " + user);
  console.log (message);
  // here you can add other conditions e.g. to send a push to sepcific users or channel etc.

  var payload = {
    alert: message,
    title: "New message in Find It"
  };


  Parse.Push.send({
     channels: [ request.params.user ],
      data: payload
    }, {
      useMasterKey: true
    })
    .then(function() {
      response.success("Push Sent!");
    }, function(error) {
      response.error("Error while trying to send push " + error.message);
    });
});
