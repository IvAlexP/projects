#include <errno.h>      //pentru perror()
#include <sys/socket.h> //pentru socket()
#include <arpa/inet.h>  //manipularea adreselor numerice IP
#include <stdio.h>      //pentru stdout
#include <stdlib.h>     //pentru exit()
#include <sys/time.h>   //pentru struct timeval tv
#include <string.h>     //pentru strcat()
#include <unistd.h>     //pentru read() si write()
#include <string.h>     //pentru strcat()
#include <sqlite3.h>    //pentru baza de date
#include <fcntl.h>      //pentru apelul neblocat de citire "quit"
#include <signal.h>     //pentru cand este inchis serverul prin CTRL C

#define PORT 2727
#define LMAX 1024       //dimensiune mesaje
#define UMAX 30         //lungime username

sqlite3 *db;
int rc;
int sd, nfds;
fd_set readfds, actfds;

void creare_baza_date();
void vf_sql_ok(char *error);
void vf_rc_done();
void vf_rc_ok();

int creare_socket();
void reutilizare_port();
struct sockaddr_in initializare_server();
void atasare_socket(struct sockaddr_in *server);
void ascultare_clienti();
fd_set descritori_activi();

void afisare_instructiuni();
void handle_sigint(int sig);
void inchidere_server();
void apelul_select(struct timeval *tv);
int server_pregatit();
int apelul_accept(struct sockaddr_in *from, socklen_t len);
void client_pregatit();
void primire_comanda();

void comanda_login(int fd, char *comanda);
void logare(char *username, int fd, char *msg);
void user_existent(char *username, int fd, sqlite3_stmt *stmt);
void user_conectare_noua(char *username, int fd);
void user_nou(char *username, int fd);
void verificare_notificari(char *username, int fd);
void mesaje_pierdute(char *username, int fd);
void seen(char *username);

void comanda_logout(int fd);
char* stare_logat(int fd, char *msg);
void deconectare(int fd, char *msg);

void comanda_quit(int fd);
void comanda_inexistenta(int fd);

void comanda_send(int fd, char *comanda);
int exista_destinatar(char *username);
int destinatar_online(char *destinatar);
void salvare_mesaj(char *expeditor, char *destinatar, char *text, int seen, int reply);
void trimite_mesaj(char *expeditor, char *destinatar, char *text, int reply);
const char *ora_trimitere_mesaj();
const char *username_expeditor(int fd);

void comanda_history(int fd, char *comanda);
void afisare_history(char* username, char* interlocutor, int fd);

void comanda_reply(int fd, char *comanda);
int vf_existenta_msg(char *destinatar, char *expeditor, int nr_msg);

void comanda_delete(int fd, char *comanda);
void sterge_mesaj(char* expeditor, char* destinatar, int nr_msg);

void apelul_read(int fd, char* msg);
void apelul_write(int fd, char *msg);

int main()
{
    signal(SIGINT, handle_sigint);

    creare_baza_date();

    sd = creare_socket();
    reutilizare_port();
    struct sockaddr_in server = initializare_server();
    atasare_socket(&server);    
    ascultare_clienti();

    FD_ZERO(&actfds);
    FD_SET(sd, &actfds);
    
    struct timeval tv = {0, 0};
    nfds = sd;

    afisare_instructiuni();

    char msg[LMAX] = {};
    int flags = fcntl(STDIN_FILENO, F_GETFL, 0);
    fcntl(STDIN_FILENO, F_SETFL, flags | O_NONBLOCK);

    while (1)
    {
        bcopy((char *)&actfds, (char *)&readfds, sizeof(readfds));
        apelul_select(&tv);

        if (server_pregatit())
        {
            client_pregatit();
        }

        if (fgets(msg, sizeof(msg), stdin) != NULL)
        {
            if (strcmp(msg, "quit\n") == 0)
            {
                inchidere_server();
                break;
            }
        }
    }

    return 0;
}

