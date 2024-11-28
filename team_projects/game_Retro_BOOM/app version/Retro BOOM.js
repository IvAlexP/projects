new p5();

function preload() {
  PlayerShip = loadImage('/Multimedia/Assets/PlayerShip.png');
  GameLogo = loadImage('/Multimedia/Assets/GameLogo.jpg');
  UserInterface = loadImage('/Multimedia/Assets/UserInterface.png');
  Ul1 = loadImage('/Multimedia/Assets/UI1.png');
  Ul2 = loadImage('/Multimedia/Assets/UI2.png');
  instructiuni = loadImage('/Multimedia/Assets/instructiuni.png');
  clickInstructiuni = loadImage('/Multimedia/Assets/clickinstructiuni.png');
  GameBackground = loadImage('/Multimedia/Assets/GameBackground.jpg');
  MenuBackground = loadImage('/Multimedia/Assets/MenuBackground.jpg');
  Text1 = loadImage('/Multimedia/Assets/Text1.png');
  Text2 = loadImage('/Multimedia/Assets/Text2.png');
  Text3 = loadImage('/Multimedia/Assets/Text3.png');
  Text4 = loadImage('/Multimedia/Assets/Text4.png');
  ButonInainte = loadImage('/Multimedia/Assets/ButonInainte.png');
  ButonInainteNull = loadImage('/Multimedia/Assets/ButonInainteNull.png');
  ButonSaIncepem = loadImage('/Multimedia/Assets/ButonSaIncepem.png');
  ButonSaIncepemNull = loadImage('/Multimedia/Assets/ButonSaIncepemNull.png');
  Nava = loadImage('/Multimedia/Assets/PlayerShip.png');
  Proiectil = loadImage('/Multimedia/Assets/Proiectil.png');
  Inima = loadImage('/Multimedia/Assets/Heart.png');
  fundal_joc = loadImage('/Multimedia/Assets/Background Game.png');
  inamic1 = loadImage('/Multimedia/Assets/Inamic Nivel 1.png');
  inamic2 = loadImage('/Multimedia/Assets/Inamic Nivel 2.png');
  inamic3 = loadImage('/Multimedia/Assets/Inamic Nivel 3.png');
  nivel_1 = loadImage('/Multimedia/Assets/nivel_1_.png');
  nivel_2 = loadImage('/Multimedia/Assets/nivel_2_.png');
  nivel_3 = loadImage('/Multimedia/Assets/nivel_3_.png');
  background_music = new Audio('/Multimedia/Sounds/Background_music.mp3');
  buton = new Audio('/Multimedia/Sounds/buton.mp3');
  castig_muzica = new Audio('/Multimedia/Sounds//muzica_castig.mp3');
  game_over = new Audio('/Multimedia/Sounds/GameOverSound.mp3');
  castig = loadImage('/Multimedia/Assets/youwin.png');
  scor = loadImage('/Multimedia/Assets/scor.png');
  pierdut = loadImage('/Multimedia/Assets/gameover.png');
  restart = loadImage('/Multimedia/Assets/restart0.png');
  restartAP = loadImage('/Multimedia/Assets/restart1.png');
  paginaPrincipala = loadImage('/Multimedia/Assets/pagina principala0.png');
  paginaPrincipalaAP = loadImage('/Multimedia/Assets/pagina principala1.png');
  ScorFont = loadFont('/Multimedia/Font/Boxy-Bold.ttf');
}

var value;
var pagina;
var x;


function setup(){
  var w = 1300;
  var h = 650;
  createCanvas(w, h);
  background(MenuBackground);
}


draw = function(){

  background_music.play();
  background(MenuBackground);
  drawStartPage();
  
  //daca apasa pe INSTRUCTIUNI
    if (value === 2) drawInstructiuni();
  //daca apasa pe INAPOI
    if (value === 3) drawStartPage();
  //daca apasa pe START
    if (value === 4) drawPovestePagina1();
  //daca apasa pe URMATORUL - prima oara
    if (value === 5) drawPovestePagina2();
  //daca apasa pe URMATORUL - a doua oara
    if (value === 6) drawPovestePagina3();
  //daca apasa pe URMATORUL - a treia oara
    if (value === 7) drawPovestePagina4();  
  //daca apasa pe SA INCEPEM
    if (value == 8) drawGame();
  //daca AI CASTIGAT
    if (value == 9) drawCastig();
  //daca AI PIERDUT
    if (value == 10) drawPierdut();
}

