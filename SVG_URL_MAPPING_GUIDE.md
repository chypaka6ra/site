# SVG URL Mapping Guide

Система позволяет заменять внешние ссылки на SVG файлы на локальные пути из директории `/files/svg/`.

## Использование

### 1. Добавление маппинга через консоль браузера

```javascript
// Добавить маппинг для одного файла
SVGStorage.addUrlMapping(
  'https://example.com/names.svg',
  'files/svg/names-vasily-maria.svg'
);

// Теперь все ссылки на https://example.com/names.svg будут заменены на files/svg/names-vasily-maria.svg
```

### 2. Добавление маппингов в JavaScript

```javascript
// Создайте файл svg-url-mappings.js (добавьте его в index.html перед svg-storage.js)

// svg-url-mappings.js
(function() {
  'use strict';

  // Ждем, пока SVGStorage загружается
  function waitForSVGStorage(callback) {
    if (window.SVGStorage) {
      callback();
    } else {
      setTimeout(() => waitForSVGStorage(callback), 100);
    }
  }

  // Добавляем маппинги
  waitForSVGStorage(() => {
    // Маппинг для имен жениха и невесты
    SVGStorage.addUrlMapping(
      'https://tildacdn.com/tild-names.svg',
      'files/svg/names-vasily-maria.svg'
    );

    // Маппинг для даты свадьбы
    SVGStorage.addUrlMapping(
      'https://tildacdn.com/tild-date.svg',
      'files/svg/wedding-date.svg'
    );

    // Маппинг для расписания
    SVGStorage.addUrlMapping(
      'https://tildacdn.com/tild-schedule.svg',
      'files/svg/wedding-schedule.svg'
    );

    console.log('SVG URL Mappings: Configured');
  });
})();
```

Затем добавьте в `index.html`:

```html
<!-- Scripts -->
<script src="svg-storage.js" defer></script>
<script src="svg-storage-utils.js" defer></script>
<script src="svg-url-mappings.js" defer></script>  <!-- Новый файл -->
<script src="script.js" defer></script>
<script src="wedding-replacer.js" defer></script>
```

### 3. Проверка маппингов

В консоли браузера:

```javascript
// Получить все текущие маппинги
const mappings = SVGStorage.getMappings();
console.table(mappings);

// Проверить, есть ли маппинг для конкретного URL
const isMapped = SVGStorage.isMapped('https://example.com/names.svg');
console.log('Mapped:', isMapped);

// Заменить URL
const localPath = SVGStorage.replaceSVGUrl('https://example.com/names.svg');
console.log('Local path:', localPath);
```

## Как это работает

### 1. URL Replacer
- Находит все `<img src="*.svg">` элементы
- Заменяет внешние URLs на локальные пути
- Автоматически следит за новыми элементами

### 2. Fetch Interceptor
- Перехватывает fetch запросы для SVG
- Заменяет URL перед запросом
- Подает контент из кэша, если доступен

### 3. Image Interceptor
- Преобразует локальные пути в Data URLs
- Позволяет использовать кэшированные SVG в img элементах

## Примеры

### Пример 1: Замена tildacdn ссылок

```javascript
// Если на сайте используются ссылки вида https://tildacdn.com/...
// Добавьте эти маппинги:

SVGStorage.addUrlMapping(
  'https://tildacdn.com/tild11112-0333-4f86-b2f0-123456789abc~/names.svg',
  'files/svg/names-vasily-maria.svg'
);

SVGStorage.addUrlMapping(
  'https://tildacdn.com/tild11112-0333-4f86-b2f0-987654321def~/wedding-date.svg',
  'files/svg/wedding-date.svg'
);
```

### Пример 2: Замена различных хостов

```javascript
// Замена ссылок с разных источников
SVGStorage.addUrlMapping(
  'https://cdn.example.com/assets/names.svg',
  'files/svg/names-vasily-maria.svg'
);

SVGStorage.addUrlMapping(
  'https://images.example.com/wedding/date.svg',
  'files/svg/wedding-date.svg'
);

SVGStorage.addUrlMapping(
  'https://staticfiles.example.com/schedule.svg',
  'files/svg/wedding-schedule.svg'
);
```

