# Project title
Hexaflake Fractal

## Description
This project aims to combine geometry and graphics, giving the user the opportunity to create a simple fractal represented by a snowflake made of hexagons that alternate in colour and size by choice.

## Programming languages
C++

## Getting started
### Installing
You are going to need an integrated development environment (IDE).  
I used **Code::Blocks** with **MinGW** included for **Windows**:
[windows_setup](https://sourceforge.net/projects/codeblocks/files/Binaries/20.03/Windows/codeblocks-20.03mingw-setup.exe/download).  
You can also download it for a **Linux** distribution at:
[linux_setup](https://www.codeblocks.org/downloads/binaries/#imagesoslinux48pnglogo-linux-32-and-64-bit).  
Or for **MacOS** at:
[mac_setup](https://sourceforge.net/projects/codeblocks/files/Binaries/13.12/MacOS/CodeBlocks-13.12-mac.zip/download).  
Download it and click on the setup to run it.  
Click **ok** until the download is finished.

### Create a new project
1. Open **Code::Blocks**
2. Click on **Create a new project**
3. Double click on **Console application**
4. Select **C++** and click on **Next**
5. Select a **Project name** and the location for the project, then click on **Next**
6. The **Compiler** should be **GNU GCC Compiler**
7. Click **Finish**

### Compiling settings
There are a few steps to be followed in order to prepare the environment:
1. Make sure the link to MinGW is correct:
    * click on **Settings** on the top menu
    * click on **Compiler...**
    * click on **Toolchain executables**
    * click on **Auto-detect**
    * make sure the link is something like **C:\Program Files\CodeBlocks\MinGW**
2. Select the right version of the compiler:
    * click on **Settings** on the top menu
    * click on **Compiler...**
    * select the **g++ [std=c++11]** version
    * click **ok** to save the changes

### Dependencies
There are a few files to be included in the folder of the project from the folder [dependencies](dependencies):
1. Replace the *main.cpp* file with [main.cpp](main.cpp)
2. Download the files:
    * [winbgi2.cpp](dependencies/winbgi2.cpp)
    * [graphics2.h](dependencies/graphics2.h)
    * [libgdi32.a](dependencies/libgdi32.a)
3. Link the lib file:
    * click **Project** on the top menu
    * click **Build options**
    * click **Linker settings**
    * click **add**
    * select the file **libgdi32.a** from the folder of your project
    * click **ok** to save the changes
4. Add the other 2 files to your project:
    * click **Project** on the top menu
    * click **Add files..**
    * select the files **winbgi2.cpp** and **graphics.h**
    from the folder of your project
    * click **ok** to save the changes

### Executing program
You can either click on the **Build and run** button on the top menu or press **(FN+)F9**.

## Usage
You can change the size of the biggest edge of the fractal by changing the number on line 21:
```cpp
int L=400;
```

You can change the size of the smallest edge of the fractal by changing the number on line 31:
```cpp
if (L<10)
```

You can change the filling and edge colouring of the hexagons on the odd levels on lines 42 and 43:
```cpp
setcolor(CYAN); fillpoly(7, hex);
setcolor(MAGENT); drawpoly(7, hex);
```

You can change the filling and edge colouring of the hexagons on the odd levels on lines 47 and 48:
```cpp
setcolor(RED); fillpoly(7, hex);
setcolor(YELLOW); drawpoly(7, hex);
```

You can find other colours at [setcolor.html](https://home.cs.colorado.edu/~main/bgi/doc/setcolor.html).