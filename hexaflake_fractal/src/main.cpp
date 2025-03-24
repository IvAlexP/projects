#include <iostream>
#include <cmath>
#include "graphics2.h"
#define NMAX 14
using namespace std;

int nr;
void fractal(int midx, int midy, int L);

int main()
{
    ///intializare mod grafic
    int driver, mod;
    initgraph(&driver, &mod, "", 1200, 1200);

    ///calculam coordonatele centrului ferestrei
    int midx=getmaxx()/2;
    int midy=getmaxy()/2;

    ///desenam fractalul
    int L=400;
    fractal(midx, midy, L);
    while (!kbhit());

    closegraph();
    return 0;
}

void fractal(int midx, int midy, int L)
{
    if (L<10)
    {
        int hex[NMAX]={midx-L,   midy,
                       midx-L/2, midy-L/2*sqrt(3),
                       midx+L/2, midy-L/2*sqrt(3),
                       midx+L,   midy,
                       midx+L/2, midy+L/2*sqrt(3),
                       midx-L/2, midy+L/2*sqrt(3),
                       midx-L,   midy};
        if (nr%2==1)
        {
            setcolor(CYAN); fillpoly(7, hex);
            setcolor(MAGENT); drawpoly(7, hex);
        }
        else
        {
            setcolor(RED); fillpoly(7, hex);
            setcolor(YELLOW); drawpoly(7, hex);
        }
    }
    else
    {
        fractal(midx-2*L/3, midy, L/3); ///hexagon stanga
        fractal(midx-L/3, midy-L/3*sqrt(3), L/3); ///hexagon stanga sus
        fractal(midx+L/3, midy-L/3*sqrt(3), L/3); ///hexagon dreapta sus
        fractal(midx+2*L/3, midy, L/3); ///hexagon dreapta
        fractal(midx+L/3, midy+L/3*sqrt(3), L/3); ///hexagon dreapta jos
        fractal(midx-L/3, midy+L/3*sqrt(3), L/3); ///hexagon stanga jos
        nr++; fractal(midx, midy, L/3); nr--; ///hexagon mijloc
    }
}
