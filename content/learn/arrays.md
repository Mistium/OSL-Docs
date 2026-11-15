---
description: Keep lists of values, read and change them by position, and transform them with map, filter and friends.
lesson: 5
---

# Arrays

An array is an ordered list of values. Write the element type followed by `[]`, and the items in square brackets:

```osl
string[] planets = ["Mercury", "Venus", "Earth", "Mars"]
log planets
log planets.len
```

```output
["Mercury","Venus","Earth","Mars"]
4
```

`.len` is the number of items. It's a property, so it has no brackets.

## Counting from one

The first item is at position 1. Negative positions count back from the end, so the last item is always `[-1]`:

```osl
string[] planets = ["Mercury", "Venus", "Earth", "Mars"]
log planets[1]
log planets[3]
log planets[-1]
planets[3] = "Home"
log planets
```

```output
Mercury
Earth
Mars
["Mercury","Venus","Home","Mars"]
```

There's no position 0, and the compiler says so when it sees one:

```osl error
string[] planets = ["Mercury", "Venus"]
log planets[0]
```

> [!tip] Why start at one?
> A list of four planets ends at position 4, a loop over five things counts to five, and "the second item" is `[2]`. Counting from one removes a whole class of off-by-one mistakes.

## Adding and removing

```osl
int[] queue = [2, 3]
queue.append(4)
queue.prepend(1)
log queue

int last = queue.pop()
int first = queue.shift()
log last first queue

queue.insert(2, 99)
log queue
queue.delete(2)
log queue
```

```output
[1,2,3,4]
4 1 [2,3]
[2,99,3]
[2,3]
```

`append` adds to the end and `prepend` to the start. `pop` removes and returns the last item, `shift` the first. `insert(position, value)` puts a value in at a position, and `delete(position)` takes one out.

## Looking inside

```osl
string[] fruit = ["apple", "pear", "plum"]
log fruit.contains("pear")
log fruit.index("plum")
log fruit.index("kiwi")
log fruit.first() fruit.last()
```

```output
true
3
0
apple plum
```

Like strings, `index` returns `0` when the value isn't there.

## Ranges

`to` makes an array of whole numbers, counting up or down, with both ends included:

```osl
log 1 to 5
log 5 to 1
int[] evens = (1 to 10).filter(n -> n % 2 == 0)
log evens
```

```output
[1,2,3,4,5]
[5,4,3,2,1]
[2,4,6,8,10]
```

## Transforming arrays

The most useful array methods take a small function and apply it to every item. `n -> n * 2` is a function that takes `n` and returns `n * 2`; the [lambdas lesson](lambdas.md) covers them properly.

```osl
int[] prices = [12, 5, 30, 8]

log prices.map(p -> p * 2)
log prices.filter(p -> p < 10)
log prices.some(p -> p > 25)
log prices.every(p -> p > 1)
log prices.sum() prices.min() prices.max()
```

```output
[24,10,60,16]
[5,8]
true
true
55 5 30
```

- `map` makes a new array from what the function returns for each item.
- `filter` keeps the items the function says `true` for.
- `some` asks whether any item passes, and `every` whether all of them do.
- `sum`, `min` and `max` do what they say.

They chain, reading left to right like a sentence:

```osl
string[] names = ["ada", "grace", "al", "linus"]
log names.filter(n -> n.len > 2).map(n -> n.toUpper()).join(", ")
```

```output
ADA, GRACE, LINUS
```

## Sorting

`sort` returns a sorted copy: numbers in numeric order, everything else alphabetically. `reverse` flips the order:

```osl
int[] scores = [42, 7, 19, 88]
log scores.sort()
log scores.sort().reverse()
log ["pear", "apple", "fig"].sort()
```

```output
[7,19,42,88]
[88,42,19,7]
["apple","fig","pear"]
```

## Joining and spreading

`++` joins two arrays, and `...` spreads one array's items into another:

```osl
int[] low = [1, 2]
int[] high = [8, 9]
log low ++ high
log [...low, 5, ...high]
log max(...high)
```

```output
[1,2,8,9]
[1,2,5,8,9]
9
```

## Taking arrays apart

Destructuring puts an array's items straight into variables. `...rest` collects whatever is left:

```osl
string[] podium = ["Ada", "Grace", "Linus", "Margaret"]
[string gold, string silver, ...others] = podium
log gold
log silver
log others
```

```output
Ada
Grace
["Linus","Margaret"]
```

## Sharing and copying

An array is shared, not copied, when you assign it to another name. Both names then see the same list:

```osl
int[] a = [1, 2, 3]
int[] b = a
b.append(4)
log a

int[] c = a.clone()
c.append(5)
log a
log c
```

```output
[1,2,3,4]
[1,2,3,4]
[1,2,3,4,5]
```

Use `.clone()` when you want a separate copy to change.

## Arrays of anything

`int[]` and `string[]` hold one type each, which is what you want most of the time. Arrays can hold arrays, as in `int[][]` for a grid, and plain `array` holds a mix of types:

```osl
int[][] grid = [[1, 2], [3, 4]]
log grid[2][1]

array mixed = [1, "two", true]
log mixed.len
```

```output
3
3
```

:::quiz
`int[] n = [10, 20, 30]`. What is `n[-1]`?

- [ ] `10`
- [x] `30`
- [ ] It's an error.

Negative positions count back from the end, so `[-1]` is the last item.
:::

:::quiz
What does `[3, 1, 2].filter(x -> x > 1).sort()` give?

- [x] `[2,3]`
- [ ] `[3,2]`
- [ ] `[1,2,3]`

`filter` keeps 3 and 2, then `sort` puts them in order.
:::

:::exercise title="Top three"
Print the three highest scores, highest first, joined with commas.

```osl
int[] scores = [55, 91, 73, 88, 62, 99]

log scores
```

```output
99, 91, 88
```

> [!hint]
> Sort the scores, then reverse them so the highest comes first.

> [!hint]
> `.left(3)` takes the first three items of an array, as it does for a string.

```osl solution
int[] scores = [55, 91, 73, 88, 62, 99]

log scores.sort().reverse().left(3).join(", ")
```
:::
