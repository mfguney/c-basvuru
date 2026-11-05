# C Başvuru Kitabı

Türkçe, başlangıçtan ileri seviyeye **C programlama başvurusu** (mdBook).
Örnekler adım animasyonlarıyla anlatılır. Metin CC BY-SA 4.0, örnek kod MIT.

## Kardeş kitaplar

- [rust-basvuru](https://github.com/mfguney/rust-basvuru) — Rust başvurusu
- [c-rust-gecis](https://github.com/mfguney/c-rust-gecis) — farklar ve geçiş

## Yerel önizleme

```bash
cargo install mdbook
mdbook serve
```

## GitHub Pages

Depo ayarlarında Pages kaynağı olarak **GitHub Actions** seçin.
`main`/`master` push sonrası workflow kitabı yayınlar.

`book.toml` içindeki `git-repository-url`, `site-url` ve bu README’deki
`example` kullanıcı adını kendi GitHub hesabınızla değiştirin.

## Lisans

- Metin: [LICENSE-CC-BY-SA](LICENSE-CC-BY-SA)
- Kod: [LICENSE-CODE](LICENSE-CODE)
