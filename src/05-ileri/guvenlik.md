# Güvenlik temelleri

C bellek güvenliği sağlamaz; savunma **katmanlı**dır: doğru kod + derleyici
bayrakları + OS + denetim.

## Yaygın zafiyet sınıfları

| Sınıf | Mekanizma |
|-------|-----------|
| Buffer overflow | yığın/heap taşması → kontrol akışı |
| UAF | dangling → keyfi yazma |
| Integer overflow | küçük tampon hesabı |
| Format string | `printf(user)` |
| Command injection | `system` / kabuk |

## Mitigasyonler (kavram)

- **Stack canary** — yığın taşmasını tespit
- **ASLR** — adresleri rastgeleleştir
- **NX / DEP** — veri yürütme engeli
- **CFI / shadow stack** — dolaylı çağrı denetimi
- **Fortify / FORTIFY_SOURCE** — bazı libc çağrılarını sertleştir

Bunlar kök nedeni (sınır denetimi eksikliği) çözmez.

## Güvenli yazım alışkanlıkları

1. Her tamponla uzunluk taşıyın
2. `snprintf`, `strtol`, checked aritmetik
3. Kullanıcı girdisini komut/format olarak kullanmayın
4. ASan/UBSan CI
5. En az yetki; `system` yerine `execve` argüman dizisi

## Alıştırmalar

1. Bilinçli taşan demo’yu ASan ile yakalayın (yalnız lab).
2. `FORTIFY_SOURCE` ile derleyip uyarı/çökme farkını görün.
3. Integer overflow’lu `malloc(n * size)` kontrolü yazın.

## Kaynaklar

- CERT C
- OWASP (uygulama)
- “The Shellcoder’s Handbook” — yalnızca savunma/öğrenme bağlamı

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
