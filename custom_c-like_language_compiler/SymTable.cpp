#include <fstream>
#include <cstring>
#include "SymTable.h"
using namespace std;

void Value::print()
{
    if (this->type == "int")
    {
        cout << this->valInt;
    }
    else if (this->type == "float")
    {
        cout << this->valFloat;
    }
    else if (this->type == "bool")
    {
        if (this->valBool == true)
        {
            cout << "true";
        }
        else
        {
            cout << "false";
        }
    }
    else if (this->type == "char")
    {
        cout << "'" << this->valChar << "'";
    }
    else if (this->type == "string")
    {
        cout << "\"" << this->valString << "\"";
    }
    cout << '\n';
}

SymTable::SymTable(SymTable *parinte, const char *name) :  parinte(parinte), name(name)
{ }

void SymTable::addVar(string type, const char *name)
{
    IdInfo var(type, name, "var");
    var.val = Value(type);
    this->ids[name] = var; 
}

void SymTable::addVec(string type, const char *name, int size)
{
    IdInfo var(type, name, "vec", size);
    this->ids[name] = var; 
}

void SymTable::addClass(const char *name)
{
    IdInfo var(name, "class");
    this->ids[name] = var; 
}

void SymTable::addFunct(string type, const char *name, ParamList *params)
{
    ParamList aux;
    if (params != nullptr)
    {
        aux = *params;
    }
    IdInfo var(type, name, "funct", aux);
    var.val = Value(type);
    this->ids[name] = var;
}

bool SymTable::existsInBlock(const char* s)
{
    return this->ids.find(s) != this->ids.end();  
}

IdInfo* SymTable::existsVarInBlock(const char* s, const char *idType)
{
    for (auto& v : ids)
    {
        if (v.first == s && v.second.idType == idType)
        {
            return &v.second;
        }
    }
    return nullptr;
}

IdInfo* SymTable::existsAnywhere(const char *s, const char *idType)
{
    auto var = this->existsVarInBlock(s, idType);
    if (var)
    {
        return var;
    }
    SymTable *p = this->parinte;
    while (p)
    {
        var = p->existsVarInBlock(s, idType);
        if (var)
        {
            return var;
        }
        p = p->parinte;
    }
    return nullptr;
}

IdInfo* SymTable::existsInClasa(const char *obiect, const char *membru, const char *idType)
{
    string aux;
    aux = obiect; aux += "."; aux += membru;
    return this->existsAnywhere(aux.c_str(), idType);
}

bool SymTable::existsClasa(map<string, SymTable*> classes, const char* clasa)
{
     return classes.find(clasa) != classes.end();
}

void SymTable::addVarClasa(map<string, SymTable*> classes, const char *clasa, const char *var)
{
    this->addVar(clasa, var);
    string aux;
    for (auto &v : classes[clasa]->ids)
    {
        aux = var; aux += "."; aux += v.second.name;
        if (v.second.idType == "var")
        {
            this->addVar(v.second.type.c_str(), aux.c_str());
            this->ids[aux.c_str()].val = v.second.val;
        }
        else if (v.second.idType == "funct")
        {
            this->addFunct(v.second.type.c_str(), aux.c_str(), &v.second.listParams);
        }
        else if (v.second.idType == "vec")
        {
            this->addVec(v.second.type.c_str(), aux.c_str(), v.second.size);
        }
    }
}

bool SymTable::checkNumParams(ParamList *primit, ParamList *necesar)
{
    return primit->param.size() != necesar->param.size();
}

bool SymTable::checkListParams(ParamList *primit, ParamList *necesar)
{
    bool ok = 1;
    for (size_t i = 0; i < primit->param.size(); ++i) 
    {
        if (primit->param[i].type != necesar->param[i].type) 
        {
            return 0;
        }
    }
    return 1;
}

void SymTable::print()
{
    std::ofstream fout = openFile("output.txt");
    printScope(fout);

    for (const pair<string, IdInfo>&v : ids)
    {
        this->printObj(fout, v);
    }

    fout.close();
}

std::ofstream SymTable::openFile(const char *fileName)
{
    std::ofstream fout(fileName, std::ios::app);

    if (!fout.is_open())
    {
        cout << "Error at opening input file\n";
        exit(0);
    }

    return fout;
}

void SymTable::printScope(std::ofstream &fout)
{
    if (this->name == "global")
    {
        fout << "Scope: global\n";
    }
    else
    {
        fout << "Scope: " << this->name << " with parent " << this->parinte->name << "\n";
    }
}

