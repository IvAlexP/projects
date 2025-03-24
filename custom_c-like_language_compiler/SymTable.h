#include <iostream>
#include <map>
#include <string>
#include <vector>

using namespace std;

class Value
{
    public:
    float valFloat;
    int valInt;
    bool valBool;
    string valString;
    char valChar;
    string type; 

    Value() : valFloat(0), valInt(0), type("") {}
    Value(string type) : valInt(0), valFloat(0), valBool(0), valString(""), valChar('\0'), type(type.c_str()) {}
    Value(float v, string type) : valFloat(v), valInt(0), valBool(false), valString(""), valChar('\0'), type(type.c_str()) {}
    Value(int v, string type) : valFloat(0), valInt(v), valBool(false), valString(""), valChar('\0'), type(type.c_str()) {}
    Value(bool v, string type) : valFloat(0), valInt(0), valBool(v), valString(""), valChar('\0'), type(type.c_str()) {}
    Value(const char* v, string type) : valFloat(0), valInt(0), valBool(false), valString(v), valChar('\0'), type(type.c_str()) {}
    Value(char v, string type) : valFloat(0), valInt(0), valBool(false), valString(""), valChar(v), type(type.c_str()) {}

    void print();
};

class ParamInfo
{
    public:
        string type;
        string name;
        ParamInfo(string type, const char *name) : type(type.c_str()), name(name) {}
};

class ParamList
{
    public:
        vector<ParamInfo> param;
};

class IdInfo
{
    public:
        string idType;
        string type;
        string name;
        int size;
        ParamList listParams;
        Value val;

        IdInfo() {}
        IdInfo(string type, const char *name, const char *idType) : type(type.c_str()), name(name), idType(idType) {} //for variables
        IdInfo(string type, const char *name, Value val) : type(type.c_str()), name(name), val(val) {} //for variables assigned at class definition
        IdInfo(string type, const char *name, const char *idType, int size) : type(type.c_str()), name(name), idType(idType), size(size) {} //for vectors
        IdInfo(string type, const char *name, const char *idType, ParamList &listParams) : type(type.c_str()), name(name), idType(idType), listParams(listParams) {} //for functons
        IdInfo(const char *name, const char *idType) : name(name), idType(idType) {} //for classes

        bool asign(Value v);
        void calculAsign(const char *semn, Value v);
        void calculAsignInt(const char *semn, Value v);
        void calculAsignFloat(const char *semn, Value v);

        void asignString(const char *v);

        bool incr();
        bool decr();
};

class SymTable
{
    public:
        map<string, IdInfo> ids;
        string name;
        SymTable *parinte;

        SymTable(SymTable *parinte, const char* name);

        void addVar(string type, const char *name);
        void addVec(string type, const char *name, int size);
        void addClass(const char *name);
        void addFunct(string type, const char *name, ParamList *params);
        void addVarClasa(map<string, SymTable*> classes, const char *clasa, const char *var);

        bool checkNumParams(ParamList *primit, ParamList *necesar);
        bool checkListParams(ParamList *primit, ParamList *necesar);

        bool existsInBlock(const char *s);
        IdInfo* existsAnywhere(const char *s, const char *idType);
        IdInfo* existsVarInBlock(const char* s, const char *idType);
        bool existsClasa(map<string, SymTable*> classes, const char* clasa);
        IdInfo* existsInClasa(const char *obiect, const char *membru, const char *idType);

        void print();
        std::ofstream openFile(const char *fileName);
        void printScope(std::ofstream &fout);
        void printObj(std::ofstream &fout, const pair<string, IdInfo>&v);
        void printFunct(std::ofstream &fout, const pair<string, IdInfo>&v);
        ~SymTable();
};

class ASTNode
{
    public:
    string label;
    ASTNode* left = nullptr;
    ASTNode* right = nullptr;
    string type;
    string idType;
    SymTable* symTable = nullptr;
    Value val;

    ASTNode(const char* label) : label(label), left(nullptr), right(nullptr), symTable(nullptr) {} 
    ASTNode(const char *label, string type) : label(label), type(type.c_str()), left(nullptr), right(nullptr), symTable(nullptr) {}
    ASTNode(string type, Value val) : type(type.c_str()), val(val), left(nullptr), right(nullptr), symTable(nullptr) {}
    ASTNode(const char* label, string type, SymTable* symTable) : label(label), type(type.c_str()), symTable(symTable), left(nullptr), right(nullptr) {}
    ASTNode(const char *label, string type, string idType) : label(label), type(type.c_str()), idType(idType) {}
    ASTNode(const char *side, const char* label, string type, bool valBool, IdInfo *var); //pentru var_true_false
    ASTNode(const char *side, const char* label, string type, bool valBool, ASTNode *var); //pentru funct_true_false
    ASTNode(const char* label, string type, ASTNode *var1, ASTNode *var2) : label(label), type(type.c_str()), symTable(nullptr), left(var1), right(var2) { } //pentru comp_bool

    Value eval();
    Value operatiiInt(string label, Value leftVal, Value rightVal);
    Value operatiiFloat(string label, Value leftVal, Value rightVal);
    Value operatiiBool(string label, Value leftVal, Value rightVal);

    ~ASTNode() { delete left; delete right; }
};