void creare_baza_date()
{
    char *error = 0;
    rc = sqlite3_open("messenger.db", &db); vf_rc_ok();

    const char *sql_create_table_users =
            "CREATE TABLE IF NOT EXISTS users (" \
            "username TEXT PRIMARY KEY," \
            "fd INTEGER);";
    rc = sqlite3_exec(db, sql_create_table_users, 0, 0, &error); vf_sql_ok(error);

    const char *sql_create_table_conv =
            "CREATE TABLE IF NOT EXISTS conversatii (" \
            "id INTEGER PRIMARY KEY AUTOINCREMENT," \
            "expeditor TEXT NOT NULL," \
            "destinatar TEXT NOT NULL," \
            "text TEXT NOT NULL," \
            "data TEXT NOT NULL," \
            "ora TEXT NOT NULL," \
            "seen INTEGER NOT NULL," \
            "reply INTEGER NOT NULL);";
    rc = sqlite3_exec(db, sql_create_table_conv, 0, 0, &error); vf_sql_ok(error);
}

void vf_sql_ok(char *error)
{
    if (rc != SQLITE_OK)
    {
        printf("SQL error: %s\n", error);
        exit(0);
    }
}

void vf_rc_ok()
{
    if (rc != SQLITE_OK)
    {
        printf("SQL error: %s\n", sqlite3_errmsg(db));
        exit(0);
    }
}

void vf_rc_done()
{
    if (rc != SQLITE_DONE)
    {
        printf("SQL error: %s\n", sqlite3_errmsg(db));
        exit(0);
    }
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

void reutilizare_port()
{
    int optval = 1;
    setsockopt(sd, SOL_SOCKET, SO_REUSEADDR, &optval, sizeof(optval));
}

struct sockaddr_in initializare_server()
{
    struct sockaddr_in server;
    bzero(&server, sizeof(server));
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = htonl(INADDR_ANY);
    server.sin_port = htons(PORT);
    return server;
}

void atasare_socket(struct sockaddr_in *server)
{
    if (bind(sd, (struct sockaddr *)server, sizeof(struct sockaddr)))
    {
        perror("Eroare la bind()");
        exit(errno);
    }
}

void ascultare_clienti()
{
    if (listen(sd, 5) == -1)
    {
        perror("Eroare la listen()");
        exit(errno);
    }
}

void afisare_instructiuni()
{
    printf("Asteptam la portul %d...\n", PORT);
    printf("Puteti inchide oricand serverul scriind comanda quit sau formand CTRL+C\n");
    fflush(stdout);
}

void handle_sigint(int sig)
{
    printf("\n");
    inchidere_server();
    exit(0);
}

void inchidere_server()
{
    int fd;
    for (fd = 0; fd <= nfds; fd++)
    {
        if (fd != sd && FD_ISSET(fd, &actfds))
        {
            apelul_write(fd, "quit");
            comanda_quit(fd);
        }
    }
    close(sd);
    FD_CLR(sd, &actfds);
    printf("Serverul a fost inchis!\nLa revedere!\n");
}

void apelul_select(struct timeval *tv)
{
    if (select(nfds+1, &readfds, NULL, NULL, tv) < 0)
    {
        perror("Eroare la select()");
        exit(errno);
    }
}

int server_pregatit()
{
    int client;
    struct sockaddr_in from;
    socklen_t len;

    if (FD_ISSET(sd, &readfds))
    {
        len = sizeof(from);
        bzero(&from, sizeof(from));

        client = apelul_accept(&from, len);

        if (nfds < client)
            nfds = client;

        FD_SET(client, &actfds);
        printf("S-a conectat clientul cu descriptorul %d\n", client);
        fflush(stdout);
    }

    return 1;
}

int apelul_accept(struct sockaddr_in *from, socklen_t len)
{
    int client = accept(sd, (struct sockaddr *)from, &len);
    if (client < 0)
    {
        perror("Eroare la accept()");
        exit(errno);
    }
    return client;
}

void client_pregatit()
{
    int fd;
    for (fd = 0; fd <= nfds; fd++)
    {
        if (fd != sd && FD_ISSET(fd, &readfds))
        {
            primire_comanda(fd);
        }
    }
}

void primire_comanda(int fd)
{
    char comanda[LMAX] = "";
    apelul_read(fd, comanda);
    printf("Comanda primita de la clientul %d este:\n   %s", fd, comanda);

    if (strstr(comanda, "login : ") != NULL)
    {
        comanda_login(fd, comanda);
    }
    else if (strcmp(comanda, "logout\n") == 0)
    {
        comanda_logout(fd);
    }
    else if (strcmp(comanda, "quit\n") == 0)
    {
        comanda_quit(fd);
    }
    else if (strstr(comanda, "send ") != NULL)
    {
        comanda_send(fd, comanda);
    }
    else if (strstr(comanda, "history : ")  != NULL)
    {
        comanda_history(fd, comanda);
    }
    else if (strstr(comanda, "reply ") != NULL)
    {
        comanda_reply(fd, comanda);
    }
    else if (strstr(comanda, "delete : ") != NULL)
    {
        comanda_delete(fd, comanda);
    }
    else
    {
        comanda_inexistenta(fd);
    }
}

void comanda_login(int fd, char *comanda)
{   
    char username[UMAX] = {}, msg[LMAX] = {};
    strcpy(username, strtok(comanda + strlen("login : "), "\n"));

    sqlite3_stmt *stmt;
    const char *sql_select = "SELECT * FROM users WHERE fd = ? AND username <> ?;";
    rc = sqlite3_prepare_v2(db, sql_select, -1, &stmt, 0);        vf_rc_ok();
    rc = sqlite3_bind_int(stmt, 1, fd);                           vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 2, username, -1, SQLITE_STATIC); vf_rc_ok();
    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW)
    {
        strcpy(msg, "Esti deja logat la alt cont!\n\n");
    }
    else if (rc == SQLITE_DONE)
    {      
        logare(username, fd, msg);
    }
    else
    {
        printf("SQL error: %s\n", sqlite3_errmsg(db));
        exit(0);
    }

    sqlite3_finalize(stmt);
    apelul_write(fd, msg);
}

