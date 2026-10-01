/* ECMAScript/JavaScript/JScript Header Copyright 2002 Cloanto Corporation */

var hover_path = "../images/";
hover_src_a = new Array("right", "close");
var exit_Val;
hover_image_a = new Array();
hover_preload = false;
function hover_preload_f()
{
	if (document.images)
	{
		for (i in hover_src_a)
		{
			hover_image_a[2*i] = new Image();
			hover_image_a[2*i].src = hover_path + hover_src_a[i] + ".gif";
		}
		for (i in hover_src_a)
		{
			hover_image_a[2*i+1] = new Image();
			hover_image_a[2*i+1].src = hover_path + hover_src_a[i] + "-hi.gif";
		}
		hover_preload = true;
	}
}

function mouseover_f(name, id)
{
	if (hover_preload)
	{
		for (i in hover_src_a)
		{
			if (hover_src_a[i] == name)
			{
				document.images[name+"-"+id].src = hover_image_a[2*i+1].src;
				break;
			}
		}
	}
}

function mouseout_f(name, id)
{
	if (hover_preload)
	{
		for (i in hover_src_a)
		{
			if (hover_src_a[i] == name)
			{
				document.images[name+"-"+id].src = hover_image_a[2*i+0].src;
				break;
			}
		}
	}
}

var menubox_version = 0;
if (window.external) if (window.external.menuboxversion) menubox_version = window.external.menuboxversion;

function menubox_close()
{
 if (menubox_version >= 200) window.external.close();
 else window.close();
}

function menubox_execute(file, parameters, directory, verb, show, absolutepath, wait)
{
 if (menubox_version >= 200) {
    exit_val = window.external.execute(file, parameters, directory, verb, show, absolutepath, wait);
 }
 else if (window.location) if (window.location.href) window.location.href = file;
 
}

function menubox_install( nextPage, installer )
{
  
   menubox_execute( installer );
   //window.location.href = nextPage;

//window.open('InstallPost5.html','newwindow',config='left=0,top=0,height=400,width=540,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no');
 menubox_close();
}