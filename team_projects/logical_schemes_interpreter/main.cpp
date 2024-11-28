#include "headers/graphics.h"
#include "headers/winbgim.h"

#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <cmath>
#include <dos.h>
#include <string.h>
#include <windows.h>
#include <math.h>
#include <limits.h>

#define infinit MAX
#define epsi 0.0001
#define MAX 100
#define MAX1 20
#define NMAX 100
#define TEXTMAX 50
#define NRBLOC 10

using namespace std;

FILE *fPtr;
struct coordonate
{
    int x, y;
};
struct legatura
{
    int id_bloc, nr_bloc, nr_legatura;
    coordonate p1, p2;
};
struct elipsa
{
    coordonate centru;
    int r1; ///RAZA IN LATIME
    int r2; ///RAZA IN INALTIME
    legatura L[3];
    bool viz;
};
elipsa buton_informatii;
struct patrulater
{
    coordonate centru;
    coordonate A, B, C, D;
    char text[TEXTMAX];
    legatura L[3];
    bool viz;
};
struct triunghi
{
    coordonate centru;
    coordonate A, B, C;
    char text[TEXTMAX];
    legatura L[5];
    bool viz;
};
///L[1] - sus
///L[2] - jos
///stop_decizie: L[0] - stg_sus + L[1] - drp_sus
///decizie: L[2] - stg + L[3] - drp + L[4] - loop
struct meniu
{
    elipsa start, stop, stop_decizie;
    patrulater citire, afisare, atribuire;
    triunghi decizie;
    bool afis[NRBLOC];
} meniu;
patrulater btn_exit;
patrulater btn_scroll_jos_ex, btn_scroll_sus_ex;
patrulater btn_scroll_jos_cod, btn_scroll_sus_cod;
patrulater butoane[10];
char text_butoane[5][20]={"", "SCHEMA NOUA", "SALVARE SCHEMA", "DESCHIDE SCHEMA", "EXECUTA"};
struct blocuri
{
    elipsa start;                ///id 1
    elipsa stop;                 ///id 2
    patrulater citire[NMAX];     ///id 3
    patrulater afisare[NMAX];    ///id 4
    triunghi decizie[NMAX];      ///id 5
    elipsa stop_decizie[NMAX];   ///id 6
    patrulater atribuire[NMAX];  ///id 7
} blocuri;
int nr_blocuri[NRBLOC];
int r_legatura=5;
char text_blocuri[10][20]={"", "START", "STOP", "CITIRE", "AFISARE", "DECIZIE", "STOP IF", "ATRIBUIRE"};
char s[TEXTMAX];
char executare[NMAX][TEXTMAX];
char codificare[NMAX][TEXTMAX];

int top1, top2;
const int max_stiva=100;
double Opd[max_stiva];
char Op[max_stiva];
int viz[30];

double variabile[30];
char OperatiiBinare[20]="+-*/^<>=$#&!m";
char Operatii[30]="+-*/^<>=#&!$scantlrm";
char OperatiiUnare[200]="scantlr";

struct functie
{
    char expresie[300];
    char vect[101][10];
    int lung;
};

struct culoare {int c1, c2, c3;};
culoare cul_bkd={245, 247, 225};
culoare cul_bloc_bkd={251, 252, 164};
culoare cul_marg={0, 0, 0};
culoare cul_hover={153, 46, 64};
culoare cul_btn={166, 166, 166};
culoare cul_tabla={255, 255, 255};
culoare cul_exec={246, 247, 233};
culoare cul_btn_exit={153, 46, 64};
culoare cul_hover_exit={250, 0, 0};

bool fereastra_schema=1, loop, schema_executata;
int inc_ex, sf_ex, total_randuri_ex;
int inc_cod, sf_cod, total_randuri_cod;

void interfata();
void tabla_schema();
void tabla_executare_schema();
void tabla_codificare_schema();
void desenare_buton_scroll_jos(patrulater btn, culoare cul);
void desenare_buton_scroll_sus(patrulater btn, culoare cul);
void meniu_blocuri();
void meniu_butoane();

void desenare_bloc_start(coordonate centru, culoare cul, culoare bkd, bool inserare);
void desenare_bloc_stop(coordonate centru, culoare cul, culoare bkd, bool inserare);
void desenare_bloc_citire(coordonate centru, culoare cul, culoare bkd, char text[], bool inserare);
void desenare_bloc_afisare(coordonate centru, culoare cul, culoare bkd, char text[], bool inserare);
void desenare_bloc_decizie(coordonate centru, culoare cul, culoare bkd, char text[], bool inserare);
void desenare_bloc_stop_decizie(coordonate centru, culoare cul, culoare bkd, bool inserare);
void desenare_bloc_atribuire(coordonate centru, culoare cul, culoare bkd, char text[], bool inserare);

void coordonate_bloc_start(elipsa &bloc, coordonate centru);
void coordonate_bloc_stop(elipsa &bloc, coordonate centru);
void coordonate_bloc_citire(patrulater &bloc, coordonate centru);
void coordonate_bloc_afisare(patrulater &bloc, coordonate centru);
void coordonate_bloc_decizie(triunghi &bloc, coordonate centru);
void coordonate_bloc_stop_decizie(elipsa &bloc, coordonate centru);
void coordonate_bloc_atribuire(patrulater &bloc, coordonate centru);

void desenare_buton_meniu(patrulater buton, culoare cul_marg, char text[]);
void desenare_buton_informatii(coordonate centru, culoare cul);

void inserare_bloc_start(elipsa bloc);
void inserare_bloc_stop(elipsa bloc);
void inserare_bloc_citire(patrulater bloc);
void inserare_bloc_afisare(patrulater bloc);
void inserare_bloc_decizie(triunghi bloc);
void inserare_bloc_stop_decizie(elipsa bloc);
void inserare_bloc_atribuire(patrulater bloc);
void inserare_buton_meniu(patrulater buton, culoare cul_marg);
void inserare_buton_informatii(coordonate centru, culoare cul);

void stergere_bloc_start();
void stergere_bloc_stop();
void stergere_bloc_citire(int i);
void stergere_bloc_afisare(int i);
void stergere_bloc_decizie(int i);
void stergere_bloc_stop_decizie(int i);
void stergere_bloc_atribuire(int i);

void mouse_hover();
void hover_blocuri_meniu();
void desenare_schema_start();
void desenare_schema_stop();
void desenare_schema_citire();
void desenare_schema_afisare();
void desenare_schema_decizie();
void desenare_schema_stop_decizie();
void desenare_schema_atribuire();

void hover_blocuri_schema();
bool hover_elipsa(elipsa bloc);
bool hover_trapez_intors(patrulater bloc);
bool hover_trapez_normal(patrulater bloc);
bool hover_romb(patrulater bloc);
bool hover_dreptunghi(patrulater bloc);
bool hover_triunghi(triunghi bloc);
float arie_triunghi(triunghi bloc);
bool hover_tabla();
void citire_sir(int x, int y, char mesaj[TEXTMAX], char S[TEXTMAX]);
void creare_bloc(int id_bloc, char s[TEXTMAX]);

void hover_blocuri_start();
void click_dreapta_blocuri_start(bool &operatie_bloc);
void click_stanga_blocuri_start(bool &operatie_bloc);
void click_mijloc_blocuri_start(bool &operatie_bloc);

void hover_blocuri_stop();
void click_dreapta_blocuri_stop(bool &operatie_bloc);
void click_stanga_blocuri_stop(bool &operatie_bloc);

void hover_blocuri_citire();
void click_dreapta_blocuri_citire(bool &operatie_bloc, int i);
void click_stanga_blocuri_citire(bool &operatie_bloc, int i);
void click_mijloc_blocuri_citire(bool &operatie_bloc, int i);

void hover_blocuri_afisare();
void click_dreapta_blocuri_afisare(bool &operatie_bloc, int i);
void click_stanga_blocuri_afisare(bool &operatie_bloc, int i);
void click_mijloc_blocuri_afisare(bool &operatie_bloc, int i);

void hover_blocuri_decizie();
void click_dreapta_blocuri_decizie(bool &operatie_bloc, int i);
void click_stanga_blocuri_decizie(bool &operatie_bloc, int i);
void click_mijloc_blocuri_decizie(bool &operatie_bloc, int i);

void hover_blocuri_stop_decizie();
void click_dreapta_blocuri_stop_decizie(bool &operatie_bloc, int i);
void click_stanga_blocuri_stop_decizie(bool &operatie_bloc, int i);
void click_mijloc_blocuri_stop_decizie(bool &operatie_bloc, int i);

void hover_blocuri_atribuire();
void click_dreapta_blocuri_atribuire(bool &operatie_bloc, int i);
void click_stanga_blocuri_atribuire(bool &operatie_bloc, int i);
void click_mijloc_blocuri_atribuire(bool &operatie_bloc, int i);

void creare_legatura(legatura &L, int id_bloc, int nr_bloc, int nr_legatura);
bool click_alta_piesa(legatura &L, int id_bloc, int nr_bloc, int nr_legatura);
bool legatura_bloc_stop(legatura &L, int id_bloc, int nr_bloc, int nr_legatura);
bool legatura_bloc_citire(legatura &L, int id_bloc, int nr_bloc, int nr_legatura);
bool legatura_bloc_afisare(legatura &L, int id_bloc, int nr_bloc, int nr_legatura);
bool legatura_bloc_decizie(legatura &L, int id_bloc, int nr_bloc, int nr_legatura);
bool legatura_bloc_stop_decizie(legatura &L, int id_bloc, int nr_bloc, int nr_legatura);
bool legatura_bloc_atribuire(legatura &L, int id_bloc, int nr_bloc, int nr_legatura);
void desenare_legatura(legatura &L);
void stergere_legatura_dintre_blocuri(legatura &L);
void stergere_legatura_cu_bloc(legatura &L);
bool click_piesa_legatura(legatura L);
void mutare_bloc(int id_bloc, int i);

void refacere_legaturi_bloc_start(legatura L);
void refacere_legaturi_bloc_stop(legatura L);
void refacere_legaturi_bloc_citire(legatura L[3], int nr);
void refacere_legaturi_bloc_afisare(legatura L[3], int nr);
void refacere_legaturi_bloc_decizie(legatura L[5], int nr);
void refacere_legaturi_bloc_stop_decizie(legatura L[3], int nr);
void refacere_legaturi_bloc_atribuire(legatura L[3], int nr);
void refacere_legatura_cu_bloc(legatura L, int id_bloc, int nr_bloc);

void refacere_schema();
void refacere_butoane_start();
void refacere_butoane_stop();
void refacere_butoane_citire();
void refacere_butoane_afisare();
void refacere_butoane_decizie();
void refacere_butoane_stop_decizie();
void refacere_butoane_atribuire();

void hover_buton_informatii();
void deschidere_fereastra_informatii();
void inchidere_fereastra_informatii();
void desenare_buton_exit(culoare cul);

void hover_butoane_meniu();

void schema_noua();

void salvare_schema();
void salvare_butoane_start();
void salvare_butoane_stop();
void salvare_butoane_citire();
void salvare_butoane_afisare();
void salvare_butoane_decizie();
void salvare_butoane_stop_decizie();
void salvare_butoane_atribuire();

void deschidere_schema();
void deschidere_butoane_start();
void deschidere_butoane_stop();
void deschidere_butoane_citire();
void deschidere_butoane_afisare();
void deschidere_butoane_decizie();
void deschidere_butoane_stop_decizie();
void deschidere_butoane_atribuire();

bool nu_exista_erori();
bool exista_bloc_start();
bool exista_bloc_stop();
bool legaturile_sunt_corecte();
void vizitare_blocuri(bool viz, int tip, int nr);
bool schema_corecta();
void eroarea(int nr);
void afisare_eroare(char text[]);

void codificare_schema();
int parcurgere_decizie(int &tip, int &nr, int x , int y, int nr_tab);
int parcurgere_while(int tip, int nr, int x , int y, int nr_tab);
void text_taburi_cod(int nr_tab, char t[]);
void text_codificare_schema();
void scroll_codificare(int &y);
void executare_schema();
void text_executare_schema();
void scroll_executare(int &y);
void hover_scroll();
void hover_scroll_sus_executare();
void hover_scroll_jos_executare();
void hover_scroll_sus_codificare();
void hover_scroll_jos_codificare();

int Prioritate(char c); ///prioritatea operatorilor
bool DifInf(float x);
float Exponential(float x);
float Inmultit(float x, float y);
float Putere(float x, float y);
bool Egal(float x, float y); ///codificat cu =
bool Diferit(float x, float y); ///codificat cu !
bool MaiMic(float x, float y);
bool MaiMare(float x, float y);
bool MaiMareEgal(float x, float  y); ///codificat cu &
bool MaiMicEgal(float x, float  y); ///codificat cu #
float Plus(float x, float y);
float Minus(float x, float y);
float Impartit(float x, float y);
float Logaritm(float x); ///codificat cu l
float Sinus(float x); ///codificat cu s
float Cosinus(float x); ///codificat cu c
float Tangent(float x); ///codificat cu t
float Cotangent(float x); ///codificat cu n
float Modul(float x); ///codificat cu a
float Radical(float x); ///codificat cu r
bool EsteNumar(char sir[MAX1]);
double ValoareFunctie(functie E);
float Evaluare(char text[]);

int main()
{
    initwindow(1100, 700);
    interfata();
    mouse_hover();
    getch();
    closegraph();
    return 0;
}

void interfata()
{
    setbkcolor(COLOR(cul_bkd.c1, cul_bkd.c2, cul_bkd.c3));
    cleardevice();
    meniu_blocuri();
    meniu_butoane();
    tabla_schema();
    tabla_executare_schema();
    tabla_codificare_schema();
}

void tabla_schema()
{
    setlinestyle(cul_marg.c1, cul_marg.c2, cul_marg.c3);
    setfillstyle(1, COLOR(cul_tabla.c1, cul_tabla.c2, cul_tabla.c3));
    setcolor(COLOR(cul_marg.c1, cul_marg.c2, cul_marg.c3));
    bar(200, 25, 800, 625);
    rectangle(200, 25, 800, 625);
}