function mousePressed() {
  
  //daca apasa pe INSTRUCTIUNI
    if (mouseX > 259 && mouseX < 1042 && mouseY > 522 && mouseY < 634 && pagina == 1) {value = 2; buton.play();}
  //daca apasa pe INAPOI
    if (mouseX > 800 && mouseX < 1050 && mouseY > 579 && mouseY < 639 && pagina == 2) {value = 3; buton.play();}
  //daca apasa pe START
    if (mouseX > 448 && mouseX < 853  && mouseY > 395 && mouseY < 505 && pagina == 1) {value = 4; buton.play();}
  //daca apasa pe URMATORUL
    if (mouseX > 607 && mouseX < 989 && mouseY > 249 && mouseY < 339) {
      //prima oara
        if (pagina == 3) {value = 5; buton.play();}
      //a doua oara
        if (pagina == 4) {value = 6; buton.play();}
      //a treia oara
        if (pagina == 5) {value = 7; buton.play();}
    }
  //daca apasa pe SA INCEPEM
    if (mouseX > 607 && mouseX < 1070 && mouseY > 249 && mouseY < 339 && pagina == 6) {value = 8; buton.play();}
  //daca apasa pe pagina CASTIG
    
    if(pagina == 8){
    //RESTART
      if (mouseX > 475 && mouseX < 680 && mouseY > 490 && mouseY < 550) value = 8;
    //PAGINA PRINCIPALA
      if (mouseX > 475 && mouseX < 910 && mouseY > 560 && mouseY < 620) value = 3;
    }

    //daca apasa pe pagina PIERDUT
    if(pagina == 9){
    //RESTART
      if (mouseX > 525 && mouseX < 735 && mouseY > 485 && mouseY < 555) value = 8;
    //PAGINA PRINCIPALA
      if (mouseX > 528 && mouseX < 965 && mouseY > 560 && mouseY < 620) value = 3;
    }

    //daca apasa pe unul dintre butoane REINITIALIZAM TOATE VARIABILELE
      if ( (pagina == 8 && mouseX > 475 && mouseX < 680 && mouseY > 490 && mouseY < 550) || 
      (pagina == 8 && mouseX > 475 && mouseX < 910 && mouseY > 560 && mouseY < 620) || 
      (pagina == 9 && mouseX > 525 && mouseX < 735 && mouseY > 485 && mouseY < 555) || 
      (pagina == 9 && mouseX > 528 && mouseX < 965 && mouseY > 560 && mouseY < 620) )
      {
      
      viteza = 1;
      e = 4;
      inamic_w = 40;
      inamic_h = 40;
      proiectil_w = 20;
      L = 0;
      Nivel = 1;
      SCOR = 0;
     
    ///NIVEL 1

      ///POZITII INAMICI
         //cream inamicii ca obiecte
       for (i = 0; i < 8; i++)
           for (j = 0; j < 10; j++)
             {
               Inamici1[i][j] = {
                 x: j * 90 + 170,
                 y: i * 60 - 450
               }
             }
     
      ///APARITIE INAMICI
         //initial toate navele apar
       for (i = 0; i < 8; i++)
           for (j = 0; j < 10; j++)
             NavaEInViata1[i][j] = true;
     
    ///NIVEL 2

        ///POZITII INAMICI
         // cream inamicii ca obiecte
         for (i = 0; i < 5; i++)
             for (j = 0; j < 10; j++)
               {
                 Inamici2[i][j] = {
                   x: j * 90 + 200,
                   y: i * 60 - 700
                 }
               }
     
        ///APARITIE INAMICI
           //initial toate navele apar
         for (i = 0; i < 5; i++)
             for (j = 0; j < 10; j++)
               NavaEInViata2[i][j] = true;
       
    ///NIVEL 3

        ///POZITII INAMICI
         //cream inamicii ca obiecte
         for (i = 0; i < 6; i++)
             for (j = 0; j < 6; j++)
               {
                 Inamici3[i][j] = {
                   x: j * 90 + 400,
                   y: i * 60 - 800
                 }
               }
     
     
         ///APARITIE INAMICI
           //initial toate navele apar
         for (i = 0; i < 6; i++)
             for (j = 0; j < 6; j++)
               NavaEInViata3[i][j] = true;
                 
    ///INIMI
       //declar vectorul cu inimi
     for (i = 0; i < 5; i++)
       inimi[i] = true;
      

    }
}

