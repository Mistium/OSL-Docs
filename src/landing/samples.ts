/* The code on the landing page and the playground's examples. Every one is
   compiled (and the runnable ones run) by scripts/examples.ts, like the
   examples in the docs, so the front page can't show code that doesn't work. */

import { exampleKey, type Example, type ExampleMode } from "../lib/markdown";

export type Sample = { title: string; files: Record<string, string>; example: Example };

function sample(title: string, code: string, mode: ExampleMode = "run"): Sample {
  const files = { "main.osl": code };
  const example: Example = { id: "", files: [{ name: "main.osl", code }], mode, title: "main.osl" };
  example.id = exampleKey(example);
  return { title, files, example };
}

export const SAMPLES: Record<string, Sample> = {
  hero: sample(
    "Typed JSON",
    `import "std:json"

struct Order (
  string item
  int qty
  number price
)

def total(Order[] orders) number (
  return orders.map(o -> o.qty * o.price).sum()
)

string body = \`[
  {"item": "tea", "qty": 2, "price": 3.5},
  {"item": "cake", "qty": 1, "price": 4}
]\`

switch json.parse<Order[]>(body) (
  case ok(orders)
    log \`\${orders.len} items, \${total(orders)} total\`
  case err(e)
    log "bad order: " ++ e.message
)`,
  ),
  playground: sample(
    "A first program",
    `// Edit me. The compiler checks your code as you type.
string[] crew = ["Ada", "Grace", "Linus"]

for i, name in crew (
  log \`\${i}. Hello, \${name}!\`
)

def shout(string text) string -> text.toUpper() ++ "!"
log shout("one binary, no runtime")`,
  ),
  script: sample("No ceremony", `log "Hello, world"`),
  types: sample(
    "Types at the edges",
    `def average(number[] values) number (
  auto total = values.sum()
  return total / values.len
)

log average([3, 4, 8])`,
  ),
  results: sample(
    "Failure is a value",
    `import "std:json"

struct User (
  string name
  int age = 0
)

switch json.parse<User>(\`{"name": "Ada", "age": 36}\`) (
  case ok(user)
    log \`\${user.name} is \${user.age}\`
  case err(e)
    log "bad input: " ++ e.message
)`,
  ),
  teach: sample("A compiler that explains itself", `int count = "three"`, "error"),
  ones: sample(
    "Counting starts at one",
    `string[] planets = ["Mercury", "Venus", "Earth"]
log planets[1]
log planets[-1]`,
  ),
  go: sample(
    "Go is one import away",
    `import "go:strings"

log strings.Repeat("na", 8) ++ " batman"`,
  ),
  server: sample(
    "A web server",
    `import "std:serve"

*serve.Router app = serve.new()

app.get("/hello/:name", def(*serve.Context c) -> (
  c.json(200, {greeting: "Hello, " ++ c.param("name")})
))

app.run(":8080").unwrap()`,
    "norun",
  ),
  ui: sample(
    "A desktop app",
    `import "std:ui"
import "std:window"

class Counter (
  int count = 0

  def add() (
    self.count += 1
  )

  def view() ui.node (
    return <column gap=12 pad=24 align=center>
      <text size=28 weight=bold>\${self.count}</text>
      <button on:click=self.add>Add one</button>
    </column>
  )
)

*window.Window win = window.create({title: "Counter", width: 320, height: 240}).unwrap()
win.show(def() -> Counter())
window.run()`,
    "norun",
  ),
  game: sample(
    "A game",
    `import "std:raylib"

raylib.initWindow(800, 450, "Bounce", {fps: 60}).unwrap()

number x = 400
number speed = 4

while !raylib.windowShouldClose() (
  x += speed
  if x < 40 or x > 760 (
    speed = -speed
  )
  raylib.draw(def() -> (
    raylib.clear("#101014")
    raylib.circle({x: x, y: 225}, 40, "#c299cf")
  ))
)

raylib.closeWindow()`,
    "norun",
  ),
  cli: sample(
    "A command-line tool",
    `string text = "the cat saw the dog and the dog saw the cat"

string[int] counts = {}
for word in text.split(" ") (
  counts[word] += 1
)

string[] words = counts.getKeys().sort().sortBy(w -> -counts[w])
for word in words.left(3) (
  log word.padEnd(" ", 5) ++ ("#" * counts[word])
)`,
  ),
  threads: sample(
    "Threads",
    `import "std:thread"

def slowSquare(int n) int (
  thread.sleep(100)
  return n * n
)

int[] squares = thread.parallel([1, 2, 3, 4], slowSquare)
log squares`,
  ),
  bot: sample(
    "A chat bot",
    `import "std:originchats"
import "std:env"

*originchats.client bot = originchats.new("wss://chats.mistium.com", {token: env.get("ROTUR_TOKEN")})

bot.command("!roll", def(*originchats.message msg) -> (
  msg.reply("You rolled " ++ random(1, 6)).unwrap()
))

bot.run().unwrap()`,
    "norun",
  ),
};