void tabla_executare_schema()
{
    setlinestyle(cul_marg.c1, cul_marg.c2, cul_marg.c3);
    setbkcolor(COLOR(cul_btn.c1, cul_btn.c2, cul_btn.c3));
    setfillstyle(1, COLOR(cul_btn.c1, cul_btn.c2, cul_btn.c3));
    bar(825, 25, 1075, 65);
    rectangle(825, 25, 1075, 65);
    outtextxy(840, 38, "EXECUTARE PROGRAM");

    btn_scroll_sus_ex.A={1010, 35};
    btn_scroll_sus_ex.C={1030, 55};
    desenare_buton_scroll_sus(btn_scroll_sus_ex, cul_btn_exit);

    btn_scroll_jos_ex.A={1040, 35};
    btn_scroll_jos_ex.C={1060, 55};
    desenare_buton_scroll_jos(btn_scroll_jos_ex, cul_btn_exit);

    setfillstyle(1, COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
    bar(825, 65, 1075, 325);
    rectangle(825, 65, 1075, 325);
}

void tabla_codificare_schema()
{
    setlinestyle(cul_marg.c1, cul_marg.c2, cul_marg.c3);
    setbkcolor(COLOR(cul_btn.c1, cul_btn.c2, cul_btn.c3));
    setfillstyle(1, COLOR(cul_btn.c1, cul_btn.c2, cul_btn.c3));
    setcolor(BLACK);
    bar(825, 350, 1075, 390);
    rectangle(825, 350, 1075, 390);
    outtextxy(840, 362, "CODIFICARE C++");

    btn_scroll_sus_cod.A={1010, 360};
    btn_scroll_sus_cod.C={1030, 380};
    desenare_buton_scroll_sus(btn_scroll_sus_cod, cul_btn_exit);

    btn_scroll_jos_cod.A={1040, 360};
    btn_scroll_jos_cod.C={1060, 380};
    desenare_buton_scroll_jos(btn_scroll_jos_cod, cul_btn_exit);

    setfillstyle(1, COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
    bar(825, 390, 1075, 680);
    rectangle(825, 390, 1075, 680);
}

void desenare_buton_scroll_jos(patrulater btn, culoare cul)
{
    setlinestyle(cul_marg.c1, cul_marg.c2, cul_marg.c3);
    setfillstyle(1, COLOR(cul.c1, cul.c2, cul.c3));
    bar(btn.A.x, btn.A.y, btn.C.x, btn.C.y);
    rectangle(btn.A.x, btn.A.y, btn.C.x, btn.C.y);
    line(btn.A.x, btn.A.y, (btn.A.x+btn.C.x)/2, btn.C.y);
    line(btn.C.x, btn.A.y, (btn.A.x+btn.C.x)/2, btn.C.y);
}

void desenare_buton_scroll_sus(patrulater btn, culoare cul)
{
    setlinestyle(cul_marg.c1, cul_marg.c2, cul_marg.c3);
    setfillstyle(1, COLOR(cul.c1, cul.c2, cul.c3));
    bar(btn.A.x, btn.A.y, btn.C.x, btn.C.y);
    rectangle(btn.A.x, btn.A.y, btn.C.x, btn.C.y);
    line(btn.A.x, btn.C.y, (btn.A.x+btn.C.x)/2, btn.A.y);
    line(btn.C.x, btn.C.y, (btn.A.x+btn.C.x)/2, btn.A.y);
}

void meniu_blocuri()
{
    int blocuri_meniu_x=100;
    desenare_bloc_start({blocuri_meniu_x, 90}, cul_marg, cul_bloc_bkd, 1);
    desenare_bloc_stop({blocuri_meniu_x, 165}, cul_marg, cul_bloc_bkd, 1);
    desenare_bloc_citire({blocuri_meniu_x, 245}, cul_marg, cul_bloc_bkd, text_blocuri[3], 1);
    desenare_bloc_afisare({blocuri_meniu_x, 330}, cul_marg, cul_bloc_bkd, text_blocuri[4], 1);
    desenare_bloc_decizie({blocuri_meniu_x, 430}, cul_marg, cul_bloc_bkd, text_blocuri[5], 1);
    desenare_bloc_stop_decizie({blocuri_meniu_x, 500}, cul_marg, cul_bloc_bkd, 1);
    desenare_bloc_atribuire({blocuri_meniu_x, 575}, cul_marg, cul_bloc_bkd, text_blocuri[7], 1);
}

void meniu_butoane()
{
    setbkcolor(COLOR(cul_btn.c1, cul_btn.c2, cul_btn.c3));
    setfillstyle(1, COLOR(cul_btn.c1, cul_btn.c2, cul_btn.c3));

    buton_informatii.centru.x=100;
    buton_informatii.centru.y=660;
    buton_informatii.r1=buton_informatii.r2=15;

    desenare_buton_informatii(buton_informatii.centru, cul_marg);

    ellipse(buton_informatii.centru.x, buton_informatii.centru.y, 0, 360, buton_informatii.r1, buton_informatii.r2);
    fillellipse(buton_informatii.centru.x, buton_informatii.centru.y, buton_informatii.r1, buton_informatii.r1);
    outtextxy(98, 652, "i");

    int butoane_A_y=640, butoane_C_y=680, i;

    butoane[1].A.x=200; butoane[1].C.x=350;
    butoane[2].A.x=350; butoane[2].C.x=520;
    butoane[3].A.x=520; butoane[3].C.x=700;
    butoane[4].A.x=700; butoane[4].C.x=800;

    for (i=1; i<=4; i++)
    {
        butoane[i].A.y=butoane_A_y;
        butoane[i].C.y=butoane_C_y;
        butoane[i].centru.x=(butoane[i].C.x+butoane[i].A.x)/2;
        butoane[i].centru.y=(butoane[i].C.y+butoane[i].A.y)/2;
    }

    for (i=1; i<=4; i++)
        desenare_buton_meniu(butoane[i], cul_marg, text_butoane[i]);
}

void desenare_bloc_start(coordonate centru, culoare cul, culoare bkd, bool inserare)
{
    int lg_text=textwidth(text_blocuri[1]);
    elipsa bloc;
    bloc.L[2].id_bloc=0;
    bloc.viz=0;
    coordonate_bloc_start(bloc, centru);

    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    ellipse(bloc.centru.x, bloc.centru.y, 0, 360, bloc.r1, bloc.r2);
    setfillstyle(1, COLOR(bkd.c1, bkd.c2, bkd.c3));
    fillellipse(bloc.centru.x, bloc.centru.y, bloc.r1, bloc.r2);

    setfillstyle(1, COLOR(bkd.c1, bkd.c2, bkd.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    circle(bloc.centru.x, bloc.centru.y+bloc.r2, r_legatura);
    floodfill(bloc.centru.x, bloc.centru.y+bloc.r2, COLOR(cul.c1, cul.c2, cul.c3));

    setbkcolor(COLOR(bkd.c1, bkd.c2, bkd.c3));
    outtextxy(bloc.centru.x-lg_text/2, bloc.centru.y-8, text_blocuri[1]);

    if (inserare)
        inserare_bloc_start(bloc);
}

void desenare_bloc_stop(coordonate centru, culoare cul, culoare bkd, bool inserare)
{
    int lg_text=textwidth(text_blocuri[2]);
    elipsa bloc;
    bloc.centru=centru;
    bloc.r1=45; bloc.r2=15;
    bloc.L[1].id_bloc=0;
    bloc.viz=0;

    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    ellipse(bloc.centru.x, bloc.centru.y, 0, 360, bloc.r1, bloc.r2);
    setfillstyle(1, COLOR(bkd.c1, bkd.c2, bkd.c3));
    fillellipse(bloc.centru.x, bloc.centru.y, bloc.r1, bloc.r2);

    setfillstyle(1, COLOR(bkd.c1, bkd.c2, bkd.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    circle(bloc.centru.x, bloc.centru.y-bloc.r2, r_legatura);
    floodfill(bloc.centru.x, bloc.centru.y-bloc.r2, COLOR(cul.c1, cul.c2, cul.c3));

    setbkcolor(COLOR(bkd.c1, bkd.c2, bkd.c3));
    outtextxy(bloc.centru.x-lg_text/2, bloc.centru.y-8, text_blocuri[2]);

    if (inserare)
        inserare_bloc_stop(bloc);
}

void desenare_bloc_citire(coordonate centru, culoare cul, culoare bkd, char text[], bool inserare)
{
    int lg_text=textwidth(text);
    patrulater bloc;
    strcpy(bloc.text, text);
    bloc.L[1].id_bloc=bloc.L[2].id_bloc=0;
    bloc.viz=0;
    coordonate_bloc_citire(bloc, centru);

    setfillstyle(1, COLOR(bkd.c1, bkd.c2, bkd.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    circle(bloc.centru.x, bloc.centru.y-15, r_legatura);
    floodfill(bloc.centru.x, bloc.centru.y-15, COLOR(cul.c1, cul.c2, cul.c3));
    circle(bloc.centru.x, bloc.centru.y+15, r_legatura);
    floodfill(bloc.centru.x, bloc.centru.y+15, COLOR(cul.c1, cul.c2, cul.c3));

    setfillstyle(1, COLOR(bkd.c1, bkd.c2, bkd.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    line(bloc.A.x, bloc.A.y, bloc.D.x, bloc.D.y);
    line(bloc.A.x, bloc.A.y, bloc.B.x, bloc.B.y);
    line(bloc.B.x, bloc.B.y, bloc.C.x, bloc.C.y);
    line(bloc.C.x, bloc.C.y, bloc.D.x, bloc.D.y);
    floodfill(centru.x, centru.y, COLOR(cul.c1, cul.c2, cul.c3));

    setbkcolor(COLOR(bkd.c1, bkd.c2, bkd.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    outtextxy(bloc.centru.x-lg_text/2, bloc.centru.y-8, text);

    if (inserare)
        inserare_bloc_citire(bloc);
}

void desenare_bloc_afisare(coordonate centru, culoare cul, culoare bkd, char text[], bool inserare)
{
    int lg_text=textwidth(text);
    patrulater bloc;
    strcpy(bloc.text, text);
    bloc.L[1].id_bloc=bloc.L[2].id_bloc=0;
    bloc.viz=0;
    coordonate_bloc_afisare(bloc, centru);

    setfillstyle(1, COLOR(bkd.c1, bkd.c2, bkd.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    circle(bloc.centru.x, bloc.centru.y-15, r_legatura);
    floodfill(bloc.centru.x, bloc.centru.y-15, COLOR(cul.c1, cul.c2, cul.c3));
    circle(bloc.centru.x, bloc.centru.y+15, r_legatura);
    floodfill(bloc.centru.x, bloc.centru.y+15, COLOR(cul.c1, cul.c2, cul.c3));

    setfillstyle(1, COLOR(bkd.c1, bkd.c2, bkd.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    line(bloc.A.x, bloc.A.y, bloc.D.x, bloc.D.y);
    line(bloc.A.x, bloc.A.y, bloc.B.x, bloc.B.y);
    line(bloc.B.x, bloc.B.y, bloc.C.x, bloc.C.y);
    line(bloc.C.x, bloc.C.y, bloc.D.x, bloc.D.y);
    floodfill(bloc.centru.x, bloc.centru.y, COLOR(cul.c1, cul.c2, cul.c3));

    setbkcolor(COLOR(bkd.c1, bkd.c2, bkd.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    outtextxy(bloc.centru.x-lg_text/2, bloc.centru.y-8, text);

    if (inserare)
        inserare_bloc_afisare(bloc);
}

void desenare_bloc_decizie(coordonate centru, culoare cul, culoare bkd, char text[], bool inserare)
{
    int lg_text=textwidth(text);
    int ht_text=textheight(text);
    triunghi bloc;
    strcpy(bloc.text, text);
    for (int i=1; i<=4; i++)
        bloc.L[i].id_bloc=0;
    bloc.viz=0;
    coordonate_bloc_decizie(bloc, centru);

    setfillstyle(1, COLOR(bkd.c1, bkd.c2, bkd.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    circle(bloc.A.x, bloc.A.y, r_legatura);
    floodfill(bloc.A.x, bloc.A.y, COLOR(cul.c1, cul.c2, cul.c3));
    circle(bloc.B.x, bloc.B.y, r_legatura);
    floodfill(bloc.B.x, bloc.B.y, COLOR(cul.c1, cul.c2, cul.c3));
    circle(bloc.C.x, bloc.C.y, r_legatura);
    floodfill(bloc.C.x, bloc.C.y, COLOR(cul.c1, cul.c2, cul.c3));

    setfillstyle(1, COLOR(bkd.c1, bkd.c2, bkd.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    line(bloc.A.x, bloc.A.y, bloc.B.x, bloc.B.y);
    line(bloc.A.x, bloc.A.y, bloc.C.x, bloc.C.y);
    line(bloc.B.x, bloc.B.y, bloc.C.x, bloc.C.y);
    floodfill(bloc.centru.x, bloc.centru.y, COLOR(cul.c1, cul.c2, cul.c3));

    setbkcolor(COLOR(bkd.c1, bkd.c2, bkd.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    outtextxy(bloc.centru.x-lg_text/2, bloc.centru.y-ht_text+5, text);

    if (inserare)
        inserare_bloc_decizie(bloc);
}

void desenare_bloc_stop_decizie(coordonate centru, culoare cul, culoare bkd, bool inserare)
{
    char text[]="STOP IF";
    int lg_text=textwidth(text);
    elipsa bloc;
    for (int i=0; i<=2; i++)
        bloc.L[i].id_bloc=0;
    bloc.viz=0;
    coordonate_bloc_stop_decizie(bloc, centru);

    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    ellipse(bloc.centru.x, bloc.centru.y, 0, 360, bloc.r1, bloc.r2);
    setfillstyle(1, COLOR(bkd.c1, bkd.c2, bkd.c3));
    fillellipse(bloc.centru.x, bloc.centru.y, bloc.r1, bloc.r2);

    setfillstyle(1, COLOR(bkd.c1, bkd.c2, bkd.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    circle(bloc.centru.x, bloc.centru.y+bloc.r2, r_legatura);
    floodfill(bloc.centru.x, bloc.centru.y+bloc.r2, COLOR(cul.c1, cul.c2, cul.c3));
    circle(bloc.centru.x, bloc.centru.y-bloc.r2, r_legatura);
    floodfill(bloc.centru.x, bloc.centru.y-bloc.r2, COLOR(cul.c1, cul.c2, cul.c3));

    setbkcolor(COLOR(bkd.c1, bkd.c2, bkd.c3));
    outtextxy(bloc.centru.x-lg_text/2, bloc.centru.y-8, text);

    if (inserare)
        inserare_bloc_stop_decizie(bloc);
}

void desenare_bloc_atribuire(coordonate centru, culoare cul, culoare bkd, char text[], bool inserare)
{
    int lg_text=textwidth(text);
    patrulater bloc;
    strcpy(bloc.text, text);
    bloc.L[1].id_bloc=bloc.L[2].id_bloc=0;
    bloc.viz=0;
    coordonate_bloc_atribuire(bloc, centru);

    setfillstyle(1, COLOR(bkd.c1, bkd.c2, bkd.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    bar(bloc.A.x, bloc.A.y, bloc.C.x, bloc.C.y);
    rectangle(bloc.A.x, bloc.A.y, bloc.C.x, bloc.C.y);

    setfillstyle(1, COLOR(bkd.c1, bkd.c2, bkd.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    circle(bloc.centru.x, bloc.centru.y-15, r_legatura);
    floodfill(bloc.centru.x, bloc.centru.y-15, COLOR(cul.c1, cul.c2, cul.c3));
    circle(bloc.centru.x, bloc.centru.y+15, r_legatura);
    floodfill(bloc.centru.x, bloc.centru.y+15, COLOR(cul.c1, cul.c2, cul.c3));

    setbkcolor(COLOR(bkd.c1, bkd.c2, bkd.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    outtextxy(bloc.centru.x-lg_text/2, bloc.centru.y-8, text);

    if (inserare)
        inserare_bloc_atribuire(bloc);
}

void coordonate_bloc_start(elipsa &bloc, coordonate centru)
{
    bloc.centru=centru;
    bloc.r1=45; bloc.r2=15;
}

void coordonate_bloc_stop(elipsa &bloc, coordonate centru)
{
    bloc.centru=centru;
    bloc.r1=45; bloc.r2=15;
}

void coordonate_bloc_citire(patrulater &bloc, coordonate centru)
{
    int lg_text=textwidth(bloc.text);
    bloc.A={centru.x-lg_text-10, centru.y-15};
    bloc.B={centru.x-lg_text+5,  centru.y+15};
    bloc.C={centru.x+lg_text-5,  centru.y+15};
    bloc.D={centru.x+lg_text+10, centru.y-15};
    bloc.centru=centru;
}

void coordonate_bloc_afisare(patrulater &bloc, coordonate centru)
{
    int lg_text=textwidth(bloc.text);
    bloc.A={centru.x-lg_text+5,  centru.y-15};
    bloc.B={centru.x-lg_text-10, centru.y+15};
    bloc.C={centru.x+lg_text+10, centru.y+15};
    bloc.D={centru.x+lg_text-5,  centru.y-15};
    bloc.centru=centru;
}

void coordonate_bloc_decizie(triunghi &bloc, coordonate centru)
{
    int lg_text=textwidth(bloc.text);
    bloc.C={centru.x,              centru.y-40};
    bloc.A={centru.x-lg_text*1.4,  centru.y+20};
    bloc.B={centru.x+lg_text*1.4,  centru.y+20};
    bloc.centru=centru;
}

void coordonate_bloc_stop_decizie(elipsa &bloc, coordonate centru)
{
    bloc.centru=centru;
    bloc.r1=45; bloc.r2=15;
}

void coordonate_bloc_atribuire(patrulater &bloc, coordonate centru)
{
    int lg_text=textwidth(bloc.text);
    bloc.A={centru.x-lg_text*0.75, centru.y-15};
    bloc.B={centru.x-lg_text*0.75, centru.y+15};
    bloc.C={centru.x+lg_text*0.75, centru.y+15};
    bloc.D={centru.x+lg_text*0.75, centru.y-15};
    bloc.centru=centru;
}

void desenare_buton_meniu(patrulater buton, culoare cul, char text[])
{
    int lg_text=textwidth(text);

    setfillstyle(1, COLOR(cul_btn.c1, cul_btn.c2, cul_btn.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    bar(buton.A.x, buton.A.y, buton.C.x, buton.C.y);
    rectangle(buton.A.x, buton.A.y, buton.C.x, buton.C.y);

    setbkcolor(COLOR(cul_btn.c1, cul_btn.c2, cul_btn.c3));
    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    outtextxy(buton.centru.x-lg_text/2, buton.centru.y-8, text);
}

void desenare_buton_informatii(coordonate centru, culoare cul)
{
    char text[]="I";
    int lg_text=textwidth(text);
    int r1=15, r2=15;

    setcolor(COLOR(cul.c1, cul.c2, cul.c3));
    ellipse(centru.x, centru.y, 0, 360, r1, r2);
    setfillstyle(1, COLOR(cul_btn.c1, cul_btn.c2, cul_btn.c3));
    fillellipse(centru.x, centru.y, r1, r2);

    setbkcolor(COLOR(cul_btn.c1, cul_btn.c2, cul_btn.c3));
    outtextxy(centru.x-lg_text/2, centru.y-8, text);
}

void inserare_bloc_start(elipsa bloc)
{
    if (!meniu.afis[1])
    {
        meniu.start=bloc;
        meniu.afis[1]=1;
    }
    else
    {
        nr_blocuri[1]++;
        blocuri.start=bloc;
    }
}

void inserare_bloc_stop(elipsa bloc)
{
    if (!meniu.afis[2])
    {
        meniu.stop=bloc;
        meniu.afis[2]=1;
    }
    else
    {
        nr_blocuri[2]++;
        blocuri.stop=bloc;
    }
}

void inserare_bloc_citire(patrulater bloc)
{
    if (!meniu.afis[3])
    {
        meniu.citire=bloc;
        meniu.afis[3]=1;
    }
    else
        blocuri.citire[++nr_blocuri[3]]=bloc;
}

void inserare_bloc_afisare(patrulater bloc)
{
    if (!meniu.afis[4])
    {
        meniu.afisare=bloc;
        meniu.afis[4]=1;
    }
    else
        blocuri.afisare[++nr_blocuri[4]]=bloc;
}

void inserare_bloc_decizie(triunghi bloc)
{
    if (!meniu.afis[5])
    {
        meniu.decizie=bloc;
        meniu.afis[5]=1;
    }
    else
        blocuri.decizie[++nr_blocuri[5]]=bloc;
}

void inserare_bloc_stop_decizie(elipsa bloc)
{
    if (!meniu.afis[6])
    {
        meniu.stop_decizie=bloc;
        meniu.afis[6]=1;
    }
    else
        blocuri.stop_decizie[++nr_blocuri[6]]=bloc;
}

void inserare_bloc_atribuire(patrulater bloc)
{
    if (!meniu.afis[7])
    {
        meniu.atribuire=bloc;
        meniu.afis[7]=1;
    }
    else
        blocuri.atribuire[++nr_blocuri[7]]=bloc;
}

void stergere_bloc_start()
{
    if (blocuri.start.L[2].id_bloc)
    {
        stergere_legatura_cu_bloc(blocuri.start.L[2]);
        blocuri.start.L[2].id_bloc=0;
    }
    nr_blocuri[1]--;
}

void stergere_bloc_stop()
{
    if (blocuri.stop.L[1].id_bloc)
    {
        stergere_legatura_cu_bloc(blocuri.stop.L[1]);
        blocuri.stop.L[1].id_bloc=0;
    }
    nr_blocuri[2]--;
}

void stergere_bloc_citire(int i)
{
    int j;
    for (j=1; j<=2; j++)
        if (blocuri.citire[i].L[j].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.citire[i].L[j]);
            blocuri.citire[i].L[j].id_bloc=0;
        }
    for (j=i; j<=nr_blocuri[4]; j++)
    {
        blocuri.citire[j]=blocuri.citire[j+1];
        refacere_legaturi_bloc_citire(blocuri.citire[j].L, j);
    }
    nr_blocuri[3]--;
}

void stergere_bloc_afisare(int i)
{
    int j;
    for (j=1; j<=2; j++)
        if (blocuri.afisare[i].L[j].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.afisare[i].L[j]);
            blocuri.afisare[i].L[j].id_bloc=0;
        }
    for (j=i; j<=nr_blocuri[4]; j++)
    {
        blocuri.afisare[j]=blocuri.afisare[j+1];
        refacere_legaturi_bloc_afisare(blocuri.afisare[j].L, j);
    }
    nr_blocuri[4]--;
}

void stergere_bloc_decizie(int i)
{
    int j;
    for (j=1; j<=4; j++)
        if (blocuri.decizie[i].L[j].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.decizie[i].L[j]);
            blocuri.decizie[i].L[j].id_bloc=0;
        }
    for (j=i; j<=nr_blocuri[5]; j++)
    {
        blocuri.decizie[j]=blocuri.decizie[j+1];
        refacere_legaturi_bloc_decizie(blocuri.decizie[j].L, j);
    }
    nr_blocuri[5]--;
}

void stergere_bloc_stop_decizie(int i)
{
    int j;
    for (j=0; j<=2; j++)
        if (blocuri.stop_decizie[i].L[j].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.stop_decizie[i].L[j]);
            blocuri.stop_decizie[i].L[j].id_bloc=0;
        }
    for (j=i; j<=nr_blocuri[6]; j++)
        {
            blocuri.stop_decizie[j]=blocuri.stop_decizie[j+1];
            refacere_legaturi_bloc_stop_decizie(blocuri.stop_decizie[j].L, j);
        }
    nr_blocuri[6]--;
}

void stergere_bloc_atribuire(int i)
{
    int j;
    for (j=1; j<=2; j++)
        if (blocuri.atribuire[i].L[j].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.atribuire[i].L[j]);
            blocuri.atribuire[i].L[j].id_bloc=0;
        }
    for (j=i; j<=nr_blocuri[7]; j++)
        {
            blocuri.atribuire[j]=blocuri.atribuire[j+1];
            refacere_legaturi_bloc_atribuire(blocuri.atribuire[j].L, j);
        }
    nr_blocuri[7]--;
}

void mouse_hover()
{
    while (1)
    {
        clearmouseclick(WM_LBUTTONDOWN);
        clearmouseclick(WM_RBUTTONDOWN);
        clearmouseclick(WM_MBUTTONDOWN);
        if (fereastra_schema)
        {
            hover_blocuri_meniu();
            hover_blocuri_schema();
            hover_buton_informatii();
            hover_butoane_meniu();
            if (schema_executata)
                hover_scroll();
        }
        else
            inchidere_fereastra_informatii();
    }
}

void hover_blocuri_meniu()
{
    if (nr_blocuri[1]==0)
        desenare_schema_start();
    else
    {
        if (nr_blocuri[2]==0)
            desenare_schema_stop();
        desenare_schema_citire();
        desenare_schema_afisare();
        desenare_schema_decizie();
        desenare_schema_stop_decizie();
        desenare_schema_atribuire();
    }
}

void desenare_schema_start()
{
    bool desen_bloc=0;
    if (hover_elipsa(meniu.start))
    {
        desenare_bloc_start(meniu.start.centru, cul_hover, cul_bloc_bkd, 0);
        while (hover_elipsa(meniu.start))
            if (ismouseclick(WM_LBUTTONDOWN))
                desen_bloc=1;
        if (desen_bloc)
            creare_bloc(1, text_blocuri[1]);
        desenare_bloc_start(meniu.start.centru, cul_marg, cul_bloc_bkd, 0);
    }
}

void desenare_schema_stop()
{
    bool desen_bloc=0;
    if (hover_elipsa(meniu.stop))
    {
        desenare_bloc_stop(meniu.stop.centru, cul_hover, cul_bloc_bkd, 0);
        while (hover_elipsa(meniu.stop))
            if (ismouseclick(WM_LBUTTONDOWN))
                desen_bloc=1;
        if (desen_bloc)
            creare_bloc(2, text_blocuri[2]);
        desenare_bloc_stop(meniu.stop.centru, cul_marg, cul_bloc_bkd, 0);
    }
}

void desenare_schema_citire()
{
    bool desen_bloc=0;
    if (hover_trapez_intors(meniu.citire))
    {
        desenare_bloc_citire(meniu.citire.centru, cul_hover, cul_bloc_bkd, text_blocuri[3], 0);
        while (hover_trapez_intors(meniu.citire))
            if (ismouseclick(WM_LBUTTONDOWN))
                desen_bloc=1;
        if (desen_bloc)
        {
            creare_bloc(3, text_blocuri[3]);
            coordonate centru=blocuri.citire[nr_blocuri[3]].centru;
            tabla_executare_schema();
            citire_sir(835, 75, "Variabila citita", s);
            tabla_executare_schema();
            desenare_bloc_citire(centru, cul_tabla, cul_tabla, text_blocuri[3], 0);
            stergere_bloc_citire(nr_blocuri[3]);
            desenare_bloc_citire(centru, cul_marg, cul_bloc_bkd, s, 1);
        }
        desenare_bloc_citire(meniu.citire.centru, cul_marg, cul_bloc_bkd, text_blocuri[3], 0);
    }
}

void desenare_schema_afisare()
{
    bool desen_bloc=0;
    if (hover_trapez_normal(meniu.afisare))
    {
        desenare_bloc_afisare(meniu.afisare.centru, cul_hover, cul_bloc_bkd, text_blocuri[4], 0);
        while (hover_trapez_normal(meniu.afisare))
            if (ismouseclick(WM_LBUTTONDOWN))
                desen_bloc=1;
        if (desen_bloc)
        {
            creare_bloc(4, text_blocuri[4]);
            coordonate centru=blocuri.afisare[nr_blocuri[4]].centru;
            tabla_executare_schema();
            citire_sir(835, 75, "Variabila afisata", s);
            tabla_executare_schema();
            desenare_bloc_afisare(centru, cul_tabla, cul_tabla, text_blocuri[4], 0);
            stergere_bloc_afisare(nr_blocuri[4]);
            desenare_bloc_afisare(centru, cul_marg, cul_bloc_bkd, s, 1);
        }
        desenare_bloc_afisare(meniu.afisare.centru, cul_marg, cul_bloc_bkd, text_blocuri[4], 0);
    }
}

void desenare_schema_decizie()
{
    bool desen_bloc=0;
    if (hover_triunghi(meniu.decizie))
    {
        desenare_bloc_decizie(meniu.decizie.centru, cul_hover, cul_bloc_bkd, text_blocuri[5], 0);
        while (hover_triunghi(meniu.decizie));
            if (ismouseclick(WM_LBUTTONDOWN))
                desen_bloc=1;
        if (desen_bloc)
        {
            creare_bloc(5, text_blocuri[5]);
            coordonate centru=blocuri.decizie[nr_blocuri[5]].centru;
            tabla_executare_schema();
            citire_sir(835, 75, "Conditie", s);
            tabla_executare_schema();
            desenare_bloc_decizie(centru, cul_tabla, cul_tabla, text_blocuri[5], 0);
            stergere_bloc_decizie(nr_blocuri[5]);
            desenare_bloc_decizie(centru, cul_marg, cul_bloc_bkd, s, 1);
        }
        desenare_bloc_decizie(meniu.decizie.centru, cul_marg, cul_bloc_bkd, text_blocuri[5], 0);
    }
}

void desenare_schema_stop_decizie()
{
    bool desen_bloc=0;
    if (hover_elipsa(meniu.stop_decizie))
    {
        desenare_bloc_stop_decizie(meniu.stop_decizie.centru, cul_hover, cul_bloc_bkd, 0);
        while (hover_elipsa(meniu.stop_decizie))
            if (ismouseclick(WM_LBUTTONDOWN))
                desen_bloc=1;
        if (desen_bloc)
            creare_bloc(6, text_blocuri[6]);
        desenare_bloc_stop_decizie(meniu.stop_decizie.centru, cul_marg, cul_bloc_bkd, 0);
    }
}

void desenare_schema_atribuire()
{
    bool desen_bloc=0;
    if (hover_dreptunghi(meniu.atribuire))
    {
        desenare_bloc_atribuire(meniu.atribuire.centru, cul_hover, cul_bloc_bkd, text_blocuri[7], 0);
        while (hover_dreptunghi(meniu.atribuire))
            if (ismouseclick(WM_LBUTTONDOWN))
                desen_bloc=1;
        if (desen_bloc)
        {
            creare_bloc(7, text_blocuri[7]);
            coordonate centru=blocuri.atribuire[nr_blocuri[7]].centru;
            tabla_executare_schema();
            citire_sir(835, 75, "Variabila modificata", s);
            tabla_executare_schema();
            desenare_bloc_atribuire(centru, cul_tabla, cul_tabla, text_blocuri[7], 0);
            stergere_bloc_atribuire(nr_blocuri[7]);
            desenare_bloc_atribuire(centru, cul_marg, cul_bloc_bkd, s, 1);
        }
        desenare_bloc_atribuire(meniu.atribuire.centru, cul_marg, cul_bloc_bkd, text_blocuri[7], 0);
    }
}

bool hover_elipsa(elipsa bloc)
{
    int x=mousex(), y=mousey();
    return x>=bloc.centru.x-bloc.r1 && x<=bloc.centru.x+bloc.r1 &&
           y>=bloc.centru.y-bloc.r2 && y<=bloc.centru.y+bloc.r1;
}

bool hover_trapez_normal(patrulater bloc)
{
    return hover_dreptunghi({bloc.centru, bloc.A, {0,0}, {bloc.D.x, bloc.B.y}, {0,0}}) ||
           hover_triunghi({bloc.centru, bloc.A, bloc.B, {bloc.A.x, bloc.B.y}}) ||
           hover_triunghi({bloc.centru, {bloc.D.x, bloc.C.y}, bloc.C, bloc.D});
}

bool hover_trapez_intors(patrulater bloc)
{
    return hover_dreptunghi({bloc.centru, {bloc.B.x, bloc.A.y}, {0,0}, bloc.C, {0,0}}) ||
           hover_triunghi({bloc.centru, bloc.A, bloc.B, {bloc.B.x, bloc.A.y}}) ||
           hover_triunghi({bloc.centru, bloc.C, bloc.D, {bloc.C.x, bloc.D.y}});
}

bool hover_dreptunghi(patrulater bloc)
{
    int x=mousex(), y=mousey();
    return x>=bloc.A.x && x<=bloc.C.x && y>=bloc.A.y && y<=bloc.C.y;
}

bool hover_triunghi(triunghi bloc)
{
    int x=mousex(), y=mousey();
    float A=arie_triunghi(bloc);
    float A1=arie_triunghi({bloc.centru, {x, y}, bloc.B, bloc.C});
    float A2=arie_triunghi({bloc.centru, bloc.A, {x, y}, bloc.C});
    float A3=arie_triunghi({bloc.centru, bloc.A, bloc.B, {x, y}});
    return A==(A1+A2+A3);
}

float arie_triunghi(triunghi bloc)
{
    return abs((bloc.A.x*(bloc.B.y-bloc.C.y)+
                bloc.B.x*(bloc.C.y-bloc.A.y)+
                bloc.C.x*(bloc.A.y-bloc.B.y)
                )/2.0);
}

bool hover_tabla()
{
    int x=mousex(), y=mousey();
    return x>=285 && x<=720 && y>=75 && y<=590;
}

void citire_sir(int x, int y, char mesaj[TEXTMAX], char S[TEXTMAX])
{
    strcpy(S, "\0");
    char Enter=13, BackSpace=8;
    char MultimeDeCaractereAcceptabile[200]="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<=>-+/%*!()'',. ";
    char Sinitial[TEXTMAX], tasta;
    char Ss[TEXTMAX], mesajs[TEXTMAX];

    setbkcolor(COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
    setcolor(BLACK);
    strcpy(Sinitial, S);
    strcpy(mesajs, mesaj);
    strcat(mesajs, ":");
    outtextxy(x, y, mesajs);
    x+=textwidth(mesajs);
    strcpy(S, "");
    do
    {
        tasta=getch();
        if (strchr(MultimeDeCaractereAcceptabile, tasta))
        {
            ///stergem fostul sir
            strcpy(Ss, S);
            strcat(Ss, "_ ");
            outtextxy(x, y, Ss);
            char tt2[2];
            tt2[0]=tasta;
            tt2[1]=0;
            strcat(S,tt2);
            ///afisam sirul nou
            strcpy(Ss, S);
            strcat(Ss, "_ ");
            outtextxy(x, y, Ss);
        }
        else if (tasta==BackSpace)
        {
            if (!strcmp(S, ""))
                Beep(800, 800);
            else
            {
                strcpy(Ss, S);
                strcat(Ss, "_ ");
                setcolor(COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
                outtextxy(x, y, Ss);
                setcolor(BLACK);
                S[strlen(S)-1]=0;
                strcpy(Ss, S);
                strcat(Ss, "_ ");
                outtextxy(x, y, Ss);
            }
        }
        else if (tasta!=Enter)
            Beep(800, 800);
    } while (tasta!=Enter);
    setcolor(COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
    outtextxy(x, y, Ss);
    setcolor(BLACK);
    Ss[strlen(Ss)-2]=0;
    outtextxy(x, y, Ss);
}

void creare_bloc(int id_bloc, char s[TEXTMAX])
{
    int x, y;
    bool desen_bloc=1;
    clearmouseclick(WM_LBUTTONDOWN);
    while (desen_bloc)
    {
        if (ismouseclick(WM_LBUTTONDOWN))
        {
            if (hover_tabla())
            {
                x=mousex(), y=mousey();
                refacere_schema();
                switch (id_bloc)
                {
                    case 1:
                        desenare_bloc_start({x, y}, cul_marg, cul_bloc_bkd, 1);
                        break;
                    case 2:
                        desenare_bloc_stop({x, y}, cul_marg, cul_bloc_bkd, 1);
                        break;
                    case 3:
                        desenare_bloc_citire({x, y}, cul_marg, cul_bloc_bkd, s, 1);
                        break;
                    case 4:
                        desenare_bloc_afisare({x, y}, cul_marg, cul_bloc_bkd, s, 1);
                        break;
                    case 5:
                        desenare_bloc_decizie({x, y}, cul_marg, cul_bloc_bkd, s, 1);
                        break;
                    case 6:
                        desenare_bloc_stop_decizie({x, y}, cul_marg, cul_bloc_bkd, 1);
                        break;
                    case 7:
                        desenare_bloc_atribuire({x, y}, cul_marg, cul_bloc_bkd, s, 1);
                        break;
                }
                desen_bloc=0;
            }
            clearmouseclick(WM_LBUTTONDOWN);
        }
    }
}

void hover_blocuri_schema()
{
    hover_blocuri_start();
    hover_blocuri_stop();
    hover_blocuri_citire();
    hover_blocuri_afisare();
    hover_blocuri_decizie();
    hover_blocuri_stop_decizie();
    hover_blocuri_atribuire();
}

void hover_blocuri_start()
{
    bool operatie_bloc=0;
    if (nr_blocuri[1] && hover_elipsa(blocuri.start))
    {
        while (hover_elipsa(blocuri.start) && !operatie_bloc)
            if (ismouseclick(WM_RBUTTONDOWN))
                click_dreapta_blocuri_start(operatie_bloc);
            else if (ismouseclick(WM_LBUTTONDOWN))
                click_stanga_blocuri_start(operatie_bloc);
            else if (ismouseclick(WM_MBUTTONDOWN))
                click_mijloc_blocuri_start(operatie_bloc);
    }
}

void click_dreapta_blocuri_start(bool &operatie_bloc)
{
    operatie_bloc=1;
    stergere_bloc_start();
    refacere_schema();
}

void click_stanga_blocuri_start(bool &operatie_bloc)
{
    operatie_bloc=1;
    clearmouseclick(WM_LBUTTONDOWN);
    desenare_bloc_start(blocuri.start.centru, cul_hover, cul_bloc_bkd, 0);
    mutare_bloc(1, 1);
    refacere_schema();
}

void click_mijloc_blocuri_start(bool &operatie_bloc)
{
    operatie_bloc=1;
    clearmouseclick(WM_MBUTTONDOWN);
    if (blocuri.start.L[2].id_bloc==0)
    {
        blocuri.start.L[2].p1={blocuri.start.centru.x, blocuri.start.centru.y+blocuri.start.r2+r_legatura};
        creare_legatura(blocuri.start.L[2], 1, 1, 2);
    }
    else
        stergere_legatura_dintre_blocuri(blocuri.start.L[2]);
}

void hover_blocuri_stop()
{
    bool operatie_bloc=0;
    if (nr_blocuri[2] && hover_elipsa(blocuri.stop))
    {
        while (hover_elipsa(blocuri.stop) && !operatie_bloc)
            if (ismouseclick(WM_RBUTTONDOWN))
                click_dreapta_blocuri_stop(operatie_bloc);
            else if (ismouseclick(WM_LBUTTONDOWN))
                click_stanga_blocuri_stop(operatie_bloc);
    }
}

void click_dreapta_blocuri_stop(bool &operatie_bloc)
{
    operatie_bloc=1;
    if (blocuri.stop.L[1].id_bloc==5)
    {
        if (blocuri.stop.L[1].nr_legatura==2 && blocuri.decizie[blocuri.stop.L[1].nr_bloc].L[3].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.decizie[blocuri.stop.L[1].nr_bloc].L[3]);
            blocuri.decizie[blocuri.stop.L[1].nr_bloc].L[3].id_bloc=0;
        }
        else if (blocuri.stop.L[1].nr_legatura==3 && blocuri.decizie[blocuri.stop.L[1].nr_bloc].L[2].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.decizie[blocuri.stop.L[1].nr_bloc].L[2]);
            blocuri.decizie[blocuri.stop.L[1].nr_bloc].L[2].id_bloc=0;
        }
    }
    stergere_bloc_stop();
    refacere_schema();
}

void click_stanga_blocuri_stop(bool &operatie_bloc)
{
    operatie_bloc=1;
    clearmouseclick(WM_LBUTTONDOWN);
    desenare_bloc_stop(blocuri.stop.centru, cul_hover, cul_bloc_bkd, 0);
    mutare_bloc(2, 1);
    refacere_schema();
}

void hover_blocuri_citire()
{
    int i;
    bool operatie_bloc;
    for (i=1; i<=nr_blocuri[3]; i++)
    {
        operatie_bloc=0;
        if (hover_trapez_intors(blocuri.citire[i]))
        {
            while (hover_trapez_intors(blocuri.citire[i]) && !operatie_bloc)
                if (ismouseclick(WM_RBUTTONDOWN))
                    click_dreapta_blocuri_citire(operatie_bloc, i);
                else if (ismouseclick(WM_LBUTTONDOWN))
                    click_stanga_blocuri_citire(operatie_bloc, i);
                else if (ismouseclick(WM_MBUTTONDOWN))
                    click_mijloc_blocuri_citire(operatie_bloc, i);
        }
    }
}

void click_dreapta_blocuri_citire(bool &operatie_bloc, int i)
{
    operatie_bloc=1;
    strcpy(s, blocuri.citire[i].text);
    if (blocuri.citire[i].L[1].id_bloc==5)
    {
        if (blocuri.citire[i].L[1].nr_legatura==2 && blocuri.decizie[blocuri.citire[i].L[1].nr_bloc].L[3].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.decizie[blocuri.citire[i].L[1].nr_bloc].L[3]);
            blocuri.decizie[blocuri.citire[i].L[1].nr_bloc].L[3].id_bloc=0;
        }
        else if (blocuri.citire[i].L[1].nr_legatura==3 && blocuri.decizie[blocuri.citire[i].L[1].nr_bloc].L[2].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.decizie[blocuri.citire[i].L[1].nr_bloc].L[2]);
            blocuri.decizie[blocuri.citire[i].L[1].nr_bloc].L[2].id_bloc=0;
        }
    }
    stergere_bloc_citire(i);
    refacere_schema();
}

void click_stanga_blocuri_citire(bool &operatie_bloc, int i)
{
    operatie_bloc=1;
    clearmouseclick(WM_LBUTTONDOWN);
    strcpy(s, blocuri.citire[i].text);
    desenare_bloc_citire(blocuri.citire[i].centru, cul_hover, cul_bloc_bkd, s, 0);
    mutare_bloc(3, i);
    refacere_schema();
}

void click_mijloc_blocuri_citire(bool &operatie_bloc, int i)
{
    operatie_bloc=1;
    clearmouseclick(WM_MBUTTONDOWN);
    if (blocuri.citire[i].L[2].id_bloc==0)
    {
        blocuri.citire[i].L[2].p1={blocuri.citire[i].centru.x, blocuri.citire[i].B.y+r_legatura};
        creare_legatura(blocuri.citire[i].L[2], 3, i, 2);
    }
    else
        stergere_legatura_dintre_blocuri(blocuri.citire[i].L[2]);
}

void hover_blocuri_afisare()
{
    int i;
    bool operatie_bloc;
    for (i=1; i<=nr_blocuri[4]; i++)
    {
        operatie_bloc=0;
        if (hover_trapez_normal(blocuri.afisare[i]))
        {
            while (hover_trapez_normal(blocuri.afisare[i]) && !operatie_bloc)
                if (ismouseclick(WM_RBUTTONDOWN))
                    click_dreapta_blocuri_afisare(operatie_bloc, i);
                else if (ismouseclick(WM_LBUTTONDOWN))
                    click_stanga_blocuri_afisare(operatie_bloc, i);
                else if (ismouseclick(WM_MBUTTONDOWN))
                    click_mijloc_blocuri_afisare(operatie_bloc, i);
        }
    }
}

void click_dreapta_blocuri_afisare(bool &operatie_bloc, int i)
{
    operatie_bloc=1;
    strcpy(s, blocuri.afisare[i].text);
    if (blocuri.afisare[i].L[1].id_bloc==5)
    {
        if (blocuri.afisare[i].L[1].nr_legatura==2 && blocuri.decizie[blocuri.afisare[i].L[1].nr_bloc].L[3].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.decizie[blocuri.afisare[i].L[1].nr_bloc].L[3]);
            blocuri.decizie[blocuri.afisare[i].L[1].nr_bloc].L[3].id_bloc=0;
        }
        else if (blocuri.afisare[i].L[1].nr_legatura==3 && blocuri.decizie[blocuri.afisare[i].L[1].nr_bloc].L[2].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.decizie[blocuri.afisare[i].L[1].nr_bloc].L[2]);
            blocuri.decizie[blocuri.afisare[i].L[1].nr_bloc].L[2].id_bloc=0;
        }
    }
    stergere_bloc_afisare(i);
    refacere_schema();
}

void click_stanga_blocuri_afisare(bool &operatie_bloc, int i)
{
    operatie_bloc=1;
    legatura L[3]; L[1]=blocuri.afisare[i].L[1]; L[2]=blocuri.afisare[i].L[2];
    clearmouseclick(WM_LBUTTONDOWN);
    strcpy(s, blocuri.afisare[i].text);
    desenare_bloc_afisare(blocuri.afisare[i].centru, cul_hover, cul_bloc_bkd, s, 0);
    mutare_bloc(4, i);
    refacere_schema();
}

void click_mijloc_blocuri_afisare(bool &operatie_bloc, int i)
{
    operatie_bloc=1;
    clearmouseclick(WM_MBUTTONDOWN);
    if (blocuri.afisare[i].L[2].id_bloc==0)
    {
        blocuri.afisare[i].L[2].p1={blocuri.afisare[i].centru.x, blocuri.afisare[i].B.y+r_legatura};
        creare_legatura(blocuri.afisare[i].L[2], 4, i, 2);
    }
    else
        stergere_legatura_dintre_blocuri(blocuri.afisare[i].L[2]);
}

void hover_blocuri_decizie()
{
    int i;
    bool operatie_bloc;
    for (i=1; i<=nr_blocuri[5]; i++)
    {
        operatie_bloc=0;
        if (hover_triunghi(blocuri.decizie[i]))
        {
            while (hover_triunghi(blocuri.decizie[i]) && !operatie_bloc)
                if (ismouseclick(WM_RBUTTONDOWN))
                    click_dreapta_blocuri_decizie(operatie_bloc, i);
                else if (ismouseclick(WM_LBUTTONDOWN))
                    click_stanga_blocuri_decizie(operatie_bloc, i);
                else if (ismouseclick(WM_MBUTTONDOWN))
                    click_mijloc_blocuri_decizie(operatie_bloc, i);
        }
    }
}

void click_dreapta_blocuri_decizie(bool &operatie_bloc, int i)
{
    operatie_bloc=1;
    strcpy(s, blocuri.decizie[i].text);
    if (blocuri.decizie[i].L[1].id_bloc==5)
    {
        if (blocuri.decizie[i].L[1].nr_legatura==2 && blocuri.decizie[blocuri.decizie[i].L[1].nr_bloc].L[3].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.decizie[blocuri.decizie[i].L[1].nr_bloc].L[3]);
            blocuri.decizie[blocuri.decizie[i].L[1].nr_bloc].L[3].id_bloc=0;
        }
        else if (blocuri.decizie[i].L[1].nr_legatura==3 && blocuri.decizie[blocuri.decizie[i].L[1].nr_bloc].L[2].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.decizie[blocuri.decizie[i].L[1].nr_bloc].L[2]);
            blocuri.decizie[blocuri.decizie[i].L[1].nr_bloc].L[2].id_bloc=0;
        }
    }
    stergere_bloc_decizie(i);
    refacere_schema();
}

void click_stanga_blocuri_decizie(bool &operatie_bloc, int i)
{
    operatie_bloc=1;
    legatura L[5];
    for (int j=1; j<=4; j++)
        L[j]=blocuri.decizie[i].L[j];
    clearmouseclick(WM_LBUTTONDOWN);
    strcpy(s, blocuri.decizie[i].text);
    desenare_bloc_decizie(blocuri.decizie[i].centru, cul_hover, cul_bloc_bkd, s, 0);
    mutare_bloc(5, i);
    refacere_schema();
}

void click_mijloc_blocuri_decizie(bool &operatie_bloc, int i)
{
    operatie_bloc=1;
    clearmouseclick(WM_MBUTTONDOWN);
    if (blocuri.decizie[i].L[2].id_bloc==0 && blocuri.decizie[i].L[3].id_bloc==0)
    {
        blocuri.decizie[i].L[2].p1={blocuri.decizie[i].A.x, blocuri.decizie[i].A.y+r_legatura};
        creare_legatura(blocuri.decizie[i].L[2], 5, i, 2);
        blocuri.decizie[i].L[3].p1={blocuri.decizie[i].B.x, blocuri.decizie[i].B.y+r_legatura};
        creare_legatura(blocuri.decizie[i].L[3], 5, i, 3);
    }
    else
    {
        stergere_legatura_dintre_blocuri(blocuri.decizie[i].L[2]);
        stergere_legatura_dintre_blocuri(blocuri.decizie[i].L[3]);
    }
}

void hover_blocuri_stop_decizie()
{
    int i;
    bool operatie_bloc;
    for (i=1; i<=nr_blocuri[6]; i++)
    {
        operatie_bloc=0;
        if (hover_elipsa(blocuri.stop_decizie[i]))
        {
            while (hover_elipsa(blocuri.stop_decizie[i]) && !operatie_bloc)
                if (ismouseclick(WM_RBUTTONDOWN))
                    click_dreapta_blocuri_stop_decizie(operatie_bloc, i);
                else if (ismouseclick(WM_LBUTTONDOWN))
                    click_stanga_blocuri_stop_decizie(operatie_bloc, i);
                else if (ismouseclick(WM_MBUTTONDOWN))
                    click_mijloc_blocuri_stop_decizie(operatie_bloc, i);
        }
    }
}

void click_dreapta_blocuri_stop_decizie(bool &operatie_bloc, int i)
{
    operatie_bloc=1;
    if (blocuri.stop_decizie[i].L[0].id_bloc==5)
    {
        if (blocuri.stop_decizie[i].L[0].nr_legatura==2 && blocuri.decizie[blocuri.stop_decizie[i].L[0].nr_bloc].L[3].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.decizie[blocuri.stop_decizie[i].L[0].nr_bloc].L[3]);
            blocuri.decizie[blocuri.stop_decizie[i].L[0].nr_bloc].L[3].id_bloc=0;
        }
        else if (blocuri.stop_decizie[i].L[0].nr_legatura==3 && blocuri.decizie[blocuri.stop_decizie[i].L[0].nr_bloc].L[2].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.decizie[blocuri.stop_decizie[i].L[0].nr_bloc].L[2]);
            blocuri.decizie[blocuri.stop_decizie[i].L[0].nr_bloc].L[2].id_bloc=0;
        }
    }
    if (blocuri.stop_decizie[i].L[1].id_bloc==5)
    {
        if (blocuri.stop_decizie[i].L[1].nr_legatura==2 && blocuri.decizie[blocuri.stop_decizie[i].L[1].nr_bloc].L[3].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.decizie[blocuri.stop_decizie[i].L[1].nr_bloc].L[3]);
            blocuri.decizie[blocuri.stop_decizie[i].L[1].nr_bloc].L[3].id_bloc=0;
        }
        else if (blocuri.stop_decizie[i].L[1].nr_legatura==3 && blocuri.decizie[blocuri.stop_decizie[i].L[1].nr_bloc].L[2].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.decizie[blocuri.stop_decizie[i].L[1].nr_bloc].L[2]);
            blocuri.decizie[blocuri.stop_decizie[i].L[1].nr_bloc].L[2].id_bloc=0;
        }
    }
    stergere_bloc_stop_decizie(i);
    refacere_schema();
}

void click_stanga_blocuri_stop_decizie(bool &operatie_bloc, int i)
{
    operatie_bloc=1;
    legatura L[3];
    for (int j=0; j<=2; j++)
        L[j]=blocuri.stop_decizie[i].L[j];
    clearmouseclick(WM_LBUTTONDOWN);
    desenare_bloc_stop_decizie(blocuri.stop_decizie[i].centru, cul_hover, cul_bloc_bkd, 0);
    mutare_bloc(6, i);
    refacere_schema();
}

void click_mijloc_blocuri_stop_decizie(bool &operatie_bloc, int i)
{
    operatie_bloc=1;
    clearmouseclick(WM_MBUTTONDOWN);
    if (blocuri.stop_decizie[i].L[2].id_bloc==0)
    {
        blocuri.stop_decizie[i].L[2].p1={blocuri.stop_decizie[i].centru.x, blocuri.stop_decizie[i].centru.y+blocuri.stop_decizie[i].r2+r_legatura};
        creare_legatura(blocuri.stop_decizie[i].L[2], 6, i, 2);
    }
    else
        stergere_legatura_dintre_blocuri(blocuri.stop_decizie[i].L[2]);
}

void hover_blocuri_atribuire()
{
    int i;
    bool operatie_bloc;
    for (i=1; i<=nr_blocuri[7]; i++)
    {
        operatie_bloc=0;
        if (hover_dreptunghi(blocuri.atribuire[i]))
        {
            while (hover_dreptunghi(blocuri.atribuire[i]) && !operatie_bloc)
                if (ismouseclick(WM_RBUTTONDOWN))
                    click_dreapta_blocuri_atribuire(operatie_bloc, i);
                else if (ismouseclick(WM_LBUTTONDOWN))
                    click_stanga_blocuri_atribuire(operatie_bloc, i);
                else if (ismouseclick(WM_MBUTTONDOWN))
                    click_mijloc_blocuri_atribuire(operatie_bloc, i);
        }
    }
}

void click_dreapta_blocuri_atribuire(bool &operatie_bloc, int i)
{
    operatie_bloc=1;
    strcpy(s, blocuri.atribuire[i].text);
    if (blocuri.atribuire[i].L[1].id_bloc==5)
    {
        if (blocuri.atribuire[i].L[1].nr_legatura==2 && blocuri.decizie[blocuri.atribuire[i].L[1].nr_bloc].L[3].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.decizie[blocuri.atribuire[i].L[1].nr_bloc].L[3]);
            blocuri.decizie[blocuri.atribuire[i].L[1].nr_bloc].L[3].id_bloc=0;
        }
        else if (blocuri.atribuire[i].L[1].nr_legatura==3 && blocuri.decizie[blocuri.atribuire[i].L[1].nr_bloc].L[2].id_bloc)
        {
            stergere_legatura_cu_bloc(blocuri.decizie[blocuri.atribuire[i].L[1].nr_bloc].L[2]);
            blocuri.decizie[blocuri.atribuire[i].L[1].nr_bloc].L[2].id_bloc=0;
        }
    }
    stergere_bloc_atribuire(i);
    refacere_schema();
}

void click_stanga_blocuri_atribuire(bool &operatie_bloc, int i)
{
    operatie_bloc=1;
    legatura L[3]; L[1]=blocuri.atribuire[i].L[1]; L[2]=blocuri.atribuire[i].L[2];
    clearmouseclick(WM_LBUTTONDOWN);
    strcpy(s, blocuri.atribuire[i].text);
    desenare_bloc_atribuire(blocuri.atribuire[i].centru, cul_hover, cul_bloc_bkd, s, 0);
    mutare_bloc(7, i);
    refacere_schema();
}

void click_mijloc_blocuri_atribuire(bool &operatie_bloc, int i)
{
    operatie_bloc=1;
    clearmouseclick(WM_MBUTTONDOWN);
    if (blocuri.atribuire[i].L[2].id_bloc==0)
    {
        blocuri.atribuire[i].L[2].p1={blocuri.atribuire[i].centru.x, blocuri.atribuire[i].B.y+r_legatura};
        creare_legatura(blocuri.atribuire[i].L[2], 7, i, 2);
    }
    else
        stergere_legatura_dintre_blocuri(blocuri.atribuire[i].L[2]);
}

void creare_legatura(legatura &L, int id_bloc, int nr_bloc, int nr_legatura)
{
    bool operatie_bloc=0;
    while (!operatie_bloc)
        if (ismouseclick(WM_MBUTTONDOWN))
        {
            if (click_alta_piesa(L, id_bloc, nr_bloc, nr_legatura))
            {
                desenare_legatura(L);
                operatie_bloc=1;
            }
            clearmouseclick(WM_MBUTTONDOWN);
        }
}

bool click_alta_piesa(legatura &L, int id_bloc, int nr_bloc, int nr_legatura)
{
    return  legatura_bloc_stop(L, id_bloc, nr_bloc, nr_legatura)         ||
            legatura_bloc_citire(L, id_bloc, nr_bloc, nr_legatura)       ||
            legatura_bloc_afisare(L, id_bloc, nr_bloc, nr_legatura)      ||
            legatura_bloc_decizie(L, id_bloc, nr_bloc, nr_legatura)      ||
            legatura_bloc_stop_decizie(L, id_bloc, nr_bloc, nr_legatura) ||
            legatura_bloc_atribuire(L, id_bloc, nr_bloc, nr_legatura);
}

bool legatura_bloc_stop(legatura &L, int id_bloc, int nr_bloc, int nr_legatura)
{
    if (hover_elipsa(blocuri.stop) && !blocuri.stop.L[1].id_bloc)
    {
        L.p2={blocuri.stop.centru.x, blocuri.stop.centru.y-blocuri.stop.r2-r_legatura};
        blocuri.stop.L[1].p1=L.p2; blocuri.stop.L[1].p2=L.p1;
        L.id_bloc=2;     blocuri.stop.L[1].id_bloc=id_bloc;
        L.nr_bloc=1;     blocuri.stop.L[1].nr_bloc=nr_bloc;
        L.nr_legatura=1; blocuri.stop.L[1].nr_legatura=nr_legatura;
        return 1;
    }
    return 0;
}

bool legatura_bloc_citire(legatura &L, int id_bloc, int nr_bloc, int nr_legatura)
{
    int i;
    for (i=1; i<=nr_blocuri[3]; i++)
        if (hover_trapez_intors(blocuri.citire[i]) && !blocuri.citire[i].L[1].id_bloc)
        {
            L.p2={blocuri.citire[i].centru.x, blocuri.citire[i].A.y-r_legatura};
            blocuri.citire[i].L[1].p1=L.p2; blocuri.citire[i].L[1].p2=L.p1;
            L.id_bloc=3;     blocuri.citire[i].L[1].id_bloc=id_bloc;
            L.nr_bloc=i;     blocuri.citire[i].L[1].nr_bloc=nr_bloc;
            L.nr_legatura=1; blocuri.citire[i].L[1].nr_legatura=nr_legatura;
            return 1;
        }
    return 0;
}

bool legatura_bloc_afisare(legatura &L, int id_bloc, int nr_bloc, int nr_legatura)
{
    int i;
    for (i=1; i<=nr_blocuri[4]; i++)
        if (hover_trapez_normal(blocuri.afisare[i])  && !blocuri.afisare[i].L[1].id_bloc)
        {
            L.p2={blocuri.afisare[i].centru.x, blocuri.afisare[i].A.y-r_legatura};
            blocuri.afisare[i].L[1].p1=L.p2; blocuri.afisare[i].L[1].p2=L.p1;
            L.id_bloc=4;     blocuri.afisare[i].L[1].id_bloc=id_bloc;
            L.nr_bloc=i;     blocuri.afisare[i].L[1].nr_bloc=nr_bloc;
            L.nr_legatura=1; blocuri.afisare[i].L[1].nr_legatura=nr_legatura;
            return 1;
        }
    return 0;
}

bool legatura_bloc_decizie(legatura &L, int id_bloc, int nr_bloc, int nr_legatura)
{
    int i;
    for (i=1; i<=nr_blocuri[5]; i++)
        if (hover_triunghi(blocuri.decizie[i]))
            if (!blocuri.decizie[i].L[1].id_bloc)
            {
                L.p2={blocuri.decizie[i].C.x, blocuri.decizie[i].C.y-r_legatura};
                blocuri.decizie[i].L[1].p1=L.p2; blocuri.decizie[i].L[1].p2=L.p1;
                L.id_bloc=5;     blocuri.decizie[i].L[1].id_bloc=id_bloc;
                L.nr_bloc=i;     blocuri.decizie[i].L[1].nr_bloc=nr_bloc;
                L.nr_legatura=1; blocuri.decizie[i].L[1].nr_legatura=nr_legatura;
                return 1;
            }
            else
            {
                loop=1;
                L.p2={blocuri.decizie[i].C.x, blocuri.decizie[i].C.y-r_legatura};
                blocuri.decizie[i].L[4].p1=L.p2; blocuri.decizie[i].L[4].p2=L.p1;
                L.id_bloc=5;     blocuri.decizie[i].L[4].id_bloc=id_bloc;
                L.nr_bloc=i;     blocuri.decizie[i].L[4].nr_bloc=nr_bloc;
                L.nr_legatura=4; blocuri.decizie[i].L[4].nr_legatura=nr_legatura;
                return 1;
            }
    return 0;
}

bool legatura_bloc_stop_decizie(legatura &L, int id_bloc, int nr_bloc, int nr_legatura)
{
    int i;
    for (i=1; i<=nr_blocuri[6]; i++)
        if (hover_elipsa(blocuri.stop_decizie[i]) && (!blocuri.stop_decizie[i].L[0].id_bloc || !blocuri.stop_decizie[i].L[1].id_bloc))
        {
            L.p2={blocuri.stop_decizie[i].centru.x, blocuri.stop_decizie[i].centru.y-blocuri.stop_decizie[i].r2-r_legatura};
            L.id_bloc=6; L.nr_bloc=i;
            if (!blocuri.stop_decizie[i].L[0].id_bloc)
            {
                blocuri.stop_decizie[i].L[0].p1=L.p2; blocuri.stop_decizie[i].L[0].p2=L.p1;
                blocuri.stop_decizie[i].L[0].id_bloc=id_bloc;
                blocuri.stop_decizie[i].L[0].nr_bloc=nr_bloc;
                L.nr_legatura=0; blocuri.stop_decizie[i].L[0].nr_legatura=nr_legatura;
                return 1;
            }
            else if (!blocuri.stop_decizie[i].L[1].id_bloc)
            {
                blocuri.stop_decizie[i].L[1].p1=L.p2; blocuri.stop_decizie[i].L[1].p2=L.p1;
                blocuri.stop_decizie[i].L[1].id_bloc=id_bloc;
                blocuri.stop_decizie[i].L[1].nr_bloc=nr_bloc;
                L.nr_legatura=1; blocuri.stop_decizie[i].L[1].nr_legatura=nr_legatura;
                return 1;
            }
        }
    return 0;
}

bool legatura_bloc_atribuire(legatura &L, int id_bloc, int nr_bloc, int nr_legatura)
{
    int i;
    for (i=1; i<=nr_blocuri[7]; i++)
        if (hover_dreptunghi(blocuri.atribuire[i]) && !blocuri.atribuire[i].L[1].id_bloc)
        {
            L.p2={blocuri.atribuire[i].centru.x, blocuri.atribuire[i].A.y-r_legatura};
            blocuri.atribuire[i].L[1].p1=L.p2; blocuri.atribuire[i].L[1].p2=L.p1;
            L.id_bloc=7;     blocuri.atribuire[i].L[1].id_bloc=id_bloc;
            L.nr_bloc=i;     blocuri.atribuire[i].L[1].nr_bloc=nr_bloc;
            L.nr_legatura=1; blocuri.atribuire[i].L[1].nr_legatura=nr_legatura;
            return 1;
        }
    return 0;
}

void desenare_legatura(legatura &L)
{
    if (loop || L.nr_legatura==4)
    {
        line(L.p1.x, L.p1.y, 225, L.p1.y);
        line(225, L.p1.y, 225, L.p2.y);
        line(225, L.p2.y, L.p2.x, L.p2.y);
        loop=0;
    }
    else
    {
        line(L.p1.x, L.p1.y, L.p1.x, (L.p2.y+L.p1.y)/2);
        line(L.p1.x, (L.p2.y+L.p1.y)/2, L.p2.x, (L.p2.y+L.p1.y)/2);
        line(L.p2.x, (L.p2.y+L.p1.y)/2, L.p2.x, L.p2.y);
    }
}

void stergere_legatura_dintre_blocuri(legatura &L)
{
    bool stergere_legatura=0;
    while (!stergere_legatura)
        if (ismouseclick(WM_MBUTTONDOWN))
        {
            if (click_piesa_legatura(L))
            {
                stergere_legatura_cu_bloc(L);
                L.id_bloc=0;
                refacere_schema();
                stergere_legatura=1;
            }
            clearmouseclick(WM_MBUTTONDOWN);
        }
}

void stergere_legatura_cu_bloc(legatura &L)
{
    switch (L.id_bloc)
    {
        case 1:
            blocuri.start.L[L.nr_legatura].id_bloc=0;
            break;
        case 2:
            blocuri.stop.L[L.nr_legatura].id_bloc=0;
            break;
        case 3:
            blocuri.citire[L.nr_bloc].L[L.nr_legatura].id_bloc=0;
            break;
        case 4:
            blocuri.afisare[L.nr_bloc].L[L.nr_legatura].id_bloc=0;
            break;
        case 5:
            blocuri.decizie[L.nr_bloc].L[L.nr_legatura].id_bloc=0;
            break;
        case 6:
            blocuri.stop_decizie[L.nr_bloc].L[L.nr_legatura].id_bloc=0;
            break;
        case 7:
            blocuri.atribuire[L.nr_bloc].L[L.nr_legatura].id_bloc=0;
            break;
    }
}

bool click_piesa_legatura(legatura L)
{
    return  L.id_bloc==2 && hover_elipsa(blocuri.stop)                      ||
            L.id_bloc==3 && hover_trapez_intors(blocuri.citire[L.nr_bloc])  ||
            L.id_bloc==4 && hover_trapez_normal(blocuri.afisare[L.nr_bloc]) ||
            L.id_bloc==5 && hover_triunghi(blocuri.decizie[L.nr_bloc])      ||
            L.id_bloc==6 && hover_elipsa(blocuri.stop_decizie[L.nr_bloc])   ||
            L.id_bloc==7 && hover_dreptunghi(blocuri.atribuire[L.nr_bloc]);
}

void mutare_bloc(int id_bloc, int i)
{
    int x, y;
    bool desen_bloc=1;
    clearmouseclick(WM_LBUTTONDOWN);
    while (desen_bloc)
    {
        if (ismouseclick(WM_LBUTTONDOWN))
        {
            if (hover_tabla())
            {
                x=mousex(), y=mousey();
                switch (id_bloc)
                {
                    case 1:
                        coordonate_bloc_start(blocuri.start, {x, y});
                        refacere_legaturi_bloc_start(blocuri.start.L[2]);
                        break;
                    case 2:
                        coordonate_bloc_stop(blocuri.stop, {x, y});
                        refacere_legaturi_bloc_stop(blocuri.stop.L[1]);
                        break;
                    case 3:
                        coordonate_bloc_citire(blocuri.citire[i], {x, y});
                        refacere_legaturi_bloc_citire(blocuri.citire[i].L, i);
                        break;
                    case 4:
                        coordonate_bloc_afisare(blocuri.afisare[i], {x, y});
                        refacere_legaturi_bloc_afisare(blocuri.afisare[i].L, i);
                        break;
                    case 5:
                        coordonate_bloc_decizie(blocuri.decizie[i], {x, y});
                        refacere_legaturi_bloc_decizie(blocuri.decizie[i].L, i);
                        break;
                    case 6:
                        coordonate_bloc_stop_decizie(blocuri.stop_decizie[i], {x, y});
                        refacere_legaturi_bloc_stop_decizie(blocuri.stop_decizie[i].L, i);
                        break;
                    case 7:
                        coordonate_bloc_atribuire(blocuri.atribuire[i], {x, y});
                        refacere_legaturi_bloc_atribuire(blocuri.atribuire[i].L, i);
                        break;
                }
                desen_bloc=0;
            }
            clearmouseclick(WM_LBUTTONDOWN);
        }
    }
}

void refacere_legaturi_bloc_start(legatura L)
{
    if (L.id_bloc)
    {
        blocuri.start.L[2]=L;
        blocuri.start.L[2].p1={blocuri.start.centru.x, blocuri.start.centru.y+blocuri.start.r2+r_legatura};
        refacere_legatura_cu_bloc(blocuri.start.L[2], 1, 1);
        desenare_legatura(blocuri.start.L[2]);
    }
}

void refacere_legaturi_bloc_stop(legatura L)
{
    if (L.id_bloc)
    {
        blocuri.stop.L[1]=L;
        blocuri.stop.L[1].p1.x=blocuri.stop.centru.x;
        blocuri.stop.L[1].p1.y=blocuri.stop.centru.y-blocuri.stop.r2-r_legatura;
        refacere_legatura_cu_bloc(blocuri.stop.L[1], 2, 1);
        desenare_legatura(blocuri.stop.L[1]);
    }
}

void refacere_legaturi_bloc_citire(legatura L[3], int nr)
{
    if (L[1].id_bloc)
    {
        blocuri.citire[nr].L[1]=L[1];
        blocuri.citire[nr].L[1].p1.x=blocuri.citire[nr].centru.x;
        blocuri.citire[nr].L[1].p1.y=blocuri.citire[nr].A.y-r_legatura;
        refacere_legatura_cu_bloc(blocuri.citire[nr].L[1], 3, nr);
        desenare_legatura(blocuri.citire[nr].L[1]);
    }
    if (L[2].id_bloc)
    {
        blocuri.citire[nr].L[2]=L[2];
        blocuri.citire[nr].L[2].p1.x=blocuri.citire[nr].centru.x;
        blocuri.citire[nr].L[2].p1.y=blocuri.citire[nr].B.y+r_legatura;
        refacere_legatura_cu_bloc(blocuri.citire[nr].L[2], 3, nr);
        desenare_legatura(blocuri.citire[nr].L[2]);
    }
}

void refacere_legaturi_bloc_afisare(legatura L[3], int nr)
{
    if (L[1].id_bloc)
    {
        blocuri.afisare[nr].L[1]=L[1];
        blocuri.afisare[nr].L[1].p1.x=blocuri.afisare[nr].centru.x;
        blocuri.afisare[nr].L[1].p1.y=blocuri.afisare[nr].A.y-r_legatura;
        refacere_legatura_cu_bloc(blocuri.afisare[nr].L[1], 4, nr);
        desenare_legatura(blocuri.afisare[nr].L[1]);
    }
    if (L[2].id_bloc)
    {
        blocuri.afisare[nr].L[2]=L[2];
        blocuri.afisare[nr].L[2].p1.x=blocuri.afisare[nr].centru.x;
        blocuri.afisare[nr].L[2].p1.y=blocuri.afisare[nr].B.y+r_legatura;
        refacere_legatura_cu_bloc(blocuri.afisare[nr].L[2], 4, nr);
        desenare_legatura(blocuri.afisare[nr].L[2]);
    }
}

void refacere_legaturi_bloc_decizie(legatura L[5], int nr)
{
    if (L[1].id_bloc)
    {
        blocuri.decizie[nr].L[1]=L[1];
        blocuri.decizie[nr].L[1].p1.x=blocuri.decizie[nr].C.x;
        blocuri.decizie[nr].L[1].p1.y=blocuri.decizie[nr].C.y-r_legatura;
        refacere_legatura_cu_bloc(blocuri.decizie[nr].L[1], 5, nr);
        desenare_legatura(blocuri.decizie[nr].L[1]);
    }
    if (L[2].id_bloc)
    {
        blocuri.decizie[nr].L[2]=L[2];
        blocuri.decizie[nr].L[2].p1.x=blocuri.decizie[nr].A.x;
        blocuri.decizie[nr].L[2].p1.y=blocuri.decizie[nr].A.y+r_legatura;
        refacere_legatura_cu_bloc(blocuri.decizie[nr].L[2], 5, nr);
        desenare_legatura(blocuri.decizie[nr].L[2]);

    }
    if (L[3].id_bloc)
    {
        blocuri.decizie[nr].L[3]=L[3];
        blocuri.decizie[nr].L[3].p1.x=blocuri.decizie[nr].B.x;
        blocuri.decizie[nr].L[3].p1.y=blocuri.decizie[nr].B.y+r_legatura;
        refacere_legatura_cu_bloc(blocuri.decizie[nr].L[3], 5, nr);
        desenare_legatura(blocuri.decizie[nr].L[3]);
    }
    if (L[4].id_bloc)
    {
        loop=1;
        blocuri.decizie[nr].L[4]=L[4];
        blocuri.decizie[nr].L[4].p1.x=blocuri.decizie[nr].C.x;
        blocuri.decizie[nr].L[4].p1.y=blocuri.decizie[nr].C.y-r_legatura;
        refacere_legatura_cu_bloc(blocuri.decizie[nr].L[4], 5, nr);
        desenare_legatura(blocuri.decizie[nr].L[4]);
    }
}

void refacere_legaturi_bloc_stop_decizie(legatura L[3], int nr)
{
    if (L[0].id_bloc)
    {
        blocuri.stop_decizie[nr].L[0]=L[0];
        blocuri.stop_decizie[nr].L[0].p1.x=blocuri.stop_decizie[nr].centru.x;
        blocuri.stop_decizie[nr].L[0].p1.y=blocuri.stop_decizie[nr].centru.y-blocuri.stop_decizie[nr].r2-r_legatura;
        refacere_legatura_cu_bloc(blocuri.stop_decizie[nr].L[0], 6, nr);
        desenare_legatura(blocuri.stop_decizie[nr].L[0]);
    }
    if (L[1].id_bloc)
    {
        blocuri.stop_decizie[nr].L[1]=L[1];
        blocuri.stop_decizie[nr].L[1].p1.x=blocuri.stop_decizie[nr].centru.x;
        blocuri.stop_decizie[nr].L[1].p1.y=blocuri.stop_decizie[nr].centru.y-blocuri.stop_decizie[nr].r2-r_legatura;
        refacere_legatura_cu_bloc(blocuri.stop_decizie[nr].L[1], 6, nr);
        desenare_legatura(blocuri.stop_decizie[nr].L[1]);
    }
    if (L[2].id_bloc)
    {
        blocuri.stop_decizie[nr].L[2]=L[2];
        blocuri.stop_decizie[nr].L[2].p1.x=blocuri.stop_decizie[nr].centru.x;
        blocuri.stop_decizie[nr].L[2].p1.y=blocuri.stop_decizie[nr].centru.y+blocuri.stop_decizie[nr].r2+r_legatura;
        refacere_legatura_cu_bloc(blocuri.stop_decizie[nr].L[2], 6, nr);
        desenare_legatura(blocuri.stop_decizie[nr].L[2]);
    }
}

void refacere_legaturi_bloc_atribuire(legatura L[3], int nr)
{
    if (L[1].id_bloc)
    {
        blocuri.atribuire[nr].L[1]=L[1];
        blocuri.atribuire[nr].L[1].p1.x=blocuri.atribuire[nr].centru.x;
        blocuri.atribuire[nr].L[1].p1.y=blocuri.atribuire[nr].A.y-r_legatura;
        refacere_legatura_cu_bloc(blocuri.atribuire[nr].L[1], 7, nr);
        desenare_legatura(blocuri.atribuire[nr].L[1]);
    }
    if (L[2].id_bloc)
    {
        blocuri.atribuire[nr].L[2]=L[2];
        blocuri.atribuire[nr].L[2].p1.x=blocuri.atribuire[nr].centru.x;
        blocuri.atribuire[nr].L[2].p1.y=blocuri.atribuire[nr].B.y+r_legatura;
        refacere_legatura_cu_bloc(blocuri.atribuire[nr].L[2], 7, nr);
        desenare_legatura(blocuri.atribuire[nr].L[2]);
    }
}

void refacere_legatura_cu_bloc(legatura L, int id_bloc, int nr_bloc)
{
    switch (L.id_bloc)
    {
        case 1:
            blocuri.start.L[L.nr_legatura].p2=L.p1;
            blocuri.start.L[L.nr_legatura].id_bloc=id_bloc;
            blocuri.start.L[L.nr_legatura].nr_bloc=nr_bloc;
            break;
        case 2:
            blocuri.stop.L[L.nr_legatura].p2=L.p1;
            blocuri.stop.L[L.nr_legatura].id_bloc=id_bloc;
            blocuri.stop.L[L.nr_legatura].nr_bloc=nr_bloc;
            break;
        case 3:
            blocuri.citire[L.nr_bloc].L[L.nr_legatura].p2=L.p1;
            blocuri.citire[L.nr_bloc].L[L.nr_legatura].id_bloc=id_bloc;
            blocuri.citire[L.nr_bloc].L[L.nr_legatura].nr_bloc=nr_bloc;
            break;
        case 4:
            blocuri.afisare[L.nr_bloc].L[L.nr_legatura].p2=L.p1;
            blocuri.afisare[L.nr_bloc].L[L.nr_legatura].id_bloc=id_bloc;
            blocuri.afisare[L.nr_bloc].L[L.nr_legatura].nr_bloc=nr_bloc;
            break;
        case 5:
            blocuri.decizie[L.nr_bloc].L[L.nr_legatura].p2=L.p1;
            blocuri.decizie[L.nr_bloc].L[L.nr_legatura].id_bloc=id_bloc;
            blocuri.decizie[L.nr_bloc].L[L.nr_legatura].nr_bloc=nr_bloc;
            break;
        case 6:
            blocuri.stop_decizie[L.nr_bloc].L[L.nr_legatura].p2=L.p1;
            blocuri.stop_decizie[L.nr_bloc].L[L.nr_legatura].id_bloc=id_bloc;
            blocuri.stop_decizie[L.nr_bloc].L[L.nr_legatura].nr_bloc=nr_bloc;
            break;
        case 7:
            blocuri.atribuire[L.nr_bloc].L[L.nr_legatura].p2=L.p1;
            blocuri.atribuire[L.nr_bloc].L[L.nr_legatura].id_bloc=id_bloc;
            blocuri.atribuire[L.nr_bloc].L[L.nr_legatura].nr_bloc=nr_bloc;
            break;
    }
}

void refacere_schema()
{
    setlinestyle(cul_marg.c1, cul_marg.c2, cul_marg.c3+1);
    setfillstyle(1, COLOR(cul_tabla.c1, cul_tabla.c2, cul_tabla.c3));
    setcolor(COLOR(cul_marg.c1, cul_marg.c2, cul_marg.c3));
    bar(200, 25, 800, 625);
    rectangle(200, 25, 800, 625);

    refacere_butoane_start();
    refacere_butoane_stop();
    refacere_butoane_citire();
    refacere_butoane_afisare();
    refacere_butoane_decizie();
    refacere_butoane_stop_decizie();
    refacere_butoane_atribuire();
}

void refacere_butoane_start()
{
    if (nr_blocuri[1])
    {
        desenare_bloc_start(blocuri.start.centru, cul_marg, cul_bloc_bkd, 0);
        if (blocuri.start.L[2].id_bloc)
            desenare_legatura(blocuri.start.L[2]);
    }
}

void refacere_butoane_stop()
{
    if (nr_blocuri[2])
        desenare_bloc_stop(blocuri.stop.centru, cul_marg, cul_bloc_bkd, 0);
}

void refacere_butoane_citire()
{
    int i;
    for (i=1; i<=nr_blocuri[3]; i++)
    {
        desenare_bloc_citire(blocuri.citire[i].centru, cul_marg, cul_bloc_bkd, blocuri.citire[i].text, 0);
        if (blocuri.citire[i].L[2].id_bloc)
            desenare_legatura(blocuri.citire[i].L[2]);
    }
}

void refacere_butoane_afisare()
{
    int i;
    for (i=1; i<=nr_blocuri[4]; i++)
    {
        desenare_bloc_afisare(blocuri.afisare[i].centru, cul_marg, cul_bloc_bkd, blocuri.afisare[i].text, 0);
        if (blocuri.afisare[i].L[2].id_bloc)
            desenare_legatura(blocuri.afisare[i].L[2]);
    }
}

void refacere_butoane_decizie()
{
    int i;
    for (i=1; i<=nr_blocuri[5]; i++)
    {
        desenare_bloc_decizie(blocuri.decizie[i].centru, cul_marg, cul_bloc_bkd,  blocuri.decizie[i].text, 0);
        if (blocuri.decizie[i].L[2].id_bloc)
            desenare_legatura(blocuri.decizie[i].L[2]);
        if (blocuri.decizie[i].L[3].id_bloc)
            desenare_legatura(blocuri.decizie[i].L[3]);
    }
}

void refacere_butoane_stop_decizie()
{
    int i;
    for (i=1; i<=nr_blocuri[6]; i++)
    {
        desenare_bloc_stop_decizie(blocuri.stop_decizie[i].centru, cul_marg, cul_bloc_bkd, 0);
        if (blocuri.stop_decizie[i].L[2].id_bloc)
            desenare_legatura(blocuri.stop_decizie[i].L[2]);
    }
}

void refacere_butoane_atribuire()
{
    int i;
    for (i=1; i<=nr_blocuri[7]; i++)
    {
        desenare_bloc_atribuire(blocuri.atribuire[i].centru, cul_marg, cul_bloc_bkd,  blocuri.atribuire[i].text, 0);
        if (blocuri.atribuire[i].L[2].id_bloc)
            desenare_legatura(blocuri.atribuire[i].L[2]);
    }
}

void hover_buton_informatii()
{
    if (hover_elipsa(buton_informatii))
    {
        desenare_buton_informatii(buton_informatii.centru, cul_hover);
        while (hover_elipsa(buton_informatii))
        {
            if (fereastra_schema && ismouseclick(WM_LBUTTONDOWN))
            {
                deschidere_fereastra_informatii();
                fereastra_schema=0;
            }
        }
        desenare_buton_informatii(buton_informatii.centru, cul_marg);
    }
}

void deschidere_fereastra_informatii()
{
    setfillstyle(1, COLOR(cul_btn.c1, cul_btn.c2, cul_btn.c3));
    setcolor(COLOR(cul_marg.c1, cul_marg.c2, cul_marg.c3));
    bar(250, 75, 750, 575);
    rectangle(250, 75, 750, 575);
    setfillstyle(1, COLOR(cul_tabla.c1, cul_tabla.c2, cul_tabla.c3));
    bar(250, 75, 750, 100);
    rectangle(250, 75, 750, 100);

    btn_exit.A={725, 75};
    btn_exit.C={750, 100};
    desenare_buton_exit(cul_btn_exit);

    int text_x=275, text_y=110, spatiu=20, paragraf=30;

    setbkcolor(COLOR(cul_btn.c1, cul_btn.c2, cul_btn.c3));
    setcolor(COLOR(cul_marg.c1, cul_marg.c2, cul_marg.c3));
    outtextxy(text_x, text_y, "Incepe schema prin desenarea butonului de start. Celelalte butoane");                 text_y+=spatiu;
    outtextxy(text_x, text_y, "vor fi activate ulterior. Pot exista un singur buton de start si stop.");             text_y+=paragraf;
    outtextxy(text_x, text_y, "Click stanga pe un bloc si click stanga undeva pe tabla pentru mutarea");             text_y+=spatiu;
    outtextxy(text_x, text_y, "blocului selectat. Legaturile se muta odata cu blocurile pe care le leaga.");         text_y+=paragraf;
    outtextxy(text_x, text_y, "Click dreapta pe un bloc pentru stergerea blocului si a legaturilor sale.");          text_y+=paragraf;
    outtextxy(text_x, text_y, "Click mijloc pe un bloc si click mijloc pe alt bloc pentru crearea sau");             text_y+=spatiu;
    outtextxy(text_x, text_y, "stergerea unei legaturi. Legaturile se creeaza si se sterg de sus in jos.");          text_y+=spatiu;
    outtextxy(text_x, text_y, "Stergerea uneia din legaturile de jos ale blocului de decizie implica ");             text_y+=spatiu;
    outtextxy(text_x, text_y, "automat si stergerea celeilalte legaturi.");                                          text_y+=paragraf;
    outtextxy(text_x, text_y, "Legaturile de jos ale blocului de decizie se creeaza si se sterg");                   text_y+=spatiu;
    outtextxy(text_x, text_y, "impreuna prin clickuri consecutive pe blocurile cu care se face ");                   text_y+=spatiu;
    outtextxy(text_x, text_y, "modificarea, incepand cu legatura stanga.");                                          text_y+=paragraf;
    outtextxy(text_x, text_y, "Prin apasarea butonului de Salvare schema se salveaza schema");                       text_y+=spatiu;
    outtextxy(text_x, text_y, "actuala, care poate fi redeschisa ulterior prin apasarea butonului");                 text_y+=spatiu;
    outtextxy(text_x, text_y, "Deschide schema.");                                                                   text_y+=paragraf;
    outtextxy(text_x, text_y, "Variabilele introduse trebuie sa fie OBLIGATORIU litere mari ale");                   text_y+=spatiu;
    outtextxy(text_x, text_y, "aflabetului englez.");                                                                text_y+=paragraf;
    outtextxy(text_x, text_y, "Sunt disponibile operatiile log(), cos(), sin(), tan(), ctan(), ^, max(), min().");   text_y+=paragraf;
    outtextxy(text_x, text_y, "Pentru afisarea unui sir de caractere, acesta va scris intre ' '.");                  text_y+=spatiu;
}

void inchidere_fereastra_informatii()
{
    if (hover_dreptunghi(btn_exit))
    {
        desenare_buton_exit(cul_hover_exit);
        while (!fereastra_schema && hover_dreptunghi(btn_exit))
        {
            if (ismouseclick(WM_LBUTTONDOWN))
            {
                refacere_schema();
                fereastra_schema=1;
                break;
            }
        }
        if (!fereastra_schema)
            desenare_buton_exit(cul_btn_exit);
    }
}

void desenare_buton_exit(culoare cul)
{
    setfillstyle(1, COLOR(cul.c1, cul.c2, cul.c3));
    bar(btn_exit.A.x, btn_exit.A.y, btn_exit.C.x, btn_exit.C.y);
    rectangle(btn_exit.A.x, btn_exit.A.y, btn_exit.C.x, btn_exit.C.y);
    line(btn_exit.A.x, btn_exit.A.y, btn_exit.C.x, btn_exit.C.y);
    line(btn_exit.A.x, btn_exit.C.y, btn_exit.C.x, btn_exit.A.y);
}

void hover_butoane_meniu()
{
    int i, operatie=0;
    for (i=1; i<=4; i++)
        if (hover_dreptunghi(butoane[i]))
        {
            desenare_buton_meniu(butoane[i], cul_hover, text_butoane[i]);
            while (hover_dreptunghi(butoane[i]) && !operatie)
                if (ismouseclick(WM_LBUTTONDOWN))
                {
                    switch (i)
                    {
                        case 1:
                            schema_noua();
                            break;
                        case 2:
                            salvare_schema();
                            break;
                        case 3:
                            deschidere_schema();
                            break;
                        case 4:
                            if (nu_exista_erori())
                            {
                                codificare_schema();
                                executare_schema();
                            }
                            break;
                    }
                    operatie=1;
                }
            desenare_buton_meniu(butoane[i], cul_marg, text_butoane[i]);
        }
}

void schema_noua()
{
    int i;
    blocuri.start.L[2].id_bloc=0;
    blocuri.stop.L[1].id_bloc=0;
    for (i=1; i<=nr_blocuri[3]; i++)
        blocuri.citire[i].L[1].id_bloc=blocuri.citire[i].L[2].id_bloc=0;
    for (i=1; i<=nr_blocuri[4]; i++)
        blocuri.afisare[i].L[1].id_bloc=blocuri.afisare[i].L[2].id_bloc=0;
    for (i=1; i<=nr_blocuri[5]; i++)
        blocuri.decizie[i].L[1].id_bloc=blocuri.decizie[i].L[2].id_bloc=blocuri.decizie[i].L[3].id_bloc=blocuri.decizie[i].L[4].id_bloc=0;
    for (i=1; i<=nr_blocuri[6]; i++)
        blocuri.stop_decizie[i].L[0].id_bloc=blocuri.stop_decizie[i].L[1].id_bloc=blocuri.stop_decizie[i].L[2].id_bloc=0;
    for (i=1; i<=nr_blocuri[7]; i++)
        blocuri.atribuire[i].L[1].id_bloc=blocuri.atribuire[i].L[2].id_bloc=0;
    for (i=1; i<=7; i++)
        nr_blocuri[i]=0;
    schema_executata=0;
    tabla_schema();
    tabla_executare_schema();
    tabla_codificare_schema();
}

void salvare_schema()
{
    fPtr=fopen("schema_salvata.txt", "w");

    salvare_butoane_start();
    salvare_butoane_stop();
    salvare_butoane_citire();
    salvare_butoane_afisare();
    salvare_butoane_decizie();
    salvare_butoane_stop_decizie();
    salvare_butoane_atribuire();

    fclose(fPtr);
}

void salvare_butoane_start()
{
    fprintf(fPtr, "%d\n", nr_blocuri[1]);
    if (nr_blocuri[1])
    {
        fprintf(fPtr, "%d %d %d %d\n", blocuri.start.centru.x, blocuri.start.centru.y, blocuri.start.r1, blocuri.start.r2);
        fprintf(fPtr, "%d ", blocuri.start.L[2].id_bloc);
        if (blocuri.start.L[2].id_bloc)
        {
            fprintf(fPtr, "%d %d ", blocuri.start.L[2].nr_bloc, blocuri.start.L[2].nr_legatura);
            fprintf(fPtr, "%d %d ", blocuri.start.L[2].p1.x, blocuri.start.L[2].p1.y);
            fprintf(fPtr, "%d %d ", blocuri.start.L[2].p2.x, blocuri.start.L[2].p2.y);
        }
        fprintf(fPtr, "\n");
    }
}

void salvare_butoane_stop()
{
    fprintf(fPtr, "%d\n", nr_blocuri[2]);
    if (nr_blocuri[2])
    {
        fprintf(fPtr, "%d %d %d %d\n", blocuri.stop.centru.x, blocuri.stop.centru.y, blocuri.stop.r1, blocuri.stop.r2);
        fprintf(fPtr, "%d ", blocuri.stop.L[1].id_bloc);
        if (blocuri.stop.L[1].id_bloc)
        {
            fprintf(fPtr, "%d %d ", blocuri.stop.L[1].nr_bloc, blocuri.stop.L[1].nr_legatura);
            fprintf(fPtr, "%d %d ", blocuri.stop.L[1].p1.x, blocuri.stop.L[1].p1.y);
            fprintf(fPtr, "%d %d ", blocuri.stop.L[1].p2.x, blocuri.stop.L[1].p2.y);
        }
        fprintf(fPtr, "\n");
    }
}

void salvare_butoane_citire()
{
    int i, j;
    fprintf(fPtr, "%d\n", nr_blocuri[3]);
    for (i=1; i<=nr_blocuri[3]; i++)
    {
        fprintf(fPtr, "%d %d\n", blocuri.citire[i].centru.x, blocuri.citire[i].centru.y);
        fprintf(fPtr, "%d %d\n", blocuri.citire[i].A.x, blocuri.citire[i].A.y);
        fprintf(fPtr, "%d %d\n", blocuri.citire[i].B.x, blocuri.citire[i].B.y);
        fprintf(fPtr, "%d %d\n", blocuri.citire[i].C.x, blocuri.citire[i].C.y);
        fprintf(fPtr, "%d %d\n", blocuri.citire[i].D.x, blocuri.citire[i].D.y);
        fprintf(fPtr, "%s\n", blocuri.citire[i].text);
        for (j=1; j<=2; j++)
        {
            fprintf(fPtr, "%d ", blocuri.citire[i].L[j].id_bloc);
            if (blocuri.citire[i].L[j].id_bloc)
            {
                fprintf(fPtr, "%d %d ", blocuri.citire[i].L[j].nr_bloc, blocuri.citire[i].L[j].nr_legatura);
                fprintf(fPtr, "%d %d ", blocuri.citire[i].L[j].p1.x, blocuri.citire[i].L[j].p1.y);
                fprintf(fPtr, "%d %d ", blocuri.citire[i].L[j].p2.x, blocuri.citire[i].L[j].p2.y);
            }
            fprintf(fPtr, "\n");
        }
    }
}

void salvare_butoane_afisare()
{
    int i, j;
    fprintf(fPtr, "%d\n", nr_blocuri[4]);
    for (i=1; i<=nr_blocuri[4]; i++)
    {
        fprintf(fPtr, "%d %d\n", blocuri.afisare[i].centru.x, blocuri.afisare[i].centru.y);
        fprintf(fPtr, "%d %d\n", blocuri.afisare[i].A.x, blocuri.afisare[i].A.y);
        fprintf(fPtr, "%d %d\n", blocuri.afisare[i].B.x, blocuri.afisare[i].B.y);
        fprintf(fPtr, "%d %d\n", blocuri.afisare[i].C.x, blocuri.afisare[i].C.y);
        fprintf(fPtr, "%d %d\n", blocuri.afisare[i].D.x, blocuri.afisare[i].D.y);
        fprintf(fPtr, "%s\n", blocuri.afisare[i].text);
        for (j=1; j<=2; j++)
        {
            fprintf(fPtr, "%d ", blocuri.afisare[i].L[j].id_bloc);
            if (blocuri.afisare[i].L[j].id_bloc)
            {
                fprintf(fPtr, "%d %d ", blocuri.afisare[i].L[j].nr_bloc, blocuri.afisare[i].L[j].nr_legatura);
                fprintf(fPtr, "%d %d ", blocuri.afisare[i].L[j].p1.x, blocuri.afisare[i].L[j].p1.y);
                fprintf(fPtr, "%d %d ", blocuri.afisare[i].L[j].p2.x, blocuri.afisare[i].L[j].p2.y);
            }
            fprintf(fPtr, "\n");
        }
    }
}

void salvare_butoane_decizie()
{
    int i, j;
    fprintf(fPtr, "%d\n", nr_blocuri[5]);
    for (i=1; i<=nr_blocuri[5]; i++)
    {
        fprintf(fPtr, "%d %d\n", blocuri.decizie[i].centru.x, blocuri.decizie[i].centru.y);
        fprintf(fPtr, "%d %d\n", blocuri.decizie[i].A.x, blocuri.decizie[i].A.y);
        fprintf(fPtr, "%d %d\n", blocuri.decizie[i].B.x, blocuri.decizie[i].B.y);
        fprintf(fPtr, "%d %d\n", blocuri.decizie[i].C.x, blocuri.decizie[i].C.y);
        fprintf(fPtr, "%s\n", blocuri.decizie[i].text);
        for (j=1; j<=4; j++)
        {
            fprintf(fPtr, "%d ", blocuri.decizie[i].L[j].id_bloc);
            if (blocuri.decizie[i].L[j].id_bloc)
            {
                fprintf(fPtr, "%d %d ", blocuri.decizie[i].L[j].nr_bloc, blocuri.decizie[i].L[j].nr_legatura);
                fprintf(fPtr, "%d %d ", blocuri.decizie[i].L[j].p1.x, blocuri.decizie[i].L[j].p1.y);
                fprintf(fPtr, "%d %d ", blocuri.decizie[i].L[j].p2.x, blocuri.decizie[i].L[j].p2.y);
            }
            fprintf(fPtr, "\n");
        }
    }
}

void salvare_butoane_stop_decizie()
{
    int i, j;
    fprintf(fPtr, "%d\n", nr_blocuri[6]);
    for (i=1; i<=nr_blocuri[6]; i++)
    {
        fprintf(fPtr, "%d %d %d %d\n", blocuri.stop_decizie[i].centru.x, blocuri.stop_decizie[i].centru.y, blocuri.stop_decizie[i].r1, blocuri.stop_decizie[i].r2);
        for (j=0; j<=2; j++)
        {
            fprintf(fPtr, "%d ", blocuri.stop_decizie[i].L[j].id_bloc);
            if (blocuri.stop_decizie[i].L[j].id_bloc)
            {
                fprintf(fPtr, "%d %d ", blocuri.stop_decizie[i].L[j].nr_bloc, blocuri.stop_decizie[i].L[j].nr_legatura);
                fprintf(fPtr, "%d %d ", blocuri.stop_decizie[i].L[j].p1.x, blocuri.stop_decizie[i].L[j].p1.y);
                fprintf(fPtr, "%d %d ", blocuri.stop_decizie[i].L[j].p2.x, blocuri.stop_decizie[i].L[j].p2.y);
            }
            fprintf(fPtr, "\n");
        }
    }
}

void salvare_butoane_atribuire()
{
    int i, j;
    fprintf(fPtr, "%d\n", nr_blocuri[7]);
    for (i=1; i<=nr_blocuri[7]; i++)
    {
        fprintf(fPtr, "%d %d\n", blocuri.atribuire[i].centru.x, blocuri.atribuire[i].centru.y);
        fprintf(fPtr, "%d %d\n", blocuri.atribuire[i].A.x, blocuri.atribuire[i].A.y);
        fprintf(fPtr, "%d %d\n", blocuri.atribuire[i].B.x, blocuri.atribuire[i].B.y);
        fprintf(fPtr, "%d %d\n", blocuri.atribuire[i].C.x, blocuri.atribuire[i].C.y);
        fprintf(fPtr, "%d %d\n", blocuri.atribuire[i].D.x, blocuri.atribuire[i].D.y);
        fprintf(fPtr, "%s\n", blocuri.atribuire[i].text);
        for (j=1; j<=2; j++)
        {
            fprintf(fPtr, "%d ", blocuri.atribuire[i].L[j].id_bloc);
            if (blocuri.atribuire[i].L[j].id_bloc)
            {
                fprintf(fPtr, "%d %d ", blocuri.atribuire[i].L[j].nr_bloc, blocuri.atribuire[i].L[j].nr_legatura);
                fprintf(fPtr, "%d %d ", blocuri.atribuire[i].L[j].p1.x, blocuri.atribuire[i].L[j].p1.y);
                fprintf(fPtr, "%d %d ", blocuri.atribuire[i].L[j].p2.x, blocuri.atribuire[i].L[j].p2.y);
            }
            fprintf(fPtr, "\n");
        }
    }
}

void deschidere_schema()
{
    fPtr=fopen("schema_salvata.txt", "r");

    deschidere_butoane_start();
    deschidere_butoane_stop();
    deschidere_butoane_citire();
    deschidere_butoane_afisare();
    deschidere_butoane_decizie();
    deschidere_butoane_stop_decizie();
    deschidere_butoane_atribuire();

    fclose(fPtr);
    refacere_schema();
}

void deschidere_butoane_start()
{
    fscanf(fPtr, "%d", &nr_blocuri[1]);
    if (nr_blocuri[1])
    {
        fscanf(fPtr, "%d %d %d %d", &blocuri.start.centru.x, &blocuri.start.centru.y, &blocuri.start.r1, &blocuri.start.r2);
        fscanf(fPtr, "%d", &blocuri.start.L[2].id_bloc);
        if (blocuri.start.L[2].id_bloc)
        {
            fscanf(fPtr, "%d %d", &blocuri.start.L[2].nr_bloc, &blocuri.start.L[2].nr_legatura);
            fscanf(fPtr, "%d %d", &blocuri.start.L[2].p1.x, &blocuri.start.L[2].p1.y);
            fscanf(fPtr, "%d %d", &blocuri.start.L[2].p2.x, &blocuri.start.L[2].p2.y);
        }
    }
}

void deschidere_butoane_stop()
{
    fscanf(fPtr, "%d", &nr_blocuri[2]);
    if (nr_blocuri[2])
    {
        fscanf(fPtr, "%d %d %d %d", &blocuri.stop.centru.x, &blocuri.stop.centru.y, &blocuri.stop.r1, &blocuri.stop.r2);
        fscanf(fPtr, "%d", &blocuri.stop.L[1].id_bloc);
        if (blocuri.stop.L[1].id_bloc)
        {
            fscanf(fPtr, "%d %d", &blocuri.stop.L[1].nr_bloc, &blocuri.stop.L[1].nr_legatura);
            fscanf(fPtr, "%d %d", &blocuri.stop.L[1].p1.x, &blocuri.stop.L[1].p1.y);
            fscanf(fPtr, "%d %d", &blocuri.stop.L[1].p2.x, &blocuri.stop.L[1].p2.y);
        }
    }
}

void deschidere_butoane_citire()
{
    int i, j;
    fscanf(fPtr, "%d", &nr_blocuri[3]);
    for (i=1; i<=nr_blocuri[3]; i++)
    {
        fscanf(fPtr, "%d %d", &blocuri.citire[i].centru.x, &blocuri.citire[i].centru.y);
        fscanf(fPtr, "%d %d", &blocuri.citire[i].A.x, &blocuri.citire[i].A.y);
        fscanf(fPtr, "%d %d", &blocuri.citire[i].B.x, &blocuri.citire[i].B.y);
        fscanf(fPtr, "%d %d", &blocuri.citire[i].C.x, &blocuri.citire[i].C.y);
        fscanf(fPtr, "%d %d", &blocuri.citire[i].D.x, &blocuri.citire[i].D.y);
        fgetc(fPtr);
        fgets(blocuri.citire[i].text, TEXTMAX, fPtr);
        blocuri.citire[i].text[strlen(blocuri.citire[i].text)-1]=0;
        for (j=1; j<=2; j++)
        {
            fscanf(fPtr, "%d", &blocuri.citire[i].L[j].id_bloc);
            if (blocuri.citire[i].L[j].id_bloc)
            {
                fscanf(fPtr, "%d %d", &blocuri.citire[i].L[j].nr_bloc, &blocuri.citire[i].L[j].nr_legatura);
                fscanf(fPtr, "%d %d", &blocuri.citire[i].L[j].p1.x, &blocuri.citire[i].L[j].p1.y);
                fscanf(fPtr, "%d %d", &blocuri.citire[i].L[j].p2.x, &blocuri.citire[i].L[j].p2.y);
            }
        }
    }
}

void deschidere_butoane_afisare()
{
    int i, j;
    fscanf(fPtr, "%d", &nr_blocuri[4]);
    for (i=1; i<=nr_blocuri[4]; i++)
    {
        fscanf(fPtr, "%d %d", &blocuri.afisare[i].centru.x, &blocuri.afisare[i].centru.y);
        fscanf(fPtr, "%d %d", &blocuri.afisare[i].A.x, &blocuri.afisare[i].A.y);
        fscanf(fPtr, "%d %d", &blocuri.afisare[i].B.x, &blocuri.afisare[i].B.y);
        fscanf(fPtr, "%d %d", &blocuri.afisare[i].C.x, &blocuri.afisare[i].C.y);
        fscanf(fPtr, "%d %d", &blocuri.afisare[i].D.x, &blocuri.afisare[i].D.y);
        fgetc(fPtr);
        fgets(blocuri.afisare[i].text, TEXTMAX, fPtr);
        blocuri.afisare[i].text[strlen(blocuri.afisare[i].text)-1]=0;
        for (j=1; j<=2; j++)
        {
            fscanf(fPtr, "%d", &blocuri.afisare[i].L[j].id_bloc);
            if (blocuri.afisare[i].L[j].id_bloc)
            {
                fscanf(fPtr, "%d %d", &blocuri.afisare[i].L[j].nr_bloc, &blocuri.afisare[i].L[j].nr_legatura);
                fscanf(fPtr, "%d %d", &blocuri.afisare[i].L[j].p1.x, &blocuri.afisare[i].L[j].p1.y);
                fscanf(fPtr, "%d %d", &blocuri.afisare[i].L[j].p2.x, &blocuri.afisare[i].L[j].p2.y);
            }
        }
    }
}

void deschidere_butoane_decizie()
{
    int i, j;
    fscanf(fPtr, "%d", &nr_blocuri[5]);
    for (i=1; i<=nr_blocuri[5]; i++)
    {
        fscanf(fPtr, "%d %d", &blocuri.decizie[i].centru.x, &blocuri.decizie[i].centru.y);
        fscanf(fPtr, "%d %d", &blocuri.decizie[i].A.x, &blocuri.decizie[i].A.y);
        fscanf(fPtr, "%d %d", &blocuri.decizie[i].B.x, &blocuri.decizie[i].B.y);
        fscanf(fPtr, "%d %d", &blocuri.decizie[i].C.x, &blocuri.decizie[i].C.y);
        fgetc(fPtr);
        fgets(blocuri.decizie[i].text, TEXTMAX, fPtr);
        blocuri.decizie[i].text[strlen(blocuri.decizie[i].text)-1]=0;
        for (j=1; j<=4; j++)
        {
            fscanf(fPtr, "%d", &blocuri.decizie[i].L[j].id_bloc);
            if (blocuri.decizie[i].L[j].id_bloc)
            {
                fscanf(fPtr, "%d %d", &blocuri.decizie[i].L[j].nr_bloc, &blocuri.decizie[i].L[j].nr_legatura);
                fscanf(fPtr, "%d %d", &blocuri.decizie[i].L[j].p1.x, &blocuri.decizie[i].L[j].p1.y);
                fscanf(fPtr, "%d %d", &blocuri.decizie[i].L[j].p2.x, &blocuri.decizie[i].L[j].p2.y);
            }
        }
    }
}

void deschidere_butoane_stop_decizie()
{
    int i, j;
    fscanf(fPtr, "%d", &nr_blocuri[6]);
    for (i=1; i<=nr_blocuri[6]; i++)
    {
        fscanf(fPtr, "%d %d %d %d", &blocuri.stop_decizie[i].centru.x, &blocuri.stop_decizie[i].centru.y, &blocuri.stop_decizie[i].r1, &blocuri.stop_decizie[i].r2);
        for (j=0; j<=2; j++)
        {
            fscanf(fPtr, "%d", &blocuri.stop_decizie[i].L[j].id_bloc);
            if (blocuri.stop_decizie[i].L[j].id_bloc)
            {
                fscanf(fPtr, "%d %d", &blocuri.stop_decizie[i].L[j].nr_bloc, &blocuri.stop_decizie[i].L[j].nr_legatura);
                fscanf(fPtr, "%d %d", &blocuri.stop_decizie[i].L[j].p1.x, &blocuri.stop_decizie[i].L[j].p1.y);
                fscanf(fPtr, "%d %d", &blocuri.stop_decizie[i].L[j].p2.x, &blocuri.stop_decizie[i].L[j].p2.y);
            }
        }
    }
}

void deschidere_butoane_atribuire()
{
    int i, j;
    fscanf(fPtr, "%d", &nr_blocuri[7]);
    for (i=1; i<=nr_blocuri[7]; i++)
    {
        fscanf(fPtr, "%d %d", &blocuri.atribuire[i].centru.x, &blocuri.atribuire[i].centru.y);
        fscanf(fPtr, "%d %d", &blocuri.atribuire[i].A.x, &blocuri.atribuire[i].A.y);
        fscanf(fPtr, "%d %d", &blocuri.atribuire[i].B.x, &blocuri.atribuire[i].B.y);
        fscanf(fPtr, "%d %d", &blocuri.atribuire[i].C.x, &blocuri.atribuire[i].C.y);
        fscanf(fPtr, "%d %d", &blocuri.atribuire[i].D.x, &blocuri.atribuire[i].D.y);
        fgetc(fPtr);
        fgets(blocuri.atribuire[i].text, TEXTMAX, fPtr);
        blocuri.atribuire[i].text[strlen(blocuri.atribuire[i].text)-1]=0;
        for (j=1; j<=2; j++)
        {
            fscanf(fPtr, "%d", &blocuri.atribuire[i].L[j].id_bloc);
            if (blocuri.atribuire[i].L[j].id_bloc)
            {
                fscanf(fPtr, "%d %d", &blocuri.atribuire[i].L[j].nr_bloc, &blocuri.atribuire[i].L[j].nr_legatura);
                fscanf(fPtr, "%d %d", &blocuri.atribuire[i].L[j].p1.x, &blocuri.atribuire[i].L[j].p1.y);
                fscanf(fPtr, "%d %d", &blocuri.atribuire[i].L[j].p2.x, &blocuri.atribuire[i].L[j].p2.y);
            }
        }
    }
}

bool nu_exista_erori()
{
    return exista_bloc_start()  &&
           exista_bloc_stop()   &&
           legaturile_sunt_corecte();
}

bool exista_bloc_start()
{
    if (!nr_blocuri[1])
    {
        eroarea(1);
        return 0;
    }
    return 1;
}

bool exista_bloc_stop()
{
    if (!nr_blocuri[2])
    {
        eroarea(2);
        return 0;
    }
    return 1;
}

bool legaturile_sunt_corecte()
{
    vizitare_blocuri(1, 1, 0);
    bool ok=schema_corecta();
    vizitare_blocuri(0, 1, 0);
    if (!ok)
        eroarea(3);
    return ok;
}

void vizitare_blocuri(bool viz, int tip, int nr)
{
    switch(tip)
    {
        case 1:
            if(blocuri.start.viz!=viz)
            {
                blocuri.start.viz=viz;
                vizitare_blocuri(viz, blocuri.start.L[2].id_bloc, blocuri.start.L[2].nr_bloc);
            }
            break;
        case 2:
            blocuri.stop.viz=viz;
            break;
        case 3:
            if(blocuri.citire[nr].viz!=viz)
            {
                blocuri.citire[nr].viz=viz;
                vizitare_blocuri(viz, blocuri.citire[nr].L[2].id_bloc, blocuri.citire[nr].L[2].nr_bloc);
            }
            break;
        case 4:
            if(blocuri.afisare[nr].viz!=viz)
            {
                blocuri.afisare[nr].viz=viz;
                vizitare_blocuri(viz, blocuri.afisare[nr].L[2].id_bloc, blocuri.afisare[nr].L[2].nr_bloc);
            }
            break;
        case 5:
            if(blocuri.decizie[nr].viz!=viz)
            {
                blocuri.decizie[nr].viz=viz;
                vizitare_blocuri(viz, blocuri.decizie[nr].L[2].id_bloc, blocuri.decizie[nr].L[2].nr_bloc);
                vizitare_blocuri(viz, blocuri.decizie[nr].L[3].id_bloc, blocuri.decizie[nr].L[3].nr_bloc);
            }
            break;
        case 6:
            if(blocuri.stop_decizie[nr].viz!=viz)
            {
                blocuri.stop_decizie[nr].viz=viz;
                vizitare_blocuri(viz, blocuri.stop_decizie[nr].L[2].id_bloc, blocuri.stop_decizie[nr].L[2].nr_bloc);
            }
            break;
        case 7:
            if(blocuri.atribuire[nr].viz!=viz)
            {
                blocuri.atribuire[nr].viz=viz;
                vizitare_blocuri(viz, blocuri.atribuire[nr].L[2].id_bloc, blocuri.atribuire[nr].L[2].nr_bloc);
            }
            break;
    }
}

bool schema_corecta()
{
    int i;
    if (blocuri.start.viz==0)
        return 0;
    if (blocuri.stop.viz==0)
        return 0;
    for (i=1; i<=nr_blocuri[3]; i++)
        if (blocuri.citire[i].viz==0)
            return 0;
    for (i=1;i<=nr_blocuri[4];i++)
        if (blocuri.afisare[i].viz==0)
            return 0;
    for (i=1; i<=nr_blocuri[5]; i++)
        if (blocuri.decizie[i].viz==0)
            return 0;
    for (i=1; i<=nr_blocuri[6]; i++)
    {
        if (blocuri.stop_decizie[i].viz==0)
            return 0;
        if (blocuri.stop_decizie[i].L[0].id_bloc==0 || blocuri.stop_decizie[i].L[1].id_bloc==0)
            return 0;
    }
    for (i=1; i<=nr_blocuri[7]; i++)
        if (blocuri.atribuire[i].viz==0)
            return 0;
    return 1;
}

void eroarea(int nr)
{
    switch(nr)
    {
        case 1:
            afisare_eroare("Nu exista bloc de start!");
            break;
        case 2:
            afisare_eroare("Nu exista bloc de stop!");
            break;
        case 3:
            afisare_eroare("Legaturile nu sunt corecte!");
            break;
    }
}

void afisare_eroare(char text[])
{
    int lg_text=textwidth(text);

    setfillstyle(1, COLOR(cul_btn.c1, cul_btn.c2, cul_btn.c3));
    setcolor(COLOR(cul_marg.c1, cul_marg.c2, cul_marg.c3));
    bar(500-lg_text/2-10, 275, 500+lg_text/2+10, 375);
    rectangle(500-lg_text/2-10, 275, 500+lg_text/2+10, 375);
    setfillstyle(1, COLOR(cul_tabla.c1, cul_tabla.c2, cul_tabla.c3));
    bar(500-lg_text/2-10, 275, 500+lg_text/2+10, 300);
    rectangle(500-lg_text/2-10, 275, 500+lg_text/2+10, 300);

    btn_exit.A.x=500+lg_text/2-15; btn_exit.A.y=275;
    btn_exit.C.x=500+lg_text/2+10; btn_exit.C.y=300;
    desenare_buton_exit(cul_btn_exit);

    setbkcolor(COLOR(cul_btn.c1, cul_btn.c2, cul_btn.c3));
    setcolor(COLOR(cul_marg.c1, cul_marg.c2, cul_marg.c3));
    outtextxy(500-lg_text/2, 330, text);

    fereastra_schema=0;
    inchidere_fereastra_informatii();
}

void codificare_schema()
{
    tabla_codificare_schema();
    schema_executata=0;

    coordonate sir={835, 400};
    int tip_bloc, nr_bloc, spatiu=17, tab=17, auxn, nr_tab=0, i;
    char t[MAX];
    inc_cod=1; sf_cod=0;

    for (i=0; i<=26; i++)
        viz[i]=0;

    for (i=1; i<=total_randuri_cod; i++)
        codificare[i][0]='\0';

    tip_bloc=blocuri.start.L[2].id_bloc;
    nr_bloc=blocuri.start.L[2].nr_bloc;

    setbkcolor(COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
    setcolor(BLACK);
    outtextxy(sir.x, sir.y, "#include <iostream>");         sir.y+=spatiu;
    strcpy(codificare[++sf_cod], "#include <iostream>");
    outtextxy(sir.x, sir.y, "#include <cmath>");            sir.y+=spatiu;
    strcpy(codificare[++sf_cod], "#include <cmath>");
    outtextxy(sir.x, sir.y, "using namespace std;");        sir.y+=spatiu;
    strcpy(codificare[++sf_cod], "using namespace std;");
    outtextxy(sir.x, sir.y, "int main()");                  sir.y+=spatiu;
    strcpy(codificare[++sf_cod], "int main()");
    outtextxy(sir.x, sir.y, "{");                           sir.y+=spatiu;
    text_taburi_cod(nr_tab, "{");                           sir.x+=tab; nr_tab++;

    while (tip_bloc!=2)
    {
        t[0]='\0';
        switch (tip_bloc)
        {
            case 3:
                if (viz[blocuri.citire[nr_bloc].text[0]-'A']==0)
                {
                    viz[blocuri.citire[nr_bloc].text[0]-'A']=1;
                    strcpy(t, "double ");
                    t[7]=blocuri.citire[nr_bloc].text[0];
                    strcpy(t+8, ";");
                    scroll_codificare(sir.y);
                    outtextxy(sir.x, sir.y, t);
                    text_taburi_cod(nr_tab, t);
                    sir.y+=spatiu;
                }
                strcpy(t, "cin>>");
                strcpy(t+5, blocuri.citire[nr_bloc].text);
                strcpy(t+6, ";");
                scroll_codificare(sir.y);
                outtextxy(sir.x, sir.y, t);
                text_taburi_cod(nr_tab, t);
                sir.y+=spatiu;
                tip_bloc=blocuri.citire[nr_bloc].L[2].id_bloc;
                nr_bloc=blocuri.citire[nr_bloc].L[2].nr_bloc;
                break;
            case 4:
                strcpy(t, "cout<<");
                strcpy(t+6, blocuri.afisare[nr_bloc].text);
                strcat(t, ";");
                scroll_codificare(sir.y);
                outtextxy(sir.x, sir.y, t);
                text_taburi_cod(nr_tab, t);
                sir.y+=spatiu;
                tip_bloc=blocuri.afisare[nr_bloc].L[2].id_bloc;
                nr_bloc=blocuri.afisare[nr_bloc].L[2].nr_bloc;
                break;
            case 5:
                int nrr;
                if (blocuri.decizie[nr_bloc].L[4].id_bloc==0) ///nu este bucla
                {
                    strcpy(t, "if(");
                    strcpy(t+3, blocuri.decizie[nr_bloc].text);
                    strcat(t, ")");
                    scroll_codificare(sir.y);
                    outtextxy(sir.x, sir.y, t);
                    text_taburi_cod(nr_tab, t);
                    sir.y+=spatiu;
                    scroll_codificare(sir.y);
                    outtextxy(sir.x, sir.y, "{");
                    text_taburi_cod(nr_tab, "{");
                    sir.x+=tab; nr_tab++;
                    sir.y+=spatiu;

                    auxn=nr_bloc;

                    tip_bloc=blocuri.decizie[nr_bloc].L[2].id_bloc;
                    nr_bloc=blocuri.decizie[nr_bloc].L[2].nr_bloc;

                    nrr=parcurgere_decizie(tip_bloc, nr_bloc, sir.x, sir.y, nr_tab);
                    sir.x-=tab; nr_tab--;
                    sir.y+=spatiu*nrr;
                    scroll_codificare(sir.y);
                    outtextxy(sir.x, sir.y, "}");
                    text_taburi_cod(nr_tab, "}");
                    sir.y+=spatiu;

                    if(blocuri.decizie[auxn].L[3].id_bloc!=6)
                    {
                        scroll_codificare(sir.y);
                        outtextxy(sir.x, sir.y, "else");
                        text_taburi_cod(nr_tab, "else");
                        sir.y+=spatiu;
                        scroll_codificare(sir.y);
                        outtextxy(sir.x, sir.y, "{");
                        text_taburi_cod(nr_tab, "{");
                        sir.y+=spatiu;
                        sir.x+=tab; nr_tab++;

                        tip_bloc=blocuri.decizie[auxn].L[3].id_bloc;
                        nr_bloc=blocuri.decizie[auxn].L[3].nr_bloc;

                        nrr=parcurgere_decizie(tip_bloc, nr_bloc, sir.x, sir.y, nr_tab);
                        sir.x-=tab; nr_tab--;
                        sir.y+=spatiu*nrr;
                        scroll_codificare(sir.y);
                        outtextxy(sir.x, sir.y, "}");
                        text_taburi_cod(nr_tab, "}");
                        sir.y+=spatiu;
                    }

                }
                else ///este bucla
                {
                    strcpy(t, "while(");
                    strcpy(t+6, blocuri.decizie[nr_bloc].text);
                    strcat(t, ")");
                    scroll_codificare(sir.y);
                    outtextxy(sir.x, sir.y, t);
                    text_taburi_cod(nr_tab, t);
                    sir.y+=spatiu;
                    scroll_codificare(sir.y);
                    outtextxy(sir.x, sir.y, "{");
                    text_taburi_cod(nr_tab, "{");
                    sir.x+=tab; nr_tab++;
                    sir.y+=spatiu;

                    nrr=parcurgere_while(tip_bloc, nr_bloc, sir.x, sir.y, nr_tab);
                    sir.x-=tab; nr_tab--;
                    sir.y+=spatiu*nrr;
                    scroll_codificare(sir.y);
                    outtextxy(sir.x, sir.y, "}");
                    text_taburi_cod(nr_tab, "}");
                    sir.y+=spatiu;

                    tip_bloc=blocuri.decizie[nr_bloc].L[3].id_bloc;
                    nr_bloc=blocuri.decizie[nr_bloc].L[3].nr_bloc;
                }
                break;
            case 6:
                tip_bloc=blocuri.stop_decizie[nr_bloc].L[2].id_bloc;
                nr_bloc=blocuri.stop_decizie[nr_bloc].L[2].nr_bloc;
                break;
            case 7:
                if(viz[blocuri.atribuire[nr_bloc].text[0]-'A']==0)
                {
                    viz[blocuri.atribuire[nr_bloc].text[0]-'A']=1;
                    strcpy(t, "double ");
                    t[7]=blocuri.atribuire[nr_bloc].text[0];
                    strcpy(t+8, ";");
                    scroll_codificare(sir.y);
                    outtextxy(sir.x, sir.y, t);
                    text_taburi_cod(nr_tab, t);
                    sir.y+=spatiu;
                }
                strcpy(t,blocuri.atribuire[nr_bloc].text);
                strcat(t, ";");
                scroll_codificare(sir.y);
                outtextxy(sir.x, sir.y, t);
                text_taburi_cod(nr_tab, t);
                sir.y+=spatiu;
                tip_bloc=blocuri.atribuire[nr_bloc].L[2].id_bloc;
                nr_bloc=blocuri.atribuire[nr_bloc].L[2].nr_bloc;
                break;
        }
    }
    scroll_codificare(sir.y);
    outtextxy(sir.x, sir.y, "return 0;");
    text_taburi_cod(nr_tab, "return 0;");
    sir.y+=spatiu; sir.x-=tab; nr_tab--;
    scroll_codificare(sir.y);
    outtextxy(sir.x, sir.y, "}");
    text_taburi_cod(nr_tab, "}");
    total_randuri_cod=sf_cod;
}

int parcurgere_decizie(int &tip, int &nr, int x, int y, int nr_tab)
{
    int nr_randuri=0, spatiu=17, tab=17, auxn;
    char t[MAX];

    setbkcolor(COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
    setcolor(BLACK);

    while (tip!=6)
    {
        t[0]='\0';
        switch (tip)
        {
            case 3:
                if (viz[blocuri.citire[nr].text[0]-'A']==0)
                {
                    viz[blocuri.citire[nr].text[0]-'A']=1;
                    strcpy(t, "double ");
                    t[7]=blocuri.citire[nr].text[0];
                    strcpy(t+8, ";");
                    scroll_codificare(y);
                    outtextxy(x, y, t);
                    text_taburi_cod(nr_tab, t);
                    y+=spatiu; nr_randuri++;
                }
                strcpy(t, "cin>>");
                strcpy(t+5, blocuri.citire[nr].text);
                strcpy(t+6, ";");
                scroll_codificare(y);
                outtextxy(x, y, t);
                text_taburi_cod(nr_tab, t);
                y+=spatiu; nr_randuri++;
                tip=blocuri.citire[nr].L[2].id_bloc;
                nr=blocuri.citire[nr].L[2].nr_bloc;
                break;
            case 4:
                strcpy(t, "cout<<");
                strcpy(t+6, blocuri.afisare[nr].text);
                strcat(t, ";");
                scroll_codificare(y);
                outtextxy(x, y, t);
                text_taburi_cod(nr_tab, t);
                y+=spatiu; nr_randuri++;
                tip=blocuri.afisare[nr].L[2].id_bloc;
                nr=blocuri.afisare[nr].L[2].nr_bloc;
                break;
            case 5:
                int nrr;
                if (blocuri.decizie[nr].L[4].id_bloc==0) ///nu este bucla
                {
                    strcpy(t, "if(");
                    strcpy(t+3, blocuri.decizie[nr].text);
                    strcat(t, ")");
                    scroll_codificare(y);
                    outtextxy(x, y, t);
                    text_taburi_cod(nr_tab, t);
                    y+=spatiu; nr_randuri++;
                    scroll_codificare(y);
                    outtextxy(x, y, "{");
                    text_taburi_cod(nr_tab, "{");
                    x+=tab; nr_tab++;
                    y+=spatiu; nr_randuri++;

                    auxn=nr;
                    tip=blocuri.decizie[nr].L[2].id_bloc;
                    nr=blocuri.decizie[nr].L[2].nr_bloc;

                    nrr=parcurgere_decizie(tip, nr, x, y, nr_tab);
                    x-=tab; nr_tab--;
                    y+=spatiu*nrr; nr_randuri+=nrr;
                    scroll_codificare(y);
                    outtextxy(x, y, "}");
                    text_taburi_cod(nr_tab, "}");
                    y+=spatiu; nr_randuri++;

                    if(blocuri.decizie[auxn].L[3].id_bloc!=6)
                    {
                        scroll_codificare(y);
                        outtextxy(x, y, "else");
                        text_taburi_cod(nr_tab, "else");
                        y+=spatiu; nr_randuri++;
                        scroll_codificare(y);
                        outtextxy(x, y, "{");
                        text_taburi_cod(nr_tab, "{");
                        x+=tab; nr_tab++;
                        y+=spatiu; nr_randuri++;

                        tip=blocuri.decizie[auxn].L[3].id_bloc;
                        nr=blocuri.decizie[auxn].L[3].nr_bloc;

                        nrr=parcurgere_decizie(tip, nr, x, y, nr_tab);
                        x-=tab; nr_tab--;
                        y+=spatiu*nrr; nr_randuri+=nrr;
                        scroll_codificare(y);
                        outtextxy(x, y, "}");
                        text_taburi_cod(nr_tab, "}");
                        y+=spatiu; nr_randuri++;
                    }

                }
                else ///este bucla
                {
                    strcpy(t, "while(");
                    strcpy(t+6, blocuri.decizie[nr].text);
                    strcat(t, ")");
                    scroll_codificare(y);
                    outtextxy(x, y, t);
                    text_taburi_cod(nr_tab, t);
                    y+=spatiu; nr_randuri++;
                    scroll_codificare(y);
                    outtextxy(x, y, "{");
                    text_taburi_cod(nr_tab, "{");
                    x+=tab; nr_tab++;
                    y+=spatiu; nr_randuri++;

                    nrr=parcurgere_while(tip, nr, x, y, nr_tab);
                    x-=tab; nr_tab--;
                    y+=spatiu*nrr; nr_randuri+=nrr;
                    scroll_codificare(y);
                    outtextxy(x, y, "}");
                    text_taburi_cod(nr_tab, "}");
                    y+=spatiu; nr_randuri++;

                    tip=blocuri.decizie[nr].L[3].id_bloc;
                    nr=blocuri.decizie[nr].L[3].nr_bloc;
                }
                break;
            case 7:
                if(viz[blocuri.atribuire[nr].text[0]-'A']==0)
                {
                    viz[blocuri.atribuire[nr].text[0]-'A']=1;
                    strcpy(t, "double ");
                    t[7]=blocuri.atribuire[nr].text[0];
                    strcpy(t+8, ";");
                    scroll_codificare(y);
                    outtextxy(x, y, t);
                    text_taburi_cod(nr_tab, t);
                    y+=spatiu; nr_randuri++;
                }
                strcpy(t,blocuri.atribuire[nr].text);
                strcat(t, ";");
                scroll_codificare(y);
                outtextxy(x, y, t);
                text_taburi_cod(nr_tab, t);
                y+=spatiu; nr_randuri++;
                tip=blocuri.atribuire[nr].L[2].id_bloc;
                nr=blocuri.atribuire[nr].L[2].nr_bloc;
                break;
        }
    }
    return nr_randuri;
}

int parcurgere_while(int tip, int nr, int x, int y, int nr_tab)
{
    int nr_randuri=0, spatiu=17, tab=17, aux1=tip, aux2=nr, auxn;
    char t[100];

    setbkcolor(COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
    setcolor(BLACK);
    tip=blocuri.decizie[nr].L[2].id_bloc;
    nr=blocuri.decizie[nr].L[2].nr_bloc;

    while (!(tip==aux1 && nr==aux2))
    {
        t[0]='\0';
        switch (tip)
        {
            case 3:
                if (viz[blocuri.citire[nr].text[0]-'A']==0)
                {
                    viz[blocuri.citire[nr].text[0]-'A']=1;
                    strcpy(t, "double ");
                    t[7]=blocuri.citire[nr].text[0];
                    strcpy(t+8, ";");
                    scroll_codificare(y);
                    outtextxy(x, y, t);
                    text_taburi_cod(nr_tab, t);
                    y+=spatiu; nr_randuri++;
                }
                strcpy(t, "cin>>");
                strcpy(t+5, blocuri.citire[nr].text);
                strcpy(t+6, ";");
                scroll_codificare(y);
                outtextxy(x, y, t);
                text_taburi_cod(nr_tab, t);
                y+=spatiu; nr_randuri++;
                tip=blocuri.citire[nr].L[2].id_bloc;
                nr=blocuri.citire[nr].L[2].nr_bloc;
                break;
            case 4:
                strcpy(t, "cout<<");
                strcpy(t+6, blocuri.afisare[nr].text);
                strcat(t, ";");
                scroll_codificare(y);
                outtextxy(x, y, t);
                text_taburi_cod(nr_tab, t);
                y+=spatiu; nr_randuri++;
                tip=blocuri.afisare[nr].L[2].id_bloc;
                nr=blocuri.afisare[nr].L[2].nr_bloc;
                break;
            case 5:
                int nrr;
                if (blocuri.decizie[nr].L[4].id_bloc==0) ///nu este bucla
                {
                    strcpy(t, "if(");
                    strcpy(t+3, blocuri.decizie[nr].text);
                    strcat(t, ")");
                    scroll_codificare(y);
                    outtextxy(x, y, t);
                    text_taburi_cod(nr_tab, t);
                    y+=spatiu; nr_randuri++;
                    scroll_codificare(y);
                    outtextxy(x, y, "{");
                    text_taburi_cod(nr_tab, "{");
                    x+=tab; nr_tab++;
                    y+=spatiu; nr_randuri++;

                    auxn=nr;

                    tip=blocuri.decizie[nr].L[2].id_bloc;
                    nr=blocuri.decizie[nr].L[2].nr_bloc;

                    nrr=parcurgere_decizie(tip, nr, x, y, nr_tab);
                    x-=tab; nr_tab--;
                    y+=spatiu*nrr; nr_randuri+=nrr;
                    scroll_codificare(y);
                    outtextxy(x, y, "}");
                    text_taburi_cod(nr_tab, "}");
                    y+=spatiu; nr_randuri++;

                    if(blocuri.decizie[auxn].L[3].id_bloc!=6)
                    {
                        scroll_codificare(y);
                        outtextxy(x, y, "else");
                        text_taburi_cod(nr_tab, "else");
                        y+=spatiu; nr_randuri++;
                        scroll_codificare(y);
                        outtextxy(x, y, "{");
                        text_taburi_cod(nr_tab, "{");
                        y+=spatiu; nr_randuri++;
                        x+=tab; nr_tab++;

                        tip=blocuri.decizie[auxn].L[3].id_bloc;
                        nr=blocuri.decizie[auxn].L[3].nr_bloc;

                        nrr=parcurgere_decizie(tip, nr, x, y, nr_tab);
                        x-=tab; nr_tab--;
                        scroll_codificare(y);
                        outtextxy(x, y, "}");
                        text_taburi_cod(nr_tab, "}");
                        y+=spatiu; nr_randuri++;
                    }
                }
                else ///este bucla
                {
                    strcpy(t, "while(");
                    strcpy(t+6, blocuri.decizie[nr].text);
                    strcat(t, ")");
                    scroll_codificare(y);
                    outtextxy(x, y, t);
                    text_taburi_cod(nr_tab, t);
                    y+=spatiu; nr_randuri++;
                    scroll_codificare(y);
                    outtextxy(x, y, "{");
                    text_taburi_cod(nr_tab, "{");
                    x+=tab; nr_tab++;
                    y+=spatiu; nr_randuri++;

                    nrr=parcurgere_while(tip, nr, x, y, nr_tab);
                    x-=tab; nr_tab--;
                    y+=spatiu*nrr; nr_randuri+=nrr;
                    scroll_codificare(y);
                    outtextxy(x, y, "}");
                    text_taburi_cod(nr_tab, "}");
                    y+=spatiu; nr_randuri++;

                    tip=blocuri.decizie[nr].L[3].id_bloc;
                    nr=blocuri.decizie[nr].L[3].nr_bloc;
                }
                break;
            case 6:
                tip=blocuri.stop_decizie[nr].L[2].id_bloc;
                nr=blocuri.stop_decizie[nr].L[2].nr_bloc;
                break;
            case 7:
                if(viz[blocuri.atribuire[nr].text[0]-'A']==0)
                {
                    viz[blocuri.atribuire[nr].text[0]-'A']=1;
                    strcpy(t, "double ");
                    t[7]=blocuri.atribuire[nr].text[0];
                    strcpy(t+8, ";");
                    scroll_codificare(y);
                    outtextxy(x, y, t);
                    text_taburi_cod(nr_tab, t);
                    y+=spatiu; nr_randuri++;
                }
                strcpy(t,blocuri.atribuire[nr].text);
                strcat(t, ";");
                scroll_codificare(y);
                outtextxy(x, y, t);
                text_taburi_cod(nr_tab, t);
                y+=spatiu; nr_randuri++;
                tip=blocuri.atribuire[nr].L[2].id_bloc;
                nr=blocuri.atribuire[nr].L[2].nr_bloc;
                break;
        }
    }
    return nr_randuri;
}

void text_taburi_cod(int nr_tab, char t[])
{
    int i;
    char ttab[TEXTMAX]="    ";
    sf_cod++;
    for (i=1; i<=nr_tab; i++)
        strcat(codificare[sf_cod], ttab);
    strcat(codificare[sf_cod], t);
}

void text_codificare_schema()
{
    tabla_codificare_schema();

    int i, spatiu=17;
    coordonate sir={835, 400};
    setbkcolor(COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
    for (i=inc_cod; i<=sf_cod; i++)
    {
        outtextxy(sir.x, sir.y, codificare[i]);
        sir.y+=spatiu;
    }
}

void scroll_codificare(int &y)
{
    if (sf_cod-inc_cod>14)
    {
        tabla_codificare_schema();
        inc_cod++;
        text_codificare_schema();
        y=655;
    }
}

void executare_schema()
{
    tabla_executare_schema();

    coordonate sir={835, 75};
    int tip_bloc, nr_bloc, spatiu=17, i;
    double valoare;
    char t[100], s[100];
    inc_ex=1; sf_ex=0;

    for(i=0;i<26;i++)
        variabile[i]=0;

    for (i=1; i<=total_randuri_ex; i++)
        executare[i][0]='\0';

    desenare_bloc_start(blocuri.start.centru, cul_hover, cul_bloc_bkd, 0);
    delay(500);
    setbkcolor(COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
    setcolor(BLACK);
    outtextxy(sir.x, sir.y, "Start");
    strcpy(executare[++sf_ex], "Start");
    delay(500);
    desenare_bloc_start(blocuri.start.centru, cul_marg, cul_bloc_bkd, 0);

    tip_bloc=blocuri.start.L[2].id_bloc;
    nr_bloc=blocuri.start.L[2].nr_bloc;

    while (tip_bloc!=2)
    {
        scroll_executare(sir.y);
        t[0]='\0'; s[0]='\0';
        switch (tip_bloc)
        {
            case 3:
                desenare_bloc_citire(blocuri.citire[nr_bloc].centru, cul_hover, cul_bloc_bkd, blocuri.citire[nr_bloc].text, 0);
                setbkcolor(COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
                setcolor(BLACK);
                delay(500);
                strcpy(t, "Introduceti valoare pentru ");
                strcpy(t+27, blocuri.citire[nr_bloc].text);
                sir.y+=spatiu;
                citire_sir(sir.x, sir.y, t, s);
                strcpy(executare[++sf_ex], t);
                strcat(executare[sf_ex], ":");
                strcat(executare[sf_ex], s);
                valoare=atof(s);
                variabile[blocuri.citire[nr_bloc].text[0]-'A']=valoare;
                delay(500);
                desenare_bloc_citire(blocuri.citire[nr_bloc].centru, cul_marg, cul_bloc_bkd, blocuri.citire[nr_bloc].text, 0);
                tip_bloc=blocuri.citire[nr_bloc].L[2].id_bloc;
                nr_bloc=blocuri.citire[nr_bloc].L[2].nr_bloc;
                break;
            case 4:
                desenare_bloc_afisare(blocuri.afisare[nr_bloc].centru, cul_hover, cul_bloc_bkd, blocuri.afisare[nr_bloc].text, 0);
                setbkcolor(COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
                setcolor(BLACK);
                delay(500);
                if(strstr(blocuri.afisare[nr_bloc].text,"'"))
                {
                    strcpy(t, "Se afiseaza ");
                    strcpy(t+12, blocuri.afisare[nr_bloc].text);
                }
                else
                {
                    valoare=Evaluare(blocuri.afisare[nr_bloc].text);
                    strcpy(t, "Valoarea afisata este ");
                    if (int(valoare) == valoare)
                    {
                        sprintf(s, "%d", (int)valoare);
                    }
                    else
                    {
                        int val = int(valoare * 100);
                        if (val < 100 && val > 0)
                        {
                            sprintf(s + 1, "%d", val);
                            s[0] = '0';
                        }
                        else if (val > -100 && val < 0)
                        {
                            sprintf(s + 1, "%d", val);
                            s[0] = '-';
                            s[1] = '0';
                        }
                        else
                        {
                            sprintf(s, "%d", val);
                        }
                        int l=strlen(s); l++;
                        s[l]='\0';
                        s[l-1]=s[l-2]; s[l-2]=s[l-3]; s[l-3]='.';
                    }
                    strcat(t, s);
                    t[strlen(t)]='\0';
                }
                sir.y+=spatiu;
                outtextxy(sir.x, sir.y, t);
                strcpy(executare[++sf_ex], t);
                delay(500);
                desenare_bloc_afisare(blocuri.afisare[nr_bloc].centru, cul_marg, cul_bloc_bkd, blocuri.afisare[nr_bloc].text, 0);
                tip_bloc=blocuri.afisare[nr_bloc].L[2].id_bloc;
                nr_bloc=blocuri.afisare[nr_bloc].L[2].nr_bloc;
                break;
            case 5:
                desenare_bloc_decizie(blocuri.decizie[nr_bloc].centru, cul_hover, cul_bloc_bkd, blocuri.decizie[nr_bloc].text, 0);
                setbkcolor(COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
                setcolor(BLACK);
                delay(500);
                valoare=Evaluare(blocuri.decizie[nr_bloc].text);
                if (valoare==1)
                {
                    sir.y+=spatiu;
                    outtextxy(sir.x, sir.y, "Expresia este adevarata");
                    strcpy(executare[++sf_ex], "Expresia este adevarata");
                    delay(500);
                    desenare_bloc_decizie(blocuri.decizie[nr_bloc].centru, cul_marg, cul_bloc_bkd, blocuri.decizie[nr_bloc].text, 0);
                    tip_bloc=blocuri.decizie[nr_bloc].L[2].id_bloc;
                    nr_bloc=blocuri.decizie[nr_bloc].L[2].nr_bloc;
                }
                else
                {
                    sir.y+=spatiu;
                    outtextxy(sir.x, sir.y, "Expresia este falsa");
                    strcpy(executare[++sf_ex], "Expresia este falsa");
                    delay(500);
                    desenare_bloc_decizie(blocuri.decizie[nr_bloc].centru, cul_marg, cul_bloc_bkd, blocuri.decizie[nr_bloc].text, 0);
                    tip_bloc=blocuri.decizie[nr_bloc].L[3].id_bloc;
                    nr_bloc=blocuri.decizie[nr_bloc].L[3].nr_bloc;
                }
                break;
            case 6:
                delay(500);
                desenare_bloc_stop_decizie(blocuri.stop_decizie[nr_bloc].centru, cul_hover, cul_bloc_bkd, 0);
                delay(500);
                desenare_bloc_stop_decizie(blocuri.stop_decizie[nr_bloc].centru, cul_marg, cul_bloc_bkd, 0);
                tip_bloc=blocuri.stop_decizie[nr_bloc].L[2].id_bloc;
                nr_bloc=blocuri.stop_decizie[nr_bloc].L[2].nr_bloc;
                break;
            case 7:
                desenare_bloc_atribuire(blocuri.atribuire[nr_bloc].centru, cul_hover, cul_bloc_bkd, blocuri.atribuire[nr_bloc].text, 0);
                setbkcolor(COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
                setcolor(BLACK);
                delay(500);
                valoare=Evaluare(blocuri.atribuire[nr_bloc].text+2);
                strcpy(t, "Atribuim variabilei ");
                t[strlen(t)]=blocuri.atribuire[nr_bloc].text[0];
                strcpy(t+21, " valoarea ");
                if (int(valoare)==valoare)
                    sprintf(s, "%d", (int)valoare);
                else
                {
                    int val=int(valoare*100);
                    if (val<100 && val>0)
                    {
                        sprintf(s+1, "%d", val);
                        s[0]='0';
                    }
                    else if (val>-100 && val<0)
                    {
                        sprintf(s+1, "%d", val);
                        s[0]='-';
                        s[1]='0';
                    }
                    else
                    {
                        sprintf(s, "%d", val);
                    }
                    int l=strlen(s); l++;
                    s[l]='\0';
                    s[l-1]=s[l-2]; s[l-2]=s[l-3]; s[l-3]='.';
                }
                strcpy(t+31, s);
                sir.y+=spatiu;
                outtextxy(sir.x, sir.y, t);
                strcpy(executare[++sf_ex], t);
                variabile[blocuri.atribuire[nr_bloc].text[0]-'A']=valoare;
                delay(500);
                desenare_bloc_atribuire(blocuri.atribuire[nr_bloc].centru, cul_marg, cul_bloc_bkd, blocuri.atribuire[nr_bloc].text, 0);
                tip_bloc=blocuri.atribuire[nr_bloc].L[2].id_bloc;
                nr_bloc=blocuri.atribuire[nr_bloc].L[2].nr_bloc;
                break;
        }
    }
    desenare_bloc_stop(blocuri.stop.centru, cul_hover, cul_bloc_bkd, 0);
    setbkcolor(COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
    setcolor(BLACK);
    delay(500);
    scroll_executare(sir.y);
    sir.y+=spatiu;
    outtextxy(sir.x, sir.y, "Stop");
    strcpy(executare[++sf_ex], "Stop");
    delay(500);
    desenare_bloc_stop(blocuri.stop.centru, cul_marg, cul_bloc_bkd, 0);

    total_randuri_ex=sf_ex;
    schema_executata=1;
}

void text_executare_schema()
{
    tabla_executare_schema();

    int i, spatiu=17;
    coordonate sir={835, 75};
    setbkcolor(COLOR(cul_exec.c1, cul_exec.c2, cul_exec.c3));
    for (i=inc_ex; i<=sf_ex; i++)
    {
        outtextxy(sir.x, sir.y, executare[i]);
        sir.y+=spatiu;
    }
}

void scroll_executare(int &y)
{
    int spatiu=17;
    delay(500);
    if (sf_ex-inc_ex>12)
    {
        tabla_executare_schema();
        inc_ex++;
        text_executare_schema();
        y-=spatiu;
    }
}

void hover_scroll()
{
    hover_scroll_sus_executare();
    hover_scroll_jos_executare();
    hover_scroll_sus_codificare();
    hover_scroll_jos_codificare();
}

void hover_scroll_sus_executare()
{
    if (hover_dreptunghi(btn_scroll_sus_ex) && inc_ex>1)
    {
        desenare_buton_scroll_sus(btn_scroll_sus_ex, cul_hover_exit);
        while (hover_dreptunghi(btn_scroll_sus_ex) && inc_ex>1)
        {
            if (ismouseclick(WM_LBUTTONDOWN))
            {
                inc_ex--; sf_ex--;
                text_executare_schema();
                break;
            }
        }
        desenare_buton_scroll_sus(btn_scroll_sus_ex, cul_btn_exit);
    }
}

void hover_scroll_jos_executare()
{
    if (hover_dreptunghi(btn_scroll_jos_ex) && sf_ex<total_randuri_ex)
    {
        desenare_buton_scroll_jos(btn_scroll_jos_ex, cul_hover_exit);
        while (hover_dreptunghi(btn_scroll_jos_ex) && sf_ex<total_randuri_ex)
        {
            if (ismouseclick(WM_LBUTTONDOWN))
            {
                inc_ex++; sf_ex++;
                text_executare_schema();
                break;
            }
        }
        desenare_buton_scroll_jos(btn_scroll_jos_ex, cul_btn_exit);
    }
}

void hover_scroll_sus_codificare()
{
    if (hover_dreptunghi(btn_scroll_sus_cod) && inc_cod>1)
    {
        desenare_buton_scroll_sus(btn_scroll_sus_cod, cul_hover_exit);
        while (hover_dreptunghi(btn_scroll_sus_cod) && inc_cod>1)
        {
            if (ismouseclick(WM_LBUTTONDOWN))
            {
                inc_cod--; sf_cod--;
                text_codificare_schema();
                break;
            }
        }
        desenare_buton_scroll_sus(btn_scroll_sus_cod, cul_btn_exit);
    }
}

void hover_scroll_jos_codificare()
{
    if (hover_dreptunghi(btn_scroll_jos_cod) && sf_cod<total_randuri_cod)
    {
        desenare_buton_scroll_jos(btn_scroll_jos_cod, cul_hover_exit);
        while (hover_dreptunghi(btn_scroll_jos_cod) && sf_cod<total_randuri_cod)
        {
            if (ismouseclick(WM_LBUTTONDOWN))
            {
                inc_cod++; sf_cod++;
                text_codificare_schema();
                break;
            }
        }
        desenare_buton_scroll_jos(btn_scroll_jos_cod, cul_btn_exit);
    }
}

int Prioritate(char c)
{
    if(c=='(' || c==')')
        return 0;
    if(c=='=' || c=='#' || c=='<' || c=='>' || c=='&' || c=='!')
        return 1;
    if(c=='+' || c=='-')
        return 2;
    if(c=='*' || c=='/')
        return 3;
    if(c=='^')
        return 4;
    if(c=='c' || c=='s' || c=='l'  || c=='t' || c=='a' || c=='n' || c=='r' ||c=='m' || c=='$')
        return 5;

}

bool DifInf(float x)
{
    return fabs(infinit-fabs(x)) > infinit / 2.0;
}

float Exponential(float x)
{
    if (DifInf(x))
        return exp(x);
    else
        return infinit;
}

float Inmultit(float x, float y)
{

    if (DifInf(x) && DifInf(y))
        return x*y;
        return infinit;
}

float Putere(float x, float y)
{
    if (x==0)
        return 0;
    else if (y==0)
        return 1;
    else if (x==infinit || y==infinit)
        return infinit;
    else
        return pow(x,y);
}

bool Egal(float x, float y) ///codificat cu =
{
    return x==y;
}

bool Diferit(float x, float y) ///codificat cu !
{
    return x!=y;
}

bool MaiMic(float x, float y)
{
    return x < y;
}

bool MaiMare(float x, float y)
{
    return x > y;
}

bool MaiMareEgal(float x, float  y) ///codificat cu &
{
    return x>=y;
}

bool MaiMicEgal(float x, float  y) ///codificat cu #
{
    return x<=y;
}

float Plus(float x, float y)
{
    if (DifInf(x) && DifInf(y))
        return x+y;
    else
        return infinit;
}

float Minus(float x, float y)
{
    if (DifInf(x) && DifInf(y))
        return x-y;
    else
        return infinit;
}

float Impartit(float x, float y)
{
    if (fabs(y)>epsi)
        return x/y;
    else
        return infinit;
}

float Logaritm(float x) ///codificat cu l
{
    if (x>epsi && DifInf(x))
        return log(x);
    else
        return infinit;
}

float Sinus(float x) ///codificat cu s
{
    if (DifInf(x))  return sin(x);
    else return infinit;
}

float Cosinus(float x) ///codificat cu c
{
    if (DifInf(x))  return cos(x);
    else return infinit;
}

float Tangent(float x) ///codificat cu t
{
    if(cos(x)==0) return infinit;
    return float(sin(x)/cos(x));
}

float Cotangent(float x) ///codificat cu n
{
    if(sin(x)==0) return infinit;
    return float(cos(x)/sin(x));
}

float Modul(float x) ///codificat cu a
{
    if (DifInf(x)) return fabs(x);
    else return infinit;
}

float Radical(float x) ///codificat cu r
{
    if(x<0) return infinit;
    return sqrt(x);
}

bool EsteNumar(char sir[MAX1])
{
    return (atof(sir)!=0.0 &&
            (strchr("0123456789",sir[0]) || sir[0]=='-' && strchr("0123456789",sir[1])));
}

double ValoareFunctie(functie E)
{
    int i;
    double valo,x_1,x_2;
    for (i=1; i<=max_stiva; i++)
    {
        Opd[i]=0;
        Op[i]='@';
    }
    top1=0; top2=1;
    Op[top2]='(';
    i=0;

    while (i<=E.lung && top2>0)
    {
        i++;
        if (EsteNumar(E.vect[i]))
        {
            top1++;
            valo=atof(E.vect[i]);
            Opd[top1]=valo;
        }
        else if (E.vect[i][0]>='A' && E.vect[i][0]<='Z')
        {
            top1++;
            Opd[top1]=variabile[E.vect[i][0]-'A'];
        }
        else
            switch (E.vect[i][0])
            {
            case '(':
                /* inceput de bloc */
                top2++;
                Op[top2]='(';
                break;
            default:
                /* operatii binare si unare */
                while ((top2>0) && !(strchr("()",Op[top2])) &&
                        Prioritate(Op[top2])>=Prioritate(E.vect[i][0]))
                {
                    if (top1>1)
                        x_1=Opd[top1-1];
                    x_2=Opd[top1];
                    switch (Op[top2])
                    {
                    case '=':
                        valo=Egal(x_1,x_2);
                        break;
                    case '!':
                        valo=Diferit(x_1,x_2);
                        break;
                    case '<':
                        valo=MaiMic(x_1,x_2);
                        break;
                    case '>':
                        valo=MaiMare(x_1,x_2);
                        break;
                    case '+':
                        valo=Plus(x_1,x_2);
                        break;
                    case '-':
                        valo=Minus(x_1,x_2);
                        break;
                    case '*':
                        valo=Inmultit(x_1,x_2);
                        break;
                    case '/':
                        valo=Impartit(x_1,x_2);
                        break;
                    case '^':
                        valo=Putere(x_1,x_2);
                        break;
                    case '#':
                        valo=MaiMicEgal(x_1,x_2);
                        break;
                    case '&':
                        valo=MaiMareEgal(x_1,x_2);
                        break;
                    case 'm':
                        valo=min(x_1,x_2);
                        break;
                    case '$':
                        valo=max(x_1,x_2);
                        break;
                    case 's':
                        valo=Sinus(x_2);
                        break;
                    case 'c':
                        valo=Cosinus(x_2);
                        break;
                    case 'l':
                        valo=Logaritm(x_2);
                        break;
                    case 't':
                        valo=Tangent(x_2);
                        break;
                    case 'n':
                        valo=Cotangent(x_2);
                        break;
                    case 'a':
                        valo=Modul(x_2);
                        break;
                    case 'r':
                        valo=Radical(x_2);
                        break;
                    }
                    if (strchr(OperatiiBinare,Op[top2]))
                        top1--;
                    if (strchr(Operatii,Op[top2]))
                        Opd[top1]=valo;
                    top2--;
                }
                if (top2>0)
                    if ((Op[top2]!='(') || (strcmp(E.vect[i],")")))
                    {
                        top2++;
                        Op[top2] = E.vect[i][0];
                    }
                    else
                        top2--;
            }
    }

    if (top2==0)
        return Opd[1];
    else
        return infinit;
}

float Evaluare(char text[])
{
    functie F;
    int k=1, j=0;
    float valoare=0;
    strcpy(F.vect[0],"(");
    strcpy(F.expresie,"(");

    while (j<strlen(text))
    {
        if(text[j]=='(' && text[j+1]=='-')
        {
            F.vect[k][0]='-';
            j=j+2;
            int contor=1;
            while(text[j]!=')')
            {
                F.vect[k][contor]=text[j];
                contor++;j++;
            }
            F.vect[k][contor]='\0';
        }
        else if (text[j]=='=' && text[j+1]=='=')
        {
            F.vect[k][0]='=';
            F.vect[k][1]='\0';
            j++;
        }
        else if (text[j]=='!' && text[j+1]=='=')
        {
            F.vect[k][0]='!';
            F.vect[k][1]='\0';
            j++;
        }
        else if (text[j]=='<' && text[j+1]=='=')
        {
            F.vect[k][0]='#';
            F.vect[k][1]='\0';
            j++;
        }
        else if (text[j]=='>' && text[j+1]=='=')
        {
            F.vect[k][0]='&';
            F.vect[k][1]='\0';
            j++;
        }
        else if (strchr("=^<>+-*/()",text[j]))
        {
            F.vect[k][0]=text[j];
            F.vect[k][1]='\0';
        }
        else if(strchr("1234567890",text[j]))
        {
            int contor=0;
            while(strchr("1234567890",text[j]))
            {
                F.vect[k][contor]=text[j];
                j++;
                contor++;
            }
            F.vect[k][contor]='\0';
            j--;
        }
        else if ('A'<=text[j] && text[j]<='Z')
        {
            F.vect[k][0]=text[j];
            F.vect[k][1]='\0';
        }
        else if (text[j]=='c' && text[j+1]=='t')
        {
            F.vect[k][0]='n';
            F.vect[k][1]='\0';
            j=j+3;
        }
        else if (text[j]=='s' && text[j+1]=='q')
        {
            F.vect[k][0]='r';
            F.vect[k][1]='\0';
            j=j+3;
        }
        else if(text[j]=='m')
        {
            if(text[j+1]=='a')
            {
                F.vect[k][0]='$';
                F.vect[k][1]='\0';
            }
            else
            {
                F.vect[k][0]='m';
                F.vect[k][1]='\0';
            }
            j=j+2;
        }
        else if ('a'<=text[j] && text[j]<='z')
        {
            if(text[j]=='c' && (text[j+4]=='0' || text[j+4]>='A' && text[j+4]=='Z' && variabile[text[j+4]-'A']==0)&& text[j+5]==')')
            {
                F.vect[k][0]='1';
                F.vect[k][1]='\0';
                j=j+6;
            }
            else
            {
                F.vect[k][0]=text[j];
                F.vect[k][1]='\0';
                j=j+2;
            }
        }
        strcat(F.expresie,F.vect[k-1]);
        if(text[j]!=',')
            k++;
        j++;
    }
    strcpy(F.vect[k],")");
    strcat(F.expresie,")");
    F.lung=strlen(F.expresie);
    valoare=ValoareFunctie(F);
    return valoare;
}