var drawStartPage = function(){
  pagina = 1;
  background(UserInterface);

  //INSTRUCTIUNI
     if (mouseX > 259 && mouseX < 1042 && mouseY > 522 && mouseY < 634) {background(UserInterface); background(Ul2); }
  //START
    else
      if (mouseX > 448 && mouseX < 853  && mouseY > 395 && mouseY < 505) {background(UserInterface); background(Ul1); }
   //inafara butoanelor - pagina initiala
      else background(UserInterface); 
}

var drawInstructiuni = function(){
  
  pagina = 2;
  background(MenuBackground);
  background(instructiuni);

  //daca apasa pe INAPOI
    if (mouseX > 800 && mouseX < 1050 && mouseY > 579 && mouseY < 639)
    {
      background(MenuBackground);
      background(clickInstructiuni);
    }
}

var drawPovestePagina1 = function(){
  pagina = 3;
  background(MenuBackground);
  background(Text1);
  background(ButonInainte);
  
  //INAINTE
    if (mouseX > 607 && mouseX < 989 && mouseY > 249 && mouseY < 339) background(ButonInainteNull);
}


var drawPovestePagina2 = function(){
  pagina = 4;
  background(MenuBackground);
  background(Text2);
  background(ButonInainte);
  
  //INAINTE
    if (mouseX > 607 && mouseX < 989 && mouseY > 249 && mouseY < 339) background(ButonInainteNull);
}


var drawPovestePagina3 = function(){
  pagina = 5;
  background(MenuBackground);
  background(Text3);
  background(ButonInainte);
  
  //INAINTE
    if (mouseX > 607 && mouseX < 989 && mouseY > 249 && mouseY < 339) background(ButonInainteNull);
}


var drawPovestePagina4 = function(){
  pagina = 6;
  background(MenuBackground);
  background(Text4);
  background(ButonSaIncepem);
  
  //INAINTE
    if (mouseX > 607 && mouseX < 1070 && mouseY > 249 && mouseY < 339 && pagina == 6) background(ButonSaIncepemNull);
}


var proiectile = [];
var NavaY = 550;
var viteza = 1;
var i, j, x, y, k;
var e = 4;
var inamic_w = 40;
var inamic_h = 40;
var proiectil_w = 20;
var L = 0;
var Nivel = 1;
var SCOR = 0;


///NIVEL 1

  ///POZITII INAMICI
    //declar matricea cu INAMICI si cream inamicii ca obiecte
  var Inamici1 = [];
  for (i = 0; i < 8; i++)
    {
      Inamici1[i] = [];
      for (j = 0; j < 10; j++)
        {
          Inamici1[i][j] = {
            x: j * 90 + 170,
            y: i * 60 - 450
          }
        }
    }

  ///APARITIE INAMICI
    //declar matricea in care memorez daca o nava a fost lovita sau e in viata
  var NavaEInViata1 = [];
  for (i = 0; i < 8; i++) NavaEInViata1[i] = [];
    //initial toate navele apar
  for (i = 0; i < 8; i++)
      for (j = 0; j < 10; j++)
        NavaEInViata1[i][j] = true;


///NIVEL 2

  ///POZITII INAMICI
    //declar matricea cu INAMICI si cream inamicii ca obiecte
    var Inamici2 = [];
    for (i = 0; i < 5; i++)
      {
        Inamici2[i] = [];
        for (j = 0; j < 10; j++)
          {
            Inamici2[i][j] = {
              x: j * 90 + 200,
              y: i * 60 - 700
            }
          }
      }

    ///APARITIE INAMICI
      //declar matricea in care memorez daca o nava a fost lovita sau e in viata
    var NavaEInViata2 = [];
    for (i = 0; i < 5; i++) NavaEInViata2[i] = [];
      //initial toate navele apar
    for (i = 0; i < 5; i++)
        for (j = 0; j < 10; j++)
          NavaEInViata2[i][j] = true;
  
