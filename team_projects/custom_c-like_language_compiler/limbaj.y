%{
#include <iostream>
#include <cstring>
#include "SymTable.h"
using namespace std;

extern FILE* yyin;
extern char* yytext;
extern int yylineno;
extern int yylex();
void yyerror(const char * s);
class SymTable* curr;
map<string, SymTable*> classes;
int errorCount = 0;
%}

%union
{
     const char *string;
     int varInt;
     float varFloat;
     char *varString;
     class ParamList *paramList;
     class ParamInfo *paramInfo;
     class IdInfo *varInfo;
     class ASTNode *nod;
}

%token BGIN_CLASSES END_CLASSES
%token BGIN_VAR END_VAR
%token BGIN_FUNCT END_FUNCT
%token BGIN_MAIN END_MAIN

%token IF ELSE WHILE DO FOR
%token EQUAL_ASSIGN
%token<string> PLUS_ASSIGN MINUS_ASSIGN PROD_ASSIGN DIV_ASSIGN MOD_ASSIGN
%token CLASA PRIVATE PUBLIC PROTECTED
%token PRINT TYPEOF

%token<string> TYPE ID
%token<string> STRING CHAR
%token<varInt> NR_INT
%token<varFloat> NR_FLOAT

%token<string> EQ_TRUE TRUE_EQ NEQ_TRUE TRUE_NEQ EQ_FALSE FALSE_EQ NEQ_FALSE FALSE_NEQ NOT TRUE FALSE
%token RETURN
%token<string> AND OR
%token<string> EQ NEQ GT LT GEQ LEQ
%token INCR DECR

%type<string> returnVar
%type<paramList> argumente_decl argumente_apel
%type<paramInfo> param
%type<varInfo> var
%type<nod> expr_num expr_bool functie_apel var_true_false funct_true_false comp_bool
%type<string> calcul_asign
%start program

%left EQUAL_ASSIGN PLUS_ASSIGN MINUS_ASSIGN PROD_ASSIGN DIV_ASSIGN MOD_ASSIGN
%left '+' '-'
%left '*' '/' '%'
%left OR
%left AND
%left EQ NEQ
%left GEQ LEQ LT GT
%right NOT

%nonassoc INCR DECR

%%

program : {
               std::remove("output.txt");
          }
          scope_classes
          scope_var
          scope_funct
          scope_main
          {
               curr->print();
               if (errorCount == 0)
               {
                    cout << "The program is correct!" << '\n';
               }
                    
          }
        ;

/* SCOPE CLASSES */

scope_classes : BGIN_CLASSES classes END_CLASSES
               | BGIN_CLASSES END_CLASSES
               ;

classes : clasa
        | clasa classes
        ;

clasa: CLASA ID
       '{'
       {
          SymTable* aux = new SymTable(curr, $2);
          curr = aux;
       }
       clasa_def
       '}'
       {
          if (classes.find($2) == classes.end())
          {
               classes[$2] = curr;
          }
          
          curr->print();
          curr = curr->parinte;

          if(!curr->existsInBlock($2))
          {
               curr->addClass($2);
          }
          else
          {      
               yyerror("Class already defined");
          }
       }
     ;

clasa_def: clasa_decl
	 | clasa_decl clasa_def
	 ;

clasa_decl: var_decl
          | functie_decl
          | PUBLIC
          | PRIVATE
          | PROTECTED 
          ;

/* SCOPE VARIABLES */

scope_var : BGIN_VAR variables END_VAR
          | BGIN_VAR END_VAR
          ;

variables : var_decl
          | var_decl variables
          ;

