(function(window) {
    document._write = document.write;

    var registr = {
        scriptcont:/<script.*?\/script>/gi,
        jsurl:/src\s*=\s*[\'\"]\s*http[s]*:\/\/.*\.js/gi,
        scripttags:/<[\/]*script[^>]*>/gi
    };
    var workmedcont = function workmedcont(medcont,target,clickUrl,cturl) {
        medcont = medcont.replace(/[\r\n\t]/g,"");
        var scripts = medcont.match(registr.scriptcont,"") || [],
            nodes = [];
        medcont = medcont.replace(/&#rn;/g,"\r\n");
        medcont = medcont.replace(/&#n;/g,"\n");
        medcont = medcont.replace(registr.scriptcont,"");   

        for( iter=0;iter<scripts.length;iter++ ) {

            var script = scripts[iter],
                opentag = script.match(/^<[^>]+/)[0],
                attributes = opentag.match(/[a-zA-Z]+\s*=\s*[\'\"][^\'\"]+/gi),
                pass = {};
            script = script.replace(/<\!--.*?\*\//,"");
            script = script.replace(/\/\*.*?\/-->/,"");
            if( attributes ) {
                var set = [];
                for( _iter=0;_iter<attributes.length;_iter++ ) {
                    var set = attributes[_iter].replace(/[\'\"\s]/g,'')
                                              .split("=");
                    var attr_name = set.shift();
                    var attr_val = set.join("=");
                    pass[attr_name] = attr_val;
                }
            }
            nodes[nodes.length] = [document.createElement("script"),false];
            
            for( var attr in pass ) {
                nodes[nodes.length-1][0][attr] = pass[attr];
            }

            if( !pass["src"] ) {
                script = script.replace(registr.scripttags,"");
                nodes[nodes.length] = [script,true];
            }
        }

        target.innerHTML = target.innerHTML + "<div onclick=\"javascript:openURL('"+clickUrl+"', '"+cturl+"');\">"+ medcont + "</div>";

        for( iter=0;iter<nodes.length;iter++ ) {
            if( nodes[iter][1] ) {
                try {
                    window.eval(nodes[iter][0]);
                } 
                catch(e) {}
            } else {
                target.appendChild(nodes[iter][0]);
            }
        }
    }

    var create = function() {
        var adcount = 0;

        return function(madservevariables, adContainer) {
            if (typeof kik === "undefined") return;

            adcount++;
            var id = 'global_ad_id' + adcount;
            
            if( !madservevariables.s ) return;

            var src = madservevariables.requesturl;
            if( typeof madservevariables.service !== "undefined" ) {
                src = madservevariables.service;
            }

            var cgi = ['p=' + escape(document.location),
                       'random=' + Math.random(),
                       'rt=javascript',
                       'v=js_10',
                       'jsvar=' + id,
                       'u=' + navigator.userAgent];

            for( var setting in madservevariables ) {
                var cgivar = setting + '=' + escape(madservevariables[setting]);
                cgi[cgi.length] = cgivar;
            }
            src += "?" + cgi.join('&');

            var adNode = document.createElement("div");
            adNode.setAttribute("id", id);
            adContainer.appendChild(adNode);

            var container = adNode,
                varscall = document.createElement("script");

            if( madservevariables.backfillhtml ) {
                container.innerHTML = "<div id= 'm_dcontent" 
                                    + id + "' "
                                    + "style='display:none'>"
                                    + madservevariables.backfillhtml
                                    + "</div>";
            }

            var varsloaded = function() {

                var ads = window[id];

                for( iter=0;iter<ads.length;++iter ) {

                    var ad = ads[iter];
                    if( !madservevariables.target ) {
                        madservevariables.target = '';
                    }

                    if( ad.error ) {
                        if( madservevariables.backfillhtml && madservevariables.reveal ) {
                            container.innerHTML = ad.error;
                        }
                        continue;  
                    }

                    if( ad.img ) {
                        var width = (madservevariables.img_width ? madservevariables.img_width: ''),
                            height = (madservevariables.img_height ? madservevariables.img_height: ''),
                            tag = "<a href='" 
                                + ad.url 
                                + "' target='" + madservevariables.target + "'>"
                                + "<img src='" + ad.img + "'"; 

                        if( madservevariables.img_width ) {
                            tag += " width='" + width + "'";
                        }         
                        if( madservevariables.img_height ) {
                            tag += " height='" + height + "'";
                        }         

                        tag += "/></a>"; 

                        container.innerHTML = tag;
                    } else if( ad.content ) {
                        container.innerHTML = '';
                        workmedcont(ad.content,container,ad.url, ad.click_url);
                    } else {
                        var tag = "<a href='" + ad.url + "' "
                                + "target='" + madservevariables.target + "'>"
                                + ad.text
                                + "</a>";

                        container.innerHTML = tag;
                    }

                    var track = new Image();
                    track.src = ad.track;
                }

                if( dcont = document.getElementById("m_dcontent" + id) ) {
                    dcont.style.display = "block";
                }

                if( madservevariables.prependclickcontent ) {
                    var links = container.getElementsByTagName("a");
                    for( iter=0;iter<links.length;++iter ) {
                        var link = links[iter],
                            original = link.href;
                        link.href = madservevariables.prependclickcontent + original;
                    }
                }
             
                if( madservevariables.trackingpixelurl ) {
                    var cachebust = Math.random(),
                        join = (madservevariables.trackingpixelurl.indexOf('?') ? '&' : '?'),
                        img = new Image();

                    img.src = madservevariables.trackingpixelurl + join + cachebust; 
                }
                delete this;
            };

            varscall.onload = varsloaded;
            varscall.src = src;
            
            kik.ready(function(){
                document.getElementById(id).appendChild(varscall);
            });

            delete this;
        };
    };
    if( !window.RequestAd_ ) {
        window.RequestAd_ = create(); 
    }
})(window);

function openURL(url, cturl) {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET",url,true);
    xmlHttp.send(null);
    kik.open(cturl);
}