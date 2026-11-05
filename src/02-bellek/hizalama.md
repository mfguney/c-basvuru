# Hizalama ve padding

CPU ve ABI, nesnelerin belirli adres katlarında olmasını ister. Derleyici
padding ekleyerek bunu sağlar; siz packed/cast ile bozarsanız maliyet veya UB doğar.

## Temel kavramlar

- `_Alignof(T)` / `alignof(T)`: T’nin hizası
- `alignas(N)`: en az N hiza isteği (C11)
- `aligned_alloc(align, size)`: over-aligned tahsis (C11; `size` kat kurallarına bakın)

```c
#include <stdalign.h>
#include <stdio.h>

struct A { char c; double d; };
int main(void) {
    printf("align=%zu size=%zu\n", alignof(struct A), sizeof(struct A));
}
```

## Neden padding?

```text
offset 0: char c
offset 1..7: padding
offset 8: double d
```

`double` 8’e hizalı olsun diye boşluk konur. Alan sırasını değiştirerek boyutu
küçültebilirsiniz (`double` önce).

## Packed struct

```c
struct __attribute__((packed)) P { char c; int i; };
```

Boyut küçülür; `i` hizasız olabilir. x86 çoğu zaman tolere eder (yavaş); bazı
ARM’lerde hizasız yükleme trap. Taşınabilir yol:

```c
unsigned char wire[5];
int i;
memcpy(&i, wire + 1, sizeof i);
```

## Over-aligned türler

SIMD (`__m256`), DMA tamponları: `alignas(32) unsigned char buf[1024];`
veya `aligned_alloc`. `malloc` yalnızca temel max hizayı garanti eder.

## Struct dizileri

`sizeof(T)` trailing padding içerir; böylece `T a[N]` içinde her eleman hizalıdır.
`memcpy` ile eleman kopyalarken `sizeof(T)` kullanın.

## FFI ve #[repr(C)]

Rust/C paylaşımında padding’in her iki tarafta aynı olduğunu `static_assert`
/`sizeof` testleriyle doğrulayın. Bkz. geçiş rehberi struct-layout bölümü.

## Alıştırmalar

1. Alan sırasını değiştirip `sizeof` farkını ölçün.
2. Packed struct’tan `memcpy` ile `int` çıkarın.
3. `alignas(64)` sayaç ile false sharing deneyine hazırlık yapın.

## Kaynaklar

- `<stdalign.h>`, C11 aligned_alloc
- Platform ABI (SysV / MS) alignment kuralları

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