void logare(char *username, int fd, char *msg)
{
    sqlite3_stmt *stmt;
    const char *sql_select = "SELECT fd FROM users WHERE username = ?;";
    rc = sqlite3_prepare_v2(db, sql_select, -1, &stmt, 0);        vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 1, username, -1, SQLITE_STATIC); vf_rc_ok();
    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW)
    {
        user_existent(username, fd, stmt);
    }
    else if (rc == SQLITE_DONE)
    {       
        user_nou(username, fd);
    }
    else
    {
        printf("SQL error: %s\n", sqlite3_errmsg(db));
        exit(0);
    }
}

void user_existent(char *username, int fd, sqlite3_stmt *stmt)
{
    if (sqlite3_column_type(stmt, 0) == SQLITE_NULL)
    {
        user_conectare_noua(username, fd);
        apelul_write(fd, "Reconectare realizata cu succes!\n\n");
        verificare_notificari(username, fd);
    }
    else
    {
        int fd_user = sqlite3_column_int(stmt, 0);
        if (fd_user != fd)
        {
            apelul_write(fd, "User conectat deja dintr-o alta locatie!\n\n");
        }
        else
        {
            apelul_write(fd, "Esti deja logat la acest cont!\n\n");
        }
    }
}

void user_conectare_noua(char *username, int fd)
{
    sqlite3_stmt *stmt;
    const char *sql_update = "UPDATE users SET fd = ? WHERE username = ?;";
    rc = sqlite3_prepare_v2(db, sql_update, -1, &stmt, 0);        vf_rc_ok();
    rc = sqlite3_bind_int(stmt, 1, fd);                           vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 2, username, -1, SQLITE_STATIC); vf_rc_ok();
    rc = sqlite3_step(stmt);                                      vf_rc_done();
    sqlite3_finalize(stmt);
}

