# Türler

C’nin tip sistemi “basit” görünür; pratikte **işaretlilik**, **genişlik**,
**hizalama**, **etkili tür (effective type)** ve **dönüşüm kuralları** çoğu UB’nin
kaynağıdır. Bu bölüm skaler türleri, boyutları ve taşınabilir yazım alışkanlıklarını
derinlemesine işler.

## Tür kategorileri (özet)

- **Nesne türleri:** tamsayı, floating, enum, pointer, array, struct, union, atomic…
- **İşlev türleri:** `int(int, int)` — değer olarak “taşınmaz”; işaretçisi alınır.
- **void:** tamamlanmamış tür; `void *` genel veri işaretçisi.

## Tamsayı türleri ve işaretlilik

### Standart tamsayılar

| Tür | Minimum aralık (standart) | Not |
|-----|---------------------------|-----|
| `signed char` | -127..127 | |
| `unsigned char` | 0..255 | bayt için tercih |
| `char` | yukarıdakilerden biri | **işaret uygulama tanımlı** |
| `short` / `int` / `long` / `long long` | artan veya eşit genişlik | `int` ≥ 16 bit |

`sizeof(char) == 1` tanım gereği “bayt”tır; baytın 8 bit olması yaygın ama
standart yalnızca `CHAR_BIT >= 8` der (`<limits.h>`).

### Sabit genişlik: stdint.h

Taşınabilir protokol/format kodunda:

```c
#include <stdint.h>
#include <inttypes.h>

int32_t x = -1;
uint64_t id = 0;
printf("id=%" PRIu64 "\n", id);  /* doğru biçim makro */
```

`int32_t` **opsiyoneldir** (ilginç mimarilerde yok); `int_least32_t` /
`int_fast32_t` her zaman vardır. Masaüstü/sunucu hedeflerinde `int32_t` fiilen
evrenseldir.

### size_t ve ptrdiff_t

- `size_t`: `sizeof` sonucu; dizi indeksi/uzunluk için doğal tür (işaretsiz).
- `ptrdiff_t`: iki işaretçi farkı (işaretli).

```c
for (size_t i = 0; i < n; i++) { /* ... */ }
```

`size_t` ile `int` karışımı: `i < n` karşılaştırmasında işaretli/işaretsiz uyarıları
ve negatif `int`’in devasa `size_t`’e dönüşmesi klasik hatadır.

## Floating türler

`float` (genelde IEEE binary32), `double` (binary64), `long double` (x86’da 80-bit
veya 64/128 — **ABI’ye bağlı**). Eşitlik için `==` yerine epsilon/ULP tabanlı
karşılaştırma düşünün; para için floating kullanmayın.

```c
#include <math.h>
if (fabs(a - b) < 1e-9) { /* kaba yaklaşım */ }
```

## char, bayt ve metin

- Ham bellek/bayt dizisi: `unsigned char *` (strict aliasing istisnası).
- C “string”: null-terminated `char` dizisi; kodlama (UTF-8 vs) dilin dışında.
- `signed char` ile `char` aynı değilse dönüşümler işaret genişletir.

## _Bool / bool

C99 `_Bool`; C23 ve `<stdbool.h>` ile `bool`, `true`, `false`.
Her sıfır dışı değer `true`’ya dönüşür: `(_Bool)0.5 == 1`.

## enum

```c
enum Renk { KIRMIZI, YESIL = 5, MAVI }; /* MAVI == 6 */
```

Enum sabitleri tamsayıdır; altta yatan tür C23 öncesi pratikte `int` ile uyumludur.
C23’te sabit tür belirtimi zenginleşir. **FFI’da boyut/işaret için açık `int32_t`
tercih edin** veya `enum` layout’unu belgelendirin.

## sizeof, _Alignof, hizalama

```c
#include <stdalign.h>
#include <stdio.h>

struct S { char c; int i; };

int main(void) {
    printf("sizeof(S)=%zu align=%zu\n", sizeof(struct S), alignof(struct S));
}
```

Hizalama: adresin `alignof(T)` katı olması. Yanlış hizalı `int` yüklemek bazı
CPU’larda trap, bazılarında yavaş veya (eski ARM) UB senaryolarına yol açar.

## Endianness

```c
#include <stdint.h>
#include <stdio.h>

int main(void) {
    uint32_t x = 0x01020304u;
    unsigned char *p = (unsigned char *)&x;
    printf("%02x %02x %02x %02x\n", p[0], p[1], p[2], p[3]);
}
```

Ağ protokolleri için host↔network dönüşümü veya açık bayt yazımı kullanın;
struct’ı diske `fwrite` ile yazmak taşınabilir format değildir.

## Tür dönüşümleri

1. **Integer promotion / usual arithmetic conversions** — ifade içinde türler yükselir.
2. İşaretli → işaretsiz: modulo $2^n$.
3. Floating → int: kesme; taşan değer UB.
4. Pointer ↔ integer: `uintptr_t` ile (C99); `int` ile saklamayın.

```c
unsigned u = 1;
int i = -2;
/* u + i → unsigned alanda hesap; sürpriz büyük sayı */
```

## Etkili tür (effective type) — önizleme

Dinamik bellekte “bu baytlar hangi tür?” sorusu **strict aliasing** kurallarını
besler. Ayrıntı: [restrict, const, aliasing](../02-bellek/aliasing.md).

## Alıştırmalar

1. Platformunuzda `sizeof` / `CHAR_BIT` / `sizeof(long)` / `sizeof(long double)` yazdırın.
2. `size_t n = 0; for (int i = n - 1; i >= 0; i--)` tuzağını açıklayın.
3. Bir `struct` için padding’i `offsetof` ile haritalayın.

## Kaynaklar

- [cppreference — Type](https://en.cppreference.com/w/c/language/type)
- `<stdint.h>`, `<limits.h>`, `<stdalign.h>`, `<inttypes.h>`
- CERT INT* kuralları (tamsayı güvenliği)
