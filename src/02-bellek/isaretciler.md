# İşaretçiler ve diziler

İşaretçi, C’nin hem gücünü hem tehlikesini taşıyan türdür: bir **adres** ve
(soyut makinede) o adresin işaret ettiği **tür** bilgisi. Bu bölüm bildirim
sözdizimini, dizi–işaretçi ilişkisini, aritmetiği, `void *` kurallarını ve
çok boyutlu düzeni ayrıntılı anlatır.

## Bildirimleri okumak

C bildirimleri “içten dışa” okunur:

```c
int *p;           /* p, int'e işaretçi */
int *p[10];       /* 10 elemanlı dizi; elemanlar int* */
int (*p)[10];     /* 10 int'lik diziye işaretçi */
int *f(void);     /* int* döndüren işlev */
int (*f)(void);   /* işlev işaretçisi; dönüş int */
char **argv;      /* char*'a işaretçi (argv tipi) */
```

`const` konumu:

```c
const int *p;     /* *p değişmez; p değişebilir */
int *const p;     /* p değişmez; *p değişebilir */
const int *const p;
```

## Null ve geçerlilik

`NULL` (veya C23 `nullptr`) hiçbir nesneye işaret etmez. Üzerinden `*` veya
indeks → **UB**. Başlatılmamış işaretçi de “wild”tur; önce `= NULL` veya geçerli adres.

```c
int *p = NULL;
if (p) {
    *p = 1; /* buraya girilmez */
}
```

## Dizi–işaretçi dönüşümü

Çoğu ifadede `T a[N]` → `&a[0]` türünde `T *` olur. **İstisnalar:** `sizeof`,
`&`, `_Alignof`, dizi başlatıcı.

```c
int a[5];
printf("%zu %zu\n", sizeof a, sizeof &a[0]); /* 5*sizeof(int) vs sizeof(int*) */
```

İşlev parametresinde dizi yazımı aslında işaretçidir:

```c
void f(int a[10]);   /* == void f(int *a);  10 bilgisi yok olur */
void g(int a[static 10]); /* C99: en az 10 eleman ipucu */
```

## İşaretçi aritmetiği

`p + k` bayt değil, **eleman** cinsinden ilerler: `p + 1` → sonraki `T`.

```c
int a[3] = {10, 20, 30};
int *p = a;
printf("%d\n", *(p + 2)); /* 30 */
```

Tanımlı olduğu yer: aynı dizi nesnesi veya bir past-the-end. Farklı nesneler
arasında çıkarma/karşılaştırma → UB (genel kural).

```c
int a[10];
int *end = a + 10;  /* OK tutmak */
/* *end = 1; */     /* UB yazmak */
```

## Çok boyutlu diziler

`int m[2][3]` satır-major: `m[0][0], m[0][1], m[0][2], m[1][0], ...`

```c
int m[2][3] = {{1,2,3},{4,5,6}};
int (*row)[3] = m;      /* satıra işaretçi */
int *flat = &m[0][0];   /* dikkat: strict layout varsayımı */
```

Dinamik 2B için iki yaygın yöntem:

1. **Tek blok:** `malloc(rows * cols * sizeof(T))` + `i*cols+j`
2. **İşaretçi tablosu:** `T **` + her satır ayrı `malloc` (daha çok tahsis, free zor)

## void *

`void *` herhangi bir nesne işaretçisine dönüşüp geri gelebilir (fonksiyon
işaretçisi hariç — o ayrı). C’de `void *` ↔ `T *` örtük dönüşür; C++’ta değil.

```c
void *generic = malloc(n);
int *p = generic; /* C'de OK */
```

`void *` üzerinde aritmetik **standart değildir** (GNU uzantısı bayt aritmetiği yapar).

## İşlev işaretçileri

```c
int add(int a, int b) { return a + b; }
int (*op)(int, int) = add;
int x = op(2, 3);
```

Tablo güdümlü dağıtım, geri çağrılar (`qsort` karşılaştırıcısı) için temel.

## Sık hatalar

1. `sizeof(p)` ile tampon boyutu sanmak (`sizeof *p` veya ayrı `len`).
2. `char buf[8]; char *p = buf + 8; *p = 0;` past-the-end yazmak.
3. `int *p = malloc(4);` — 4 bayt, 4 int değil.
4. Dizi döndürmeye çalışmak — işaretçi döndürülür; yerel dizi dangling.

## Alıştırmalar

1. `int (*p)[3]` ile satır satır gezin.
2. `qsort` için `int` karşılaştırıcı yazın.
3. Tek blok 2B matris `get/set` API’si tasarlayın.

## Kaynaklar

- [cppreference — Pointer](https://en.cppreference.com/w/c/language/pointer)
- [Array declaration](https://en.cppreference.com/w/c/language/array)
- CERT ARR* / EXP*
