# Program yapısı ve main

Bu bölüm bir C programının **metinsel ve bağlama düzeyindeki** iskeletini kurar:
çeviri birimleri, başlıklar, `main`, argümanlar, çıkış kodları ve “program
başlamadan önce / bittikten sonra” ne olur.

## Çeviri birimi (translation unit)

Derleyiciye verilen tek bir `.c` dosyası, önişlemciden sonra bir **çeviri birimi**
oluşturur. `#include "foo.h"` satırı, `foo.h` içeriğinin **metin olarak** o noktaya
yapıştırılması demektir. Bu yüzden:

- Başlıklar **birden fazla kez** include edilirse (dolaylı yollarla) çift tanım hatası
  doğabilir → **include guard** veya `#pragma once`.
- Başlıkta **kod üretmeyen** şeyler olmalı: bildirimler, `static inline` işlevler,
  `typedef`, makrolar. `int x;` gibi **tanımlar** başlıkta ise her include eden
  birimde bir `x` oluşur (bağlama hatası / ODR benzeri sorun).

```c
/* foo.h */
#ifndef FOO_H
#define FOO_H

void foo(int n);          /* bildirim — tamam */
/* int g; */              /* tanım — başlıkta yapmayın */
extern int g;             /* bildirim — tamam; tanım bir .c'de */

#endif
```

```c
/* foo.c */
#include "foo.h"
int g = 0;                /* tek tanım */
void foo(int n) { g = n; }
```

## Bildirim vs tanım

| Kavram | Ne yapar? | Örnek |
|--------|-----------|--------|
| Bildirim | İsmi ve türü tanıtır | `int f(int);` / `extern int x;` |
| Tanım | Nesne/işlev için yer ayırır veya gövde verir | `int x = 1;` / `int f(int a) { return a; }` |

Bir işlev veya nesnenin **tek bir dış tanıma** ihtiyacı vardır (C’nin tek tanım
kuralına yakın pratik). `static` iç bağlamalı tanımlar her birimde ayrıdır.

## Programın giriş noktası: main

Standart biçimler:

```c
int main(void);
int main(int argc, char *argv[]);
```

Bazı POSIX ortamları üçüncü parametre kabul eder (`envp`); bu **ISO C zorunlu
değildir**. Windows’ta Unicode için `wmain` / `WinMain` ayrı modellerdir.

### Dönüş değeri

`main`’den dönen `int`, süreç **çıkış kodu** olur. Taşınabilirlik:

```c
#include <stdlib.h>
return EXIT_SUCCESS;  /* genelde 0 */
return EXIT_FAILURE;  /* sıfır dışı */
```

C99’dan itibaren `main` sonunda `return` yoksa `return 0;` ima edilir. Yine de
açık yazmak okunabilirliği artırır. `main` dışında ima yoktur.

### argc / argv sözleşmesi

- `argc >= 1` olması **gerekmez** diye varsaymayın; boş `argv` teorik olarak mümkün
  (nadir). Pratikte `argv[0]` program adı/yoludur; biçimi uygulama tanımlıdır.
- `argv[argc] == NULL` garanti edilir.
- `argv[i]` dizgileri değiştirilebilir; ama `argv` dizisinin kendisini genişletmek
  taşınabilir değildir.

```c
#include <stdio.h>

int main(int argc, char *argv[]) {
    for (int i = 0; i < argc; i++) {
        printf("argv[%d] = %s\n", i, argv[i]);
    }
    return 0;
}
```

## Başlamadan önce / bittikten sonra

- **Statik depolamalı** nesneler program başlangıcında sıfırlanır veya sabit
  ifadelerle başlatılır (sıra: çeviri birimi içinde bildirim sırası; birimler arası
  sıra belirtilmemiştir — **static initialization order** tuzakları).
- `atexit` / `at_quick_exit` ile çıkışta geri çağrılar kaydedilebilir.
- `abort` atexit listesini çalıştırmadan çıkar; `_Exit` da benzer şekilde hızlıdır.

```c
#include <stdio.h>
#include <stdlib.h>

static void veda(void) {
    puts("atexit");
}

int main(void) {
    atexit(veda);
    puts("main");
    return 0;
}
```

## Tek dosya vs çok dosya

Küçük örnekler tek `.c` ile yeter. Gerçek projede:

```text
include/   API başlıkları
src/       tanımlar
tests/
```

Bağımlılık yönü: üst seviye modüller alt detaylara bağımlı olmasın; başlıklar
mümkün olduğunca az `#include` çeksin (**ön deklarasyon** ile pointer türleri).

## Sık hatalar

1. Başlıkta `static` olmayan fonksiyon **tanımı** (inline hariç) → çoklu sembol.
2. `main`’i `void main` yazmak → standart dışı (gömülü hariç).
3. `argv`’yi `free` etmeye kalkmak → size ait değil.
4. Çıkış kodunu unutup kabuk/CI’nin başarı sandığı senaryolar.

## Alıştırmalar

1. İki çeviri birimli küçük bir program yazın (`util.h` / `util.c` / `main.c`).
2. Bilerek başlığa `int g;` koyup bağlama hatasını görün.
3. `atexit` ile iki geri çağrı kaydedip çağrı sırasını gözlemleyin (LIFO).

## Kaynaklar

- [cppreference — Main function](https://en.cppreference.com/w/c/language/main_function)
- [cppreference — Translation phases](https://en.cppreference.com/w/c/language/translation_phases)
- `man 3 atexit`
