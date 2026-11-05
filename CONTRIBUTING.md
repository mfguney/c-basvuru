# Katkı Rehberi

Bu kitap özgün Türkçe anlatımdır. ISO C metnini birebir kopyalamayın;
açık kaynak ve resmi belgelerden derleyip kendi sözcüklerinizle yazın.

## Lisans

- Metin: CC BY-SA 4.0 (`LICENSE-CC-BY-SA`)
- Örnek kod: MIT (`LICENSE-CODE`)

## Bölüm yazma

1. `src/SUMMARY.md` içinde ilgili sayfayı bağlayın.
2. Terimleri `GLOSSARY.md` ile uyumlu kullanın (Türkçe + İngilizce parantez).
3. Tehlikeli bellek konularında mümkünse `animations/` altında adım diyagramı ekleyin.
4. Bölüm sonunda **Kaynaklar** listesi koyun (cppreference, man sayfaları, WG14 taslakları vb.).
5. Örnek kodları kısa ve derlenebilir tutun; tam projeler `examples/` altına.

## Animasyon

```html
<div class="step-anim" data-step-anim>
  <p class="step-anim__title">Konu</p>
  <div class="step-anim__viewport">
    <div class="step-anim__frame" data-caption="Adım açıklaması">
      <img src="animations/..." alt="..." />
    </div>
  </div>
</div>
```

## Yerel derleme

```bash
cargo install mdbook mdbook-mermaid
mdbook-mermaid install .
mdbook serve
```
