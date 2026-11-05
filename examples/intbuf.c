#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    size_t len;
    size_t cap;
} IntBuf;

static int ib_push(IntBuf *b, int v) {
    if (b->len == b->cap) {
        size_t ncap = b->cap ? b->cap * 2 : 4;
        int *nd = realloc(b->data, ncap * sizeof *nd);
        if (!nd) {
            return -1;
        }
        b->data = nd;
        b->cap = ncap;
    }
    b->data[b->len++] = v;
    return 0;
}

int main(void) {
    IntBuf b = {0};
    for (int i = 0; i < 10; i++) {
        if (ib_push(&b, i) != 0) {
            fprintf(stderr, "oom\n");
            free(b.data);
            return 1;
        }
    }
    for (size_t i = 0; i < b.len; i++) {
        printf("%d ", b.data[i]);
    }
    puts("");
    free(b.data);
    return 0;
}
