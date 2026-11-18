# Internet speed measure

Консольный скрипт на **TypeScript** / Node.js для оценки скорости скачивания: **10 последовательных** HTTP-запросов по URL, полное тело ответа на каждом, отчёт в консоль.

## Требования

- [Node.js](https://nodejs.org/) **20** или новее
- npm

## Установка

```bash
git clone https://github.com/radomir-radionov/tt-03-etolegko.git
cd tt-03-etolegko
npm install
```

## Запуск

```bash
npm test          # сборка + unit / e2e (tsx + node:test)
npm run build     # tsc → dist/
npm start -- "https://example.com/path/to/large-file.jpg"
# после сборки напрямую:
node dist/cli.js "https://example.com/path/to/large-file.jpg"
```

Без аргумента или с невалидным URL — код выхода `1`, сообщение в stderr.

Таймаут одного запроса: **120 с** (`DEFAULT_REQUEST_TIMEOUT_MS` в `src/constants.ts`).

## Единицы

| Метрика | Единица |
|--------|---------|
| Объём | байты (вывод KB/MB, основание 1000) |
| Среднее время запроса | мс |
| Скорость | **Mbps** (мегабит/с, 10⁶ бит/с) |

`Mbps = (totalBytes × 8) / (totalDurationMs / 1000) / 1_000_000`

## Структура

```text
src/           # TypeScript (ESM, NodeNext)
  cli.ts
  run.ts
  types.ts
  ...
test/          # *.test.ts, импорты с суффиксом .js (Node ESM)
dist/          # артефакт tsc (в .gitignore)
```

## Лицензия

MIT