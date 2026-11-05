# Değişkenler, kapsam, depolama

Bir ismin **ne anlama geldiği** (kapsam), **nerede yaşadığı** (depolama süresi) ve
**başka birimlerin görüp görmediği** (bağlama) C’de üç ayrı eksendir. Karıştırmak
“neden bu değişken sıfır?”, “neden bağlama hatası?” sınıfı bug’ların kaynağıdır.

## Kapsam (scope)

### Blok kapsamı

```c
void f(void) {
    int x = 1;
    {
        int x = 2;   /* gölgeleme (shadowing) */
        /* burada x == 2 */
    }
    /* tekrar x == 1 */
}
```

`for (int i = 0; ...)` içindeki `i` (C99+) yalnızca döngü kapsamındadır.

### Dosya kapsamı

Dosyanın en dışındaki bildirimler **dosya kapsamındadır**. `static` ise **iç
bağlamalı**; değilse **dış bağlamalı** (başka birimler `extern` ile görebilir).

### İşlev prototip kapsamı

```c
void g(int n, int a[n]); /* n parametre listesinde görünür (VLA parametre) */
```

## Depolama süreleri (storage duration)

| Süre | Nasıl oluşur? | Ömür | İlk değer |
|------|----------------|------|-----------|
| automatic | blok içi yerel (varsayılan) | blok çıkışına kadar | belirsiz (başlatılmazsa) |
| static | `static` veya dosya düzeyi | program ömrü | sıfır / sabit ifade |
| thread | `_Thread_local` / `thread_local` | iş parçacığı ömrü | benzer static kurallar |
| allocated | `malloc` ailesi | `free`’e kadar | `malloc` belirsiz, `calloc` sıfır |

### Otomatik: yığın çerçevesi

```c
int *dangling(void) {
    int x = 42;
    return &x; /* UB: x'in ömrü bitti */
}
```

Büyük otomatik diziler yığını patlatabilir (`int huge[10'000'000];`). Büyük
tamponlar için heap veya `static` (dikkat: yeniden giriş) kullanın.

### Static yerel

```c
int sayac(void) {
    static int n = 0; /* bir kez başlatılır */
    return ++n;
}
```

Çağrılar arasında değer korunur. Çok iş parçacıklı ortamda yarış vardır;
atomik veya kilit gerekir.

### Extern ve tanım

```c
/* a.h */
extern int paylas;

/* a.c */
int paylas = 1;   /* tanım */

/* b.c */
#include "a.h"
/* paylas kullan */
```

Başlıkta `int paylas;` (tanım) yazmak → çoklu tanım. Tentative definition
kuralları karmaşıktır; pratikte **tek .c’de tanım, başlıkta extern**.

## Bağlama (linkage)

| Bağlama | Anlam |
|---------|--------|
| external | tüm programda aynı nesne/işlev |
| internal (`static` dosya düzeyi) | yalnızca bu çeviri birimi |
| none | yerel otomatik / bazı parametreler |

`inline` işlevlerin bağlama/tanım kuralları (C99) ayrıntılıdır: başlıkta
`inline` tanım + bir `.c`’de `extern inline` veya non-inline tanım kalıbı yaygındır.

## register (tarihsel)

`register int x;` derleyiciye “register’da tut” ipucuydu; adresi alınamazdı.
Modern derleyiciler yok sayabilir; yeni kodda kullanmayın.

## Başlatma

```c
int a;          /* static süre: 0; automatic: belirsiz */
int b = 3;
int c[4] = {1, 2};      /* kalan 0 */
int d[4] = {0};           /* hepsi 0 */
struct { int x, y; } s = { .y = 2 }; /* C99 designated */
```

Belirsiz otomatik değişken okumak → UB (pratikte çöp / sanitizer uyarısı).

## Qualifier’lar (önizleme)

`const`, `volatile`, `restrict`, `_Atomic` — depolama süresinden bağımsız
**niteliklerdir**. Ayrıntı bellek ve atomik bölümlerinde.

## Sık tuzaklar

1. Başlatılmamış otomatik okumak.
2. Static yereli thread-safe sanmak.
3. Dosyalar arası static init sırasına güvenmek.
4. `size_t` döngüde `int i = n - 1` ile geri sayım.

## Alıştırmalar

1. Shadowing örneğini derleyip `-Wshadow` ile görün.
2. `static` sayaçlı işlevi iki thread’den çağırıp yarışı ASan/TSan ile deneyin.
3. Tentative definition: iki `.c`’de `int x;` bırakıp bağlayıcı davranışını görün.

## Kaynaklar

- [cppreference — Storage duration / Linkage / Scope](https://en.cppreference.com/w/c/language/storage_duration)
- CERT DCL* kuralları
