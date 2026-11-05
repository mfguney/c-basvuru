# Kontrol akışı ve goto

Kontrol akışı “kolay” görünür; C’de asıl riskler: `switch` içinde bildirim,
fall-through, çapraz `goto` ile başlatmayı atlama ve kaynak temizliği.

## if / else

```c
if (err)
    return -1;
else if (warn)
    log_warn();
else
    ok();
```

Atama ile karşılaştırma karışıklığı:

```c
if (x = 0) { }    /* çoğu zaman hata; -Wall uyarır */
if (x == 0) { }
if (0 == x) { }   /* Yoda — tartışmalı stil */
```

## switch

```c
switch (code) {
case 0:
    handle0();
    break;
case 1:
case 2:           /* fall-through bilinçli */
    handle12();
    break;
default:
    handle_other();
}
```

Fall-through’u yorumla veya C23/attribute ile işaretleyin (`[[fallthrough]]`
destekliyorsa). `break` unutmak klasik bug’tır.

### switch ve bildirimler

```c
switch (n) {
case 1:
    int x = 1;   /* C23 öncesi: etiket sonrası bildirim sorunlu olabilir */
    break;
}
```

Taşınabilir kalıp: `case` altında süslü parantez açın veya tüm bildirimleri üstte toplayın.

```c
switch (n) {
case 1: {
    int x = 1;
    use(x);
    break;
}
}
```

Enum `switch`’lerinde `default` veya tüm alternatifleri kapsayın; `-Wswitch` faydalıdır.

## Döngüler

```c
for (size_t i = 0; i < n; i++) { }
while (cond) { }
do { } while (cond);
```

`for (;;)` sonsuz döngü. `break` / `continue` yalnızca en iç döngüyü etkiler;
çoklu düzey için bayrak veya `goto` (nadiren).

### size_t geri sayım tuzağı

```c
for (size_t i = n - 1; i >= 0; i--) { /* i işaretsiz: i>=0 hep doğru → sonsuz */ }
```

Doğru kalıplar:

```c
for (size_t i = n; i-- > 0; ) { use(buf[i]); }
```

## goto

ISO C `goto`’ya izin verir; modern stil onu **dar** tutar.

### Meşru kalıp: ortak temizlik

```c
int copy_file(const char *src, const char *dst) {
    FILE *in = NULL, *out = NULL;
    char *buf = NULL;
    int rc = -1;

    in = fopen(src, "rb");
    if (!in) goto cleanup;
    out = fopen(dst, "wb");
    if (!out) goto cleanup;
    buf = malloc(1 << 16);
    if (!buf) goto cleanup;

    /* ... kopyala ... */
    rc = 0;

cleanup:
    free(buf);
    if (out) fclose(out);
    if (in) fclose(in);
    return rc;
}
```

### Yasak / tehlikeli

- Başlatılmamış değişkenin kapsamına **aşağıdan yukarı** zıplayıp okumak.
- Başka işleve `goto` (yok).
- Spaghetti akış: okunabilirliği öldürür; hata ayıklamayı zorlaştırır.

C++’ta destructor’lar nedeniyle `goto` daha da riskli; saf C’de cleanup kalıbı
hâlâ yaygındır. Rust’a geçişte bu kalıp **Drop/RAII** olur
([geçiş rehberi](https://github.com/mfguney/c-rust-gecis)).

## setjmp / longjmp (kısa not)

`setjmp`/`longjmp` “uzun goto”dur; yerel nesnelerin `volatile` olması gerekebilir,
açık kaynaklar `atexit` gibi çalışmaz. Sinyal/hata modelinde dikkat; yeni tasarımda
tercihen `Result`-benzeri hata kodları.

## Alıştırmalar

1. Fall-through’lu bir `switch` yazıp bilinçli yorum ekleyin.
2. Yukarıdaki `copy_file` iskeletini gerçek `fread`/`fwrite` ile doldurun.
3. `size_t` geri sayım sonsuz döngüsünü gözlemleyin (küçük `n` ile).

## Kaynaklar

- cppreference — Statements
- CERT MSC20-C (goto)
- Linux kernel: gotos-for-cleanup stili tartışmaları