void user_nou(char *username, int fd)
{
    sqlite3_stmt *stmt;
    const char *sql_insert = "INSERT INTO users (username, fd) VALUES (?, ?);";
    rc = sqlite3_prepare_v2(db, sql_insert, -1, &stmt, 0);   vf_rc_ok();
    sqlite3_bind_text(stmt, 1, username, -1, SQLITE_STATIC); vf_rc_ok();
    sqlite3_bind_int(stmt, 2, fd);                           vf_rc_ok();
    rc = sqlite3_step(stmt);                                 vf_rc_done();
    sqlite3_finalize(stmt);
    apelul_write(fd, "Contul a fost creat!\nConectare realizata cu succes!\n\n");
}

void verificare_notificari(char *username, int fd)
{
    sqlite3_stmt *stmt;
    const char *sql_select = "SELECT COUNT(*) FROM conversatii " \
                             "WHERE destinatar = ? AND seen = 0;";
    rc = sqlite3_prepare_v2(db, sql_select, -1, &stmt, 0);        vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 1, username, -1, SQLITE_STATIC); vf_rc_ok();
    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW)
    {
        int nr = sqlite3_column_int(stmt, 0);
        if (nr == 1)
        {
            apelul_write(fd, "Ai un mesaj pierdut:\n");
            mesaje_pierdute(username, fd);
        }
        else if (nr > 0)
        {
            char temp[40] = {};
            sprintf(temp, "Ai %d mesaje pierdute:\n", nr);
            apelul_write(fd, temp);
            mesaje_pierdute(username, fd);
        }
    }
    else
    {
        printf("SQL error: %s\n", sqlite3_errmsg(db));
        exit(0);
    }

    sqlite3_finalize(stmt);
}

void mesaje_pierdute(char *username, int fd)
{
    sqlite3_stmt *stmt;
    const char *sql_select = "SELECT data, ora, expeditor, text " \
                             "FROM conversatii WHERE destinatar = ? AND seen = 0;";
    rc = sqlite3_prepare_v2(db, sql_select, -1, &stmt, 0);        vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 1, username, -1, SQLITE_STATIC); vf_rc_ok();
    
    while (sqlite3_step(stmt) == SQLITE_ROW) 
    {
        const unsigned char *data = sqlite3_column_text(stmt, 0);
        const unsigned char *ora = sqlite3_column_text(stmt, 1);
        const unsigned char *expeditor = sqlite3_column_text(stmt, 2);
        const unsigned char *text = sqlite3_column_text(stmt, 3);
        char aux[LMAX] = {};
        sprintf(aux, "%s %s %s : %s\n", data, ora, expeditor, text);
        apelul_write(fd, aux);
    }
    
    apelul_write(fd, "\n");
    sqlite3_finalize(stmt);
    seen(username);
}

void seen(char *username)
{
    sqlite3_stmt *stmt;
    const char *sql_update = "UPDATE conversatii SET seen = 1 WHERE destinatar = ?;";
    rc = sqlite3_prepare_v2(db, sql_update, -1, &stmt, 0);        vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 1, username, -1, SQLITE_STATIC); vf_rc_ok();
    rc = sqlite3_step(stmt);                                      vf_rc_done();
    sqlite3_finalize(stmt);
}

void comanda_logout(int fd)
{
    char msg[LMAX] = {};
    if (stare_logat(fd, msg))
    {
        deconectare(fd, msg);
    }
    apelul_write(fd, msg);
}

char* stare_logat(int fd, char *msg)
{
    sqlite3_stmt *stmt;
    const char *sql_select = "SELECT username FROM users WHERE fd = ?;";
    rc = sqlite3_prepare_v2(db, sql_select, -1, &stmt, 0); vf_rc_ok();
    rc = sqlite3_bind_int(stmt, 1, fd);                    vf_rc_ok();
    rc = sqlite3_step(stmt);
    
    if (rc == SQLITE_ROW)
    {
        const unsigned char *username = sqlite3_column_text(stmt, 0);
        return (char*)(username);
    }
    else if (rc == SQLITE_DONE)
    {
        sqlite3_finalize(stmt);
        strcpy(msg, "Nu esti conectat la niciun cont!\n\n");
        return NULL;
    }
    else
    {
        printf("SQL error: %s\n", sqlite3_errmsg(db));
        exit(0);
    }
}

