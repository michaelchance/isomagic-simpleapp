IsoMagic-simpleapp
==================

IsoMagic extension that adds simple app capabilities

uses IsoMagic-template to translate a templateid, from `res.templateid` with data from `res.data`, and apply it to
the app 'body', specified by the config `bodySelector` option

This extension requires [IsoMagic-template](https://github.com/michaelchance/isomagic-template).  For details on template file structure, see that repository.

Sample Config file:

```javascript
{
	"extensions" : [
		{
			"id":"simpleapp",
			"require":"isomagic-simpleapp",
			"filePath":"node_modules/isomagic-simpleapp/simpleapp.js"
			//optional parameter bodySelector described below.
		},
		{
			"id":"template",
			"require":"isomagic-template",
			"filePath":"node_modules/isomagic-template/template.js",
			"templateFiles":["myTemplates.html"]
		}
	], 
	"routes" : [
		{"middleware" : ["simpleapp#checkpage"]},
		{
			"method":"get",
			"route":"/", 
			"middleware" : [
				{"type":"simpleapp#usetemplate", "templateid":"homeTemplate"}
			]
		},
		{
			"method":"get",
			"route":"/foo", 
			"middleware" : [
				{"type":"simpleapp#usetemplate", "templateid":"fooTemplate"}
			]
		},
		{"middleware" : ["simpleapp#showpage"]}
	]
}
```


Config
------

* `bodySelector` (String) default: "body"
	a jQuery selector for where the translated template will be applied if `"simpleapp#showpage"` is called

Middleware
----------

* `checkpage` - checks the "body" for the current page against req.originalUrl.  If we're already there, halts the middleware chain
* [builder] `usetemplate` 
	* `templateid`: a templateid to be stored in `res.templateid`
* [builder] `setdata`
	* `data`: some data object to be attached to `res.data`
* `showpage` - translates `res.templateid` with `res.data` using IsoMagic-template, and puts the content into the "body" specified by bodySelector

TLC Formats
-----------

none included
