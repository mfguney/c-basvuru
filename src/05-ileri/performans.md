# Performans

Önce doğruluk ve ölçüm; sonra mikro optimizasyon. UB’ye dayanan “hız”
optimizasyon seviyesinde buharlaşır.

## Ölçüm

- `perf`, VTune, Instruments, Windows ETW
- Mikrobenchmark: ısınma, pin thread, istatistik (medyan)
- `-O2` / LTO ile ölçün; `-O0` yanıltır

## Yerellik

- Cache line (~64B): ardışık erişim iyi; rastgele kötü
- **False sharing:** iki thread komşu atomikleri ezer → line ping-pong
- `alignas(64)` ile ayırma

## Dallanma ve vektörizasyon

- Tahmin edilebilir dallar ucuz; rastgele pahalı
- Derleyici otomatik vektörizasyon; `-fopt-info` / Godbolt
- Hot loop’ta bağımlılık zincirlerini kısaltın

## Bellek tahsisi

- Sık `malloc` → arena / pool
- `realloc` amortize büyüme (×2)
- Büyük nesnelerde `mmap` / huge pages (ileri)

## Kontrol listesi

1. Algoritma karmaşıklığı
2. Profil (sıcak nokta)
3. Yerellik
4. Tahsis azaltma
5. SIMD / paralellik

## Kaynaklar

- Agner Fog optimization manuals
- CPU vendor optimization guides

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
