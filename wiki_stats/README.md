# Project title
Wiki_stats


## Description
The purpose of this project is to read the zip archieve provided and extract certain information about all the data from all JSON files and print the it in a file: 
* a frequency list of all the words as written
* a frequency list of all the words as lowercase
* the title, the path in the zip and the size of the longest article
* the title, the path in the zip and the size of the longest title


## Programming languages
Rust


## Getting started
### Installing
You are going to need to install Rust on your local machine from [this](https://www.rust-lang.org/tools/install) website.

Open a new terminal or command prompt and check to see if the installation was successful, writing this commands:

```bash
rustc --version
cargo --version
```

If *rustc* is not found, ensure you have in your PATH:

* on Linux/macOS : ~/.cargo/bin
* on Windows : %USERPROFILE%\.cargo\bin

Additionally, you may want to update Rust using the command:

```bash
rustup update
```

### Create a new project (on Windows)
1. Open **Windows PowerShell**
2. Run :
```bash
cargo new project
cd project
```
3. Copy the code from the [main.rs](main.rs) file into the new one created.


### Dependencies

In the **Cargo.toml** file, you have to add the necessary dependencies:

```toml
[dependencies]
chrono = "0.4"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
threadpool = "1.8"
zip = "0.6"
num_cpus = "1.13"
```

### Executing program
1. Open **Windows PowerShell**
2. Additional commands:
```bash
cargo clippy // helps lint your code and catch issues early
cargo build // builds the project
cargo check // quickly analyzes code without creating binaries
```
3. Run the project
```bash
cargo run --release
```

## Usage
You can test it on the 8 GB zip archieve from the link required: https://www.kaggle.com/datasets/ltcmdrdata/plain-text-wikipedia-202011/. There are 600 JSON files in it. It takes 5 - 10 minutes for running, depending on your machine. You are going to need a special document editor in order to open the output file, since it is too big for common editors (more than 1GB).

You can also test it on any other zip archieve that contains JSON files, starting with smaller onea and building up until you test the archieve provided, comparing the time and resources needed.