void deconectare(int fd, char *msg)
{
    sqlite3_stmt *stmt;
    const char *sql_update = "UPDATE users SET fd = NULL WHERE fd = ?;";
    rc = sqlite3_prepare_v2(db, sql_update, -1, &stmt, 0); vf_rc_ok();
    rc = sqlite3_bind_int(stmt, 1, fd);                    vf_rc_ok();
    rc = sqlite3_step(stmt);                               vf_rc_done();
    sqlite3_finalize(stmt);
    strcpy(msg, "Deconectare realizata cu succes!\n\n");
}

void comanda_quit(int fd)
{
    char msg[LMAX] = {};
    if (stare_logat(fd, msg))
    {
        deconectare(fd, msg);
    }
    printf("S-a deconectat clientul cu descriptorul %d\n", fd);
    close(fd);
    FD_CLR(fd, &actfds);
}

void comanda_send(int fd, char *comanda)
{
    char msg[LMAX] = {};
    if (!stare_logat(fd, msg))
    {
        apelul_write(fd, "Conecteaza-te la un cont pentru a putea trimite mesaje!\n\n");
    }
    else
    {
        char expeditor[UMAX] = {};
        strcpy(expeditor, username_expeditor(fd));

        char copie[LMAX];
        strcpy(copie, comanda);
        char *p = strtok(copie, " :");
        p = strtok(NULL, " :");

        char destinatar[UMAX] = {};
        strcpy(destinatar, p);

        if (exista_destinatar(destinatar))
        {
            char text[LMAX] = {};
            strcpy(text, comanda + 8 + strlen(destinatar));
            text[strlen(text)-1] = '\0';
            trimite_mesaj(expeditor, destinatar, text, 0);
            apelul_write(fd, "Mesaj trimis cu succes!\n\n");
        }
        else
        {
            apelul_write(fd, "Username-ul introdus nu exista!\n\n");
        }     
    }
}

const char *username_expeditor(int fd)
{
    sqlite3_stmt *stmt;
    const char *sql_select = "SELECT username FROM users WHERE fd = ?;";
    rc = sqlite3_prepare_v2(db, sql_select, -1, &stmt, 0); vf_rc_ok();
    rc = sqlite3_bind_int(stmt, 1, fd);                    vf_rc_ok();
    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW)
    {
        const unsigned char *info = sqlite3_column_text(stmt, 0);
        return (const char *)info;
    }
    else
    {
        printf("SQL error: %s\n", sqlite3_errmsg(db));
        exit(0);
    }
}

int exista_destinatar(char *username)
{
    sqlite3_stmt *stmt;
    const char *sql_select = "SELECT * FROM users WHERE username = ?;";
    rc = sqlite3_prepare_v2(db, sql_select, -1, &stmt, 0);        vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 1, username, -1, SQLITE_STATIC); vf_rc_ok();
    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW)
    {
        return 1;
    }
    else if (rc == SQLITE_DONE)
    {
        return 0;
    }
    else
    {
        printf("SQL error: %s\n", sqlite3_errmsg(db));
        exit(0);
    }
}

void trimite_mesaj(char *expeditor, char *destinatar, char *text, int reply)
{
    int fd_dest = destinatar_online(destinatar);
    if (fd_dest)
    {
        salvare_mesaj(expeditor, destinatar, text, 1, reply); 
        char msg[LMAX*2] = {};
        sprintf(msg, "Ai primit un mesaj nou:\n%s %s : %s\n\n", ora_trimitere_mesaj(), expeditor, text);
        apelul_write(fd_dest, msg);
    }
    else
    {
        salvare_mesaj(expeditor, destinatar, text, 0, reply);
    }
}

