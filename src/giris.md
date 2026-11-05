# Giriş

Bu kitap, **C programlama dilini** başlangıç düzeyinden sistem programlama ve
güvenlik bilincine kadar Türkçe anlatan kapsamlı bir başvurudur.

## Amaç

- Resmi standartların ve açık kaynak belgelerin bilgisini **özgün Türkçe**de derlemek
- Yalnızca sözdizimi değil: bellek modeli, UB, ABI, araçlar
- Kritik kavramları **adım animasyonlarıyla** somutlaştırmak

## Bu kitap ne değildir?

- ISO/IEC 9899 metninin birebir çevirisi değildir (telif).
- Tek derleyiciye özel bir kılavuz değildir; farklar **IB** olarak işaretlenir.
- “Kopyala-yapıştır snippet koleksiyonu” değildir; sözleşmeleri ve tuzakları yazar.

## Okuma yolları

| Hedef | Yol |
|-------|-----|
| Dil temeli | I → II |
| Güvenli bellek | II + III (UB) + VI (sanitizer) |
| Sistem | V |
| Rust’a geçiş | kardeş [c-rust-gecis](https://github.com/mfguney/c-rust-gecis) |

## Sözleşme

Örnekler aksi belirtilmedikçe **C17** odaklıdır; C23 notları ilgili yerlerdedir.
Örnek kod MIT; metin CC BY-SA 4.0.

## Animasyonlar

Bellek bölümlerinde `Adım 1/2/3` düğmeli diyagramlar vardır. Tarayıcıda GitHub
Pages veya `mdbook serve` ile açın.

## Kaynaklar

- [cppreference — C](https://en.cppreference.com/w/c)
- WG14 drafts
- Linux man-pages

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
