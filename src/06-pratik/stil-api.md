# Stil ve API tasarımı

İyi C API’si sıkıcıdır: öngörülebilir isimler, net ownership, az sürpriz.

## İsimlendirme

- `mod_action` öneki: `buf_create`, `buf_push`, `buf_destroy`
- Tipler: `typedef struct Buf Buf;` (opaque tercih)
- Makrolar: `BUF_` öneki; `min` gibi genel isimler yok

## Ownership sözleşmesi

Dokümante edin (başlık yorumu):

```c
/* Dönen işaretçi çağırana aittir; buf_destroy ile serbest. */
Buf *buf_create(void);
void buf_destroy(Buf *b); /* NULL kabul */
```

Borrow: “dönen işaretçi `b` yaşadığı sürece geçerli; free etmeyin”.

## Hata modeli

Tek tutarlı politika: `0` başarı / negatif hata **veya** `bool` + out-param.
Karıştırmayın. Kısmi başarıda nesneyi geçerli bırakın veya tamamen rollback.

## Başlık hijyeni

- Include guard
- Mümkün olduğunca az include; forward decl
- C++ kullanıcıları için `extern "C"` sarmalayıcı

```c
#ifdef __cplusplus
extern "C" {
#endif
/* API */
#ifdef __cplusplus
}
#endif
```

## Kaynaklar

- Linux kernel coding style (disiplin örneği)
- “C Interfaces and Implementations” (kitap — fikir)

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
