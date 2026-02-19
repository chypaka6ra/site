# SVG Storage Guide

## Описание

Система локального хранилища SVG файлов для оптимизации производительности и поддержки офлайн-режима.

## Структура файлов

```
/home/user/site/
├── files/svg/                      # Директория с SVG файлами
│   ├── names-vasily-maria.svg      # SVG с именами жениха и невесты
│   ├── wedding-date.svg            # SVG с датой свадьбы
│   └── wedding-schedule.svg        # SVG с расписанием события
├── svg-storage.js                  # Основной модуль кэширования
├── svg-storage-utils.js            # Утилиты и вспомогательные функции
└── index.html                      # Главная страница (подключает оба скрипта)
```

## Возможности

### 1. Автоматическое кэширование SVG файлов
- Все SVG файлы автоматически загружаются и кэшируются при загрузке страницы
- Данные хранятся в `localStorage` браузера
- Максимальный размер кэша: 5 МБ
- Время жизни кэша: 30 дней

### 2. Умное управление хранилищем
- Автоматическая очистка устаревших записей
- Удаление старейших записей при превышении лимита
- Отслеживание размера каждого SVG

### 3. Интерцепция запросов
- Fetch-интерцептор автоматически использует кэшированные SVG
- Image-интерцептор преобразует кэшированные SVG в Data URLs
- Автоматическое наблюдение за новыми элементами на странице

## API

### Основной API (window.SVGStorage)

```javascript
// Загрузить SVG с кэшированием
await SVGStorage.loadSVG('files/svg/wedding-date.svg');

// Получить SVG из кэша
const svgContent = SVGStorage.getSVG('files/svg/wedding-date.svg');

// Проверить наличие в кэше
const isCached = SVGStorage.hasSVG('files/svg/wedding-date.svg');

// Очистить весь кэш
SVGStorage.clearCache();

// Получить статистику
const stats = SVGStorage.getStats();

// Закэшировать все SVG на странице
await SVGStorage.cachePageSVGs();
```

### Утилиты консоли (SVGStorageConsole)

Откройте консоль браузера (F12) и используйте эти команды:

```javascript
// Показать статистику кэша
SVGStorageConsole.showStats();

// Очистить кэш
SVGStorageConsole.clearCache();

// Перезагрузить все SVG
SVGStorageConsole.reloadSVGs();
```

## Пример использования

### Вывод статистики кэша в консоль

```javascript
// Открыть консоль браузера и выполнить:
SVGStorageConsole.showStats();

// Вывод:
// SVG Storage Statistics
// Total cached SVGs: 3
// Total size: 2.64 KB
// ┌─────────────────────────────┬───────┬───────────┐
// │ URL                         │ Size  │ Age (hrs) │
// ├─────────────────────────────┼───────┼───────────┤
// │ .../files/svg/wedding-...   │ 0.46  │ 0.12      │
// │ .../files/svg/wedding-...   │ 1.64  │ 0.12      │
// │ .../files/svg/names-...     │ 0.48  │ 0.12      │
// └─────────────────────────────┴───────┴───────────┘
```

### Добавление нового SVG файла

1. Разместите SVG в директории `files/svg/`
2. Обновите скрипт `svg-storage.js` в методе `findAllSVGUrls()`:

```javascript
const svgFiles = [
  'files/svg/names-vasily-maria.svg',
  'files/svg/wedding-date.svg',
  'files/svg/wedding-schedule.svg',
  'files/svg/your-new-file.svg'  // Добавьте новый файл
];
```

3. Файл будет автоматически загружен и закэширован при загрузке страницы.

## Технические детали

### localStorage структура

```javascript
{
  "version": 1,
  "createdAt": 1613652000000,
  "entries": {
    "svg_https://example.com/files/svg/wedding-date.svg": {
      "url": "https://example.com/files/svg/wedding-date.svg",
      "content": "<svg>...</svg>",
      "timestamp": 1613652000000,
      "size": 470
    }
    // ... другие SVG
  }
}
```

### Поддерживаемые браузеры

- Chrome/Edge 4+
- Firefox 3.5+
- Safari 4+
- Opera 10.5+
- IE 8+

### Ограничения

- **localStorage**: обычно 5-10 МБ на домен
- **Offline**: работает после загрузки страницы онлайн
- **CORS**: требуется доступ к SVG файлам без ограничений CORS

## Отладка

### Проверить, загружены ли SVG в кэш

```javascript
// В консоли браузера
SVGStorageConsole.showStats();
```

### Просмотреть localStorage напрямую

```javascript
// В консоли браузера
console.log(JSON.parse(localStorage.getItem('svg_cache')));
```

### Очистить кэш и перезагрузить

```javascript
// В консоли браузера
SVGStorageConsole.clearCache();
location.reload();
```

## Производительность

### Ожидаемое улучшение

- **Первая загрузка**: кэширует все SVG (+ ~10-50ms)
- **Последующие загрузки**: использует кэш (~1-5ms вместо 50-200ms за запрос)
- **Офлайн**: полная поддержка кэшированных SVG

### Размер кэша по умолчанию

- 3 SVG файла: ~2.6 КБ
- Максимум: 5 МБ

## Локальные SVG файлы

Система использует только локальные SVG файлы из директории `/files/svg/`:

```
/files/svg/
├── names-vasily-maria.svg      (493 bytes)
├── wedding-date.svg            (470 bytes)
└── wedding-schedule.svg        (1.7 KB)
```

Все внешние ссылки полностью исключены - вся информация берется локально.

## Решение проблем

### SVG не загружаются из кэша

1. Проверьте консоль на ошибки: `Ctrl+Shift+J` (Chrome)
2. Выполните: `SVGStorageConsole.showStats()`
3. Убедитесь, что localStorage включен в браузере

### Кэш переполнен

- Автоматически удаляются старейшие 25% записей
- Используйте `SVGStorageConsole.clearCache()` для полной очистки

### SVG файлы не найдены

1. Проверьте, что файлы находятся в `files/svg/`
2. Убедитесь, что пути в `svg-storage.js` актуальны
3. Проверьте CORS-заголовки сервера

## Будущие улучшения

- [ ] IndexedDB для больших SVG
- [ ] Service Worker для полного офлайн-режима
- [ ] Автоматическая оптимизация SVG (minification)
- [ ] WebSocket синхронизация между табами
- [ ] Предварительная загрузка SVG
