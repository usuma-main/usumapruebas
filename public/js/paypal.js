const fName = document.getElementById("fName").innerHTML;
const lastName = document.getElementById("lastName").innerHTML;
const email = document.getElementById("email").innerHTML;
const birthday = document.getElementById("birthday").innerHTML;
const cellphone = document.getElementById("cellphone").innerHTML;
const RFC = document.getElementById("RFC").innerHTML;
const postalCode = document.getElementById("postalCode").innerHTML;
const kidId = document.getElementById("kidId").value;
const socialCause = document.getElementById("socialCause").value;
const subscriptionPlan = document.getElementById("subscriptionPlan").value;
const url = '/kidGodParent/'+kidId;


paypal
  .Buttons({
    style: {
      color: "blue",
      layout: "vertical",
      label: "subscribe",
    },
    createSubscription: function (data, actions) {
      return actions.subscription.create({
        plan_id: subscriptionPlan,
      });
    },
    onApprove: function (data, actions) {
      const subscriptionId = data.subscriptionID;
      const details ={
        fName,
        lastName,
        email,
        birthday,
        cellphone,
        RFC,
        subscriptionId,
        postalCode,
        socialCause
      }
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: formBody,
      }).then(response =>{
        window.location.replace("/api/send-email/"+kidId);
      }).catch(err =>{
        window.location.replace("/");
      });
    
    },
  })
  .render("#paypal-button-container");

