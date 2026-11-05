# UB, IB, belirtilmemiş davranış

Standart, her program durumuna bir semantik vermez. Üç sınıfı ayırmak, “bug mı
yoksa taşınabilirlik mi?” sorusunu netleştirir.

## Tanımlar

| Sınıf | İngilizce | Anlam | Örnek |
|-------|-----------|--------|--------|
| UB | undefined behavior | hiç garanti yok | UAF, işaretli taşma (klasik), null deref |
| IB | implementation-defined | derleyici belgeler, seçer | `char` işaretliliği, kaydırma işaretlisi |
| Unspecified | unspecified | geçerli seçeneklerden biri; belgelemek zorunda değil | argüman değerlendirme sırası |

UB ≠ “çökme”. UB: burn the nasal demons — optimize edici varsayımları kırar.

## Sık UB kategorileri

1. **Bellek:** UAF, double-free, taşma, hizasız (bazı modeller), wild pointer
2. **Tamsayı:** işaretli taşma; geçersiz kaydırma
3. **Aliasing:** strict aliasing ihlali
4. **Sıra:** `i = i++`
5. **Kütüphane:** yanlış `printf` formatı; `memcpy` örtüşmesi
6. **Data race:** C11’de yarışan çelişkili erişimler

## İşaretli taşma örneği

```c
int x = INT_MAX;
x = x + 1; /* UB — sarmalama varsaymayın */
```

İşaretsiz sarmalama tanımlıdır. Güvenlik-kritik sayaçlarda `unsigned` veya
açık taşma kontrolleri.

## Derleyici ve UB

```c
int f(int *p) {
    int x = *p;      /* p null ise UB — derleyici null olmadığını varsayabilir */
    if (!p) return 0;
    return x;
}
```

Null kontrolünün “yukarı alınması” gibi optimizasyonlar UB varsayımlarından gelir.

## Araçlar

- `-fsanitize=undefined`
- ASan / MSan
- SoftBound+Bound / yazım denetleyicileri
- Statik analiz (clang-tidy, Coverity…)

## Güvenli alt küme disiplini

CERT C, MISRA C gibi kılavuzlar UB’ye giden yapıları kısıtlar. Gömülü ve güvenlik
kritikte faydalıdır; her kuralı körü körüne uygulamayın ama bilerek sapın.

## Alıştırmalar

1. Aşağıdakileri sınıflandırın: UB / IB / unspecified.
2. UBSan ile işaretli taşma yakalayın.
3. `memcpy`/`memmove` örtüşme senaryosu yazın.

## Kaynaklar

- CERT C
- cppreference — Undefined behavior
- LLVM “What Every C Programmer Should Know About Undefined Behavior”

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