///NIVEL 3

  ///POZITII INAMICI
    //declar matricea cu INAMICI si cream inamicii ca obiecte
    var Inamici3 = [];
    for (i = 0; i < 6; i++)
      {
        Inamici3[i] = [];
        for (j = 0; j < 6; j++)
          {
            Inamici3[i][j] = {
              x: j * 90 + 400,
              y: i * 60 - 800
            }
          }
        }

    ///APARITIE INAMICI
      //declar matricea in care memorez daca o nava a fost lovita sau e in viata
    var NavaEInViata3 = [];
    for (i = 0; i < 6; i++) NavaEInViata3[i] = [];
      //initial toate navele apar
    for (i = 0; i < 6; i++)
        for (j = 0; j < 6; j++)
          NavaEInViata3[i][j] = true;
  
              
///INIMI
  //declar vectorul cu inimi
var inimi = [];
for (i = 0; i < 5; i++)
  inimi[i] = true;


var drawGame = function(){
  pagina = 7;
  
  background(fundal_joc);
  image(scor, 10, 100, 100, 50);

  fill(255, 255, 255);
  textFont(ScorFont);
  textSize(30);
  text(SCOR*10, 22, 170);

///NIVELUL 1
  if (Nivel === 1)
  {     
    //aparitie nave inamice
    for (i = 0; i < 8; i++)
      for (j = 0; j < 10; j++)
        if (NavaEInViata1[i][j] === true) {
          image(inamic1, Inamici1[i][j].x, Inamici1[i][j].y, inamic_w, inamic_h);
          Inamici1[i][j].y += 0.6;
        }

    //daca lovesc o nava
      for (j = 0; j < 8; j++) 
        for (k = 0; k < 10; k++)
          if (NavaEInViata1[j][k] === true)
            {
              for (i = proiectile.length - 1; i >= 0; i--)
              {
                //VERIFICI COLIZIUNEA
                if (proiectile[i].x < Inamici1[j][k].x + inamic_w && proiectile[i].x + proiectil_w > Inamici1[j][k].x && proiectile[i].y < Inamici1[j][k].y + inamic_h) {
                  NavaEInViata1[j][k] = false;
                  L++;
                  SCOR++;
                  proiectile.splice(i,1);
                }
              }
            }

    //daca inamicii ies din canvas
    for (i = 0; i < 8; i++)
      for (j = 0; j < 10; j++)
        {
          if (Inamici1[i][j].y > 650 && NavaEInViata1[i][j] === true) {
            NavaEInViata1[i][j] = false;
            L++;
            inimi[e] = false;
            e--;
          }
        }

    image(nivel_1, 15, 0, 150, 100);

    if (L === 80) Nivel = 2;

  }


///NIVELUL 2
  if (Nivel === 2)
  {
    //aparitie nave inamice
    for (i = 0; i < 4; i++)
      for (j = 0; j < 10; j++)
        if (NavaEInViata2[i][j] === true) {
          image(inamic2, Inamici2[i][j].x, Inamici2[i][j].y, inamic_w, inamic_h);
          Inamici2[i][j].y += 1.1;
        }

  //daca lovesc o nava
  for (j = 0; j < 4; j++) 
    for (k = 0; k < 10; k++)
      if (NavaEInViata2[j][k] === true)
        {
          for (i = proiectile.length - 1; i >= 0; i--)
          {
            //VERIFICI COLIZIUNEA
            if(proiectile[i].x < Inamici2[j][k].x + inamic_w && proiectile[i].x + proiectil_w > Inamici2[j][k].x && proiectile[i].y < Inamici2[j][k].y + inamic_h) {
              NavaEInViata2[j][k] = false;
              L++;
              SCOR++;
              proiectile.splice(i,1);
            }
          }
        }


  //daca inamicii ies din canvas
    for (i = 0; i < 4; i++)
      for (j = 0; j < 10; j++)
        {
          if (Inamici2[i][j].y > 650 && NavaEInViata2[i][j] === true) {
            NavaEInViata2[i][j] = false;
            L++;
            inimi[e] = false;
            e--;
          }
        }

  image(nivel_2, 15, 0, 150, 100);

  if (L === 120) Nivel = 3;  

  }


///NIVELUL 3
  if (Nivel === 3)
  {    

    //aparitie nave inamice
    for (i = 0; i < 6; i++)
      for (j = 0; j < 6; j++)
        if (NavaEInViata3[i][j] === true) {
          image(inamic3, Inamici3[i][j].x, Inamici3[i][j].y, inamic_w, inamic_h);
          Inamici3[i][j].y += 1.7;
        }

    //daca lovesc o nava
      for (j = 0; j < 6; j++) 
        for (k = 0; k < 6; k++)
          if (NavaEInViata3[j][k] === true)
            {
              for(i = proiectile.length - 1; i >= 0; i--)
              {
                //VERIFICI COLIZIUNEA
                if(proiectile[i].x < Inamici3[j][k].x + inamic_w && proiectile[i].x + proiectil_w > Inamici3[j][k].x && proiectile[i].y < Inamici3[j][k].y + inamic_h) {
                  NavaEInViata3[j][k] = false;
                  L++;
                  SCOR++;
                  proiectile.splice(i,1);
                }
              }
            }

    //daca inamicii ies din canvas
      for (i = 0; i < 6; i++)
        for (j = 0; j < 6; j++)
          {
            if (Inamici3[i][j].y > 650 && NavaEInViata3[i][j] === true) {
              NavaEInViata3[i][j] = false;
              L++;
              inimi[e] = false;
              e--;
            }
          }

    image(nivel_3, 15, 0, 150, 100);

  }

  
//daca declanseaza PROIECTILUL
  for (i = proiectile.length - 1; i >= 0; i--) {
    
    image(Proiectil, proiectile[i].x, proiectile[i].y, proiectil_w, proiectil_w);
    //viteza
      proiectile[i].y -= 3;
    //dispar dupa ce ies din canvas
      if(proiectile[i].y < -10) proiectile.splice(i, 1);
  }

//miscarea navei
  if (mouseX <= 1250 && mouseX >= 50) {image(Nava, mouseX-50, NavaY, 100, 100);}
  else 
    if (mouseX > 1250) {image(Nava, 1200, NavaY, 100, 100);}
      else if (mouseX <= 50) {image(Nava, 0, NavaY, 100, 100);}

//inimile
  for(i = 0; i < 5; i++) 
    if(inimi[i] === true)
      image(Inima, 1250-55*i, 10, 50, 50);

//ai pierdut
  if (e < 0)
    {value = 10; game_over.play(); for (i = proiectile.length - 1; i >= 0; i--) proiectile.splice(i,1);}
  else
    //ai castigat
    if (L === 156 && e >= 0)
      {value = 9; castig_muzica.play(); for (i = proiectile.length - 1; i >= 0; i--) proiectile.splice(i,1);}

}