var_decl : TYPE ID ';'
          {
               if (!curr->existsInBlock($2))
               {
                    curr->addVar($1, $2);
               }
               else
               {
                    yyerror("Variable already defined");
               }
          }
          | TYPE ID EQUAL_ASSIGN expr_num ';'
          {
               if (!curr->existsInBlock($2)) 
               {
                    curr->addVar($1, $2);
                    IdInfo* var = curr->existsVarInBlock($2, "var");
                    Value v = $4->eval();
                    if (var->asign(v) == 0)
                    {
                         yyerror("Type mismatch in assignment");
                    }
                    else
                    {
                         var->val = v;
                    }
               } 
               else 
               {
                    yyerror("Variable already defined");
               }
          }
          | TYPE ID EQUAL_ASSIGN expr_bool ';'
          {
               if (!curr->existsInBlock($2)) 
               {
                    curr->addVar($1, $2);
                    IdInfo* var = curr->existsVarInBlock($2, "var");
                    Value v = $4->eval();
                    if (var->asign(v) == 0)
                    {
                         yyerror("Type mismatch in assignment");
                    }
                    else
                    {
                         var->val = v;
                    }
               } 
               else 
               {
                    yyerror("Variable already defined");
               }
          }
          | TYPE ID EQUAL_ASSIGN TRUE ';'
          {
               if (!curr->existsInBlock($2)) 
               {
                    curr->addVar($1, $2);
                    IdInfo* var = curr->existsVarInBlock($2, "var");
                    if (strcmp($1, "bool") == 0)
                    {
                         var->val = Value(true, "bool");
                    }
                    else
                    {
                         yyerror("Type mismatch in assignment of true");
                    }
               } 
               else 
               {
                    yyerror("Variable already defined");
               }
          }
          | TYPE ID EQUAL_ASSIGN FALSE ';'
          {
               if (!curr->existsInBlock($2)) 
               {
                    curr->addVar($1, $2);
                    IdInfo* var = curr->existsVarInBlock($2, "var");
                    if (strcmp($1, "bool") == 0)
                    {
                         var->val = Value(false, "bool");
                    }
                    else
                    {
                         yyerror("Type mismatch in assignment of false");
                    }
               } 
               else 
               {
                    yyerror("Variable already defined");
               }
          }
          | TYPE ID EQUAL_ASSIGN STRING ';'
          {
               if (!curr->existsInBlock($2)) 
               {
                    curr->addVar($1, $2);
                    IdInfo* var = curr->existsVarInBlock($2, "var");
                    if (strcmp($1, "string") == 0)
                    {
                         var->asignString($4);
                    }
                    else
                    {
                         yyerror("Type mismatch in assignment of string");
                    }
               }
          }
          | TYPE ID EQUAL_ASSIGN CHAR ';'
          {
               if (!curr->existsInBlock($2)) 
               {
                    curr->addVar($1, $2);
                    IdInfo* var = curr->existsVarInBlock($2, "var");
                    if (strcmp($1, "char") == 0)
                    {
                         var->val = Value($4[1], "char");
                    }
                    else
                    {
                         yyerror("Type mismatch in assignment of char");
                    }
               } 
               else
               {
                    yyerror("Variable already defined");
               }
          }
          | TYPE ID '[' NR_INT ']' ';'
          {
               if (!curr->existsInBlock($2))
               {
                    curr->addVec($1, $2, $4);
               }
               else
               {
                    yyerror("Variable already defined");
               }
          }
          | ID ID ';'
          {
               if (!curr->existsClasa(classes, $1))
               {
                    yyerror("Class type not declared");
               }
               else
               {
                    if (!curr->existsInBlock($2))
                    {
                         curr->addVarClasa(classes, $1, $2);
                    }
                    else
                    {
                         yyerror("Variable already defined");
                    }
               }
          }
          ;

/* SCOPE FUNCTIONS */

scope_funct : BGIN_FUNCT functions END_FUNCT
               | BGIN_FUNCT END_FUNCT
               ;

functions : functie_decl
          | functie_decl functions
          ;

functie_decl : TYPE ID '(' 
               {
                    SymTable* aux = new SymTable(curr, $2);
                    curr = aux;
               }
               argumente_decl ')'
               {
                    SymTable *copy = curr->parinte; 
                    if (!copy->existsInBlock($2))
                    {
                         copy->addFunct($1, $2, $5);
                    }
                    else
                    {
                         yyerror("Function already defined");
                    }
               }
               '{'
                   instructiuni
               '}'
               {
                    curr->print();
                    curr = curr->parinte;
               }

               | TYPE ID '(' 
               {
                    SymTable* aux = new SymTable(curr, $2);
                    curr = aux;

                    SymTable *copy = curr->parinte; 
                    if (!copy->existsInBlock($2))
                    {
                         copy->addFunct($1, $2, nullptr);
                    }
                    else
                    {
                         yyerror("Function already defined");
                    }
               }
               ')'
               '{'
                   instructiuni
               '}'
               {
                    curr->print();
                    curr = curr->parinte;
               }
	 ;

