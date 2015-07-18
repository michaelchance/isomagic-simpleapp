/******************************************************************************
 * @module isomagic-simpleapp
 *
 * IsoMagic extension that adds simple app capabilities
 * 		
 * @param {string} bodySelector a jQuery selector for the element to add body content to.  Defaults to 'body'
 * 
 * tlc:
 *		none added.
 * 
 * middleware:
 *		checkpage - checks the current page that the app is on, and if it is identical to the req.originalUrl, halts the middleware chain, otherwise, proceeds.
 *		[builder] usetemplate - {"templateid":"sometemplate"} attaches this templateid to the res
 *		[builder] setdata - {"data":{...}} attaches this data object to the res
 *		showpage - if the res has an attached templateid (data object optional), renders that template using the data into the bodySelector on the page, and sets res.handled to true
 *
 *****************************************************************************/

(function(){
	var extname = "simpleapp";
	
	var extension = function(_app, config){
		var selector = config.bodySelector || 'body'
		var templates = {};
		var r = {
			tlc : {
				}
			middleware : {
				showpage : function(req,res,next){
					// console.log('showpage');
					res.data = res.data || {};
					var $view;
					var viewhtml = '<div class="active" data-app-uri="'+req.originalUrl+'" data-tlc="bind $var \'.\'; template#translate --templateid=\''+res.templateid+'\' --data=$var; apply --append;"></div>';
					if(_app.server()){
						var cheerio = require('cheerio');
						$view = cheerio.load(viewhtml);
						}
					else{
						$view = $(viewhtml);
						}
					res.data.session = req.session;
					res.tlc.run($view, res.data);
					res.$view = $view;
					res.$(selector).empty().append(_app.server() ? $view.html() : $view);
					res.$('[data-app-uri] > div', $view).attr('data-templateid',res.templateid);
					// console.log('setting handled true');
					req.handled = true;
					next();
					},
				checkpage : function(req,res,next){
					// console.log('checkpage');
					if(!_app.server()){
						var $currentPage = $(selector+' [data-app-uri]');	
						// console.log($currentPage);
						if($currentPage.length && $currentPage.attr('data-app-uri') == req.originalUrl){
							//stop execution by not calling next
							}
						else {
							next();
							}
						}
					else {
						next();
						}
					}
				}
			middlewareBuilders : {
				setdata : function(opts){
					return function(req,res,next){
						res.data = opts.data;
						next();
						};
					},
				template : function(opts){
					var mwkey = ''
					if(opts.templateid){
						mwkey = "template_"+opts.templateid;
						if(!mwcache[mwkey]){
							mwcache[mwkey] = function(t){
								return function(req,res,next){
									console.log('template '+t);
									res.templateid = t; 
									next();}
								}(opts.templateid)
							}
						}
					return mwcache[mwkey] || null;
					}
				}
			}
		var mwcache = {};
		return r;
		}
	// Only Node.JS has a process variable that is of [[Class]] process 
	var isNode = false;
	try {isNode = Object.prototype.toString.call(global.process) === '[object process]';} catch(e) {}
	if(isNode){	root = {};}
	else {root = window;}
	
	if(isNode){
		module.exports = extension;
		}
	else {
		window[extname] = extension;
		}
	
	})()