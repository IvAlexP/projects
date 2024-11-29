# Project title
Hexaflake Fractal

## Description
************ to add ******************

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
    * you may find it on the desktop or you can search for it in the search bar
2. Click on **Create a new project**
3. Double click on **Console application**
4. Select **C++** and click on **Next**
5. Select a **Project name** and the location for the project, then click on **Next**
6. The **Compiler** should be **GNU GCC Compiler**
7. Click **Finish**

### Compiling settings
There are a few steps to be followed in order to prepare the environment:
1. Make sure the link to MinGW is correct:
    * click on **Settings** on the top meniu
    * click on **Compiler...**
    * click on **Toolchain executables**
    * click on **Auto-detect**
    * make sure the link is something like **C:\Program Files\CodeBlocks\MinGW**
2. Select the right version of the compiler:
    * click on **Settings** on the top meniu
    * click on **Compiler...**
    * select the **g++ [std=c++11]** version
    * click **ok** to save the changes

### Dependencies
There are a few files to be included in the folder of the project:
1. Download [main.cpp](main.cpp)
2. Download [schema_salvata.txt](schema_salvata.txt)
3. Download the folders:
    * *[headers](headers)*
        * *winbgi2.h*
        * *graphics2.h*
    * *[lib](lib)*
        * *libgdi32.a*
4. Add the 2 headers to your project:
    * click **Project** on the top meniu
    * click **Add files..**
    * select the files **winbgim.h** and **graphics.h**
    from the folder of your project
    * click **ok** to save the changes
5. Link the lib file:
    * click **Project** on the top meniu
    * click **Build options**
    * click **Linker settings**
    * click **add**
    * select the file **libgdi32.a** from the **lib** folder
    * click **ok** to save the changes

### Executing program
You can either click on the **Build and run** button on the top meniu or press **(FN+)F9**.

## Usage
************ to add ******************