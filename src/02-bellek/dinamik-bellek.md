# Dinamik bellek

Bu bölüm `malloc` ailesinin sözleşmelerini, `realloc` tuzaklarını, hata yollarını
ve savunmacı kalıpları derinlemesine ele alır. Animasyonlar use-after-free ve
kapasite büyümesini adım adır gösterir.

## API sözleşmeleri

```c
#include <stdlib.h>

void *malloc(size_t size);
void *calloc(size_t nmemb, size_t size);
void *realloc(void *ptr, size_t size);
void  free(void *ptr);
```

| İşlev | Sıfırlama | Not |
|--------|-----------|-----|
| `malloc(n)` | hayır | `n==0` uygulama tanımlı (NULL veya unique pointer) |
| `calloc(c,s)` | evet (sıfır) | taşma: `c*s` sığmazsa başarısızlık / güvenlik riski |
| `realloc(p,n)` | kısmen | **adres değişebilir**; başarısızsa `p` hâlâ geçerli |
| `free(p)` | — | `p==NULL` no-op; yabancı pointer → UB |

Hizalama: `malloc` sonucu temel türler için uygun hizalıdır; over-aligned türler
için C11 `aligned_alloc` (veya platform API’leri).

## realloc doğru kullanımı

```c
int *p = malloc(4 * sizeof *p);
if (!p) return -1;

int *np = realloc(p, 8 * sizeof *p);
if (!np) {
    /* p hâlâ geçerli! */
    free(p);
    return -1;
}
p = np; /* yalnızca başarıda */
```

Yanlış:

```c
p = realloc(p, new_size); /* başarısızsa eski p sızdı + NULL yazıldı */
```

## Animasyon: kapasite büyümesi

<div class="step-anim" data-step-anim>
  <p class="step-anim__title">realloc ile kapasite artışı</p>
  <div class="step-anim__viewport">
    <div class="step-anim__frame" data-caption="Kapasite dolu: yeni eleman için yer yok.">
      <img src="../animations/realloc/frame1.svg" alt="cap dolu" />
    </div>
    <div class="step-anim__frame" data-caption="realloc yeni blok ayırıp kopyalayabilir; eski işaretçi geçersiz olabilir.">
      <img src="../animations/realloc/frame2.svg" alt="realloc kopya" />
    </div>
  </div>
</div>

Eski `p`’ye ait **iç işaretçiler / dilimler** büyümeden sonra geçersizdir. Bu,
Rust’ta `Vec` büyürken referansların invalid olmasıyla aynı sınıftır; C’de
derleyici sizi durdurmaz.

## Dinamik dizi kalıbı (tam örnek)

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    size_t len;
    size_t cap;
} IntBuf;

void ib_init(IntBuf *b) {
    b->data = NULL;
    b->len = b->cap = 0;
}

void ib_free(IntBuf *b) {
    free(b->data);
    ib_init(b);
}

int ib_reserve(IntBuf *b, size_t need) {
    if (need <= b->cap) return 0;
    size_t ncap = b->cap ? b->cap : 4;
    while (ncap < need) {
        if (ncap > (SIZE_MAX / 2 / sizeof(int))) return -1;
        ncap *= 2;
    }
    int *nd = realloc(b->data, ncap * sizeof *nd);
    if (!nd) return -1;
    b->data = nd;
    b->cap = ncap;
    return 0;
}

int ib_push(IntBuf *b, int v) {
    if (ib_reserve(b, b->len + 1) != 0) return -1;
    b->data[b->len++] = v;
    return 0;
}
```

`examples/intbuf.c` benzer bir sürümdür.

## Use-after-free

<div class="step-anim" data-step-anim>
  <p class="step-anim__title">Use-after-free zaman çizelgesi</p>
  <div class="step-anim__viewport">
    <div class="step-anim__frame" data-caption="Tahsis: s geçerli bir C dizesine işaret eder.">
      <img src="../animations/dangling/frame1.svg" alt="tahsis" />
    </div>
    <div class="step-anim__frame" data-caption="free(s): bellek geri verildi; s hâlâ eski adresi tutuyor.">
      <img src="../animations/dangling/frame2.svg" alt="free" />
    </div>
    <div class="step-anim__frame" data-caption="s üzerinden okuma/yazma tanımsız davranıştır.">
      <img src="../animations/dangling/frame3.svg" alt="UAF" />
    </div>
  </div>
</div>

```c
char *s = malloc(16);
if (!s) return;
free(s);
/* printf("%s", s); */ /* UB */
s = NULL;
```

UAF’nin “çalışır görünmesi”: blok henüz başka tahsise verilmemiş olabilir.
ASan/Valgrind olmadan güvenmeyin.

## Double-free ve allocator bozulması

```c
free(p);
free(p); /* UB */
```

Belirtiler: rastgele çökme, daha sonraki `malloc`’ta abort, güvenlik açığı
(heap overflow ile birleşince).

## Taşma ve calloc

```c
size_t n = huge, m = huge;
/* n * m taşabilir */
void *p = calloc(n, m); /* kaliteli libc taşmayı yakalar; yine de bilin */
```

Elle:

```c
if (m && n > SIZE_MAX / m) return NULL;
void *p = malloc(n * m);
```

## Özel allocator’lar / arena

Kısa ömürlü çok tahsis: arena / bump allocator — tek `free` ile toplu iade.
Oyun ve derleyici geçişlerinde yaygındır. Sözleşme: arena’dan gelen işaretçileri
arena öldükten sonra kullanma.

## Araçlar

```bash
cc -g -O1 -fsanitize=address,undefined -o t t.c
./t
```

- ASan: UAF, double-free, çoğu taşma
- Valgrind `memcheck`: leak + geçersiz erişim (yavaş)
- `MALLOC_CHECK_` / Windows CRT debug heap

## Sık tuzaklar

1. `realloc` sonucunu aynı değişkene yazmak.
2. `sizeof(pointer)` ile `malloc` (yanlış boyut).
3. `malloc(sizeof(Foo))` yerine `malloc(sizeof *p)` tercih edin (tür değişince güvenli).
4. Başarı yolunda `free`, hata yolunda unutmak → leak.

## Alıştırmalar

1. `ib_push` için birim test + ASan CI komutu yazın.
2. Bilerek UAF üretip ASan raporunu okuyun.
3. `calloc` taşma senaryosunu (mümkünse) güvenli kontrol ile engelleyin.

## Kaynaklar

- [cppreference — Memory](https://en.cppreference.com/w/c/memory)
- CERT MEM30-C, MEM34-C, MEM07-C
- `man 3 malloc` / `man 3 realloc`
