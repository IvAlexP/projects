%{
#include <stdio.h>
#include "limbaj.tab.h"
%}
%option noyywrap
%%

"begin_classes" {return BGIN_CLASSES;}
"end_classes" {return END_CLASSES;}

"begin_variables" {return BGIN_VAR;}
"end_variables" {return END_VAR;}

"begin_functions" {return BGIN_FUNCT;}
"end_functions" {return END_FUNCT;}

"begin_main" {return BGIN_MAIN;}
"end_main" {return END_MAIN;}

"int"|"float"|"char"|"string"|"bool" {yylval.string = strdup(yytext); return TYPE;}

"!" {return NOT;}

"=="[ ]*"true" {return EQ_TRUE;}
"true"[ ]*"==" {return TRUE_EQ;}
"!="[ ]*"true" {return NEQ_TRUE;}
"true"[ ]*"!=" {return TRUE_NEQ;}

"=="[ ]*"false" {return EQ_FALSE;}
"false"[ ]*"==" {return FALSE_EQ;}
"!="[ ]*"false" {return NEQ_FALSE;}
"false"[ ]*"!=" {return FALSE_NEQ;}

"true" {return TRUE;}
"false" {return FALSE;}

"return" {return RETURN;}

"&&" {return AND;}
"||" {return OR;}
"==" {return EQ;}
"!=" {return NEQ;}

">=" {return GEQ;}
"<=" {return LEQ;}
">" {return GT;}
"<" {return LT;}

"++" {return INCR;}
"--" {return DECR;}

["][^"]*["] {yylval.string = strdup(yytext); return STRING;}
['][^']['] {yylval.string = strdup(yytext); return CHAR;}

"if" {return IF;}
"else" {return ELSE;}
"while" {return WHILE;}
"do" {return DO;}
"for" {return FOR;}

"Print" {return PRINT;}
"TypeOf" {return TYPEOF;}

"clasa" {return CLASA;}
"public:" {return PUBLIC;}
"private:" {return PRIVATE;}
"protected:" {return PROTECTED;}

[a-zA-Z][a-zA-Z0-9]* {yylval.string = strdup(yytext); return ID;}
[0-9]+ {yylval.varInt = atoi(yytext); return NR_INT;}
[0-9]+"."[0-9]+ {yylval.varFloat = strtof(yytext, NULL); return NR_FLOAT;}

"=" {yylval.string = strdup(yytext); return EQUAL_ASSIGN;}
"+=" {yylval.string = strdup(yytext); return PLUS_ASSIGN;}
"-=" {yylval.string = strdup(yytext); return MINUS_ASSIGN;}
"*=" {yylval.string = strdup(yytext); return PROD_ASSIGN;}
"/=" {yylval.string = strdup(yytext); return DIV_ASSIGN;}
"%=" {yylval.string = strdup(yytext); return MOD_ASSIGN;}

[ \t] ;
\n {++yylineno;}
. {return yytext[0];}
%%
