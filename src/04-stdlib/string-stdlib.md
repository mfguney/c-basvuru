# string, stdlib, time, math

Standart kütüphanenin “günlük” yüzeyi: bayt/string, genel yardımcılar, zaman,
matematik. Sınır bilgisi taşımayan C string modeli çoğu açığın kaynağıdır.

## string.h — bayt ve C string

| İşlev | Not |
|--------|-----|
| `memcpy` | örtüşme YOK |
| `memmove` | örtüşme OK |
| `memset` | bayt doldur |
| `strlen` | null’a kadar; uzunluk yoksa tehlikeli |
| `strcpy` / `strcat` | hedef boyutu bilmez — kaçının |
| `strncpy` | null sonlandırmayı garanti etmez |
| `strlcpy` | BSD; standart değil ama daha iyi model |
| `snprintf` | sınırlı biçimli yazma |

```c
char dst[32];
snprintf(dst, sizeof dst, "%s", src);
```

Karşılaştırma: `strcmp` / `memcmp`. Sıralama locale’e bağlı olabilir (`strcoll`).

## stdlib.h

- Dönüşüm: `strtol`, `strtod` (`atoi` hata bildirmez — zayıf)
- Bellek: `malloc` ailesi
- Arama/sıralama: `qsort`, `bsearch` (karşılaştırıcı sözleşmesine dikkat)
- Rastgele: `rand` / `srand` — kriptografik değil; C23/OS API’lerine bakın
- Çıkış: `exit`, `atexit`, `abort`, `_Exit`

```c
char *end;
long v = strtol(s, &end, 10);
if (end == s || *end != '\0') { /* hata */ }
```

## time.h

`time_t`, `struct tm`, `time`, `localtime` / `gmtime` (bazıları static tampon —
thread-safe değil; `*_r` POSIX). C11 `timespec_get`.

## math.h / fenv.h

`sin`, `log`, `pow`, `isnan`… Hata bildirimi `errno` ve/veya floating environment.
Bağlarken `-lm` (çok UNIX).

## Alıştırmalar

1. `strcpy` kullanan kodu `snprintf` ile değiştirin.
2. `strtol` ile kapsam (`ERANGE`) kontrolü ekleyin.
3. `qsort` ile struct dizisi sıralayın.

## Kaynaklar

- cppreference C library
- CERT STR* / INT*

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
