# stdio ve dosya G/Ç

`<stdio.h>` C’nin taşınabilir G/Ç yüzüdür: akışlar (`FILE *`), biçimli yazma/okuma,
ikili vs metin modu. Biçim dizgesi hataları doğrudan UB’ye gider.

## Akışlar

Üç ön tanımlı: `stdin`, `stdout`, `stderr`. `fopen` / `fclose`, `fflush`.

```c
FILE *fp = fopen("data.bin", "rb");
if (!fp) { perror("fopen"); return 1; }
/* ... */
if (fclose(fp) != 0) perror("fclose");
```

Modlar: `"r"`, `"w"`, `"a"`, `"rb"`, `"wb"`, `"+"` güncelleme. Windows’ta metin
modu `\r\n` çevirir; ikili için `b` kullanın.

## Blok G/Ç

```c
size_t n = fread(buf, 1, sizeof buf, fp);
if (n < sizeof buf && ferror(fp)) { /* hata */ }
fwrite(buf, 1, n, out);
```

`fread` eleman sayısı döndürür; kısmi okuma EOF veya hata olabilir → `feof`/`ferror`.

## Biçimli G/Ç

```c
fprintf(fp, "%s: %d\n", name, code);
int x;
if (fscanf(fp, "%d", &x) != 1) { /* eşleşme yok */ }
```

Kurallar:

- Format ile argüman türü **birebir** uyuşmalı (`%d` ← `int`, `%zu` ← `size_t`).
- Kullanıcı girdisini `scanf("%s", buf)` ile sınırsız okumayın → taşma.
- Tercih: `fgets` + `sscanf` / `strtol`.

```c
char line[256];
if (fgets(line, sizeof line, stdin)) {
    char *end;
    long v = strtol(line, &end, 10);
    if (end != line) { /* parse OK */ }
}
```

## Buffering

`stdout` genelde satır tamponlu (TTY) veya tam tamponlu (dosya). `stderr` çoğu
zaman tamponsuz. Prompt sonrası `fflush(stdout)` düşünün.

## Güvenlik

- Format string: `printf(user)` yasak; `printf("%s", user)`.
- `gets` kaldırıldı/yasak; asla kullanmayın.
- Geçici dosya: `mkstemp` (POSIX) — `tmpnam` yarışlı.

## Alıştırmalar

1. Metin satır satır kopyalayan program yazın (`fgets`/`fputs`).
2. Bilerek yanlış `%d` / `long` verip UBSan/uyarı görün.
3. İkili struct yazımı yerine alan alan `fwrite` tasarlayın.

## Kaynaklar

- `man 3 printf`, `man 3 fread`
- CERT FIO* / STR*

## Metin ve sınırlar

Her zaman uzunluk taşıyın. C’de `snprintf`; Rust’ta `&str` / `String`.
FFI’da UTF-8 doğrulaması (`from_utf8`) unutulursa güven/doğruluk kırılır.


## Derinleşme: pratik notlar

Bu bölümün yüzeysel kalmaması için aşağıdaki kontrol listesini uygulayın:

1. Küçük, derlenebilir bir örnek yazın ve çalıştırın.
2. Bilerek kırık bir varyant üretip derleyici/sanitizer mesajını okuyun.
3. Kardeş kitaptaki ilgili bölüme çapraz referans ekleyin (C ↔ Rust).
4. “Sık tuzaklar” listesine kendi bulduğunuz bir vakayı ekleyin (PR).

## Sık tuzaklar

- Sözleşmeyi dokümante etmeden işaretçi/ödünç paylaşmak
- Hata yolunda kaynak sızıntısı veya kısmi init
- Platforma özel davranışı evrensel sanmak
- Optimizasyon açıkken kaybolan “şans eseri çalışan” kod

## Alıştırmalar

1. Bu bölümdeki ana örneği `examples/` altına tam proje olarak taşıyın.
2. Bir birim test veya sanitizer komutu ekleyin.
3. Bölüm sonu kaynakçasındaki en az bir belgeyi okuyup buraya bir cümlelik not düşün.

## Daha fazla okuma

Resmi belgeler (The Book, Reference, Nomicon, cppreference, man sayfaları) bu
konunun normatif kaynağıdır. Bu kitap özgün Türkçe derlemedir; çelişkide resmi
metne bakın.
