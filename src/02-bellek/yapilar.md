# Yapılar, birleşimler, bit alanları

Toplu veri modelinin üç aracı: `struct` (yan yana), `union` (üst üste),
bit alanları (alan içinde bit). Layout, padding ve ABI FFI’nin kalbidir.

## struct

```c
struct Nokta {
    int x;
    int y;
};

struct Nokta p = { .x = 1, .y = 2 }; /* C99 designated */
```

Üyeler bildirim sırasında artan ofsetlerle yerleşir; araya **padding** girebilir.
`sizeof(struct Nokta)` ≥ üyelerin toplamı; sonda da trailing padding olabilir.

```c
#include <stddef.h>
#include <stdio.h>
struct T { char c; int i; };
printf("%zu %zu\n", offsetof(struct T, i), sizeof(struct T));
```

### Esnek dizi üyesi (C99)

```c
struct Buf {
    size_t len;
    unsigned char data[]; /* son üye */
};

struct Buf *b = malloc(sizeof *b + n);
b->len = n;
```

`sizeof(struct Buf)` `data`’yı saymaz (veya 0). Esnek üye yalnız sonda olur.

### Anonim struct / üye (C11)

```c
struct Packet {
    struct { int x, y; }; /* anonim */
};
```

## union

```c
union Sayı {
    int i;
    float f;
    unsigned char bytes[4];
};
```

Depolama: en büyük üye (+ hizalama). **Aktif üye** kuralı: son yazılan üyeden
okumak C’de tip punning için yaygın pratiktir; taşınabilirlikte `memcpy` daha nettir.

Etiketli birleşim (Rust enum benzeri):

```c
struct Deger {
    enum { INT, FLOAT } tag;
    union { int i; float f; } u;
};
```

## Bit alanları

```c
struct Flags {
    unsigned ready : 1;
    unsigned error : 1;
    unsigned code  : 6;
};
```

- Düzen (hangi bayt, endian, işaret) **uygulama tanımlı**.
- Adresi alınamaz (`&flags.ready` yok).
- FFI / ağ / dosya formatında **riskli**; açık `uint8_t` maskeleri tercih edin.

```c
#define READY (1u << 0)
#define ERROR (1u << 1)
uint8_t flags = 0;
flags |= READY;
```

## Opaque struct

API’de tamamlanmamış tür:

```c
/* foo.h */
struct Foo;
struct Foo *foo_create(void);
void foo_destroy(struct Foo *);
```

Tanım yalnızca `.c` içinde → ABI saklama, kapsülleme.

## Sık tuzaklar

1. Padding’li struct’ı `memcmp` / hash ile karşılaştırmak (padding çöp içerebilir).
2. Packed attribute sonrası hizasız `int` yüklemek.
3. Bit field’ı protokol wire format sanmak.

## Alıştırmalar

1. `offsetof` ile bir struct haritası çıkarın.
2. Esnek dizili `Buf` için `create/destroy` yazın.
3. Tag+union `Deger` için `print` işlevi yazın.

## Kaynaklar

- cppreference — Struct / Union / Bit fields
- CERT EXP11-C, DCL39-C
