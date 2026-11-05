# Operatörler ve sıra noktaları

Operatör önceliği ezberinden çok, **yan etki (side effect)** ve **değer hesaplama
sırası** C’de kritiktir. Yanlış sıra → tanımsız davranış; “derleyicide çalıştı”
güven vermez.

## Öncelik ve birleşme (özet hatırlatma)

Yüksekten düşüğe kabaca: sonek (`[]` `()` `.` `->`), tekil (`* & ! ~ ++ --`),
çarpma, toplama, kaydırma, ilişkisel, eşitlik, bit AND/XOR/OR, mantıksal AND/OR,
koşul `?:`, atama, virgül.

Şüphede **parantez** kullanın. `*p++` = `*(p++)`, `sizeof *p` = `sizeof(*p)`.

## Lvalue ve atama

Atamanın solu **modifiable lvalue** olmalıdır. `const` nesne, dizi ifadesi,
işlev — atama almaz.

```c
int a[3];
/* a = ...; */      /* hatalı */
int *p = a;         /* tamam: a dizi→işaretçi dönüşümü */
```

## Artırma / eksiltme

```c
int i = 0;
int x = i++;  /* x=0, sonra i=1 */
int y = ++i;  /* önce i=2, y=2 */
```

Aynı skaler nesneye, sıralama ilişkisi olmadan birden fazla yan etki → **UB**:

```c
i = i++;           /* UB */
a[i++] = i;        /* UB */
f(i++, i++);       /* UB — argüman sırası da belirtilmemiş */
```

Güvenli yazım:

```c
a[i] = i;
i++;
```

## Sequenced-before (C11 modeli)

C11, eski “sequence point” dilini **sequenced-before** kısmi sıralamasıyla
yeniden ifade eder. Özet pratik kurallar:

- `A && B`, `A || B`, `A ? B : C`, `,` (virgül operatörü): soldan sağa sıralı.
- Atama: sağ tarafın değeri, atamadan önce hesaplanır; ama `i = i++` hâlâ UB’dir
  (aynı nesneye iki yan etki).
- İşlev çağrısında gövde, argümanların hesaplanmasından **sonra** sıralanır; ama
  argümanlar **kendi aralarında** sırasız olabilir.

Virgül **operatörü** ile fonksiyon argüman listesindeki virgül farklıdır:

```c
f(a, b);     /* argüman sırası unspecified */
x = (a, b);  /* virgül operatörü: a sonra b */
```

## Mantıksal kısa devre

```c
if (p && p->x > 0) { /* p null ise p->x değerlendirilmez */ }
```

`&` / `|` bit düzeyidir; kısa devre yapmaz. Boolean için `&&` `||` kullanın.

## Bit işlemleri

İşaretli tamsayılarda sağa kaydırma **uygulama tanımlı** olabilir (aritmetik vs
mantıksal). Taşınabilir bit manipülasyonu için `unsigned` türler tercih edin.

```c
uint32_t f = 1u << n;  /* n >= 32 ise UB (genişliğe bağlı) */
```

Kaydırma miktarı ≥ genişlik → UB.

## İşaretçi aritmetiği

`p + k` yalnızca aynı dizi (veya bir past-the-end) içinde tanımlıdır.
Farklı nesnelere işaret eden işaretçileri karşılaştırmak / çıkarmak → UB
(genel kural; bazı boşluklar var).

```c
int a[10];
int *p = a + 10;   /* past-the-end: tutulabilir, yazılamaz */
int *q = a + 11;   /* UB */
```

## sizeof ve _Alignof

`sizeof` çoğu zaman derleme zamanı; VLA’da çalışma zamanı. `sizeof` ifadesinin
yan etkisi **değerlendirilmez** (VLA türü boyutu hariç incelikleri vardır):

```c
int i = 0;
sizeof(i++);  /* i hâlâ 0 */
```

## Sık tuzaklar

1. Makroda `MAX(i++, j)` → yan etki iki kez.
2. `x | y == 0` → `(x | y) == 0` değil; öncelik.
3. `1 << 31` işaretli `int` üzerinde UB (işaret biti).
4. `float` için bit operatörleri yok; `memcpy` ile type punning.

## Alıştırmalar

1. Aşağıdakilerden hangileri UB? Neden?
   `i = ++i`, `f(++i, ++i)`, `v[i] = i++`.
2. `uint32_t` ile güvenli “en yüksek 1 biti bul” ifadesi yazın.
3. `p && *p` ile `*p && p` farkını açıklayın.

## Kaynaklar

- [cppreference — Order of evaluation](https://en.cppreference.com/w/c/language/eval_order)
- [Operator precedence](https://en.cppreference.com/w/c/language/operator_precedence)
- CERT EXP* kuralları