argumente_decl: param
               {
                    $$ = new ParamList();
                    $$->param.push_back(*$1);
               }
               | param ',' argumente_decl
               {
                    $$ = $3;
                    $$->param.insert($$->param.begin(), *$1);
               }
               ;

param : TYPE ID
      {
          $$ = new ParamInfo($1, $2);
          if (!curr->existsInBlock($2))
          {
               curr->addVar($1,$2);
          }
          else
          {
               yyerror("Variable already defined");
          }
      }
      | TYPE ID '[' NR_INT ']'
      {
          $$ = new ParamInfo($1, $2);
          if (!curr->existsInBlock($2))
          {
               curr->addVec($1, $2, $4);
          }
          else
          {
               yyerror("Vector already defined");
          }
      }
      | ID ID
      {
          $$ = new ParamInfo($1, $2);
          if (!curr->existsInBlock($2))
          {
               curr->addVar($1, $2);
          }
          else
          {
               yyerror("Variable already defined");
          }
      }
      ;

returnVar : expr_num
          {
               $$ = $1->type.c_str();
          }
          | expr_bool
          {
               $$ = $1->type.c_str();
          }
          | STRING
          {
               $$ = "string";
          }
          | CHAR
          {
               $$ = "char";
          }
          | TRUE
          {
               $$ = "bool";
          }
          | FALSE
          {
               $$ = "bool";
          }
           ;

/* SCOPE MAIN */

scope_main : BGIN_MAIN
            {
               SymTable* aux = new SymTable(curr, "main");
               curr = aux;
            }
            instructiuni
            END_MAIN
            {
               curr->print();
               curr = curr->parinte;
            }
            ;

instructiuni: instructiune
	    | instructiune instructiuni
	    ;

instructiune: var_decl
          | RETURN returnVar ';'
          | asignare ';'
          | incrementare ';'
          | decrementare ';'
          | print ';'
          | typeOf ';'
          | functie_apel ';'
          | IF '(' expr_bool ')' block_stmt
          | IF '(' expr_bool ')' block_stmt ELSE block_stmt
          | WHILE '(' expr_bool ')' block_stmt
          | DO block_stmt WHILE '(' expr_bool ')' ';'
          | FOR '(' for_cond ';' expr_bool ';' for_cond ')' block_stmt
          ;

incrementare : var INCR
               {
                    if (!$1->incr())
                    {
                         yyerror("Can only increment int or float");
                    }
               }
               ;

decrementare: var DECR
               {
                    if (!$1->decr())
                    {
                         yyerror("Can only decrement int or float");
                    }
               }
               ;

print : PRINT '(' CHAR ')'
      {
          cout << $3 << '\n';
      }
      | PRINT '(' STRING ')'
      {
          cout << $3 << '\n';
      }
      | PRINT '(' TRUE ')'
      {
          cout << true << '\n';
      }
      | PRINT '(' FALSE ')'
      {
          cout << false << '\n';
      }
      | PRINT '(' expr_bool ')'
      {
          $3->eval().print();
      }
      | PRINT '(' expr_num ')'
      {
          $3->eval().print();
      }
      ;

typeOf : TYPEOF '(' CHAR ')'
       {
          cout << "char" << '\n';
       }
       | TYPEOF '(' STRING ')'
       {
          cout << "string" << '\n';
       }
       | TYPEOF '(' TRUE ')'
       {
          cout << "bool" << '\n';
       }
       | TYPEOF '(' FALSE ')'
       {
          cout << "bool" << '\n';
       }
       | TYPEOF '(' expr_bool ')'
       {
          Value v = $3->eval();
          cout << "bool" << '\n';
       }
       | TYPEOF '(' expr_num ')'
       {
          cout << $3->eval().type << '\n';
       }
       ;

