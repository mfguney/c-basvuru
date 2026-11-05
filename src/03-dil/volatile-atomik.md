# volatile ve atomikler

İkisi de “derleyici dokunmasın / görünür olsun” hissi verse de **farklı
problemleri** çözer. `volatile` ≠ thread senkronizasyonu.

## volatile ne içindir?

Derleyiciye: bu nesneye erişimleri **gözlemlenebilir yan etki** say; silme veya
register’da birleştirme. Kullanım alanları:

- bellek eşlemeli I/O (MMIO register)
- `setjmp` / sinyal bayrakları (`sig_atomic_t` ile birlikte düşünün)
- bazı debugger/hardware senaryoları

```c
volatile uint32_t *reg = (volatile uint32_t *)0x40000000u;
uint32_t v = *reg; /* her seferinde gerçekten oku */
*reg = v | 1u;
```

## volatile ne değildir?

İki thread’in aynı `volatile int` üzerinde `++` yapması **data race**’tir → C11’de
UB. Optimizasyon engellenir ama **atomiklik / sıralama** gelmez.

## stdatomic.h (C11)

```c
#include <stdatomic.h>

atomic_int counter = 0;
atomic_fetch_add_explicit(&counter, 1, memory_order_relaxed);
```

Yaygın türler: `atomic_bool`, `atomic_int`, `atomic_size_t`, `atomic_uintptr_t`…
İşlemler: `load`, `store`, `exchange`, `compare_exchange_*`, `fetch_add`…

### Bellek sıraları (özet)

| Sıra | Anlam (kabaca) |
|------|----------------|
| `relaxed` | atomiklik var; sıra yok |
| `acquire` / `release` | senkron kenarı |
| `acq_rel` | RMW için ikisi |
| `seq_cst` | en güçlü; varsayılan düşünceye yakın |

Şüphede `seq_cst` ile başlayın; profil sonrası gevşetin. Yanlış sıra → ince bug.

### atomic vs mutex

- Basit sayaç / bayrak: atomik
- Kritik bölümde birden fazla invariant: `mtx_t` / pthread mutex / rwlock

## Alıştırmalar

1. `volatile` sayaçlı iki thread yarışını gözlemleyin (UB — öğrenme).
2. Aynı sayacı `atomic_fetch_add` ile düzeltin.
3. Producer/consumer için acquire/release bayrağı tasarlayın.

## Kaynaklar

- cppreference — Atomic / volatile
- Herb Sutter “atomic weapons” (C++ ama model benzer)

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
