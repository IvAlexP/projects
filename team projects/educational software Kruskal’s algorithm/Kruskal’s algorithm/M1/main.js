var slider_img = document.querySelector('.slider-img');
var img = ['plan_birou.jpg', 'plan_birou_min.jpg'];
var i=0;

function next()
{
	if (i>=img.length-1) i=-1;
	i++;
	return setImg();			 
}

function setImg()
{
	return slider_img.setAttribute('src', "img/"+img[i]);
}