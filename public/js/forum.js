var fName=false,
  lastName=false,
  email=false,
  cellphone=false,
  birthday=false,
  RFC = true,
  postalCode = true,
  socialCause = true;

const subscriptionId = document.getElementById("subscriptionId");


//https://api-sepomex.hckdrk.mx/query/search_cp/0981


const inputs = document.querySelectorAll("input[type=text], textarea");

const kidId = document.getElementById("kidId").value;

const kid = document.getElementById("kidId");

const forum = document.getElementById("godParentData");

const submitButton = document.querySelector("input[type=submit]");

const datePicker = document.getElementById("birthday");

const [social, postal] = document.querySelectorAll(".optional");




const patterns = {
  fName: /^[a-zA-ZÀ-ÿ\u00f1\u00d1][a-zA-ZÀ-ÿ\u00f1\u00d1 ]{2,100}$/,
  lastName: /^[a-zA-ZÀ-ÿ\u00f1\u00d1][a-zA-ZÀ-ÿ\u00f1\u00d1 ]{2,100}$/,
  email: /^([a-z\d\._-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/,
  cellphone: /^\d{10}$/,
  RFC: /^$|^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/,
  postalCode: /^[0-9]{5}/,
  socialCause: /^[a-zA-Z0-9]{1,100}/
};

inputs.forEach((input) => {
  input.addEventListener("keyup", (e) => {
    validate(
      e.target,
      patterns[e.target.attributes.name.value],
      e.target.attributes.name.value
    );
  });
});

datePicker.addEventListener("change", (event)=>{
  
  if(event.target.value){
    birthday=true;
  }
});


forum.addEventListener("submit",(e=>{
  
  if(fName && lastName && email && cellphone && RFC && birthday && postalCode && socialCause){
    kid.value=kidId;
  }else{
    e.preventDefault();
  }
}));

function validate(field, regex, name) {
  switch (name) {
    case "fName":
      fName = regex.test(field.value.toLowerCase());
      if(fName){
        field.className = "inputValid";
        
      }else{
        field.className="inputInvalid";
      }
      break;

    case "lastName":
      lastName = regex.test(field.value.toLowerCase());
      if (lastName) {
        field.className = "inputValid";
      } else {
        field.className = "inputInvalid";
      }
      break;

    case "email":
      email = regex.test(field.value.toLowerCase());
      if (email) {
        field.className = "inputValid";
      } else {
        field.className = "inputInvalid";
      }
      break;

    case "cellphone":
      cellphone = regex.test(field.value.toLowerCase());
      if (cellphone) {
        field.className = "inputValid";
      } else {
        field.className = "inputInvalid";
      }
      break;

    case "RFC":
      RFC = regex.test(field.value);
      if (RFC) {
        field.className = "inputValid";
        if(field.value.length>0){
          social.className = "factura";
          postal.className = "factura";
          postalCode=false;
          socialCause=false;
        }else{
          postalCode=true;
          socialCause=true;
          social.firstElementChild.value="";
          postal.firstElementChild.value="";
          social.className = "sinFactura";
          postal.className = "sinFactura";
        }
      } else {
        social.firstElementChild.value="";
        postal.firstElementChild.value="";
        field.className = "inputInvalid";
        social.className = "sinFactura";
        postal.className = "sinFactura";
      }
      break;

    case "postalCode":
      postalCode = regex.test(field.value);
      if(postalCode){
        field.className = "inputValid"
      }else{
        field.className = "inputInvalid"
      }
      break;

    case "socialCause":
      console.log(field.value)
      socialCause = regex.test(field.value);
      if(socialCause){
        field.className = "inputValid"
      }else{
        field.className = "inputInvalid"
      }
      break;

    default:
      break;
  }

}
