# restrict, const, aliasing

Optimizasyon ile doğruluk arasındaki ince çizgi burada geçer. Derleyiciye
verdiğiniz sözler (`const`, `restrict`, tür üzerinden erişim) yanlışsa sonuç
**UB** olur — “debug’da çalışıp release’de kırılma”nın klasik nedeni.

## const doğruluğu

```c
void f(const int *p) {
    /* *p = 1; */          /* derleme hatası */
    int *q = (int *)p;     /* const cast */
    *q = 1;                /* nesne gerçekten const ise UB */
}
```

- `const T *` = bu işaretçi yoluyla yazma yok (başka yolla yazılabilir).
- Gerçek `const` nesneye yazmak UB’dir.
- API’de `const` hem dokümantasyon hem derleyici denetimidir; cast ile delmeyin.

`char *strstr(const char *, const char *)` tarihsel olarak `char *` döndürür —
C const-correctness mirası; C++ overload’ları düzeltir.

## restrict (C99)

```c
void add(size_t n, double *restrict out,
         const double *restrict a,
         const double *restrict b) {
    for (size_t i = 0; i < n; i++)
        out[i] = a[i] + b[i];
}
```

Anlam: `out`, `a`, `b`’nin gösterdiği nesneler **örtüşmez**. Örtüşürse (ör.
`add(n, x+1, x, y)`) → UB; derleyici vektörizasyon yapmış olabilir.

`memcpy` vs `memmove`: `memcpy` örtüşmez varsayar; örtüşmede `memmove`.

## Strict aliasing (etkili tür)

Kabaca: bir nesneye, onun **etkili türüyle** uyumsuz bir lvalue ile erişmek UB’dir.
İstisna: karakter türleri (`char`, `signed char`, `unsigned char`) herhangi bir
nesnenin baytlarını inceleyebilir.

Yanlış tip punning:

```c
float f = 1.0f;
int i = *(int *)&f; /* sık UB — yapmayın */
```

Doğru yollar:

```c
#include <string.h>
float f = 1.0f;
int i;
memcpy(&i, &f, sizeof i); /* tanımlı */

union { float f; int i; } u; /* C'de union punning — incelikli; C99+ tartışmalı alan */
u.f = 1.0f;
int j = u.i; /* birçok derleyicide beklenen; taşınabilirlikte memcpy tercih */
```

## Effective type ve malloc

`malloc` belleğinin etkili türü, ilk yazılan türe göre şekillenir. Sonra başka
türle okumak kurallara takılır. Bayt kopyası / `memcpy` güvenli kalıptır.

## Pratik kurallar

1. Tamponları `unsigned char *` veya `void *` + `memcpy` ile taşıyın.
2. `restrict` yalnızca gerçekten örtüşme yoksa.
3. Ağ paketleri / dosya formatları için packed struct + doğrudan cast yerine
   alan alan `memcpy`.
4. `-fno-strict-aliasing` bir yara bandıdır; kök tasarımı düzeltin.

## Alıştırmalar

1. `float` ↔ `uint32_t` bitlerini `memcpy` ile yazdırın.
2. Örtüşen `restrict` örneği uydurup `-O3` altında ne olduğunu ASan/UBSan ile deneyin.
3. `const` parametreli API’de cast’i kaldıracak yeniden tasarım yapın.

## Kaynaklar

- CERT EXP39-C, EXP05-C
- [cppreference — Type-based alias analysis notes](https://en.cppreference.com/w/c/language/object#Strict_aliasing)
- C99 `restrict` gerekçeleri (WG14)
