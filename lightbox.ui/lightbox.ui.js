(function($) {

	$.fn.lightboxUi = function(options) {
		// SET DEFAULT OPTIONS
		var defaults = {
                aniDuration: 300,
                padding: 20,
                id: 'lightbox',
                fadeTime: 200
        };
		
		// LOAD OPTIONS
		var o = $.extend(defaults, options);
		var fade = o.fadeTime;
		var aniDuration = o.aniDuration;

		$('body').append('<div style="display: none" id="' + o.id + '"></div>');

		var lbId = $("#" + o.id);
		var imgCount = this.filter("a").size();

		// CENTER ON RESIZE
		$(window).resize(function(){
			var isOpen = lbId.dialog("isOpen");
			if(isOpen === true) {
				lbId.dialog({ position: {my: "center", at: "center"}});


				var width = $(lbId).outerWidth();
				var height = $(lbId).outerHeight();
				
				// diaSize(width,height);
			}
		});		


		// WINDOW SIZE 
		function diaSize(width,height) {
			
			var wWidth = $(window).width();
		    var dWidth = wWidth * 0.9;
		    var wHeight = $(window).height();
		    var dHeight = wHeight * 0.9;
						
		}

		
		lbId.remove();
		lbId.on("dialogopen", function(event, ui) {
			var isOpen = $(lbId).dialog("isOpen");
		});
		// LOAD IMAGE FUNCTION
		function imageLoad(imgId) {
			$('body').append('<div id="lbLoading"></div>');

			var currNum = imgId.split('_');
			var prevId = currNum[1] - 1;
			var nextId = parseInt(currNum[1],10) + 1;
			imgId = '#' + imgId;
			
			// SETTING VARIABLES
			var href = $(imgId).attr('href');
			var title = $(imgId).find('img').attr('title');
			var alt = $(imgId).find('img').attr('alt');
			var id = $(imgId).attr('id');

			if(title === undefined || title === '') {
				title = '';
			}
			if(alt === undefined || alt === '') {
				alt = '';
			}
			
			var caption = '<div id="lbCaption">';
			caption += '<div id="lbTitle"><b>' + title + '</b></div>';
			caption += '<div id="lbAlt">' +  alt + '</div></div>';
			caption += '</div>';
			
			if(prevId !== 0) {
				var prevLink = '<a id="prevLink" href="#"><div class="arrow"><div class="arrowInner"></div></div></a>';
			} else {
				prevLink = '';
			}
			if(nextId <= imgCount) {
				var nextLink = '<a id="nextLink" href="#"><div class="arrow"><div class="arrowInner"></div></div></a>';
			} else {
				nextLink = '';
			}
			
			
			// THROW IN CAPTION and LINKS
			lbId.html(prevLink + nextLink + caption);
					
			// CREATE AND LOAD IMAGE
			var img = new Image();
			$(img).load(function () {
				$(this).hide();
				lbId.prepend(this);
				
				// SETTING VARIABLES
				var w = $(this).outerWidth();
				var h = $(this).outerHeight();
				var lbCaption = $("#lbCaption");				
				lbCaption.css('width', w + 'px').hide();
				var captionH = parseInt(lbCaption.outerHeight());
				
				// CALC PADDINGS
				var paddingTop = parseInt($('.ui-dialog-content').css('padding-top').replace('px',''));
				var paddingRight = parseInt($('.ui-dialog-content').css('padding-right').replace('px',''));
				var paddingBottom = parseInt($('.ui-dialog-content').css('padding-bottom').replace('px',''));
				var paddingLeft = parseInt($('.ui-dialog-content').css('padding-left').replace('px',''));
								
				var width =  paddingLeft + parseInt(w) + paddingRight + 4;
				var height = paddingTop + parseInt(h) + captionH + paddingBottom;
				
				//console.log(paddingTop,h,captionH,paddingBottom,height);
				// diaSize(width,height);
				
				var wWidth = $(window).width();
			    var wHeight = $(window).height();

				var diaWidth = width;
				var diaHeight = height;
				
				var calcW = parseInt(wWidth - diaWidth);
				var calcH = parseInt(wHeight - diaHeight);				

				
				if(diaWidth > wWidth || diaHeight > wHeight) {
					if(calcW > calcH || calcW < calcH) {
						
						if(w > h) {
							var sizeFactor =  parseInt(w) / parseInt(h);
							var diaHeight = wHeight - captionH - paddingTop + paddingBottom;
							var resizeImgH = wHeight - captionH - captionH - paddingTop - paddingBottom;
							var resizeImgW = resizeImgH * sizeFactor;
							$(lbId).find('img').css('width', resizeImgW).css('height', resizeImgH);
							var diaWidth = resizeImgW + o.padding * 2;
							console.log('1 1 1 1 1 1 1 1');
						} else if(h > w) {


							
							var sizeFactor =   parseInt(w) / parseInt(h);
							var resizeImgH = wHeight - captionH - captionH - paddingTop - paddingBottom;
							var resizeImgW = resizeImgH * sizeFactor;

							$(lbCaption).css('width', resizeImgW + 'px');
							var captionH = parseInt(lbCaption.outerHeight());

							var resizeImgH = wHeight - captionH - paddingTop - paddingBottom;
							var resizeImgW = resizeImgH * sizeFactor;
							var diaHeight = resizeImgH + captionH + paddingTop + paddingBottom;

							console.log(captionH);



							$(lbId).find('img').css('width', resizeImgW).css('height', resizeImgH);
							var diaWidth = resizeImgW + o.padding * 2;
							console.log('2 2 2 2 2 2 2 2 2');
						}
						// console.log(calcW,calcH + ' FACTOR ' + sizeFactor);
						
					}
				} else if (diaWidth < wWidth || diaHeight < wHeight) {
					//console.log('bild ' + diaWidth,diaHeight + ' < fenster ' + wWidth,wHeight);
					console.log('bild < fenster');
					console.log(captionH);
				}				
								
				
				$(lbId).parent('.ui-dialog').animate({width: diaWidth, height: diaHeight},{
					duration: aniDuration,
					step: function(){
						lbId.dialog({ position: { my: "center", at: "center" } });
					},
					complete: function(){
						$('#lbLoading').remove();
						lbCaption.css('width', 'auto').fadeIn(fade);
					}
				});
				$(this).delay(aniDuration).fadeIn(fade);

				// CALL PREV/NEXT
				$("#prevLink").on('click', function(e) {
					e.preventDefault();
					var prevImg = currNum[0] + '_' + prevId;
					imageLoad(prevImg);
				});	
				$("#nextLink").on('click', function(e) {
					e.preventDefault();
					var nextImg = currNum[0] + '_' + nextId;
					imageLoad(nextImg);
				});
			}).error(function () {
				
				// HANDLE ERROR WHILE LOADING
				$('#lbLoading').remove();
				lbId.html('Failed!');
			}).attr('src', href);
		}
		
		
		// WORK ON EACH SELECTED ELEMENT
		return this.filter("a").each(function(i) {
			
			// SET ID FOR EACH LINK
			i = ++i;
			var currId = $(this).attr('id');
			$(this).attr('id', currId + '_' + i);
			
			// CLICK HANDLER OPEN LIGHTBOX
			$(this).bind('click', function(e) {
				e.preventDefault();
				imageLoad($(this).attr('id'));
				lbId.dialog({
					dialogClass: 'lightboxId',
					resizable: false,
					position: 'center',
					modal: true,
					minWidth: 80,
					minHeight: 80,
					width: 80
				});
				
				// MAKE OVERLAY CLOSE LIGHTBOX ON CLICK
				$('.ui-widget-overlay').on("click", function() {
					lbId.dialog("close");
					var isOpen = lbId.dialog("isOpen");
				});
			});
		});
	};
}(jQuery));