void salvare_mesaj(char *expeditor, char *destinatar, char *text, int seen, int reply)
{
    sqlite3_stmt *stmt;
    const char *sql_insert =
            "INSERT INTO conversatii" \
            "(expeditor, destinatar, text," \
            " data, ora, seen, reply)" \
            "VALUES (?, ?, ?," \
            "STRFTIME('%d-%m-%Y', 'now', 'localtime')," \
            "STRFTIME('%H:%M:%S', 'now', 'localtime')," \
            "?, ?);";
    rc = sqlite3_prepare_v2(db, sql_insert, -1, &stmt, 0);     vf_rc_ok();
    sqlite3_bind_text(stmt, 1, expeditor, -1, SQLITE_STATIC);  vf_rc_ok();
    sqlite3_bind_text(stmt, 2, destinatar, -1, SQLITE_STATIC); vf_rc_ok();
    sqlite3_bind_text(stmt, 3, text, -1, SQLITE_STATIC);       vf_rc_ok();
    sqlite3_bind_int(stmt, 4, seen);                           vf_rc_ok();
    sqlite3_bind_int(stmt, 5, reply);                          vf_rc_ok();
    rc = sqlite3_step(stmt);                                   vf_rc_done();
    sqlite3_finalize(stmt);
}

const char *ora_trimitere_mesaj()
{
    sqlite3_stmt *stmt;
    const char *sql_select = "SELECT ora FROM conversatii " \
                             "ORDER BY ROWID DESC LIMIT 1;";
    rc = sqlite3_prepare_v2(db, sql_select, -1, &stmt, 0); vf_rc_ok();
    rc = sqlite3_step(stmt);
    
    if (rc == SQLITE_ROW)
    {
        const unsigned char *ora = sqlite3_column_text(stmt, 0);
        return (const char *)ora;
    }
    else
    {
        printf("SQL error: %s\n", sqlite3_errmsg(db));
        exit(0);
    }
}

int destinatar_online(char *destinatar)
{
    sqlite3_stmt *stmt;
    int fd_exp;
    const char *sql_select = "SELECT fd FROM users WHERE username = ?;";
    rc = sqlite3_prepare_v2(db, sql_select, -1, &stmt, 0);          vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 1, destinatar, -1, SQLITE_STATIC); vf_rc_ok();
    rc = sqlite3_step(stmt);

    if (rc == SQLITE_ROW)
    {
        fd_exp = sqlite3_column_int(stmt, 0);
    }
    else if (rc == SQLITE_DONE)
    {
        fd_exp = 0;
    }
    else
    {
        printf("SQL error: %s\n", sqlite3_errmsg(db));
        exit(0);
    }
    
    sqlite3_finalize(stmt);
    return fd_exp;
}

void comanda_history(int fd, char *comanda)
{
    char msg[LMAX] = {};
    char *username = stare_logat(fd, msg);
    if (!username)
    {
        apelul_write(fd, "Conecteaza-te la un cont pentru a putea vizualiza istoricul!\n\n");
    }
    else
    {
        char interlocutor[LMAX] = {};
        strcpy(interlocutor, comanda + 10);
        interlocutor[strlen(interlocutor)-1] = '\0';
        afisare_history(username, interlocutor, fd);
    }
}

