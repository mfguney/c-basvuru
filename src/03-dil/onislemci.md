# Önişlemci ve _Generic

Önişlemci metin dönüştürür; tür bilmez, kapsam bilmez. Güçlüdür, tehlikelidir.
Modern C’de `inline`, `enum`, `static const` ile makroyu azaltın; kaldığında
hijyen kurallarına uyun.

## Include

```c
#include <stdio.h>   /* sistem */
#include "local.h"   /* proje */
```

Include guard:

```c
#ifndef UTIL_H
#define UTIL_H
/* ... */
#endif
```

`#pragma once` yaygın ama standart değildir; çoğu derleyici destekler.

## Makro hijyeni

```c
#define SQR(x) ((x) * (x))          /* parantez */
#define MAX(a,b) ((a) > (b) ? (a) : (b)) /* yan etki iki kez! */

/* daha iyi (GNU): */
#define MAX(a,b) __extension__({ \
    __typeof__(a) _a = (a); \
    __typeof__(b) _b = (b); \
    _a > _b ? _a : _b; \
})
```

Çok satırlı ifade makroları:

```c
#define CLEANUP() do { free(p); p = NULL; } while (0)
```

## Koşullu derleme

```c
#if defined(DEBUG) && DEBUG
  #define DBG(...) fprintf(stderr, __VA_ARGS__)
#else
  #define DBG(...) ((void)0)
#endif
```

`#error`, `#warning` (uzantı), `#line` — araç zinciri / üretim için.

## X-macro

```c
#define COLOR_LIST \
    X(KIRMIZI) \
    X(YESIL) \
    X(MAVI)

enum Color {
#define X(n) n,
    COLOR_LIST
#undef X
};

const char *color_name(enum Color c) {
    switch (c) {
#define X(n) case n: return #n;
    COLOR_LIST
#undef X
    }
    return "?";
}
```

Tek listeden enum + string + başka tablolar.

## _Generic (C11)

```c
#define typename(x) _Generic((x), \
    int: "int", \
    double: "double", \
    default: "other")
```

Basit aşırı yükleme benzeri `max` makroları yazılabilir. Sınır: C++ templates /
Rust generics kadar güçlü değil; tür kümesi açık listelenir.

## Sık tuzaklar

1. Makroda `++` yan etkisi.
2. Başlıkta `#define` kirliliği — `prefix_` kullanın.
3. `#define min` Windows başlıklarıyla çakışma.

## Alıştırmalar

1. Güvenli `MIN`/`MAX` yazın (yan etkisiz; uzantı veya inline).
2. X-macro ile opcode tablosu üretin.
3. `_Generic` ile `square` makro/işlev seçimi yapın.

## Kaynaklar

- cppreference — Preprocessor / Generic selection
