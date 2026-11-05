# Toolchain ve derleme

C programı tek bir sihirli adımda “çalışır” hale gelmez. Kaynak metin, bir dizi
araçtan geçerek yürütülebilir (veya kütüphane) üretilir. Bu bölüm o boru hattını,
yaygın bayrakları ve taşınabilirlik tuzaklarını ayrıntılı anlatır.

## Derleme boru hattı

```text
  kaynak.c ──► önişlemci ──► derleyici ──► birleştirici ──► bağlayıcı ──► a.out / .exe
                 (.i)         (.s)          (.o/.obj)        (ld / link)
```

1. **Önişlemci (`cpp`)** — `#include`, `#define`, `#if` işlenir; çıktı hâlâ C metnidir.
2. **Derleyici** — soyut sözdizimi ağacı, tür denetimi, ara temsil (IR), optimizasyon,
   hedef mimari için assembly.
3. **Birleştirici (`as`)** — assembly → nesne dosyası (makine kodu + sembol tablosu +
   yer değiştirme kayıtları).
4. **Bağlayıcı (`ld` / `link.exe`)** — birden fazla `.o` ve kütüphaneyi birleştirir;
   dış sembolleri çözer; giriş noktasını ayarlar.

Tek komut (`cc hello.c -o hello`) bu adımları gizler. Öğrenmek için ara çıktıları
saklamak faydalıdır:

```bash
cc -std=c17 -E hello.c -o hello.i          # yalnızca önişlem
cc -std=c17 -S hello.c -o hello.s          # assembly
cc -std=c17 -c hello.c -o hello.o          # nesne
cc hello.o -o hello                        # bağlama
```

## Dil diyalekti ve standart seçimi

| Bayrak | Anlam |
|--------|--------|
| `-std=c11` / `-std=c17` / `-std=c23` | ISO diyalekti |
| `-std=gnu17` | C17 + GNU uzantıları |
| `-pedantic` / `-Wpedantic` | diyalekt dışını uyar |

MSVC: `/std:c17` (sürüm desteğine bakın). “C gibi görünen” ama GNU/`typeof`/
iç içe fonksiyon kullanan kod, başka derleyicide kırılır. Kitap örnekleri aksi
belirtilmedikçe **C17** varsayar.

`__STDC_VERSION__` makro ile sürümü denetleyebilirsiniz:

```c
#if __STDC_VERSION__ >= 201710L
/* C17+ */
#endif
```

## Uyarılar: bedava denetim

Önerilen taban satırı:

```bash
cc -std=c17 -Wall -Wextra -Wshadow -Wconversion -Wformat=2 -o prog prog.c
```

| Uyarı grubu | Ne yakalar? |
|-------------|-------------|
| `-Wall` | kullanılmayan, şüpheli dönüşümler, eksik `break`… |
| `-Wextra` | daha fazla; imzasız karşılaştırma vb. |
| `-Wshadow` | gölgeleme |
| `-Wconversion` | sessiz daraltıcı dönüşümler |
| `-Werror` | uyarıyı hata yap (CI için iyi) |

Uyarıyı “susturmak” yerine kök nedeni düzeltin. `#pragma` ile kapatmak son çaredir
ve gerekçesi yorumda yazılmalıdır.

## Optimizasyon seviyeleri

| Seviye | Tipik kullanım |
|--------|----------------|
| `-O0` | hata ayıklama; satır satır izlenebilir |
| `-Og` | debug + hafif opt (GCC/Clang) |
| `-O1` / `-O2` | sürüm; `-O2` yaygın varsayılan |
| `-O3` | daha agresif; bazen kod şişmesi |
| `-Os` / `-Oz` | boyut |
| `-Ofast` | strict IEEE/standart varsayımlarını gevşetir — dikkat |

UB, yüksek optimizasyonda “garip” davranışın ana kaynağıdır: `-O0`’da “çalışan”
kod `-O2`’de kırılabilir. Bu bir derleyici bug’ı değil; tanımsız davranışın
doğaıdır.

## Bağlama: static vs shared

```bash
cc -c a.c b.c
cc a.o b.o -o prog                 # yürütülebilir
cc -shared -fPIC lib.c -o libx.so  # paylaşılan (ELF)
ar rcs libx.a x.o y.o              # statik arşiv
cc main.o -L. -lx -o prog          # -lx → libx.a / libx.so
```

Windows’ta `.lib` / `.dll` modeli ve `__declspec(dllexport)` ayrıntıları farklıdır.
Sembol görünürlüğü (`-fvisibility=hidden`) büyük kütüphanelerde API yüzeyini daraltır.

## Make ile minimal proje

```makefile
CC = cc
CFLAGS = -std=c17 -Wall -Wextra -O2
OBJS = main.o util.o

prog: $(OBJS)
	$(CC) $(CFLAGS) -o $@ $(OBJS)

%.o: %.c
	$(CC) $(CFLAGS) -c -o $@ $<

clean:
	rm -f $(OBJS) prog
```

Bağımlılık üretimi: `cc -MM *.c` veya CMake.

## CMake iskeleti

```cmake
cmake_minimum_required(VERSION 3.16)
project(ornek C)
set(CMAKE_C_STANDARD 17)
set(CMAKE_C_STANDARD_REQUIRED ON)
add_executable(ornek main.c util.c)
target_compile_options(ornek PRIVATE -Wall -Wextra)
```

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
```

## Sanitizer’larla “ikinci toolchain”

Geliştirme derlemesi ile sürüm derlemesi ayrı tutun:

```bash
# geliştirme
cc -std=c17 -g -O1 -fsanitize=address,undefined -fno-omit-frame-pointer \
   -o prog_asan prog.c

# sürüm
cc -std=c17 -O2 -DNDEBUG -o prog prog.c
```

ASan ile bağlanan ikili, ASan runtime ister; üretime böyle göndermeyin.

## Sık tuzaklar

1. **Yalnızca `.c` derleyip başlığı unutmak** — prototip yoksa eski C örtük `int`
   kuralları (artık yok) veya yanlış varsayılanlar.
2. **C++ derleyicisiyle `.c` derlemek** — `void*` dönüşümleri, `restrict` vb. farklar.
3. **Farklı `-std` ile karışık nesneler** — nadiren ABI/layout farkı.
4. **Uyarıları görmezden gelmek** — özellikle `format` ve `uninitialized`.

## Alıştırmalar

1. Bir dosyayı `-E`, `-S`, `-c` ile derleyip ara çıktılara bakın.
2. Bilerek işaretsiz/işaretli karışımı yapıp `-Wconversion` çıktısını okuyun.
3. Aynı UB örneğini `-O0` ve `-O2` altında çalıştırıp farkı gözlemleyin (dikkat:
   UB’dir; öğrenme amaçlı).

## Kaynaklar

- GCC/Clang man: `man gcc`, `man clang`
- [CMake documentation](https://cmake.org/documentation/)
- [cppreference — Compilers](https://en.cppreference.com/w/c/compiler_support)
- Clang Sanitizers belgesi