void afisare_history(char* username, char* interlocutor, int fd)
{
    const char *sql_select =
        "SELECT data, ora, expeditor, text, seen, reply " \
        "FROM conversatii " \
        "WHERE (destinatar = ? AND expeditor = ?) OR (destinatar = ? AND expeditor = ?) " \
        "ORDER BY data, ora;";
    sqlite3_stmt *stmt;
    rc = sqlite3_prepare_v2(db, sql_select, -1, &stmt, 0);            vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 1, username, -1, SQLITE_STATIC);     vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 2, interlocutor, -1, SQLITE_STATIC); vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 3, interlocutor, -1, SQLITE_STATIC); vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 4, username, -1, SQLITE_STATIC);     vf_rc_ok();
    
    if (sqlite3_step(stmt) == SQLITE_ROW)
    {
        int nr_row = 0;
        do
        {
            nr_row++;
            char spatii[10] = "  ";
            int copie = nr_row;
            while (copie)
            {
                strcat(spatii, " ");
                copie /= 10;
            }

            const unsigned char *data = sqlite3_column_text(stmt, 0);
            const unsigned char *ora = sqlite3_column_text(stmt, 1);

            const unsigned char *exp = sqlite3_column_text(stmt, 2);
            char e[UMAX] = {};
            if (strcmp((char *)exp, interlocutor))
            {
                strcpy(e, "eu");
            }
            else
            {
                strcpy(e, (char *)exp);
            }

            const unsigned char *text = sqlite3_column_text(stmt, 3);

            int seen = sqlite3_column_int(stmt, 4);
            char stare_seen[30] = {};
            if (strcmp(e, "eu") == 0)
            {
                if (seen)
                {
                    sprintf(stare_seen, "%s%s\n", spatii, "citit");
                }
                else
                {
                    sprintf(stare_seen, "%s%s\n", spatii, "necitit");
                }
            }
            
            int reply = sqlite3_column_int(stmt, 5);
            char stare_reply[30] = {};
            if (reply)
            {
                sprintf(stare_reply, "%sreply la %d\n", spatii, reply);
            }
            
            char aux[LMAX] = {};
            sprintf(aux, "%d. %s : %s\n%strimis : %s, %s\n%s%s", nr_row, e, text, spatii, data, ora, stare_reply, stare_seen);
            apelul_write(fd, aux);
        } while (sqlite3_step(stmt) == SQLITE_ROW);
        apelul_write(fd, "\n");
    }
    else
    {
        char aux[LMAX] = {};
        sprintf(aux, "Nu ati inceput o conversatie cu %s!\n\n", interlocutor);
        apelul_write(fd, aux);
    }

    sqlite3_finalize(stmt);
}

void comanda_reply(int fd, char *comanda)
{
    char msg[LMAX] = {};
    char *username = stare_logat(fd, msg);
    if (!username)
    {
        strcpy(msg, "Conecteaza-te la un cont pentru a putea da reply la mesaje!\n\n");
    }
    else
    {
        char copie[LMAX] = {};
        strcpy(copie, comanda);

        char *p = strtok(copie, " ");
        p = strtok(NULL, " ");
        char *destinatar = p;
        
        if (exista_destinatar(destinatar))
        {
            p = strtok(NULL, " ");
            int nr_msg = atoi(p);
            int vf = vf_existenta_msg(username, destinatar, nr_msg);

            if (vf == 1)
            {
                char *p2 = strtok(comanda, ":\n");
                p2 = strtok(NULL, ":\n");
                char *text = p2+1;
                trimite_mesaj(username, destinatar, text, nr_msg);
                strcpy(msg, "Mesaj trimis cu succes!\n\n");
            }
            else if (vf == 2)
            {
                strcpy(msg, "Nu poti raspunde la propriul mesaj!\n\n");
            }
            else
            {
                strcpy(msg, "Mesajul specificat nu exista!\n\n");
            }
        }
        else
        {
            strcpy(msg, "Utilizatorul specificat nu exista!\n\n");
        }
    }
    apelul_write(fd, msg);
}

int vf_existenta_msg(char *destinatar, char *expeditor, int nr_msg)
{
    const char *sql_select = "SELECT expeditor, destinatar FROM conversatii " \
                             "WHERE (destinatar = ? AND expeditor = ?) OR (destinatar = ? AND expeditor = ?) " \
                             "ORDER BY data, ora " \
                             "LIMIT 1 OFFSET ?;";
    sqlite3_stmt *stmt;
    rc = sqlite3_prepare_v2(db, sql_select, -1, &stmt, 0);          vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 1, expeditor, -1, SQLITE_STATIC);  vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 2, destinatar, -1, SQLITE_STATIC); vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 3, destinatar, -1, SQLITE_STATIC); vf_rc_ok();
    rc = sqlite3_bind_text(stmt, 4, expeditor, -1, SQLITE_STATIC);  vf_rc_ok();
    rc = sqlite3_bind_int(stmt, 5, nr_msg-1);                       vf_rc_ok();
    rc = sqlite3_step(stmt);
    
    if (rc == SQLITE_ROW)
    {
        const unsigned char *e = sqlite3_column_text(stmt, 0);
        const unsigned char *d = sqlite3_column_text(stmt, 1);
        if (strcmp((char *)d, destinatar) == 0 && strcmp((char *)e, expeditor) == 0)
        {
            sqlite3_finalize(stmt);
            return 1;
        }
        else
        {
            sqlite3_finalize(stmt);
            return 2;
        }
    }
    else if (rc == SQLITE_DONE)
    {
        sqlite3_finalize(stmt);
        return 0;
    }
    else
    {
        printf("SQL error: %s\n", sqlite3_errmsg(db));
        exit(0);
    }
}

