# Stack ve heap

C’de her nesnenin bir **ömrü** ve bir **yeri** vardır. Yer seçimi performansı,
güvenliği ve API sözleşmelerini belirler. Bu bölüm yığın (stack) ile öbek (heap)
arasındaki farkı, çerçeve modelini ve dangling işaretçi sınıfını ayrıntılı işler.

## Bellek bölgelerine bakış

Tipik kullanıcı süreci (şematik, OS’e göre değişir):

```text
  yüksek adres
  ┌─────────────┐
  │    stack    │  ↓ büyür (çok platformda)
  │      ↓      │
  │     ...     │
  │      ↑      │
  │    heap     │  ↑ büyür
  ├─────────────┤
  │     BSS     │  sıfır static
  │     data    │  başlatılmış static
  │     text    │  kod
  └─────────────┘
  düşük adres
```

Ayrıca: bellek eşlemeli dosyalar (`mmap`), paylaşılan kütüphaneler, TLS (thread
local storage). “Stack vs heap” ikiliği basitleştirmedir; ama doğru bir başlangıçtır.

## Stack: otomatik depolama

Fonksiyon çağrıldığında hedef ABI’ye göre bir **çağrı çerçevesi** oluşur:

- dönüş adresi
- kaydedilmiş register’lar
- yerel değişkenler / geçici değerler
- (bazen) varargs / alloca

Çerçeve fonksiyon dönünce geçersizdir. Bu yüzden:

```c
int *bad(void) {
    int x = 42;
    return &x; /* UB */
}

char *also_bad(void) {
    char buf[64];
    snprintf(buf, sizeof buf, "hi");
    return buf; /* UB */
}
```

### Örnek: güvenli dönüş

```c
#include <stdlib.h>
#include <string.h>

char *dup_msg(const char *s) {
    size_t n = strlen(s) + 1;
    char *p = malloc(n);
    if (!p) return NULL;
    memcpy(p, s, n);
    return p; /* çağıran free eder */
}
```

### Yığın boyutu

Varsayılan yığın birkaç MB olabilir (pthread’te `ulimit -s` / `pthread_attr_setstacksize`).
Derin özyineleme veya büyük `char buf[1<<20];` → **stack overflow** (genelde
sinyal / erişim ihlali). Büyük tamponlar: heap veya `static` (yeniden giriş?).

### VLA (C99)

```c
void f(size_t n) {
    int a[n]; /* yığında; n büyükse tehlikeli */
}
```

VLA boyutu çalışma zamanında bilinir; `sizeof a` runtime olabilir. Bazı güvenlik
kılavuzları VLA’yı yasaklar (kontrolsüz `n`).

## Heap: dinamik depolama

`malloc` / `calloc` / `realloc` / `free` — ayrıntılar bir sonraki bölümde.
Burada model:

- Ömür **sizin sözleşmenizle** biter (`free` veya özel allocator).
- Başarısızlık: `NULL` (veya C23/uygulama `malloc` davranışları).
- Fragmentasyon, allocator kilidi, false sharing — performans konuları.

## Animasyon: çerçeve ve malloc

<div class="step-anim" data-step-anim>
  <p class="step-anim__title">Stack çerçevesi ve malloc</p>
  <div class="step-anim__viewport">
    <div class="step-anim__frame" data-caption="Çağrı çerçevesinde yerel değişkenler tutulur; heap henüz kullanılmıyor olabilir.">
      <img src="../animations/stack-heap/frame1.svg" alt="Stack çerçevesi" />
    </div>
    <div class="step-anim__frame" data-caption="malloc öbekte blok ayırır; stack’teki işaretçi bloğu gösterir.">
      <img src="../animations/stack-heap/frame2.svg" alt="malloc sonrası" />
    </div>
    <div class="step-anim__frame" data-caption="free sonrası işaretçi hâlâ eski adresi tutabilir — dangling pointer.">
      <img src="../animations/stack-heap/frame3.svg" alt="free sonrası dangling" />
    </div>
  </div>
</div>

## Dangling, sızıntı, double-free (sınıflandırma)

| Hata | Tanım | Tipik sonuç |
|------|--------|-------------|
| dangling | ömrü bitmiş nesneye işaret | UAF → UB |
| leak | free edilmeyen heap | bellek şişmesi |
| double-free | aynı blok iki kez free | heap corruption / UB |
| wild pointer | başlatılmamış işaretçi | rastgele yazma |

Savunmacı alışkanlık:

```c
free(p);
p = NULL;
```

Bu double-free’yi her zaman önlemez (başka kopya işaretçi varsa) ama tek sahipli
kalıpta faydalıdır.

## Stack’ten heap’e “kaçış” analizi

Derleyici kaçış analiziyle (escape analysis) bazı heap tahsislerini yığına
indirebilir — bu bir optimizasyondur; dil semantiğini değiştirmez. Siz hâlâ
soyut makine kurallarına uymalısınız.

## Çok iş parçacığı

Her thread’in genelde **kendi yığını** vardır. Heap ortaktır; `malloc` genelde
thread-safe’tir ama sizin veri yapılarınız değil. Aynı satırda cache için
[performans](../05-ileri/performans.md) bölümüne bakın.

## Karşılaştırma tablosu

| | Stack | Heap |
|---|--------|------|
| Tahsis | otomatik, çok hızlı | fonksiyon çağrısı, daha yavaş |
| Ömür | kapsam | `free`’e kadar |
| Boyut | sınırlı | büyük (OS limiti) |
| Hata sınıfı | overflow, dangling ref | leak, UAF, double-free |
| Yeniden boyut | hayır (VLA hariç) | `realloc` |

## Rust ile zihinsel köprü

Rust’ta stack/heap ayrımı benzerdir; fark **sahiplik ve Drop** ile sızıntı/UAF’nin
safe kodda engellenmesidir. Bkz. geçiş rehberi “Bellek: free vs Drop”.

## Alıştırmalar

1. Bilerek dangling döndüren fonksiyon yazıp ASan ile yakalayın.
2. 8 MB otomatik dizi ile stack overflow’u gözlemleyin (dikkat).
3. `dup_msg` için karşılık gelen `free` sözleşmesini header yorumunda yazın.

## Kaynaklar

- C17 §6.2.4 Storage durations (kavramsal; metin kopyalanmaz)
- `man 3 malloc`
- [cppreference — Memory management](https://en.cppreference.com/w/c/memory)
- CERT MEM* kuralları
