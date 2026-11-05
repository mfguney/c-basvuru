# Sözlük (C / ortak)

Üç kitapta senkron tutulur. Biçim: **Türkçe terim** — English (kısa açıklama).

| Türkçe | English | Not |
|--------|---------|-----|
| bellek yığını (yığın) | stack | Otomatik depolama; çerçeveler |
| öbek | heap | Dinamik tahsis (`malloc` vb.) |
| işaretçi | pointer | Adres tutan nesne |
| tanımsız davranış | undefined behavior (UB) | Standart garanti vermez |
| belirtilmemiş davranış | unspecified behavior | Geçerli seçenekler kümesi |
| uygulama tanımlı | implementation-defined | Belgelenmek zorunda |
| sıkı aliasing | strict aliasing | Tür üzerinden erişim kuralları |
| hizalama | alignment | Adresin katları |
| dolgu | padding | Struct içi boş baytlar |
| soyut makine | abstract machine | C semantik modeli |
| derleme birimi | translation unit | Tek `.c` + includes |
| bağlama | linkage | internal/external |
| depolama süresi | storage duration | automatic/static/thread/allocated |
| sıra noktası | sequence point / sequenced-before | C99/C11 değerlendirme sırası |
| sahiplik | ownership | (Rust; geçiş kitabında) |
| ödünç alma | borrowing | (Rust) |
| yaşam süresi | lifetime | (Rust) |
| yabancı işlev arayüzü | FFI | C ↔ Rust sınırı |

Kaynak kopyası: her depoda `GLOSSARY.md` ve `src/glossary.md` aynı tutulmalıdır.
