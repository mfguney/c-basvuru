# Bellek eşleme ve sayfalama

`mmap` süreç adres alanına sayfalar bağlar: dosya veya anonim bellek. Büyük
dosya I/O ve özel allocator’lar için temeldir.

## Örnek (POSIX)

```c
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

int fd = open(path, O_RDONLY);
struct stat st;
fstat(fd, &st);
void *p = mmap(NULL, st.st_size, PROT_READ, MAP_PRIVATE, fd, 0);
/* p kullan */
munmap(p, st.st_size);
close(fd);
```

## Kavramlar

- Sayfa boyutu: `sysconf(_SC_PAGESIZE)` — ofset hizası
- `MAP_SHARED` vs `PRIVATE` (copy-on-write)
- `PROT_READ/WRITE/EXEC` — W^X güvenlik politikaları
- `mprotect`, `msync`, `madvise`

## Sayfa hataları

İlk erişimde OS sayfayı getirir (demand paging). Büyük `malloc` da benzer
şekilde overcommit / lazy olabilir (OS’e bağlı).

## Windows

`CreateFileMapping` / `MapViewOfFile` eşdeğeri.

## Kaynaklar

- `man 2 mmap`

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