var: ID
     {
          IdInfo* var = curr->existsAnywhere($1, "var");
          if (!var) 
          {
               yyerror("Variable not declared");
          }
          else
          {
               $$ = var;
          }
     }
     | ID '[' NR_INT ']'
     {
          IdInfo* var = curr->existsAnywhere($1, "vec");
          if (!var) 
          {
               
               yyerror("Vector not declared");
          }
          else
          {
               $$ = var;
          }
     }
     | ID '.' ID
     {
          if (!curr->existsAnywhere($1, "var"))
          {
               yyerror("Variable not declared");
          }
          else
          {
               IdInfo* var = curr->existsInClasa($1, $3, "var");
               if (!var)
               {
                    yyerror("Variable is not a field of the class");
               }
               else
               {
                    $$ = var;
               }
          }
     }
     | ID '.' ID '[' NR_INT ']'
     {
          IdInfo* var = curr->existsInClasa($1, $3, "var");
          if (!var)
          {
               yyerror("Vector is not a field of the class");
          }
          else
          {
               $$ = var;
          }
     }
     ;

asignare: var EQUAL_ASSIGN TRUE
          {
               if ($1->type == "bool")
               {
                    $1->val = Value(true, "bool");
               }
               else
               {
                    yyerror("Type mismatch in assignment of true");
               }
          }
          | var EQUAL_ASSIGN FALSE
          {
               if ($1->type == "bool")
               {
                    $1->val = Value(false, "bool");
               }
               else
               {
                    yyerror("Type mismatch in assignment of false");
               }
          }
          | var EQUAL_ASSIGN CHAR
          {
               if ($1->type == "char")
               {
                    $1->val = Value($3[1], "char");
               }
               else
               {
                    yyerror("Type mismatch in assignment of char");
               }
          }
          | var EQUAL_ASSIGN STRING
          {
               if ($1->type == "string")
               {
                    $1->asignString($3);
               }
               else
               {
                    yyerror("Type mismatch in assignment of string");
               }
          }
          | var EQUAL_ASSIGN expr_bool
          {
               Value v = $3->eval();
               if (!$1->asign(v))
               {
                    yyerror("Variable is not of type bool");
               }
               else
               {
                    $1->val.valBool = v.valBool;
               }
          }
          | var EQUAL_ASSIGN expr_num
          {
               Value v = $3->eval();
               if ($1->asign(v) == 0)
               {
                    yyerror("Type mismatch in assignment");
               }
               else
               {
                    $1->val = v;
               }
          }
          | var calcul_asign expr_num
          {
               $1->calculAsign($2, $3->eval());
          }
          ;

calcul_asign :  PLUS_ASSIGN
               {
                    $$ = $1;
               }
               | MINUS_ASSIGN
               {
                    $$ = $1;
               }
               | PROD_ASSIGN
               {
                    $$ = $1;
               }
               | DIV_ASSIGN
               {
                    $$ = $1;
               }
               | MOD_ASSIGN
               {
                    $$ = $1;
               }
               ;

expr_num : expr_num '+' expr_num
          {
               $$ = new ASTNode("+", "operator", $1, $3);
          }
          | expr_num '-' expr_num
          {
               $$ = new ASTNode("-", "operator", $1, $3);
          }
          | expr_num '*' expr_num
          {
               $$ = new ASTNode("*", "operator", $1, $3);
          }
          | expr_num '/' expr_num
          {
               $$ = new ASTNode("/", "operator", $1, $3);
          }
          | expr_num '%' expr_num
          {
               $$ = new ASTNode("%", "operator", $1, $3);
          }
          | '(' expr_num ')'
          {
               $$ = $2;
          }
          | NR_INT
          {
               $$ = new ASTNode("int", Value($1, "int"));
          }
          | NR_FLOAT
          {
               $$ = new ASTNode("float", Value($1, "float"));
          }
          | var
          {
               $$ = new ASTNode($1->name.c_str(), $1->type, nullptr);
               if($1->idType == "var")
               {
                    $$->val = $1->val;
               }
               else
               {
                    $$->val = Value($1->type);
               }
          }
          | functie_apel
          {
               $$ = $1;
          }
          ;

