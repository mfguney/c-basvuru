# ABI ve çağrı sözleşmeleri

**ABI**, ikili düzeyde anlaşmadır: register’lar, yığın hizası, struct geçirme,
isimler, exception/personality (C’de sınırlı), syscalls. Kaynak uyumlu ama ABI
uyumsuz iki nesne dosyası → ince çökme.

## Ne ABI’ye girer?

- Çağrı sözleşmesi (calling convention)
- Veri layout (`int` boyutu, struct padding, enum)
- Sistem çağrı numaraları / vDSO
- Dinamik bağlama (ELF/Mach-O/PE)

## SysV AMD64 (özet)

- Tamsayı/pointer argümanlar: `rdi, rsi, rdx, rcx, r8, r9`
- Floating: `xmm0…`
- Dönüş: `rax` / `rdx:rax` / `xmm0`
- Yığın 16-byte hizalı (call öncesi)
- Red zone (128 bayt) — sinyal dikkatı

## Microsoft x64 (özet)

- İlk dört argüman: `rcx, rdx, r8, r9` (+ shadow space)
- Farklı floating/vararg kuralları
- Linux nesnesini Win’e link etmeyin

## C vs C++ / Rust

C sembolleri genelde süslenmez (`extern "C"`). Rust `extern "C"` + `#[repr(C)]`
ile SysV/MS ABI’ye uyum sağlar. Ayrıntı geçiş rehberinde.

## Pratik kontrol listesi

1. Aynı platform triple
2. Aynı struct packing
3. `sizeof`/`offsetof` testleri
4. Enum altında yatan tür

## Kaynaklar

- System V AMD64 ABI PDF
- Microsoft x64 calling convention docs

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
