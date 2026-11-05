# errno ve hata işleme

C’de istisna yoktur. Hatalar: dönüş kodu, `NULL`, ve/veya `errno`. Sözleşmeyi
okumadan `errno`’ya bakmak yanlış sonuç verir.

## errno modeli

```c
#include <errno.h>
#include <string.h>
#include <stdio.h>

errno = 0;
FILE *fp = fopen(path, "r");
if (!fp) {
    fprintf(stderr, "fopen %s: %s\n", path, strerror(errno));
}
```

- Başarıda bazı işlevler `errno`’yu değiştirmeyebilir → önce `errno = 0` (gerekirse).
- `errno` thread-local’dır (modern libc).
- `perror("msg")` = stderr’e msg + strerror.

## Kalıplar

### 1) Dönen hata kodu

```c
int parse(...); /* 0 OK, negatif hata */
```

### 2) Out-parametre + kod

```c
int get_value(int id, int *out);
```

### 3) goto cleanup

Kaynak çoksa ortak serbest bırakma (bkz. kontrol akışı bölümü).

## Kütüphane tasarımı

Dokümante edin: hangi kod ne demek; kim `free` eder; kısmi başarıda durum.
`errno`’yu kendi API’nizde kötüye kullanmayın; açık kodlar daha nettir.

## Alıştırmalar

1. `strtol` + `ERANGE` örneği yazın.
2. Üç kaynaklı işlevde `goto cleanup` uygulayın.
3. Hata kodlarını `enum` ile tanımlayıp `strerror` benzeri tablo yazın.

## Kaynaklar

- `man 3 errno`
- POSIX hata kodları

## Hata modeli seçimi

Tek politika seçin ve API genelinde uygulayın. Karışık `errno` + bool + sentinel
değer okunabilirliği öldürür. Rust’ta `?` + `map_err`; C sınırında kararlı
negatif kod tablosu.


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
