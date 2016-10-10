var ajaxCall = function() {
  return {
    a : new Custom.Ajax.Net.Request(),
    b : new Custom.Ajax.Net.PageRequests(),
    c : new Custom.Ajax.Net.Connection(),
    button : null,

    ajaxCallback : function(src) {
      if ( src.ReadyState == 4) {
        if ( src.Status == 200) {
          var El = document.getElementsByTagName('body')[0];
          El.innerHTML = src.ResponseText;
        }
      }
    },

    setArgs : function() {
      this.a.Method = "GET";
      this.a.Async = true;
      this.a.Callback = this.ajaxCallback;
      this.b.AddRequest(this.a);
      this.c.PageRequests = this.b;
    }
  }
}

function getLoginForm() {
  var loginForm = new ajaxCall();
  loginForm.a.URL = "/login";
  loginForm.setArgs();
  loginForm.c.Open();
}


function getSignupForm() {
  var signupForm = new ajaxCall();
  signupForm.a.URL = "/signup";
  signupForm.setArgs();

  signupForm.c.Open();
}

function loginProfile() {
  var email = document.getElementById('email');
  var password = document.getElementById('password');
  var login = new ajaxCall();
  login.a.URL = "/login";
  login.setArgs();
  login.a.Method = "POST";
  login.a.AddParam("email", email.value);
  login.a.AddParam("password", password.value);
  return login.c.Open();
}

function signUp() {
  var email = document.getElementById('email');
  var password = document.getElementById('password');
  var login = new ajaxCall();
  login.a.URL = "/signup";
  login.setArgs();
  login.a.Method = "POST";
  login.a.AddParam("email", email.value);
  login.a.AddParam("password", password.value);
  return login.c.Open();
}

function gethome() {
  var home = new ajaxCall();
  home.a.URL = "/";
  home.setArgs();
  home.c.Open();
}

function logOut() {
  var logoutUser = new ajaxCall();
  logoutUser.a.URL = "/logout";
  logoutUser.setArgs();

  logoutUser.c.Open();
}