# Inline assembly’ye giriş

Inline asm, derleyici IR’sini atlayıp doğrudan talimat yazmanıza izin verir.
Taşınabilirlik ve optimizasyon dostu değildir; dar sınırlı kullanın.

## GCC/Clang sözdizimi (özet)

```c
int x = 1, y;
asm volatile (
    "addl $1, %0"
    : "+r"(x)      /* okuma-yazma çıktı */
    :              /* girdiler */
    : "cc"         /* clobber */
);
```

Kısıtlar: `r` register, `m` bellek, `i` immediate… Yanlış clobber → sessiz bozulma.

## Ne zaman?

- Tek talimat intrinsikleri yoksa
- Boot / bare-metal
- Mikrobenchmark (dikkat: ölçüm hatası)

## Alternatifler

- Compiler builtins (`__builtin_ctz`)
- `<immintrin.h>` SIMD
- Ayrı `.S` dosyası + net çağrı ABI’si

## MSVC

Farklı (`__asm` x86; x64’te sınırlı). Intrinsics tercih edilir.

## Kaynaklar

- GCC Extended Asm
- Intel Intrinsics Guide

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
