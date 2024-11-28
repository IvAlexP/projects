var slider_img = document.querySelector('.slider-img');
var textBox = document.getElementById("text0");
var steps = ['graf.png', 'graf1.png', 'graf2.png', 'graf3.png', 'graf4.png'];
var i=0;

function prev()
{
	if (i<=0) return;	
	i--;
	return setImg();			 
}

function next()
{
	if (i>=steps.length-1) return;
	i++;
	return setImg();			 
}

function setImg()
{
	return slider_img.setAttribute('src', "img/"+steps[i]);
}

/*SCHIMBARE TEXT*/

function swapClasses(elem, targetClass)
{
	elem.className = targetClass;
}

/*NEXT*/

function toggleTextNext()
{
	switch (textBox.className)
	{
  		case "text0":
		{
			textBox.innerHTML = "<r><b>Pasul 1</r></b><br>Selectăm o muchie de cost minim (în cazul nostru, de cost 1).<br>Există 2 opțiuni: <b>[3, 2]</b> și [3, 5]. O vom selecta pe prima deoarece conține vârful cu numărul de ordine cel mai mic dintre vârfurile necomune care fac parte din cele două muchii.<br>În acest moment, în graful parţial format există <b>n-1</b>=4 subarbori, întrucât am unit subarborii corespunzători extremităţilor muchiei selectate.<br>Subarborii sunt: {1}; {2 , 3}; {4}; {5};";
			swapClasses(textBox, "text1");
			break;
  		}
  		case "text1":
		{
			textBox.innerHTML = "<r><b>Pasul 2</b></r><br>Selectăm din nou o muchie de cost minim (din nou de cost 1).<br>Mai există o singură astfel de muchie neselectată: <b>[3, 5]</b>.<br>În acest moment, în graful parţial format există <b>n-2</b>=3 subarbori, întrucât am unit subarborii corespunzători extremităţilor muchiei selectate.<br>Subarborii sunt: {1}; {2 , 3 , 5}; {4};";
			swapClasses(textBox, "text2");
			break;
  		}
		case "text2":
		{
			textBox.innerHTML = "<r><b>Pasul 3</b></r><br>Selectăm iar o muchie de cost minim (de această dată de cost 2).<br>Există 2 astfel de muchii: <b>[1, 3]</b> și [1, 5]. O vom selecta pe prima deoarece conține vârful cu numărul de ordine cel mai mic dintre vârfurile necomune care fac parte din cele două muchii.<br>În acest moment, în graful parţial format există <b>n-3</b>=2 subarbori, întrucât am unit subarborii corespunzători extremităţilor muchiiilor selectate anterior.<br>Subarborii sunt: {1 , 2 , 3 , 5}; {4};";
			swapClasses(textBox, "text3");
			break;
  		}
		case "text3":
		{
			textBox.innerHTML = "<r><b>Pasul 4</b></r><br>De această dată nu mai putem selecta o muchie de cost minim deoarece, dacă am selecta muchia [1, 5] de cost 2 s-ar obține ciclul {1 , 3 , 5}, iar dacă am selecta [1, 2] de cost 3 s-ar obține ciclul {1 , 2 , 3}. Din această cauză vom selecta următoarea muchie din punctul de vedere al costului și anume <b>[2, 4]</b>, care are costul 4.<br>În acest moment, am obținut un graf fără cicluri cu <b>n-1</b> muchii, deci arborele căutat.";
			swapClasses(textBox, "text4");
			break;
  		}
	}
}

/*PREV*/

function toggleTextPrev()
{
	switch (textBox.className)
	{
	  	case "text1":
		{
			textBox.innerHTML = "Considerăm graful <b>G</b> cu <b>n</b>=5 vârfuri un <span style='color:#F00'>graf neorientat conex</span>, iar costul fiecărei muchii din graf un număr real pozitiv. Definim costul unui arbore parţial drept suma costurilor muchiilor arborelui.<br>Pentru a determina <span style='color:#ff0000'>aborele parțial de cost minim</span>, pornim de la o pădure formată din <b>n</b> subarbori, reprezentați de către vârfurile grafului. Aceștia vor fi uniți succesiv prin muchii, până când se obține un singur arbore.<br>La fiecare pas se selectează o muchie de cost minim care <span style='color:#ff0000'>nu</span> a mai fost selectată şi care <span style='color:#F00'>nu</span> formează cicluri cu muchiile deja selectate.";
			swapClasses(textBox, "text0");
			break;
	  	}
	  	case "text2":
		{
			textBox.innerHTML = "<r><b>Pasul 1</r></b><br>Selectăm o muchie de cost minim (în cazul nostru, de cost 1).<br>Există 2 opțiuni: <b>[3, 2]</b> și [3, 5]. O vom selecta pe prima deoarece conține vârful cu numărul de ordine cel mai mic dintre vârfurile necomune care fac parte din cele două muchii.<br>În acest moment, în graful parţial format există <b>n-1</b>=4 subarbori, întrucât am unit subarborii corespunzători extremităţilor muchiei selectate.<br>Subarborii sunt: {1}; {2 , 3}; {4}; {5};";
			swapClasses(textBox, "text1");
			break;
	  	}
		case "text3":
		{
			textBox.innerHTML = "<r><b>Pasul 2</b></r><br>Selectăm din nou o muchie de cost minim (din nou de cost 1).<br>Mai există o singură astfel de muchie neselectată: <b>[3, 5]</b>.<br>În acest moment, în graful parţial format există <b>n-2</b>=3 subarbori, întrucât am unit subarborii corespunzători extremităţilor muchiei selectate.<br>Subarborii sunt: {1}; {2 , 3 , 5}; {4};";
			swapClasses(textBox, "text2");
			break;
	  	}
		case "text4":
		{
			textBox.innerHTML = "<r><b>Pasul 3</b></r><br>Selectăm iar o muchie de cost minim (de această dată de cost 2).<br>Există 2 astfel de muchii: <b>[1, 3]</b> și [1, 5]. O vom selecta pe prima deoarece conține vârful cu numărul de ordine cel mai mic dintre vârfurile necomune care fac parte din cele două muchii.<br>În acest moment, în graful parţial format există <b>n-3</b>=2 subarbori, întrucât am unit subarborii corespunzători extremităţilor muchiiilor selectate anterior.<br>Subarborii sunt: {1 , 2 , 3 , 5}; {4};";
			swapClasses(textBox, "text3");
			break;
	  	}
	}
}