var slider_img = document.querySelector('.slider-img');
var textBox = document.getElementById("text0");
var img = ['exp1.png', 'exp2.png'];
var i=0;

/*SCHIMBARE IMAGINI*/

function prev()
{
	if (i<=0) return;	
	i--;
	return setImg();			 
}

function next()
{
	if (i>=img.length-1) return;
	i++;
	return setImg();			 
}

function setImg()
{
	return slider_img.setAttribute('src', "img/"+img[i]);
}

/*SCHIMBARE TEXT*/

function swapClasses(elem, targetClass)
{
	elem.className = targetClass;
}

function toggleTextNext()
{
	switch (textBox.className)
	{
  		case "text0":
		{
			textBox.innerHTML = "<r><b>Ideea 1</b></r>: Pentru a extrage costul minim, sortăm muchiile crescător după costul acestora, urmând să le parcurgem secvențial.<br><r><b>Ideea 2</b></r>: Pentru a realiza sortarea, vom reprezenta graful prin lista muchiilor (vector cu <b>m</b> elemente, fiecare element fiind o structură în care reținem cele două extremități ale muchiei și costul acesteia).<br><r><b>Ideea 3</b></r>: Pentru ca muchia <b>[x, y]</b> să nu formeze cicluri cu muchiile deja selectate, este necesar ca vârful <b>x</b> și vârful <b>y</b> să se afle în componente conexe diferite. Deci, trebuie să ținem permanent evidența componentelor conexe care se formează.";
			swapClasses(textBox, "text1");
			break;
  		}
	}
}

function toggleTextPrev()
{
	switch (textBox.className)
	{
	  	case "text1":
		{
			textBox.innerHTML = "În implementarea algoritmului intervin două probleme: <br>- extragerea muchiei de cost minim; <br>- felul în care testam dacă muchia selectată formează sau nu cicluri cu celelalte muchii deja selectate;";
			swapClasses(textBox, "text0");
			break;
	  	}
	}
}