void SymTable::printObj(std::ofstream &fout, const pair<string, IdInfo>&v)
{
    if (v.second.idType == "class")
    {
        fout << "name: " << v.first << " idtype: " << v.second.idType << "\n";
    }
    else if (v.second.idType == "funct")
    {
        fout << "name: " << v.first << " type: " << v.second.type << " idtype: " << v.second.idType << " " << "param: ";
        for (const auto &it : v.second.listParams.param)
        {
            fout << it.type << ' ' << it.name << "; ";
        }
        fout <<'\n';
    }
    else
    {
        fout << "name: " << v.first << " type: " << v.second.type << " idtype: " << v.second.idType << "\n";
    }
}

void SymTable::printFunct(std::ofstream &fout, const pair<string, IdInfo>&v)
{
    fout << "name: " << v.first << " type: " << v.second.type << " idtype: " << v.second.idType << " " << "param: ";
    for (const auto &it : v.second.listParams.param)
    {
        fout << it.type << ' ' << it.name << "; ";
    }
    fout <<'\n';
}

SymTable::~SymTable()
{
    ids.clear();
}

ASTNode::ASTNode(const char *side, const char* label, string type, bool valBool, IdInfo *var) : label(label), type(type), symTable(nullptr)
{
    if (strcmp(side, "stanga") == 0)
    {
        left = new ASTNode("bool", Value(valBool, "bool"));
        right = new ASTNode(var->type.c_str(), var->val);
    }
    else
    {
        right = new ASTNode("bool", Value(valBool, "bool"));
        left = new ASTNode(var->type.c_str(), var->val);
    }
}

ASTNode::ASTNode(const char *side, const char* label, string type, bool valBool, ASTNode *var) : label(label), type(type), symTable(nullptr)
{
    if (strcmp(side, "stanga") == 0)
    {
        left = new ASTNode("bool", Value(valBool, "bool"));
        right = var;
    }
    else
    {
        right = new ASTNode("bool", Value(valBool, "bool"));
        left = var;
    }
}

Value ASTNode::eval()
{
    if (this->idType == "funct")
    {
        return Value(type.c_str());
    }

    if (this->type == "int" || this->type == "float" || this->type == "bool" || this->type == "string" || this->type == "char")
    {
        return this->val;
    }
    else if (this->type != "operator")
    {
        return Value(type.c_str());
    }

    Value leftVal, rightVal;
    if (this->left != nullptr)
    {
        leftVal = left->eval();
    }
    if (this->right != nullptr)
    {
        rightVal = right->eval();
    }

    if (type == "operator")
    {
        type = leftVal.type;
    }
    
    if (label == "&&")
    {
        return Value(leftVal.valBool && rightVal.valBool, "bool");
    }
    else if (label == "||")
    {
        return Value(leftVal.valBool || rightVal.valBool, "bool");
    }
    else
    {
        if (leftVal.type == "int" && rightVal.type == "int")
        {
            return this->operatiiInt(label, leftVal, rightVal);
        }
        else if (leftVal.type == "float" && rightVal.type == "float")
        {
            return this->operatiiFloat(label, leftVal, rightVal);
        }
        else if (leftVal.type == "bool" && rightVal.type == "bool")
        {
            return this->operatiiBool(label, leftVal, rightVal);
        }
        else if  (label == "!")
        {
            return Value(!leftVal.valBool, "bool");
        }
        else
        {
            throw runtime_error("Type mismatch in expression");
        }
    }

    throw runtime_error("Invalid node of label: " + label);
}

Value ASTNode::operatiiInt(string label, Value leftVal, Value rightVal)
{
    if (label == "+")
    {
        return Value(leftVal.valInt + rightVal.valInt, "int");
    }
    else if (label == "-")
    {
        return Value(leftVal.valInt - rightVal.valInt, "int");
    }
    else if (label == "*")
    {
        return Value(leftVal.valInt * rightVal.valInt, "int");
    }
    else if (label == "/")
    {
        if (rightVal.valInt == 0)
        {
            throw runtime_error("Cannot divide by zero");
        }
        else
        {
            return Value(leftVal.valInt / rightVal.valInt, "int");
        }
    }
    else if (label == "%")
    {
        if (rightVal.valInt == 0)
        {
            throw runtime_error("Cannot divide by zero");
        }
        else
        {
            return Value(leftVal.valInt % rightVal.valInt, "int");
        }
    }
    else if (label == "==")
    {
        return Value(leftVal.valInt == rightVal.valInt, "bool");
    }
    else if (label == "!=")
    {
        return Value(leftVal.valInt != rightVal.valInt, "bool");
    }
    else if (label == "<")
    {
        return Value(leftVal.valInt < rightVal.valInt, "bool");
    }
    else if (label == "<=")
    {
        return Value(leftVal.valInt <= rightVal.valInt, "bool");
    }
    else if (label == ">")
    {
        return Value(leftVal.valInt > rightVal.valInt, "bool");
    }
    else if (label == ">=")
    {
        return Value(leftVal.valInt >= rightVal.valInt, "bool");
    }

    throw runtime_error("Invalid node of label: " + label);
}

