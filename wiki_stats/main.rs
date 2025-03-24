use chrono::Local;
use serde_json::Value;
use std::collections::HashMap;
use std::fs::{File, OpenOptions};
use std::io::{self, BufReader, BufWriter, Read, Write};
use std::sync::{Arc, Mutex};
use threadpool::ThreadPool;
use zip::read::ZipArchive;

struct Global {
    word_freq: Arc<Mutex<HashMap<String, u64>>>,
    word_freq_lower: Arc<Mutex<HashMap<String, u64>>>,
    max_art: Mutex<(String, usize, String)>,
    max_title: Mutex<(String, usize, String)>,
}

impl Global {
    fn new() -> Self {
        Global {
            word_freq: Arc::new(Mutex::new(HashMap::new())),
            word_freq_lower: Arc::new(Mutex::new(HashMap::new())),
            max_art: Mutex::new((String::new(), 0, String::new())),
            max_title: Mutex::new((String::new(), 0, String::new())),
        }
    }

    fn update_word_freq(&self, local_freq: HashMap<String, u64>) {
        let mut global_freq = self.word_freq.lock().unwrap();
        for (word, count) in local_freq {
            *global_freq.entry(word).or_insert(0) += count;
        }
    }

    fn update_word_freq_lower(&self, local_freq_lower: HashMap<String, u64>) {
        let mut global_freq_lower = self.word_freq_lower.lock().unwrap();
        for (word, count) in local_freq_lower {
            *global_freq_lower.entry(word).or_insert(0) += count;
        }
    }

    fn update_max_art(&self, title: &str, text_len: usize, nume_fisier: &str) {
        let mut max_art = self.max_art.lock().unwrap();
        if text_len > max_art.1 {
            *max_art = (title.to_string(), text_len, nume_fisier.to_string());
        }
    }

    fn update_max_title(&self, title: &str, nume_fisier: &str) {
        let mut max_title = self.max_title.lock().unwrap();
        let title_len = title.len();
        if title_len > max_title.1 {
            *max_title = (title.to_string(), title_len, nume_fisier.to_string());
        }
    }
}

struct Info {
    word_freq: HashMap<String, u64>,
    word_freq_lower: HashMap<String, u64>,
    max_art: (String, usize, String),
    max_title: (String, usize, String),
}

impl Info {
    fn new() -> Self {
        Info {
            word_freq: HashMap::new(),
            word_freq_lower: HashMap::new(),
            max_art: (String::new(), 0, String::new()),
            max_title: (String::new(), 0, String::new()),
        }
    }

    fn update_word_freq(&mut self, word: &str) {
        *self.word_freq.entry(word.to_string()).or_insert(0) += 1;
    }

    fn update_word_freq_lower(&mut self, word: &str) {
        let word_lower = word.to_lowercase();
        *self.word_freq_lower.entry(word_lower).or_insert(0) += 1;
    }

    fn update_max_art(&mut self, title: &str, text_len: usize, nume_fisier: &str) {
        if text_len > self.max_art.1 {
            self.max_art = (title.to_string(), text_len, nume_fisier.to_string());
        }
    }

    fn update_max_title(&mut self, title: &str, nume_fisier: &str) {
        let title_len = title.len();
        if title_len > self.max_title.1 {
            self.max_title = (title.to_string(), title_len, nume_fisier.to_string());
        }
    }
}

fn extr_zip(zip_path: &str) -> io::Result<Vec<String>> {
    let file = File::open(zip_path)?;
    let mut archive = ZipArchive::new(file)?;

    let mut json_files = Vec::new();

    for i in 0..archive.len() {
        let file_in_zip = archive.by_index(i)?;

        if file_in_zip.name().ends_with(".json") {
            let nume_fisier = file_in_zip.name().to_string();
            json_files.push(nume_fisier);
        }
    }

    if json_files.is_empty() {
        Err(io::Error::new(
            io::ErrorKind::NotFound,
            "Nu au fost gasite fisiere JSON in arhiva ZIP",
        ))
    } else {
        Ok(json_files)
    }
}

fn proc_fis_1(file_content: &[u8], nume_fisier: &str) -> io::Result<Info> {
    let reader = BufReader::new(file_content);
    let articles: Vec<Value> = serde_json::from_reader(reader)?;

    let mut local = Info::new();

    for item in articles {
        if let Some(articol) = item.as_object() {
            if let Some(titlu) = articol.get("title").and_then(|t| t.as_str()) {
                local.update_max_title(titlu, nume_fisier);

                for word in titlu.split_whitespace() {
                    local.update_word_freq(word);
                }

                if let Some(text) = articol.get("text").and_then(|t| t.as_str()) {
                    local.update_max_art(titlu, text.len(), nume_fisier);

                    for word in text.split_whitespace() {
                        local.update_word_freq(word);
                    }
                }
            }
        }
    }

    Ok(local)
}

fn proc_fis_2(file_content: &[u8]) -> io::Result<Info> {
    let reader = BufReader::new(file_content);
    let articles: Vec<Value> = serde_json::from_reader(reader)?;

    let mut local = Info::new();

    for item in articles {
        if let Some(articol) = item.as_object() {
            if let Some(titlu) = articol.get("title").and_then(|t| t.as_str()) {
                for word in titlu.split_whitespace() {
                    local.update_word_freq_lower(word);
                }

                if let Some(text) = articol.get("text").and_then(|t| t.as_str()) {
                    for word in text.split_whitespace() {
                        local.update_word_freq_lower(word);
                    }
                }
            }
        }
    }

    Ok(local)
}

