// A universal ajax call object which will use our  Custom.Ajax.Net class
var ajaxCall = function() {

  return {
    a : new Custom.Ajax.Net.Request(),
    b : new Custom.Ajax.Net.PageRequests(),
    c : new Custom.Ajax.Net.Connection(),

    // custom callback function to the ajax
    ajaxCallback : function(src) {

      if ( src.ReadyState == 4) {
        if ( src.Status == 200) {
          // replace the body elements with ajax response
          var El = document.getElementsByTagName('body')[0];
          El.innerHTML = src.ResponseText;
        }
      }
    },

    // set the initial properties of our ajax call, these properties can be changed later
    setArgs : function() {

      this.a.Method = "GET";
      this.a.Async = true;
      this.a.Callback = this.ajaxCallback;
      this.b.AddRequest(this.a);
      this.c.PageRequests = this.b;
    }
  }
}


// onClick function which gets the login form using ajax
function getLoginForm() {

  var loginForm = new ajaxCall();
  loginForm.a.URL = "/login";
  loginForm.setArgs();

  // opens up the ajax connection
  loginForm.c.Open();
}


// onClick function which gets the signup form using ajax
function getSignupForm() {

  var signupForm = new ajaxCall();
  signupForm.a.URL = "/signup";
  signupForm.setArgs();

  // opens up the ajax connection
  signupForm.c.Open();
}

// onClick function which gets the profile of the user, if validated, using ajax
function loginProfile() {

  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var login = new ajaxCall();
  login.a.URL = "/login";
  login.setArgs();

  // set the ajax method to POST
  login.a.Method = "POST";

  // set the post data to ajax request
  login.a.AddParam("email", email);
  login.a.AddParam("password", password);
  // opens up the ajax connection
  return login.c.Open();
}

// onClick function which gets the profile of the user, after signing up the user through ajax
function signUp() {

  var fname = document.getElementById('fname').value;
  var lname = document.getElementById('lname').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var cpassword = document.getElementById('cpassword').value;
  var login = new ajaxCall();
  login.a.URL = "/signup";
  login.setArgs();

  // set the ajax method to POST
  login.a.Method = "POST";

  // set the post data to ajax request
  login.a.AddParam("fname", fname);
  login.a.AddParam("lname", lname);
  login.a.AddParam("email", email);
  login.a.AddParam("password", password);
  login.a.AddParam("cpassword", cpassword);
  // opens up the ajax connection
  return login.c.Open();
}

// onClick function to get to the homepage using ajax
function gethome() {

  var home = new ajaxCall();
  home.a.URL = "/home";
  home.setArgs();
  // opens up the ajax connection
  home.c.Open();
}

// onClick function to log out and end the session of the user using ajax
function logOut() {

  var logoutUser = new ajaxCall();
  logoutUser.a.URL = "/logout";
  logoutUser.setArgs();

  // opens up the ajax connection
  logoutUser.c.Open();
}