Value ASTNode::operatiiFloat(string label, Value leftVal, Value rightVal)
{
    if (label == "+")
    {
        return Value(leftVal.valFloat + rightVal.valFloat, "float");
    }
    else if (label == "-")
    {
        return Value(leftVal.valFloat - rightVal.valFloat, "float");
    }
    else if (label == "*")
    {
        return Value(leftVal.valFloat * rightVal.valFloat, "float");
    }
    else if (label == "/")
    {
        if (rightVal.valFloat == 0)
        {
            throw runtime_error("Cannot divide by zero");
        }
        else
        {
            return Value(leftVal.valFloat / rightVal.valFloat, "float");
        }
    }
    else if (label == "%")
    {
        throw runtime_error("Invalid operation on floats");
    }
    else if (label == "==")
    {
        return Value(leftVal.valFloat == rightVal.valFloat, "bool");
    }
    else if (label == "!=")
    {
        return Value(leftVal.valFloat != rightVal.valFloat, "bool");
    }
    else if (label == "<")
    {
        return Value(leftVal.valFloat < rightVal.valFloat, "bool");
    }
    else if (label == "<=")
    {
        return Value(leftVal.valFloat <= rightVal.valFloat, "bool");
    }
    else if (label == ">")
    {
        return Value(leftVal.valFloat > rightVal.valFloat, "bool");
    }
    else if (label == ">=")
    {
        return Value(leftVal.valFloat >= rightVal.valFloat, "bool");
    }

    throw runtime_error("Invalid node of label: " + label);
}

Value ASTNode::operatiiBool(string label, Value leftVal, Value rightVal)
{
    if (label == "==")
    {
        return Value(leftVal.valBool == rightVal.valBool, "bool");
    }
    else if (label == "!=")
    {
        return Value(leftVal.valBool != rightVal.valBool, "bool");
    }

    throw runtime_error("Invalid node of label: " + label);
}

bool IdInfo::asign(Value v)
{
   return this->type == v.type;
}

void IdInfo::calculAsign(const char *semn, Value v)
{
    if (this->type == "int" && v.type == "int")
    {
        this->calculAsignInt(semn, v);
    }
    else if (this->type == "float" && v.type == "float")
    {
        this->calculAsignFloat(semn, v);
    }
    else
    {
        throw runtime_error("Mismatch type at asign operation");
    } 
}

void IdInfo::calculAsignInt(const char *semn, Value v)
{
    if (strcmp(semn, "+=") == 0) 
    {
        this->val.valInt += v.valInt;
    } 
    else if (strcmp(semn, "*=") == 0) 
    {
        this->val.valInt *=  v.valInt;
    } 
    else if (strcmp(semn, "-=") == 0) 
    {
        this->val.valInt -=  v.valInt;
    } 
    else if (strcmp(semn, "/=") == 0) 
    {
        if (v.valInt == 0)
        {
            throw runtime_error("Cannot divide by 0");
        }
        else
        {
            this->val.valInt /=  v.valInt;
        }
    } 
    else if (strcmp(semn, "%=") == 0) 
    {
        if(v.valInt == 0.0)
        {
            throw runtime_error("Cannot divide by 0");
        }
        else
        {
            this->val.valInt /=  v.valInt;
        }
    }
}

void IdInfo::calculAsignFloat(const char *semn, Value v)
{
    if (strcmp(semn, "+=") == 0) 
    {
        this->val.valFloat += v.valFloat;
    } 
    else if (strcmp(semn, "*=") == 0) 
    {
        this->val.valFloat *=  v.valFloat;
    } 
    else if (strcmp(semn, "-=") == 0) 
    {
        this->val.valFloat -=  v.valFloat;
    } 
    else if (strcmp(semn, "/=") == 0) 
    {
        if (v.valFloat == 0)
        {
            throw runtime_error("Cannot divide by 0");
        }
        else
        {
            this->val.valFloat /=  v.valFloat;
        }
    } 
    else if (strcmp(semn, "%=") == 0) 
    {
        throw runtime_error("Cannot divide by 0");
    }
}

void IdInfo::asignString(const char *v)
{
    string aux;
    int l = strlen(v), i;
    for (i=1; i<l-1; i++)
    {
        aux += v[i]; 
    }
    this->val = Value(aux.c_str(), "string");
}

bool IdInfo::incr()
{
    if (this->type == "int")
    {
        this->val.valInt++;
        return 1;
    }
    if (this->type == "float")
    {
        this->val.valFloat++;
        return 1;
    }
    return 0;
}

bool IdInfo::decr()
{
    if (this->type == "int")
    {
        this->val.valInt--;
        return 1;
    }
    if (this->type == "float")
    {
        this->val.valFloat--;
        return 1;
    }
    return 0;
}