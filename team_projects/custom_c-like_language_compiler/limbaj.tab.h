/* A Bison parser, made by GNU Bison 3.8.2.  */

/* Bison interface for Yacc-like parsers in C

   Copyright (C) 1984, 1989-1990, 2000-2015, 2018-2021 Free Software Foundation,
   Inc.

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <https://www.gnu.org/licenses/>.  */

/* As a special exception, you may create a larger work that contains
   part or all of the Bison parser skeleton and distribute that work
   under terms of your choice, so long as that work isn't itself a
   parser generator using the skeleton or a modified version thereof
   as a parser skeleton.  Alternatively, if you modify or redistribute
   the parser skeleton itself, you may (at your option) remove this
   special exception, which will cause the skeleton and the resulting
   Bison output files to be licensed under the GNU General Public
   License without this special exception.

   This special exception was added by the Free Software Foundation in
   version 2.2 of Bison.  */

/* DO NOT RELY ON FEATURES THAT ARE NOT DOCUMENTED in the manual,
   especially those whose name start with YY_ or yy_.  They are
   private implementation details that can be changed or removed.  */

#ifndef YY_YY_LIMBAJ_TAB_H_INCLUDED
# define YY_YY_LIMBAJ_TAB_H_INCLUDED
/* Debug traces.  */
#ifndef YYDEBUG
# define YYDEBUG 0
#endif
#if YYDEBUG
extern int yydebug;
#endif

/* Token kinds.  */
#ifndef YYTOKENTYPE
# define YYTOKENTYPE
  enum yytokentype
  {
    YYEMPTY = -2,
    YYEOF = 0,                     /* "end of file"  */
    YYerror = 256,                 /* error  */
    YYUNDEF = 257,                 /* "invalid token"  */
    BGIN_CLASSES = 258,            /* BGIN_CLASSES  */
    END_CLASSES = 259,             /* END_CLASSES  */
    BGIN_VAR = 260,                /* BGIN_VAR  */
    END_VAR = 261,                 /* END_VAR  */
    BGIN_FUNCT = 262,              /* BGIN_FUNCT  */
    END_FUNCT = 263,               /* END_FUNCT  */
    BGIN_MAIN = 264,               /* BGIN_MAIN  */
    END_MAIN = 265,                /* END_MAIN  */
    IF = 266,                      /* IF  */
    ELSE = 267,                    /* ELSE  */
    WHILE = 268,                   /* WHILE  */
    DO = 269,                      /* DO  */
    FOR = 270,                     /* FOR  */
    EQUAL_ASSIGN = 271,            /* EQUAL_ASSIGN  */
    PLUS_ASSIGN = 272,             /* PLUS_ASSIGN  */
    MINUS_ASSIGN = 273,            /* MINUS_ASSIGN  */
    PROD_ASSIGN = 274,             /* PROD_ASSIGN  */
    DIV_ASSIGN = 275,              /* DIV_ASSIGN  */
    MOD_ASSIGN = 276,              /* MOD_ASSIGN  */
    CLASA = 277,                   /* CLASA  */
    PRIVATE = 278,                 /* PRIVATE  */
    PUBLIC = 279,                  /* PUBLIC  */
    PROTECTED = 280,               /* PROTECTED  */
    PRINT = 281,                   /* PRINT  */
    TYPEOF = 282,                  /* TYPEOF  */
    TYPE = 283,                    /* TYPE  */
    ID = 284,                      /* ID  */
    STRING = 285,                  /* STRING  */
    CHAR = 286,                    /* CHAR  */
    NR_INT = 287,                  /* NR_INT  */
    NR_FLOAT = 288,                /* NR_FLOAT  */
    EQ_TRUE = 289,                 /* EQ_TRUE  */
    TRUE_EQ = 290,                 /* TRUE_EQ  */
    NEQ_TRUE = 291,                /* NEQ_TRUE  */
    TRUE_NEQ = 292,                /* TRUE_NEQ  */
    EQ_FALSE = 293,                /* EQ_FALSE  */
    FALSE_EQ = 294,                /* FALSE_EQ  */
    NEQ_FALSE = 295,               /* NEQ_FALSE  */
    FALSE_NEQ = 296,               /* FALSE_NEQ  */
    NOT = 297,                     /* NOT  */
    TRUE = 298,                    /* TRUE  */
    FALSE = 299,                   /* FALSE  */
    RETURN = 300,                  /* RETURN  */
    AND = 301,                     /* AND  */
    OR = 302,                      /* OR  */
    EQ = 303,                      /* EQ  */
    NEQ = 304,                     /* NEQ  */
    GT = 305,                      /* GT  */
    LT = 306,                      /* LT  */
    GEQ = 307,                     /* GEQ  */
    LEQ = 308,                     /* LEQ  */
    INCR = 309,                    /* INCR  */
    DECR = 310                     /* DECR  */
  };
  typedef enum yytokentype yytoken_kind_t;
#endif

/* Value type.  */
#if ! defined YYSTYPE && ! defined YYSTYPE_IS_DECLARED
union YYSTYPE
{
#line 18 "limbaj.y"

     const char *string;
     int varInt;
     float varFloat;
     char *varString;
     class ParamList *paramList;
     class ParamInfo *paramInfo;
     class IdInfo *varInfo;
     class ASTNode *nod;

#line 130 "limbaj.tab.h"

};
typedef union YYSTYPE YYSTYPE;
# define YYSTYPE_IS_TRIVIAL 1
# define YYSTYPE_IS_DECLARED 1
#endif


extern YYSTYPE yylval;


int yyparse (void);


#endif /* !YY_YY_LIMBAJ_TAB_H_INCLUDED  */