void comanda_delete(int fd, char *comanda)
{
    char msg[LMAX] = {};
    char *username = stare_logat(fd, msg);
    if (!username)
    {
        strcpy(msg, "Conecteaza-te la un cont pentru a putea sterge un mesaj!\n\n");
    }
    else
    {        
        char copie[LMAX] = {};
        strcpy(copie, comanda);

        char *p = strtok(copie, " :\n");
        p = strtok(NULL, " :\n");
        char *destinatar = p;
        
        if (exista_destinatar(destinatar))
        {
            p = strtok(NULL, " :\n");
            int nr_msg = atoi(p);
            int vf = vf_existenta_msg(destinatar, username, nr_msg);

            if (vf == 1)
            {
                sterge_mesaj(username, destinatar, nr_msg);
                strcpy(msg, "Mesaj sters cu succes!\n\n");
            }
            else if (vf == 2)
            {
                strcpy(msg, "Mesajul specificat nu a fost scris de tine!\n\n");
            }
            else
            {
                strcpy(msg, "Mesajul specificat nu exista!\n\n");
            }
        }
        else
        {
            strcpy(msg, "Utilizatorul specificat nu exista!\n\n");
        }
    }
    apelul_write(fd, msg);
}

void sterge_mesaj(char* expeditor, char* destinatar, int nr_msg)
{
    sqlite3_stmt *stmt;
    const char *sql = "UPDATE conversatii " \
                      "SET text = 'Acest mesaj a fost sters' " \
                      "WHERE expeditor = ? AND destinatar = ? AND id = (" \
                      "    SELECT id FROM conversatii " \
                      "    WHERE (destinatar = ? AND expeditor = ?) OR (destinatar = ? AND expeditor = ?) " \
                      "    ORDER BY data, ora " \
                      "    LIMIT 1 OFFSET ?);";
    rc = sqlite3_prepare_v2(db, sql, -1, &stmt, NULL);         vf_rc_ok();
    sqlite3_bind_text(stmt, 1, expeditor, -1, SQLITE_STATIC);  vf_rc_ok();
    sqlite3_bind_text(stmt, 2, destinatar, -1, SQLITE_STATIC); vf_rc_ok();
    sqlite3_bind_text(stmt, 3, destinatar, -1, SQLITE_STATIC); vf_rc_ok();
    sqlite3_bind_text(stmt, 4, expeditor, -1, SQLITE_STATIC);  vf_rc_ok();
    sqlite3_bind_text(stmt, 5, expeditor, -1, SQLITE_STATIC);  vf_rc_ok();
    sqlite3_bind_text(stmt, 6, destinatar, -1, SQLITE_STATIC); vf_rc_ok();
    sqlite3_bind_int(stmt, 7, nr_msg-1);                       vf_rc_ok();
    rc = sqlite3_step(stmt);                                   vf_rc_done();
    sqlite3_finalize(stmt);
}

void comanda_inexistenta(int fd)
{
    char msg[LMAX] = {};
    strcpy(msg, "Comanda inexistenta!\n\n");
    apelul_write(fd, msg);
}

void apelul_read(int fd, char* msg)
{
    char buffer[LMAX];
    long int bytes = read(fd, msg, sizeof(buffer));
    if (bytes < 0)
    {
        perror("Eroare la read()");
        exit(errno);
    }
}

void apelul_write(int fd, char *msg)
{
    if (write(fd, msg, LMAX) < 0)
    {
        perror("Eroare la write()");
        exit(errno);
    }
}