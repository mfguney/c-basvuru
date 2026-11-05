# C11 / C17 / C23

C “tek dil” değildir; **standart sürümleri** özellik kapılarıdır. Projede
`-std=` seçimini bilinçli yapın ve `__STDC_VERSION__` ile özellik test edin.

## Sürüm numaraları

| Sürüm | `__STDC_VERSION__` (tipik) | Öne çıkanlar |
|-------|----------------------------|--------------|
| C99 | 199901L | VLA, `long long`, `//`, `stdint`, designated init |
| C11 | 201112L | atomikler, threads, `alignof`, `_Generic`, `static_assert` |
| C17 | 201710L | C11 düzeltmeleri (büyük özellik yok) |
| C23 | 202311L | `bool` anahtar, `typeof`, `_BitInt`, `nullptr`, birçok iyileştirme |

Derleyici desteği asimetriktir: Clang/GCC C23’ü aşamalı ekler; MSVC geriden gelebilir.

## C11’den pratikte kullandıklarınız

- `<stdatomic.h>`, isteğe `<threads.h>`
- `_Static_assert` / `static_assert`
- `alignas` / `alignof`
- `_Generic`
- anonim struct/union

## C23’ten seçilmişler

- `nullptr`, `typeof` / `typeof_unqual`
- `#embed` (araç desteğine bakın)
- bit-precise `_BitInt(N)`
- gelişmiş `enum` tür belirtimi
- `memset_explicit` benzeri güvenlik fonksiyonları (kütüphane)

## Özellik testi

```c
#if defined(__STDC_VERSION__) && __STDC_VERSION__ >= 201112L
  #include <stdalign.h>
#endif
```

Kütüphane/OS özellikleri için ayrıca `__has_include` (C23 / uzantı) veya
feature macro’ları.

## Taşınabilirlik stratejisi

1. Ortak payda: C17 + birkaç C11 özelliği
2. C23’ü `#if` ile opsiyonel
3. CI’da en az iki derleyici (gcc + clang) ve istenen `-std`

## Kaynaklar

- WG14 working drafts / Nxxxx belgeler
- cppreference — C compiler support
- Derleyici release notes

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
