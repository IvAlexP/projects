# Project title
Logical Schemes Interpreter

## Description
This project aims to give the user an interface in which to create, edit, check, save, run and code in C++ a logical scheme by choice.

## Programming languages
C/C++

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
There are a few files to be included in the folder of the project:
1. Replace the *main.cpp* file from the folder of the project with [main.cpp](src/main.cpp)
2. Download the files:
    * [schema_salvata.txt](dependencies/schema_salvata.txt)
    * [winbgim.h](headers/winbgim.h)
    * [graphics.h](headers/graphics.h)
    * [libgdi32.a](lib/libgdi32.a)
3. Link the lib file:
    * click **Project** on the top menu
    * click **Build options**
    * click **Linker settings**
    * click **add**
    * select the file **libgdi32.a** from the **lib** folder
    * click **ok** to save the changes
4. Add the 2 headers to your project:
    * click **Project** on the top menu
    * click **Add files..**
    * select the files **winbgim.h** and **graphics.h**
    from the folder of your project
    * click **ok** to save the changes


### Executing program
You can either click on the **Build and run** button on the top menu or press **(FN+)F9**.

## Usage
### The left menu
You can draw the logical scheme on the provided display by selecting shapes from the menu on the left side of screen for commands such as *start*, *finish*, *start if*, *end if*, *read*, *write* and *attribute*. The shapes can be moved on the display by left clicking on them and then on their new position. You can delete a shape by right clicking on it. All shapes should be connected by double-clicking on two of them consecutively.

### The down menu
On the down side of the screen, there are several buttons which provide options for the user - *new sheme*, *save scheme*, *open scheme* and *run*.  
Should the *run* button be clicked on, the program checks for possible errors in the syntax of the logical scheme. Afterwards, the C++ codification of the logical scheme is displayed on the down-right side of the screen. Following this, the top-right side of the screen displays a step-by-step running through the scheme while highlighting the correspondent shape on the display. 

### The information button
On the down left corner of the screen there is an *information button*. By clicking on it at any given moment, a new window pops up with further information regarding the usage of the program.

### Further information
Watch the [video presentation](<presentation.mkv>) for a better understanding of the way the Logical Scheme Interpretator should be used.