fn afisare_1(global: &Arc<Global>, output: &mut dyn Write) {
    println!("\nS-a terminat prima procesare a fisierelor!\nScriem informatia in output.txt!\n");

    let max_art = global.max_art.lock().unwrap();
    output
        .write_all(
            format!(
                "Cel mai lung articol:\nTitlu: {}\nDimensiune: {}\nCalea fisierului: {}\n\n",
                max_art.0, max_art.1, max_art.2
            )
            .as_bytes(),
        )
        .unwrap();

    let max_title = global.max_title.lock().unwrap();
    output
        .write_all(
            format!(
                "Cel mai lung titlu:\nTitlu: {}\nDimensiune: {}\nCalea fisierului: {}\n\n",
                max_title.0, max_title.1, max_title.2
            )
            .as_bytes(),
        )
        .unwrap();
    drop(max_title);

    output.write_all(b"Frecventa cuvintelor:\n").unwrap();
    let mut word_freq = global.word_freq.lock().unwrap();
    write_word_freq(&word_freq, output);
    *word_freq = HashMap::new();
    drop(word_freq);
}

fn afisare_2(global: &Arc<Global>, output: &mut dyn Write) {
    println!("\nS-a terminat a doua procesare a fisierelor!\nAdaugam informatia in output.txt!\n");

    output
        .write_all(b"\nFrecventa cuvintelor lowercase:\n")
        .unwrap();
    let mut word_freq_lower = global.word_freq_lower.lock().unwrap();
    write_word_freq(&word_freq_lower, output);
    *word_freq_lower = HashMap::new();
    drop(word_freq_lower);
}

fn write_word_freq(info: &HashMap<String, u64>, output: &mut dyn Write) {
    let capacity = 1_000_000_000; // buffer de 1 GB
    let mut buf_writer = BufWriter::with_capacity(capacity, output);

    for (word, count) in info.iter() {
        let line = format!("{}: {}\n", word, count);
        buf_writer.write_all(line.as_bytes()).unwrap();
    }

    buf_writer.flush().unwrap();
}

fn afisare_timp(time_start: chrono::DateTime<Local>) {
    let time_finish = Local::now();
    let time_running = time_finish - time_start;
    println!(
        "Timp de rulare: {:02}:{:02}:{:02}",
        time_running.num_hours(),
        time_running.num_minutes() % 60,
        time_running.num_seconds() % 60
    );
}

fn main() {
    let time_start = Local::now();

    let zip_path = "enwiki20201020.zip";

    let mut output = OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open("output.txt")
        .unwrap();

    let num_threads = num_cpus::get();
    let pool = ThreadPool::new(num_threads);
    println!("\nLucram cu {} fire.", num_threads);

    let global = Arc::new(Global::new());

    match extr_zip(zip_path) {
        Ok(json_files) => {
            /************** PRIMA PARCURGERE ***********/
            println!("\nPrima procesare a fisierelor:\n");
            let mut nr_fis = 0;

            for fisier in &json_files {
                let global = Arc::clone(&global);
                let nume_fisier = fisier.clone();

                pool.execute(move || {
                    println!("{} - Se proceseaza fisierul: {}", nr_fis + 1, nume_fisier);

                    let desc_arhiva =
                        File::open(zip_path).expect("Eroare la deschiderea arhivei ZIP");
                    let mut archive =
                        ZipArchive::new(desc_arhiva).expect("Eroare la citirea din arhiva ZIP");

                    let mut fis = archive
                        .by_index(nr_fis)
                        .expect("Eroare la citirea fisierului din arhiva");

                    let mut content = Vec::new();
                    fis.read_to_end(&mut content)
                        .expect("Eroare la citirea fisierului din arhiva");

                    match proc_fis_1(&content, &nume_fisier) {
                        Ok(local) => {
                            global.update_word_freq(local.word_freq);
                            global.update_max_art(
                                &local.max_art.0,
                                local.max_art.1,
                                &local.max_art.2,
                            );
                            global.update_max_title(&local.max_title.0, &local.max_title.2);
                        }
                        Err(e) => {
                            eprintln!("Eroare la procesarea fisierului {}: {}", nume_fisier, e)
                        }
                    }
                });
                nr_fis += 1;
            }

            pool.join();
            afisare_1(&global, &mut output);

            /************** A DOUA PARCURGERE ***********/
            println!("A doua procesare a fisierelor:\n");
            nr_fis = 0;

            for fisier in json_files {
                let global = Arc::clone(&global);
                let nume_fisier = fisier.clone();

                pool.execute(move || {
                    println!("{} - Se proceseaza fisierul: {}", nr_fis + 1, nume_fisier);

                    let desc_arhiva =
                        File::open(zip_path).expect("Eroare la deschiderea arhivei ZIP");
                    let mut archive =
                        ZipArchive::new(desc_arhiva).expect("Eroare la citirea din arhiva ZIP");

                    let mut fis = archive
                        .by_index(nr_fis)
                        .expect("Eroare la citirea fisierului din arhiva");

                    let mut content = Vec::new();
                    fis.read_to_end(&mut content)
                        .expect("Eroare la citirea fisierului din arhiva");

                    match proc_fis_2(&content) {
                        Ok(local) => {
                            global.update_word_freq_lower(local.word_freq_lower);
                        }
                        Err(e) => {
                            eprintln!("Eroare la procesarea fisierului {}: {}", nume_fisier, e)
                        }
                    }
                });
                nr_fis += 1;
            }

            pool.join();
            afisare_2(&global, &mut output);
            println!("Yuhu!! Am terminat!!\nVerifica fisierul output.txt pentru a vedea rezultatele! <3\n");
            afisare_timp(time_start);
        }
        Err(e) => eprintln!("Eroare la extragerea fișierelor JSON din arhiva ZIP: {}", e),
    }
}
