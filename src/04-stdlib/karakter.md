# Karakter kümeleri

C “metin”i dil düzeyinde Unicode zorunlu kılmaz. `char` dizileri çoğu modern
ortamda UTF-8 bayt dizisidir; geniş karakterler ve locale dönüşümleri ayrı katmandır.

## char dizileri

- Uzunluk: `strlen` (bayt; UTF-8 kod noktası değil)
- Doğrulama: geçersiz UTF-8’i siz denetlersiniz
- Karşılaştırma: bayt sırası ≠ dilbilgisel sıra

## Geniş ve çok baytlı

`<wchar.h>`, `<uchar.h>` (C11): `wchar_t`, `char16_t`, `char32_t`, `mbrtowc`…
`wchar_t` boyutu platforma göre 16 veya 32 bit — taşınabilir Unicode için
`char8_t`/UTF-8 kütüphaneleri (C23 tartışmaları / üçüncü parti) tercih edilir.

## Locale

`setlocale` `printf` / `strtod` / karakter sınıflarını etkiler. Kütüphanelerde
locale’i sessizce değiştirmeyin; thread-safe locale API’leri (POSIX `*_l`) kullanın.

## Pratik öneri

Uygulama içi kanonik form: UTF-8 `char` tamponları + uzunluk.
Windows API sınırında UTF-16 dönüşümü.

## Kaynaklar

- `<uchar.h>`, Unicode Standard
- UTF-8 Everywhere manifestosu (felsefe)

## UTF-8 pratik

```c
/* Kod noktası sayısı ≠ strlen */
size_t utf8_codepoints(const char *s) {
    size_t n = 0;
    while (*s) {
        unsigned char c = (unsigned char)*s++;
        if ((c & 0xC0) != 0x80) n++; /* continuation değilse */
    }
    return n;
}
```

Gerçek doğrulama için sağlam bir UTF-8 kütüphanesi kullanın.

## Windows

Konsol ve API çoğu yerde UTF-16. `WideCharToMultiByte` / UTF-8 code page (65001).


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