expr_bool: NOT '(' expr_bool ')'
          {  
               $$ = new ASTNode("!", "operator", $3, nullptr);
               $$->left = $3;
          }
          | comp_bool
          {
               $$ = $1;
          }
          | '(' expr_bool ')'
          {
               $$ = $2;
          }
          | var_true_false
          {
               $$ = $1;
          }
          | funct_true_false
          {
               $$ = $1;
          }
          ;

comp_bool : expr_bool AND expr_bool
          {  
               $$ = new ASTNode("&&", "operator", $1, $3);
          }
          | expr_bool OR expr_bool
          {  
               $$ = new ASTNode("||", "operator", $1, $3);
          }
          | expr_num LT expr_num
          {  
               $$ = new ASTNode("<", "operator", $1, $3);
          }
          | expr_num LEQ expr_num
          {  
               $$ = new ASTNode("<=", "operator", $1, $3);
          }
          | expr_num GT expr_num
          {  
               $$ = new ASTNode(">", "operator", $1, $3);
          }
          | expr_num GEQ expr_num
          {  
               $$ = new ASTNode(">=", "operator", $1, $3);
          }
          | expr_num EQ expr_num
          {  
               $$ = new ASTNode("==", "operator", $1, $3);
          }
          | expr_num NEQ expr_num
          {  
               $$ = new ASTNode("!=", "operator", $1, $3);
          }
          ;

var_true_false : var EQ_TRUE
               {
                    $$ = new ASTNode("dreapta", "==", "operator", true, $1);
               }
               | var NEQ_TRUE
               {
                    $$ = new ASTNode("dreapta", "!=", "operator", true, $1);
               }
               | var EQ_FALSE
               {
                    $$ = new ASTNode("dreapta", "==", "operator", false, $1);
               }
               | var NEQ_FALSE
               {
                    $$ = new ASTNode("dreapta", "!=", "operator", false, $1);
               }
               | TRUE_EQ var
               {
                    $$ = new ASTNode("stanga", "==", "operator", true, $2);
               }
               | TRUE_NEQ var
               {
                    $$ = new ASTNode("stanga", "!=", "operator", true, $2);
               }
               | FALSE_EQ var
               {
                    $$ = new ASTNode("stanga", "==", "operator", false, $2);
               }
               | FALSE_NEQ var
               {
                    $$ = new ASTNode("stanga", "!=", "operator", false, $2);
               }
               ;

funct_true_false : functie_apel EQ_TRUE
               {
                    $$ = new ASTNode("dreapta", "==", "operator", true, $1);
               }
               |  functie_apel NEQ_TRUE
               {
                    $$ = new ASTNode("dreapta", "!=", "operator", true, $1);
               }
               |  functie_apel EQ_FALSE
               {
                    $$ = new ASTNode("dreapta", "==", "operator", false, $1);
               }
               |  functie_apel NEQ_FALSE
               {
                    $$ = new ASTNode("dreapta", "!=", "operator", false, $1);
               }
               | TRUE_EQ functie_apel
               {
                    $$ = new ASTNode("stanga", "==", "operator", true, $2);
               }
               | TRUE_NEQ functie_apel
               {
                    $$ = new ASTNode("stanga", "!=", "operator", true, $2);
               }
               | FALSE_EQ functie_apel
               {
                    $$ = new ASTNode("stanga", "==", "operator", false, $2);
               }
               | FALSE_NEQ functie_apel
               {
                    $$ = new ASTNode("stanga", "!=", "operator", false, $2);
               }     
               ;

