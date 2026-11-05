# Fonksiyonlar ve va_list

İşlevler C’nin yapı taşlarıdır: türleri, işaretçileri, `inline` bağlama kuralları
ve değişken argüman listeleri (`stdarg.h`) bu bölümde.

## İşlev türü ve bildirim

```c
int add(int a, int b);           /* bildirim / prototip */
int add(int a, int b) { return a + b; } /* tanım */

/* eski K&R bildirimi — kullanmayın */
/* int add(); */
```

Prototipsiz çağrı (tarihsel) argüman dönüşümlerini yanlış yapardı. Her zaman
prototip kullanın; başlıkta bildirin.

## Parametre geçişi

C **değerle** geçer. Diziler/işlevler işaretçiye dönüşür; struct büyükse kopya
pahalıdır — işaretçi veya “out parametre” tercih edilir.

```c
void init_point(struct Point *out) {
    out->x = out->y = 0;
}
```

## static ve inline

```c
static int helper(int x) { return x + 1; } /* iç bağlama; birim özel */

/* başlıkta */
static inline int max_i(int a, int b) { return a > b ? a : b; }
```

C99 `inline`: birden çok birimde görünen tanım mümkün; bağlayıcıda tek “taşınır”
kopya için kurallar inceliklidir. Pratik kalıp:

- küçük işlevler: `static inline` başlıkta
- veya `inline` başlıkta + bir `.c`’de `extern inline` / normal tanım

## İşlev işaretçileri

```c
typedef int (*binop_t)(int, int);

int apply(binop_t op, int a, int b) {
    return op(a, b);
}
```

`qsort` / `bsearch` karşılaştırıcıları, state machine tabloları, eklenti API’leri.

## Değişken argümanlar

```c
#include <stdarg.h>
#include <stdio.h>

void logf(const char *fmt, ...) {
    va_list ap;
    va_start(ap, fmt);
    vfprintf(stderr, fmt, ap);
    va_end(ap);
}
```

Kurallar:

- En az bir sabit parametre (`fmt`) gerekir (`va_start` için).
- `va_arg(ap, type)` ile doğru türü siz söylemelisiniz — yanlış tür UB.
- `float` varsayılan argüman yükseltmesiyle `double` olur; `va_arg(..., float)` yanlış.
- `va_copy` (C99) ile liste kopyalanır.

Güvenlik: kullanıcı kontrollü format + `printf` benzeri → format string açığı.
`"%s"` ile dinamik format vermeyin.

## _Noreturn / noreturn

```c
#include <stdnoreturn.h>
noreturn void die(const char *msg);
```

Derleyiciye “dönmez” bilgisi; uyarı kalitesini artırır.

## Alıştırmalar

1. `binop_t` tablosuyla dört işlem hesap makinesi yazın.
2. `logf` benzeri işlevi `vsnprintf` ile tampona yazacak şekilde genişletin.
3. `static inline` ile başlık-only kütüphane yapın.

## Kaynaklar

- cppreference — Function declaration / Variadic
- CERT FIO30-C (format string)
