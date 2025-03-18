#include <errno.h>      //pentru perror()
#include <sys/socket.h> //pentru socket()
#include <arpa/inet.h>  //manipularea adreselor numerice IP
#include <stdio.h>      //pentru stdout
#include <stdlib.h>     //pentru exit()
#include <sys/time.h>   //pentru struct timeval tv
#include <string.h>     //pentru strcat()
#include <unistd.h>     //pentru read() si write()
#include <string.h>     //pentru strcat()
#include <signal.h>     //pentru semnalele de inchidere

#define LMAX 1024

int sd, pid;

void verificare_argumente(int argc);
void afisare_comenzi();
int creare_socket();
struct sockaddr_in initializare_server(int port, int addr);
void conectare_server(struct sockaddr_in *server);
int creare_fork();
void proces_fiu();
void proces_tata();
long int apelul_read(int fd, char* msg);
void apelul_write(char *msg);
void handle_quit(int sig);
void handle_parinte(int sig);
void handle_fiu(int sig);

int main(int argc, char *argv[])
{
    verificare_argumente(argc);
    afisare_comenzi();

    sd = creare_socket();
    int port = atoi(argv[2]);
    struct sockaddr_in server = initializare_server(port, atoi(argv[1]));
    conectare_server(&server);
    
    pid = creare_fork();

    if (pid == 0)
    {
        proces_fiu(sd);
    }
    else
    {
        proces_tata(sd);
    }

    return 0;
}

void verificare_argumente(int argc)
{
    if (argc != 3)
    {
        printf("Sintaxa: <./client> <adresa_server> <port>\n");
        exit(0);
    }
}

void afisare_comenzi()
{
    int i;
    char* comenzi[] = {"login : username",
                       "logout",
                       "quit",
                       "send username : text ",
                       "history : username",
                       "reply username nr_msg : text",
                       "delete : username nr_msg"};
    printf("%s\n", "Comenzi posibile:");
    for (i=0; i<7; i++)
    {
        printf("  %s\n", comenzi[i]);
    }
    printf("\n%s\n\n", "Comenzile dumneavoastra:");
}

int creare_socket()
{
    int sd = socket(AF_INET, SOCK_STREAM, 0);
    if (sd == -1)
    {
        perror("Eroare la socket()");
        exit(errno);
    }
    return sd;
}

struct sockaddr_in initializare_server(int port, int addr)
{
    struct sockaddr_in server;
    bzero(&server, sizeof(server));
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = htonl(addr);
    server.sin_port = htons(port);
    return server;
}

void conectare_server(struct sockaddr_in *server)
{
    if (connect(sd, (struct sockaddr *)server, sizeof(struct sockaddr)) == -1)
    {
        perror("Eroare la connect()");
        exit(errno);
    }
}

int creare_fork()
{
    int pid = fork();
    if (pid == -1)
    {
        perror("Eroare la fork");
        exit(errno);
    }
    return pid;
}

void proces_tata(int sd)
{
    char msg[LMAX] = "";
    signal(SIGINT, handle_quit);
    signal(SIGTERM, handle_parinte);
    while (1)
    {
        bzero(msg, LMAX);
        apelul_read(0, msg);
        apelul_write(msg);
        if (strcmp(msg, "quit\n") == 0)
        {
            kill(pid, SIGTERM);
            shutdown(sd, SHUT_RDWR);
            close(sd);
            break;
        }
    }
}

void proces_fiu(int sd)
{
    char msg[LMAX] = {};
    signal(SIGTERM, handle_fiu);
    while (1)
    {
        bzero(msg, LMAX);
        apelul_read(sd, msg);
        if (strcmp(msg, "quit") == 0)
        {
            kill(getppid(), SIGTERM);
            shutdown(sd, SHUT_RDWR);
            close(sd);
            break;
        }
        printf("%s", msg);
    }
}

long int apelul_read(int fd, char* msg)
{
    char buffer[LMAX];
    long int bytes = read(fd, msg, sizeof(buffer));
    if (bytes < 0)
    {
        perror("Eroare la read()");
        exit(errno);
    }
    return bytes;
}

void apelul_write(char *msg)
{
    if (write(sd, msg, LMAX) < 0)
    {
        perror("Eroare la write()");
        exit(errno);
    }
}

void handle_quit(int sig)
{
    apelul_write("quit\n");
    printf("\nLa revedere!\n");
    kill(pid, SIGTERM);
    exit(0);
}

void handle_parinte(int sig)
{
    printf("Serverul a fost inchis!\nLa revedere!\n");
    exit(0);
}

void handle_fiu(int sig)
{
    printf("La revedere!\n");
    exit(0);
}