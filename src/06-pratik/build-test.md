# Build, test, sanitizer’lar

Kaliteli C projesi: uyarılar + test + sanitizer + CI. Bu bölüm pratik komut
satırını bir araya getirir.

## Önerilen geliştirme bayrakları

```bash
CFLAGS="-std=c17 -Wall -Wextra -Werror -g -O1 -fno-omit-frame-pointer"
CFLAGS="$CFLAGS -fsanitize=address,undefined"
```

Sürüm:

```bash
CFLAGS="-std=c17 -O2 -DNDEBUG -Wall -Wextra"
```

## Sanitizer’lar

| Araç | Yakar |
|------|-------|
| ASan | taşma, UAF, double-free |
| UBSan | yanlış kaydırma, yanlış hiza, işaretli taşma (seçenek) |
| MSan | başlatılmamış (Clang) |
| TSan | data race |

ASan+TSan birlikte bağlanmaz; ayrı job’lar.

## Test iskeleti

Basit assert:

```c
#include <assert.h>
#include <stdio.h>
static void test_add(void) {
    assert(add(2, 3) == 5);
}
int main(void) {
    test_add();
    puts("ok");
}
```

Büyüdükçe: CTest + CMake, Unity, Check, Criterion.

## CI iskeleti (özet)

1. `gcc -O2` test
2. `clang -O1 -fsanitize=address,undefined` test
3. (opsiyonel) clang-tidy

## Kaynaklar

- Clang Sanitizers
- CMake CTest

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
