# İş parçacıkları

C11 `<threads.h>` taşınabilir bir API sunar; ekosistemde **POSIX pthreads** daha
yaygındır. Ortak ders: paylaşılan veriye kilit/atomik olmadan yazmak **data race → UB**.

## C11 threads (özet)

```c
#include <threads.h>

int worker(void *arg) {
    /* ... */
    return 0;
}

thrd_t t;
thrd_create(&t, worker, NULL);
thrd_join(t, NULL);
```

Senkron: `mtx_t`, `cnd_t`. Destek derleyici/libc’ye bağlı (MSVC/glibc farklılıkları).

## pthreads (özet)

```c
pthread_t t;
pthread_create(&t, NULL, start, arg);
pthread_join(t, NULL);
pthread_mutex_lock(&m);
/* kritik */
pthread_mutex_unlock(&m);
```

## Yarış ve bellek modeli

C11 bellek modeli atomikler ve kilitlerle tanımlanır. “Önce yazdım, sonra okur”
sezgisini **happens-before** ilişkisi olmadan taşımayın.

## TLS

`_Thread_local` / `thread_local` — her thread’te ayrı kopya. Sızıntı: thread
çıkışında destructor yok (C; C++ farklı).

## Alıştırmalar

1. Paylaşılan sayaçta yarış üretin; TSan ile yakalayın.
2. Mutex ile düzeltin; sonra atomikle deneyin.
3. Producer/consumer kuyruğu (mutex + condition) yazın.

## Kaynaklar

- cppreference Thread support
- `man 7 pthreads`

## Yarıştan kaçınma kontrol listesi

1. Paylaşılan durum var mı?
2. Varsa kilit/atomik/`Send`+`Sync` doğru mu?
3. Kilit sırası deadlock üretiyor mu?
4. TSan / loom (Rust) çalıştı mı?

“Önce yazdım sonra okur” sezgisi **happens-before** olmadan geçersizdir.


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