### Пример 3: Динамическое добавление маппингов

```javascript
// Создать функцию для добавления маппингов
function addSVGMapping(externalUrl, localFile) {
  if (window.SVGStorage) {
    SVGStorage.addUrlMapping(externalUrl, localFile);
    console.log(`Added mapping: ${externalUrl} -> ${localFile}`);
  } else {
    console.error('SVGStorage is not loaded yet');
  }
}

// Использовать функцию
addSVGMapping('https://example.com/file.svg', 'files/svg/file.svg');
```

## Структура маппинга

```
Внешний URL → Локальный путь
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
https://tildacdn.com/...names.svg → files/svg/names-vasily-maria.svg
https://tildacdn.com/...date.svg  → files/svg/wedding-date.svg
https://tildacdn.com/...schedule  → files/svg/wedding-schedule.svg
```

## Отладка

### Проверить, работает ли маппинг

```javascript
// В консоли браузера

// 1. Проверить все маппинги
SVGStorageConsole.showStats();

// 2. Проверить конкретный URL
const url = 'https://example.com/test.svg';
const mapped = SVGStorage.isMapped(url);
console.log('Is mapped:', mapped);

const localPath = SVGStorage.replaceSVGUrl(url);
console.log('Replaced URL:', localPath);

// 3. Просмотреть все маппинги
const mappings = SVGStorage.getMappings();
console.table(mappings);
```

### Проверить, загружено ли из кэша

Откройте DevTools (F12) → Network tab → Filter by '.svg'

Если SVG загружен из кэша, он должен появиться практически мгновенно.

## Производительность

### До маппинга
- Запрос на внешний сервер: 200-2000ms
- Загрузка из интернета

### После маппинга
- Загрузка локального файла: 5-50ms
- Загрузка из localStorage: 1-10ms

## Бесплатные преимущества

✅ Никаких внешних зависимостей
✅ Полный контроль над ссылками
✅ Офлайн доступ к SVG
✅ Быстрая загрузка
✅ Меньше запросов на сервер
✅ Лучшая производительность

## Частые ошибки

### Ошибка 1: Маппинг не работает

```javascript
// ❌ Неправильно - маппинг добавлен слишком рано
SVGStorage.addUrlMapping(...);  // undefined - SVGStorage еще не загружен

// ✅ Правильно - используйте callback
function waitForSVGStorage(callback) {
  if (window.SVGStorage) {
    callback();
  } else {
    setTimeout(() => waitForSVGStorage(callback), 100);
  }
}

waitForSVGStorage(() => {
  SVGStorage.addUrlMapping(...);
});
```

### Ошибка 2: Неправильный путь к файлу

```javascript
// ❌ Неправильно
SVGStorage.addUrlMapping(
  'https://example.com/names.svg',
  '/files/svg/names-vasily-maria.svg'  // Не используйте /
);

// ✅ Правильно
SVGStorage.addUrlMapping(
  'https://example.com/names.svg',
  'files/svg/names-vasily-maria.svg'   // Относительный путь
);
```

### Ошибка 3: Неправильный внешний URL

```javascript
// ❌ Неправильно - случайный URL
SVGStorage.addUrlMapping(
  'https://example.com/names.svg',
  'files/svg/names-vasily-maria.svg'
);

// ✅ Правильно - точный URL из HTML
// 1. Откройте DevTools
// 2. Найдите точный URL в Network tab
// 3. Используйте его в маппинге
SVGStorage.addUrlMapping(
  'https://tildacdn.com/tild1234567890/names.svg',
  'files/svg/names-vasily-maria.svg'
);
```

## Дополнительные ресурсы

- [SVG Storage Guide](./SVG_STORAGE_GUIDE.md) - Основное руководство по кэшированию
- [Browser DevTools](https://developer.chrome.com/docs/devtools/) - Отладка в браузере
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - Информация о fetch
