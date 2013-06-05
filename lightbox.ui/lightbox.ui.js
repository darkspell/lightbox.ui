(function($) {

	$.fn.samBox = function(options) {
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
				}
		});
		
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
				var prevLink = '<a id="prevLink" href="#"></a>';
			} else {
				prevLink = '';
			}
			if(nextId <= imgCount) {
				var nextLink = '<a id="nextLink" href="#"></a>';
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
				var captionH = lbCaption.outerHeight();
				
				// CALC PADDINGS
				var paddingTop = $('.ui-dialog-content').css('padding-top').replace('px','');
				var paddingRight = $('.ui-dialog-content').css('padding-right').replace('px','');
				var paddingBottom = $('.ui-dialog-content').css('padding-bottom').replace('px','');
				var paddingLeft = $('.ui-dialog-content').css('padding-left').replace('px','');
				
				var width = Math.round(paddingLeft/100) + w + Math.round(paddingRight/100) + 27;
				var height = Math.round(paddingTop/100) + h + captionH + Math.round(paddingBottom/100) + 13;
				
				$(lbId).parent('.ui-dialog').animate({width: width, height: height},{
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

// Usage example:
$(".lightbox").samBox();