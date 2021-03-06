i19n
====

Provides i18n (internationalization) support as a RequireJS plugin.

**Like the i18n plugin - but one better ;)**

###Why not just use the RequireJS i18n plugin?###

http://requirejs.org/docs/api.html#i18n

The i18n plugin forces you to structure your locale bundles a specific way. This works ok in some circumstances 
but if you want to have a resource file per view or use nested folders to structure your application, then creating 'nls/<locale> folders
everywhere you want to have locale bundles can be hard to maintain.

This plugin aims to provide similar functionality but allowing you to place your locale specific files 
anywhere you want. 

You are not restricted to placing files in a specified directory structure.

**Example File Structure**

![alt text](https://raw.github.com/benpriebe/i19n/master/locale-bundles.png "Example File Structure")

###Getting Started###

First you need to create your master (or fallback) bundle module.

Let's call this file: ```viewmodels/login.strings.js```

The contents of that file could look something like this:

```javascript
  define(
    { 
        root: { 
          "username": "username", 
          "password": "password",
        } 
    }
  );
``` 

An object literal with a property of **root** defines this module. That is all you have to do to set
the stage for later localization work. You can then use the above module in another module, 
say, in the ```viewmodels/login.js``` file:

```javascript
define(["i19n!viewmodels/login.strings"], function(i19n) {
    return {
        loginLabel : i19n.username
    }
});
```
The ```viewmodels/login``` module has one property called ```loginLabel``` that uses ```i19n.username``` property to show 
the localized value for the label - username. 

Adding a specific translation (e.g. for the en-AU locale) is a simple two step process.
First, you need to tell your master/fallback file about the supported locale using the supportedLocales property:

```javascript
  define(
    { 
        root: { 
          "username": "username", 
          "password": "password",
        },
        supportedLocales : ["en-AU"] // must be lowercase
    }
  );
``` 

The ```supportedLocales``` property tells the i19n plugin that a file called ```viewmodels/login.strings.en-AU.js```
exists with localized strings and needs to be loaded.

Second, you need to create your localized string module. These are defined slightly differently from the 
```master/fallback``` files as they do not need the ```root``` wrapper and ```supportedLocales``` properties.

The contents of the ```viewmodels/login.strings.en-AU.js``` file should override **some** or **all** strings that have a localized value.

```javascript
define(
    { 
      "username": "no, not your drug name", 
      "password": "put your secret squirrel here",
    }
  );
```


RequireJS will use the browser's navigator.language or navigator.userLanguage property to determine what 
locale values to use for ```viewmodels/login.strings```, so your app does not have to change. 

**However** this mechanism doesn't work reliably across browsers. It is a much better practice to set the 
locale specifically. 

You can use the module config to pass the locale to the plugin:

```javascript 
requirejs.config({
    config: {
        //Set the config for the i18n
        //module ID
        i19n: {
            locale: 'en-AU'
        }
    }
});
```

**NOTE:** of course you would want to set this locale value based on the browsers settings; to do this reliably
you need to pull out the ```Accept-Language``` request header from a server call.

In ASP.NET you could do something like this in a .cshtml file:

```javascript
 <script type="text/javascript">
   window.locale = "@(HttpContext.Current.Request.Headers["Accept-Language"].Split(',')[0].ToLower())";
   
   requirejs.config({
     config: {
        i19n: {
            locale: window.locale
        }
     }
   });
 </script>
```


The i19n plugin allows you to build out localized string bundles with more specific *locale* strings replacing 
less specific strings.

For example, given the following login.strings locale bundles:

```javascript

// eg. viewmodels/login.strings.js

define(
    root: { 
      "username": "username", 
      "password": "password",
      "forgotPassword" "I forgot my password"
    },
    supportedLocales : ["en", "en-AU"]
  );
  
// eg. viewmodels/login.strings.en.js  

define(
    {
      "username": "en - username", 
    }
 );
  
// eg. viewmodels/login.strings.en-AU.js

define(
    {
      "password": "en-AU - password",
    }
 );

```

When a module loads in the ```viewmodel/login.strings``` i19n module with a browser locale of 'en-AU':

e.g.

```javascript
define(["i19n!viewmodels/login.strings"], function(i19n) {
    return {
        i19n : i19n;
    }
});
```

The contents of the i19n object will be:

```javascript
{
  "username": "en - username", 
  "password": "en-AU - password",
  "forgotPassword" "I forgot my password"
}
```


###Debugging Your Localized Strings###

When you code in your native language and run the web app in the same language you can't be 100% sure
that the string resources you see on screen are from an i19n bundle or just hard-coded in the code.

Wouldn't it be great if you could visually see all the localized strings in your app?

Simply override the i19n config locale setting to equal 'debug' to surround all localized strings with underscores.

```javascript
requirejs.config({
    config: {
        //Set the config for the i18n
        //module ID
        i19n: {
            locale: 'debug'
        }
    }
});
```

So a localized string value of 'This is some localized string' becomes '_This is some localized string_'.

Now when you run your app you will easily be able to identify strings that are not localized.


###Written By###

- Ben Priebe
- Gerrod Thomas