///cand apasa click declanseaza proiectilul
function mouseClicked() {
  if (proiectile.length < 50 && pagina == 7) {
       proiectile[proiectile.length] = {
         x : mouseX-proiectil_w/2,
         y : NavaY
       };
  }
}


var drawCastig = function(){
  pagina = 8;

  background(fundal_joc);
  background(castig);
  image(scor, 450, 400, 200, 100);
  textSize(50);
  text(SCOR*10, 650, 470);
  image(restart, 467, 480, 220, 80);
  image(paginaPrincipala, 469, 550, 450, 80);

  //RESTART
    if (mouseX > 475 && mouseX < 680 && mouseY > 490 && mouseY < 550) image(restartAP, 467, 480, 220, 80);
  //PAGINA PRINCIPALA
    if (mouseX > 475 && mouseX < 910 && mouseY > 560 && mouseY < 620) image(paginaPrincipalaAP, 469, 550, 450, 80);
}

var drawPierdut = function(){
  pagina = 9;

  background(fundal_joc);
  background(pierdut);
  image(scor, 500, 400, 200, 100);
  textSize(50);
  text(SCOR*10, 700, 470);
  image(restart, 520, 480, 220, 80);
  image(paginaPrincipala, 522, 550, 450, 80);

  //RESTART
    if (mouseX > 525 && mouseX < 735 && mouseY > 485 && mouseY < 555) image(restartAP, 520, 480, 220, 80);
  //PAGINA PRINCIPALA
   if (mouseX > 528 && mouseX < 965 && mouseY > 560 && mouseY < 620) image(paginaPrincipalaAP, 522, 550, 450, 80);
}