functie_apel : ID '(' ')'
               {
                    IdInfo* var = curr->existsAnywhere($1, "funct");
                    if (!var) 
                    {
                         yyerror("Function does not exist");
                    }
                    else
                    {
                         $$ = new ASTNode(var->name.c_str(), var->type, "funct");
                    }
               }
               | ID '(' argumente_apel ')'
               {
                    IdInfo* var = curr->existsAnywhere($1, "funct");
                    if (!var)
                    {
                         yyerror("Function not declared");
                    }
                    else
                    {
                         if (curr->checkNumParams($3, &var->listParams)) 
                         {
                              yyerror("The number of parameters is incorrect");
                              exit(0);
                         }
                         else
                         {
                              if (curr->checkListParams($3, &var->listParams))
                              {
                                   $$  = new ASTNode(var->name.c_str(), var->type, "funct");
                              }
                              else
                              {
                                   yyerror("Mismatch type at parameters of the functon call");
                                   exit(0);
                              }
                         }
                    }
               }
               | ID '.' ID '(' ')'
               {
                    if (!curr->existsAnywhere($1, "var"))
                    {
                         yyerror("Variable not declared");
                    }
                    else
                    {
                         IdInfo* var = curr->existsInClasa($1, $3, "funct");
                         if (!var)
                         {
                              yyerror("Functions is not a field of the class");
                         }
                         else
                         {
                              $$ = new ASTNode(var->name.c_str(), var->type, "funct");
                         }
                    }
               }
               | ID '.' ID '(' argumente_apel ')'
               {
                    if (!curr->existsAnywhere($1, "var"))
                    {
                         yyerror("Variable not declared");
                    }
                    else
                    {
                         IdInfo* var = curr->existsInClasa($1, $3, "funct");
                         if (!var)
                         {
                              yyerror("Functions is not a field of the class");
                         }
                         else
                         {
                              if (curr->checkNumParams($5, &var->listParams)) 
                              {
                                   yyerror("The number of parameters is incorrect");
                                   exit(0);
                              }
                              else
                              { 
                                   if (curr->checkListParams($5, &var->listParams))
                                   {
                                        $$  = new ASTNode(var->name.c_str(), var->type, "funct");
                                   }
                                   else
                                   {
                                        yyerror("Mismach type at parameters of the functon call");
                                        exit(0);
                                   }
                              }
                         } 
                    }
               }
               ;

argumente_apel :  expr_num
               {
                    Value v = $1->eval();
                    ParamInfo var = ParamInfo(v.type, "e");
                    $$ = new ParamList();
                    $$->param.push_back(var);
               }
               | expr_bool
               {
                    Value v = $1->eval();
                    ParamInfo var = ParamInfo(v.type, "e");
                    $$ = new ParamList();
                    $$->param.push_back(var);
               }
               | STRING
               {
                    ParamInfo var = ParamInfo("string", $1);
                    $$ = new ParamList();
                    $$->param.push_back(var);
               }
               | CHAR
               {
                    ParamInfo var = ParamInfo("char", $1);
                    $$ = new ParamList();
                    $$->param.push_back(var);
               }
               | expr_num ',' argumente_apel
               {
                    $$ = $3;
                    ParamInfo var =  ParamInfo($1->type, "e");
                    $$->param.insert($$->param.begin(), var);
               }
               | expr_bool ',' argumente_apel
               {
                    $$ = $3;
                    ParamInfo var =  ParamInfo($1->type, "e");
                    $$->param.insert($$->param.begin(), var);
               }
               | STRING ',' argumente_apel
               {
                    $$ = $3;
                    ParamInfo var =  ParamInfo("string", $1);
                    $$->param.insert($$->param.begin(), var);
               }
               | CHAR ',' argumente_apel
               {
                    $$ = $3;
                    ParamInfo var =  ParamInfo("char", $1);
                    $$->param.insert($$->param.begin(), var);
               }
               ;

for_cond: for_op
          | for_op ',' for_cond
          ;

for_op : asignare
       | incrementare
       | decrementare
       ;

block_stmt : '{'
         {
               SymTable* aux = new SymTable(curr, "block");
               curr = aux;
         }
         instructiuni
         '}'
         {
               curr->print();
               curr = curr->parinte;
         } 

%%

void yyerror(const char * s)
{
     errorCount++;
     cout << "error:" << s << " at line: " << yylineno << endl;
}

int main(int argc, char** argv)
{
     yyin=fopen(argv[1], "r");
     curr = new SymTable(NULL, "global");
     yyparse();
} 
