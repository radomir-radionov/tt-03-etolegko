# Internet speed measure

Консольный скрипт на Node.js для оценки скорости скачивания: делает **10 последовательных** HTTP-запросов по указанному URL, дожидается полного тела ответа на каждом и выводит статистику.

## Требования

- [Node.js](https://nodejs.org/) **20** или новее
- Внешние npm-зависимости не нужны (только стандартная библиотека)

## Установка

```bash
git clone <url-репозитория>
cd internet-speed-measure
```

## Запуск

```bash
npm test          # unit / e2e тесты
npm start -- "https://example.com/path/to/large-file.jpg"
# или
node src/cli.js "https://example.com/path/to/large-file.jpg"
```

Без аргумента или с невалидным URL скрипт завершится с кодом `1` и сообщением в stderr.

Каждый запрос ограничен таймаутом **120 с** (`DEFAULT_REQUEST_TIMEOUT_MS` в `src/constants.js`); при превышении — ошибка и код выхода `1`.

## Что считается

| Метрика | Описание |
|--------|----------|
| **Total downloaded** | Сумма байт по всем 10 ответам (в выводе — KB/MB, десятичные кратные 1000) |
| **Total time** | Сумма длительностей каждого запроса (не wall-clock между первым и последним) |
| **Average request time** | `total time / 10`, миллисекунды |
| **Download speed** | **Мбит/с (Mbps)** |

### Формула скорости

```
Mbps = (totalBytes × 8) / (totalDurationMs / 1000) / 1_000_000
```

То есть полный объём в битах, делённый на суммарное время загрузок в секундах, в мегабитах (10⁶ бит/с).

## Пример вывода

```text
URL: https://example.com/large.jpg
Requests: 10 (sequential)
Total downloaded: 45.23 MB
Total time (sum of requests): 12.40 s
Average request time: 1240.00 ms
Download speed: 29.17 Mbps
```

## Структура

```text
src/
  cli.js       # точка входа
  run.js       # оркестрация
  parse-args.js
  request.js   # один GET до конца тела
  constants.js # REQUEST_COUNT, таймаут
  measure.js   # 10 последовательных запросов
  speed.js     # расчёты и форматирование
test/          # node:test
```

## Публикация на GitHub

```bash
git init
git add .
git commit -m "Add internet speed measure CLI"
gh repo create tt-03-etolegko --public --source=. --push
```

Если репозиторий уже создан на GitHub:

```bash
git remote add origin git@github.com:<user>/<repo>.git
git branch -M main
git push -u origin main
```

## Лицензия

MIT