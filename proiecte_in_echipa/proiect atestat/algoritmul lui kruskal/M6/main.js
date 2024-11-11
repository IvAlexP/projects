var box = document.getElementById("box");
var variabile = document.getElementById("box_variabile");
var i=-1;

variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 0 <br> a[] = {} <br> cc[] = {} <br> <br> <br> <br> <br>";

function prev()
{
	if (i==-1) {i=-1; return;}
	i--;
	pasi();	
}

function next()
{
	i++;
	if (i==77) return;
	pasi();
}

function pasi()
{
	if (i==-1)
	{
		box.style.marginTop = 0 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 0 <br> a[] = {} <br> cc[] = {} <br> <br> <br> <br> <br>";
	}
	
	/*while(0<4)*/
	
	else if (i==0)
	{
		box.style.marginTop = 77 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 0 <br> a[] = {} <br> cc[] = {1, 2, 3, 4, 5} <br> i = 1 <br> j =  <br> nrsel = <r>0</r> <br> cx = <br> cy ="
	}
	
	else if (i==1)
	{
		box.style.marginTop = 140 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {<r>2</r>, 3, 1, 1, 1, 2} <br> G[].y = {<r>3</r>, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 0 <br> a[] = {} <br> cc[] = {1, <r>2</r>, <r>3</r>, 4, 5} <br> i = <r>1</r> <br> j =  <br> nrsel = 0 <br> cx = <br> cy =";
	}
	
	else if (i==2)
	{
		box.style.marginTop = 172 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {<r>1</r>, 1, 2, 2, 3, 4} <br> cmin = <r>1</r> <br> a[]={<r>1</r>} <br> cc[] = {1, 2, 3, 4, 5} <br> i = <r>1</r> <br> j =  <br> nrsel = <r>1</r> <br> cx = <br> cy =";
	}
	
	else if (i==3)
	{
		box.style.marginTop = 204 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {<r>2</r>, 3, 1, 1, 1, 2} <br> G[].y = {<r>3</r>, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[]={1} <br> cc[] = {<r>1</r>, <r>2</r>, 3, 4, 5} <br> i = <r>1</r> <br> j =  <br> nrsel = 1 <br> cx = <r>1</r> <br> cy = <r>2</r>";
	}
	
	else if (i==4)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[]={1} <br> cc[] = {1, 2, 3, 4, 5} <br> i = 1 <br> j = <r>1</r> <br> nrsel = 1 <br> cx = 1 <br> cy = 2";
	}
	
	else if (i==5)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[]={1} <br> cc[] = {<r>1</r>, 2, 3, 4, 5} <br> i = 1 <br> j = <r>1</r> <br> nrsel = 1 <br> cx = 1 <br> cy = <r>2</r>";
	}
	
	else if (i==6)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[]={1} <br> cc[] = {1, 2, 3, 4, 5} <br> i = 1 <br> j = <r>2</r> <br> nrsel = 1 <br> cx = 1 <br> cy = 2";
	}
	
	else if (i==7)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[]={1} <br> cc[] = {1, <r>2</r>, 3, 4, 5} <br> i = 1 <br> j = <r>2</r> <br> nrsel = 1 <br> cx = 1 <br> cy = <r>2</r>";
	}
	
	else if (i==8)
	{
		box.style.marginTop = 251 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[]={1} <br> cc[] = {1, <r>1</r>, 3, 4, 5} <br> i = 1 <br> j = <r>2</r> <br> nrsel = 1 <br> cx = <r>1</r> <br> cy = 2";
	}
	
	else if (i==9)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[]={1} <br> cc[] = {1, 1, 3, 4, 5} <br> i = 1 <br> j = <r>3</r> <br> nrsel = 1 <br> cx = 1 <br> cy = 2";
	}
	
	else if (i==10)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[]={1} <br> cc[] = {1, 1, <r>3</r>, 4, 5} <br> i = 1 <br> j = <r>3</r> <br> nrsel = 1 <br> cx = 1 <br> cy = <r>2</r>";
	}
	
	else if (i==11)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[]={1} <br> cc[] = {1, 1, 3, 4, 5} <br> i = 1 <br> j = <r>4</r> <br> nrsel = 1 <br> cx = 1 <br> cy = 2";
	}
	
	else if (i==12)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[]={1} <br> cc[] = {1, 1, 3, <r>4</r>, 5} <br> i = 1 <br> j = <r>4</r> <br> nrsel = 1 <br> cx = 1 <br> cy = <r>2</r>";
	}
	
	else if (i==13)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[]={1} <br> cc[] = {1, 1, 3, 4, 5} <br> i = 1 <br> j = <r>5</r> <br> nrsel = 1 <br> cx = 1 <br> cy = 2";
	}
	
	else if (i==14)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[]={1} <br> cc[] = {1, 1, 3, 4, <r>5</r>} <br> i = 1 <br> j = <r>5</r> <br> nrsel = 1 <br> cx = 1 <br> cy = <r>2</r>";
	}
	
	else if (i==15)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[]={1} <br> cc[] = {1, 1, 3, 4, 5} <br> i = 1 <br> j = <r>6</r> <br> nrsel = 1 <br> cx = 1 <br> cy = 2";
		}
	
	else if (i==16)
	{
		box.style.marginTop = 282 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[]={1} <br> cc[] = {1, 1, 3, 4, 5} <br> i = <r>2</r> <br> j = 6 <br> nrsel = 1 <br> cx = 1 <br> cy = 2";
	}
	
	/*while(1<4)*/
	
	else if (i==17)
	{
		box.style.marginTop = 77 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[] = {1} <br> cc[] = {1, 1, 3, 4, 5} <br> i = 2 <br> j = 6 <br> nrsel = <r>1</r> <br> cx = <br> cy =";
	}
	
	else if (i==18)
	{
		box.style.marginTop = 140 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, <r>3</r>, 1, 1, 1, 2} <br> G[].y = {3, <r>5</r>, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 1 <br> a[]={1} <br> cc[] = {1, 1, <r>3</r>, 4, <r>5</r>} <br> i = <r>2</r> <br> j = 6 <br> nrsel = 1 <br> cx = 1 <br> cy = 2";
	}
	
	else if (i==19)
	{
		box.style.marginTop = 172 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, <r>1</r>, 2, 2, 3, 4} <br> cmin = <r>2</r> <br> a[]={1, 2} <br> cc[] = {1, 1, <r>3</r>, 4, <r>5</r>} <br> i = <r>2</r> <br> j = 6 <br> nrsel = <r>2</r> <br> cx = 1 <br> cy = 2";}
	
	else if (i==20)
	{
		box.style.marginTop = 204 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, <r>3</r>, 1, 1, 1, 2} <br> G[].y = {3, <r>5</r>, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {1, 1, <r>3</r>, 4, <r>5</r>} <br> i = <r>2</r> <br> j = 6 <br> nrsel = 2 <br> cx = <r>3</r> <br> cy = <r>5</r>";
	}
	
	else if (i==21)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {1, 1, 3, 4, 5} <br> i = 2 <br> j = <r>1</r> <br> nrsel = 2 <br> cx = 3 <br> cy = 5";
	}
	
	else if (i==22)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {<r>1</r>, 1, 3, 4, 5} <br> i = 2 <br> j = <r>1</r> <br> nrsel = 2 <br> cx = 3 <br> cy = <r>5</r>";
	}
	
	else if (i==23)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {1, 1, 3, 4, 5} <br> i = 2 <br> j = <r>2</r> <br> nrsel = 2 <br> cx = 3 <br> cy = 5";
	}
	
	else if (i==24)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {1, <r>1</r>, 3, 4, 5} <br> i = 2 <br> j = <r>1</r> <br> nrsel = 2 <br> cx = 3 <br> cy = <r>5</r>";
	}
	
	else if (i==25)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {1, 1, 3, 4, 5} <br> i = 2 <br> j = <r>3</r> <br> nrsel = 2 <br> cx = 3 <br> cy = 5";
	}
	
	else if (i==26)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {1, 1, <r>3</r>, 4, 5} <br> i = 2 <br> j = <r>3</r> <br> nrsel = 2 <br> cx = 3 <br> cy = <r>5</r>";
	}
	
	else if (i==27)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {1, 1, 3, 4, 5} <br> i = 2 <br> j = <r>4</r> <br> nrsel = 2 <br> cx = 3 <br> cy = 5";
	}
	
	else if (i==28)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {1, 1, 3, <r>4</r>, 5} <br> i = 2 <br> j = <r>4</r> <br> nrsel = 2 <br> cx = 3 <br> cy = <r>5</r>";
	}
	
	else if (i==29)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {1, 1, 3, 4, 5} <br> i = 2 <br> j = <r>5</r> <br> nrsel = 2 <br> cx = 3 <br> cy = 5";
	}
	
	else if (i==30)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {1, 1, 3, 4, <r>5</r>} <br> i = 2 <br> j = <r>5</r> <br> nrsel = 2 <br> cx = 3 <br> cy = <r>5</r>";
	}
	
	else if (i==31)
	{
		box.style.marginTop = 251 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {1, 1, 3, 4, <r>3</r>} <br> i = 2 <br> j = <r>5</r> <br> nrsel = 2 <br> cx = <r>3</r> <br> cy = 5";
	}
	
	else if (i==32)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {1, 1, 3, 4, 3} <br> i = 2 <br> j = <r>6</r> <br> nrsel = 2 <br> cx = 3 <br> cy = 5";
	}
	
	else if (i==33)
	{
		box.style.marginTop = 282 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {1, 1, 3, 4, 3} <br> i = <r>3</r> <br> j = 6 <br> nrsel = 2 <br> cx = 3 <br> cy = 5";
	}
	
	/*while(2<4)*/
	
	else if (i==34)
	{
		box.style.marginTop = 77 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {1, 1, 3, 4, 3} <br> i = 3 <br> j = 6 <br> nrsel = <r>2</r> <br> cx = 3 <br> cy = 5";
	}
	
	else if (i==35)
	{
		box.style.marginTop = 140 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, <r>1</r>, 1, 1, 2} <br> G[].y = {3, 5, <r>3</r>, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 2 <br> a[]={1, 2} <br> cc[] = {<r>1</r>, 1, <r>3</r>, 4, 3} <br> i = <r>3</r> <br> j = 6 <br> nrsel = 2 <br> cx = 3 <br> cy = 5";
	}
	
	else if (i==36)
	{
		box.style.marginTop = 172 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, <r>2</r>, 2, 3, 4} <br> cmin = <r>4</r> <br> a[]={1, 2, <r>3</r>} <br> cc[] = {1, 1, 3, 4, 3} <br> i = <r>3</r> <br> j = 6 <br> nrsel = <r>3</r> <br> cx = 3 <br> cy = 5";}
	
	else if (i==37)
	{
		box.style.marginTop = 204 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, <r>1</r>, 1, 1, 2} <br> G[].y = {3, 5, <r>3</r>, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {<r>1</r>, 1, <r>3</r>, 4, 3} <br> i = <r>3</r> <br> j = 6 <br> nrsel = 3 <br> cx = <r>1</r> <br> cy = <r>3</r>";
	}
	
	else if (i==38)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, 3, 4, 3} <br> i = 3 <br> j = <r>1</r> <br> nrsel = 3 <br> cx = 1 <br> cy = 3";
	}
	
	else if (i==39)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {<r>1</r>, 1, 3, 4, 3} <br> i = 3 <br> j = <r>1</r> <br> nrsel = 3 <br> cx = 1 <br> cy = <r>3</r>";
	}
	
	else if (i==40)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, 3, 4, 3} <br> i = 3 <br> j = <r>2</r> <br> nrsel = 3 <br> cx = 1 <br> cy = 3";
	}
	
	else if (i==41)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, <r>1</r>, 3, 4, 3} <br> i = 3 <br> j = <r>2</r> <br> nrsel = 3 <br> cx = 1 <br> cy = <r>3</r>";
	}
	
	else if (i==42)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, 3, 4, 3} <br> i = 3 <br> j = <r>3</r> <br> nrsel = 3 <br> cx = 1 <br> cy = 3";
	}
	
	else if (i==43)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, <r>3</r>, 4, 3} <br> i = 3 <br> j = <r>3</r> <br> nrsel = 3 <br> cx = 1 <br> cy = <r>3</r>";
	}
	
	else if (i==44)
	{
		box.style.marginTop = 251 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, <r>1</r>, 4, 3} <br> i = 3 <br> j = <r>3</r> <br> nrsel = 3 <br> cx = <r>1</r> <br> cy = 3";
	}
	
	else if (i==45)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, 1, 4, 3} <br> i = 3 <br> j = <r>4</r> <br> nrsel = 3 <br> cx = 1 <br> cy = 3";
	}
	
	else if (i==46)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, 1, <r>4</r>, 3} <br> i = 3 <br> j = <r>4</r> <br> nrsel = 3 <br> cx = 1 <br> cy = <r>3</r>";
	}
	
	else if (i==47)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, 1, 4, 3} <br> i = 3 <br> j = <r>5</r> <br> nrsel = 3 <br> cx = 1 <br> cy = 3";
	}
	
	else if (i==48)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, 1, 4, <r>3</r>} <br> i = 3 <br> j = <r>5</r> <br> nrsel = 3 <br> cx = 1 <br> cy = <r>3</r>";
	}
	
	else if (i==49)
	{
		box.style.marginTop = 251 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, 1, 4, <r>1</r>} <br> i = 3 <br> j = <r>5</r> <br> nrsel = 3 <br> cx = <r>1</r> <br> cy = 3";
	}
	
	else if (i==50)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, 1, 4, 1} <br> i = 3 <br> j = <r>6</r> <br> nrsel = 3 <br> cx = 1 <br> cy = 3";
	}
	
	else if (i==51)
	{
		box.style.marginTop = 282 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, 1, 4, 1} <br> i = <r>4</r> <br> j = 6 <br> nrsel = 3 <br> cx = 1 <br> cy = 3";
	}
	
	/*while(3<4)*/
	
	else if (i==52)
	{
		box.style.marginTop = 77 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, 1, 4, 1} <br> i = 4 <br> j = 6 <br> nrsel = <r>3</r> <br> cx = 1 <br> cy = 3";
	}
	
	else if (i==53)
	{
		box.style.marginTop = 140 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, <r>1</r>, 1, 2} <br> G[].y = {3, 5, 3, <r>5</r>, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {<r>1</r>, 1, 1, 4, <r>1</r>} <br> i = <r>4</r> <br> j = 6 <br> nrsel = 3 <br> cx = 1 <br> cy = 3";
	}
	
	else if (i==54)
	{
		box.style.marginTop = 282 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, 1, 4, 1} <br> i = <r>5</r> <br> j = 6 <br> nrsel = 3 <br> cx = 1 <br> cy = 3";
	}
	
	else if (i==55)
	{
		box.style.marginTop = 77 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, 1, 4, 1} <br> i = 5 <br> j = 6 <br> nrsel = <r>3</r> <br> cx = 1 <br> cy = 3";
	}
	
	else if (i==56)
	{
		box.style.marginTop = 140 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, <r>1</r>, 2} <br> G[].y = {3, 5, 3, 5, <r>2</r>, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {<r>1</r>, <r>1</r>, 1, 4, 1} <br> i = <r>5</r> <br> j = 6 <br> nrsel = 3 <br> cx = 1 <br> cy = 3";
	}
	
	else if (i==57)
	{
		box.style.marginTop = 282 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, 1, 4, 1} <br> i = <r>6</r> <br> j = 6 <br> nrsel = 3 <br> cx = 1 <br> cy = 3";
	}
	
	else if (i==58)
	{
		box.style.marginTop = 77 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, 1, 1, 4, 1} <br> i = 6 <br> j = 6 <br> nrsel = <r>3</r> <br> cx = 1 <br> cy = 3";
	}
	
	else if (i==59)
	{
		box.style.marginTop = 140 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, <r>2</r>} <br> G[].y = {3, 5, 3, 5, 2, <r>4</r>} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 4 <br> a[]={1, 2, 3} <br> cc[] = {1, <r>1</r>, 1, <r>4</r>, 1} <br> i = <r>6</r> <br> j = 6 <br> nrsel = 3 <br> cx = 1 <br> cy = 3";
	}
	
	else if (i==60)
	{
		box.style.marginTop = 172 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, <r>4</r>} <br> cmin = 8 <br> a[]={1, 2, 3, <r>6</r>} <br> cc[] = {1, 1, 1, 4, 1} <br> i = <r>6</r> <br> j = 6 <br> nrsel = <r>4</r> <br> cx = 1 <br> cy = 3";}
	
	else if (i==61)
	{
		box.style.marginTop = 204 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, <r>2</r>} <br> G[].y = {3, 5, 3, 5, 2, <r>4</r>} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 8 <br> a[]={1, 2, 3, 6} <br> cc[] = {1, <r>1</r>, 1, <r>4</r>, 1} <br> i = <r>6</r> <br> j = 6 <br> nrsel = 4 <br> cx = <r>1</r> <br> cy = <r>4</r>";
	}
	
	else if (i==62)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 8 <br> a[]={1, 2, 3, 6} <br> cc[] = {1, 1, 1, 4, 1} <br> i = 6 <br> j = <r>1</r> <br> nrsel = 4 <br> cx = 1 <br> cy = 4";
	}
	
	else if (i==63)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 8 <br> a[]={1, 2, 3, 6} <br> cc[] = {<r>1</r>, 1, 1, 4, 1} <br> i = 6 <br> j = <r>1</r> <br> nrsel = 4 <br> cx = 1 <br> cy = <r>4</r>";
	}
	
	else if (i==64)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 8 <br> a[]={1, 2, 3, 6} <br> cc[] = {1, 1, 1, 4, 1} <br> i = 6 <br> j = <r>2</r> <br> nrsel = 4 <br> cx = 1 <br> cy = 4";
	}
	
	else if (i==65)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 8 <br> a[]={1, 2, 3, 6} <br> cc[] = {1, <r>1</r>, 1, 4, 1} <br> i = 6 <br> j = <r>2</r> <br> nrsel = 4 <br> cx = 1 <br> cy = <r>4</r>";
	}
	
	else if (i==66)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 8 <br> a[]={1, 2, 3, 6} <br> cc[] = {1, 1, 1, 4, 1} <br> i = 6 <br> j = <r>3</r> <br> nrsel = 4 <br> cx = 1 <br> cy = 4";
	}
	
	else if (i==67)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 8 <br> a[]={1, 2, 3, 6} <br> cc[] = {1, 1, <r>1</r>, 4, 1} <br> i = 6 <br> j = <r>3</r> <br> nrsel = 4 <br> cx = 1 <br> cy = <r>4</r>";
	}
	
	else if (i==68)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 8 <br> a[]={1, 2, 3, 6} <br> cc[] = {1, 1, 1, 4, 1} <br> i = 6 <br> j = <r>4</r> <br> nrsel = 4 <br> cx = 1 <br> cy = 4";
	}
	
	else if (i==69)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 8 <br> a[]={1, 2, 3, 6} <br> cc[] = {1, 1, 1, <r>4</r>, 1} <br> i = 6 <br> j = <r>3</r> <br> nrsel = 4 <br> cx = 1 <br> cy = <r>4</r>";
	}
	
	else if (i==70)
	{
		box.style.marginTop = 251 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 8 <br> a[]={1, 2, 3, 6} <br> cc[] = {1, 1, 1, <r>1</r>, 1} <br> i = 6 <br> j = <r>4</r> <br> nrsel = 4 <br> cx = 1 <br> cy = <r>4</r>";
	}
	
	else if (i==71)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 8 <br> a[]={1, 2, 3, 6} <br> cc[] = {1, 1, 1, 1, 1} <br> i = 6 <br> j = <r>5</r> <br> nrsel = 4 <br> cx = 1 <br> cy = 4";
	}
	
	else if (i==72)
	{
		box.style.marginTop = 235 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 8 <br> a[]={1, 2, 3, 6} <br> cc[] = {1, 1, 1, 1, <r>1</r>} <br> i = 6 <br> j = <r>5</r> <br> nrsel = 4 <br> cx = 1 <br> cy = <r>4</r>";
	}
	
	else if (i==73)
	{
		box.style.marginTop = 219 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 8 <br> a[]={1, 2, 3, 6} <br> cc[] = {1, 1, 1, 1, 1} <br> i = 6 <br> j = <r>6</r> <br> nrsel = 4 <br> cx = 1 <br> cy = 4";
	}
	
	else if (i==74)
	{
		box.style.marginTop = 282 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 8 <br> a[]={1, 2, 3, 6} <br> cc[] = {1, 1, 1, 1, 1} <br> i = <r>7</r> <br> j = <r>6</r> <br> nrsel = 4 <br> cx = 1 <br> cy = 4";
	}
	
	/*while(4<4)*/
	
	else if (i==75)
	{
		box.style.marginTop = 77 + "px";
		variabile.innerHTML = "n = <r>5</r> <br> G[].x = {2, 3, 1, 1, 1, 2} <br> G[].y = {3, 5, 3, 5, 2, 4} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = 8 <br> a[]={1, 2, 3, 6} <br> cc[] = {1, 1, 1, 1, 1} <br> i = 7 <br> j = 6 <br> nrsel = <r>4</r> <br> cx = 1 <br> cy = 4";
	}
	
	else if (i==76)
	{
		box.style.marginTop = 315 + "px";
		variabile.innerHTML = "n = 5 <br> G[].x = {<r>2</r>, <r>3</r>, <r>1</r>, 1, 1, <r>2</r>} <br> G[].y = {<r>3</r>, <r>5</r>, <r>3</r>, 5, 2, <r>4</r>} <br> G[].c = {1, 1, 2, 2, 3, 4} <br> cmin = <r>8</r> <br> a[]={1, 2, 3, 6} <br> cc[] = {1, 1, 1, 1, 1} <br> i = 7 <br> j = 6 <br> nrsel = <r>4</r> <br> cx = 1 <br> cy = 4";
	}
}