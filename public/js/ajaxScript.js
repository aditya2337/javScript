var Namespace = {

  Register : function( _Name) {
    var o = window;
    var x = false;
    for (var a = _Name.split("."); a.length > 0;) {
      var s = a.shift();
      if ( a.length == 0) { if ( o[s]) { x = true ;} }
      if ( !o[s]) { o[s] = {};}
      o = o[s];
    }

    if ( x) { return 1;}
  }
}

// Create NameSpace
Namespace.Register("Custom.Ajax.Net");

// methods object
Custom.Ajax.Net.RequestMethod = { Get:"GET", Post:"POST" };

// Page Requests in a collection
Custom.Ajax.Net.PageRequests = function() {
  return {
    Requests : null,

    // Get type of objects
    GetType : function() { return "Custom.Ajax.Net.PageRequests"; },

    // Initializer
    Init : function() {
      this.Requests = new Array();
      if ( arguments[0].length == 1) {
        this.Requests.push( arguments[0][0]);
      }
      return this;
    },

    // add requests to the collection
    AddRequest : function() {
      if ( arguments.length == 0 || arguments[0].GetType() != "Custom.Ajax.Net.Request") {
        return;
      }
      this.Requests.push( arguments[0]);
    }
  }.Init(arguments);
}

// Single Page requests

Custom.Ajax.Net.Request = function() {
  return {
    Method : null,
    URL : null,
    Params : null,
    Callback : null,
    Async : false,
    UserObject : null,

    // Get the type of object
    GetType : function(){ return "Custom.Ajax.Net.Request"; },

    // Initializer
    Init : function() {
      switch( arguments[0].length) {

        case 1 : this.Method = arguments[0][0]; 
        break;
        case 2 : this.Method = arguments[0][0]; 
        this.URL = arguments[0][1]; 
        break;
        case 3 : this.Method = arguments[0][0]; 
        this.URL = arguments[0][1]; 
        this.Callback = arguments[0][2]; 
        break;
        case 4 : this.Method = arguments[0][0]; 
        this.URL = arguments[0][1]; 
        this.Callback = arguments[0][2]; 
        this.Async = arguments[0][3]; 
        break;
        case 5 : this.Method = arguments[0][0]; 
        this.URL = arguments[0][1]; 
        this.Callback = arguments[0][2]; 
        this.Async = arguments[0][3]; 
        this.UserObject = arguments[0][4]; 
        break;
      }

      this.Params = new Array();
      return this; 
    },

    // add parameters to collection
    AddParam : function() {
      switch( arguments.length) {
        case 1 : this.Params.push(arguments[0]); break;
        case 2 : this.Params.push( new Custom.Ajax.Net.Parameter(arguments[0], arguments[1]));
        break;
      }
    }
  }.Init( arguments);
}

// page requests parameter object
Custom.Ajax.Net.Parameter = function() {
  return {
    Name : null,
    Value : null,

    // Get the type of object
    GetType : function(){ return "Custom.Ajax.Net.Parameter"; },

    // Initializer
    Init : function() {
      if(arguments[0].length==2){ 
        this.Name = arguments[0][0]; 
        this.Value = arguments[0][1]; 
      }
      return this;
    }
  }.Init( arguments);
}
// for knowing the type of Active X object
Custom.Ajax.Net.ActiveObject = 0;

// for handling ajax connection
Custom.Ajax.Net.Connection = function() {
  return {

    ActiveXObject : null,
    PageRequests : null,
    Current : null,

    // Get the type of object    
    GetType : function(){ return "Custom.Ajax.Net.Connection"; },

    // Initializer
    Init : function() {
      if(arguments[0].length==1){ this.PageRequests = arguments[0][0]; }
      return this;
    },

    // creates active X object for use
    Create : function() {
      switch(Custom.Ajax.Net.ActiveObject) {
        case 0:
        if(window.ActiveXObject)
        {
          try 
          { 
            Custom.Ajax.Net.ActiveObject = 2;
            return new ActiveXObject("Msxml2.XMLHTTP");        
          } 
          catch(e) 
          {  
            Custom.Ajax.Net.ActiveObject = 3;
            return new ActiveXObject("Microsoft.XMLHTTP");
          }
        }
        else
        {
          if(window.XMLHttpRequest)
          {
            Custom.Ajax.Net.ActiveObject = 1;
            return new XMLHttpRequest();
          }
        }
        
        case 1: return new XMLHttpRequest();           
        case 2: return new ActiveXObject("Msxml2.XMLHTTP");           
        case 3: return new ActiveXObject("Microsoft.XMLHTTP");
        default: break;
      }

      // no ajax object found
      Custom.Ajax.Net.ActiveObject = -1;
      throw "Missing a required ajax object.";
      return false;
    },

    Open : function() {
      //Check if page requests has something
      if(this.PageRequests==null){ return; }

      //Create Variables
      var obj = this;
      var Data = "";
      
      //Create ActiveX
      this.ActiveXObject = this.Create();
      
      //Get Request
      this.Current = this.PageRequests.Requests.shift();
      // console.log(Current);
      //Open Connection
      this.ActiveXObject.open(this.Current.Method, this.Current.URL, this.Current.Async);
      
      //Create ActiveX Callback
      this.ActiveXObject.onreadystatechange = function() 
      { obj.OnReadyStateChange(); }

      // open ajax
      if(this.Current.Method=="POST")
      {
        this.ActiveXObject.setRequestHeader("Content-type", 
         "application/x-www-form-urlencoded");

        if(this.Current.Params!=null && this.Current.Params.length!=0)
        {
          for(var Param in this.Current.Params) 
          {
            Data += (Data=="") ? this.Current.Params[Param].Name +
                 "=" + this.Current.Params[Param].Value : "&" +
                 this.Current.Params[Param].Name + "=" +
                 this.Current.Params[Param].Value;
          }
        }
        this.ActiveXObject.send(encodeURI(Data));
      }
      else
      {
        this.ActiveXObject.send(null);
      }
    },

    // ActiveXObject callback
    OnReadyStateChange : function() {

      // get ajax objects for return
      var r = {};
      r.ReadyState = this.ActiveXObject.readyState;
      r.ResponseText = (this.ActiveXObject.readyState==4)? this.ActiveXObject.responseText:null;
      r.Status = (this.ActiveXObject.readyState==4)? this.ActiveXObject.status:null;
      r.URL = this.Current.URL;
      r.UserObject = this.Current.UserObject;
      r.Complete = (this.ActiveXObject.readyState==4 && this.PageRequests.Requests.length==0) ? true : false;

      // call callback
      if(this.Current.Callback != null){this.Current.Callback(r);}

      // loop for many urls
      if(this.ActiveXObject.readyState==4)
      { 
        if(r.Complete) { 
          this.PageRequests=null; 
          this.ActiveXObject.abort();
          this.Current=null; 
        }
        else { this.Open();}
      }
    }
  }.Init( arguments);
}

