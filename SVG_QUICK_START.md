# SVG Storage - Быстрый Старт

## 🎯 Цель

Заменить все внешние ссылки на SVG файлы на локальные файлы, хранящиеся в `/files/svg/`.

```
https://example.com/names.svg  →  files/svg/names-vasily-maria.svg
https://example.com/date.svg   →  files/svg/wedding-date.svg
https://example.com/schedule   →  files/svg/wedding-schedule.svg
```

## ⚡ За 3 шага

### Шаг 1: Скопируйте файл маппингов

Скопируйте `svg-url-mappings-example.js` и переименуйте в `svg-url-mappings.js`:

```bash
cp svg-url-mappings-example.js svg-url-mappings.js
```

### Шаг 2: Добавьте свои URL маппинги

Отредактируйте `svg-url-mappings.js` и добавьте ваши маппинги:

```javascript
// svg-url-mappings.js
SVGStorage.addUrlMapping(
  'https://YOUR_ACTUAL_URL/names.svg',    // Замените на реальный URL
  'files/svg/names-vasily-maria.svg'      // Локальный путь (не изменяйте)
);
```

### Шаг 3: Подключите скрипт в HTML

Обновите `index.html` - добавьте строку перед другими скриптами:

```html
<!-- Scripts -->
<script src="svg-storage.js" defer></script>
<script src="svg-storage-utils.js" defer></script>
<script src="svg-url-mappings.js" defer></script>  ← Добавьте эту строку
<script src="script.js" defer></script>
<script src="wedding-replacer.js" defer></script>
```

## 🔍 Как найти реальные URL?

### Способ 1: Используя консоль браузера

```javascript
// Откройте консоль браузера (F12) и выполните:
const urls = discoverSVGUrls();
console.table(urls);

// Результат покажет все SVG URLs на странице
```

### Способ 2: Проверить Network tab

1. Откройте DevTools (F12)
2. Перейдите на вкладку "Network"
3. Перезагрузите страницу (Ctrl+R)
4. Фильтруйте по ".svg"
5. Все запросы к SVG будут видны с полными URL

## 📋 Структура локальных файлов

```
/home/user/site/
├── files/svg/
│   ├── names-vasily-maria.svg      (493 bytes)
│   ├── wedding-date.svg            (470 bytes)
│   └── wedding-schedule.svg        (1679 bytes)
├── svg-storage.js                  (основной модуль)
├── svg-storage-utils.js            (утилиты)
└── svg-url-mappings.js            (ваши маппинги) ← Создайте этот файл
```

## ✅ Проверка

После добавления маппингов, проверьте в консоли:

```javascript
// Показать все текущие маппинги
SVGStorage.getMappings();

// Результат:
// [
//   ["https://example.com/names.svg", "files/svg/names-vasily-maria.svg"],
//   ["https://example.com/date.svg", "files/svg/wedding-date.svg"],
//   ...
// ]

// Показать статистику кэша
SVGStorageConsole.showStats();
```

## 🎁 Примеры

### Пример 1: tildacdn ссылки

```javascript
// svg-url-mappings.js
SVGStorage.addUrlMapping(
  'https://tildacdn.com/tild111-abc-names.svg',
  'files/svg/names-vasily-maria.svg'
);
```

### Пример 2: Несколько URL для одного файла

```javascript
// Если один SVG доступен с разных URL
SVGStorage.addUrlMapping(
  'https://cdn1.example.com/names.svg',
  'files/svg/names-vasily-maria.svg'
);

SVGStorage.addUrlMapping(
  'https://cdn2.example.com/names.svg',
  'files/svg/names-vasily-maria.svg'
);
```

### Пример 3: Полный конфиг

```javascript
// svg-url-mappings.js - Полный пример

(function() {
  'use strict';

  function waitForSVGStorage(callback) {
    if (window.SVGStorage) {
      callback();
    } else {
      setTimeout(() => waitForSVGStorage(callback), 100);
    }
  }

  waitForSVGStorage(() => {
    // Маппинг имен
    SVGStorage.addUrlMapping(
      'https://tildacdn.com/tild111111-abc-names-abc.svg',
      'files/svg/names-vasily-maria.svg'
    );

    // Маппинг даты
    SVGStorage.addUrlMapping(
      'https://tildacdn.com/tild222222-def-date-def.svg',
      'files/svg/wedding-date.svg'
    );

    // Маппинг расписания
    SVGStorage.addUrlMapping(
      'https://tildacdn.com/tild333333-ghi-schedule-ghi.svg',
      'files/svg/wedding-schedule.svg'
    );

    console.log('✓ SVG URL Mappings configured');
  });
})();
```

## 🔧 Консольные команды

```javascript
// Показать все кэшированные SVG
SVGStorageConsole.showStats();

// Очистить кэш
SVGStorageConsole.clearCache();

// Перезагрузить все SVG
SVGStorageConsole.reloadSVGs();

// Найти все SVG URLs на странице
discoverSVGUrls();

// Добавить маппинг вручную
addSVGMapping('https://example.com/file.svg', 'files/svg/file.svg');
```

## 📊 Результаты

### До
- Загрузка каждого SVG: 200-2000ms
- Зависимость от внешних сервисов
- Нет офлайн доступа

### После
- Загрузка из localStorage: 1-10ms
- Полная автономность
- Офлайн поддержка ✓

## 🚀 Дополнительные ресурсы

- [SVG_STORAGE_GUIDE.md](./SVG_STORAGE_GUIDE.md) - Полное руководство
- [SVG_URL_MAPPING_GUIDE.md](./SVG_URL_MAPPING_GUIDE.md) - Детали маппингов
- [svg-url-mappings-example.js](./svg-url-mappings-example.js) - Шаблон для копирования

## ❓ Частые вопросы

### Q: Где взять реальные URL?
A: Откройте DevTools (F12) → Network → перезагрузите страницу → фильтруйте по .svg

### Q: Что если URL неправильный?
A: Используйте `discoverSVGUrls()` в консоли, чтобы найти все URLs на странице

### Q: Может ли быть несколько URL для одного файла?
A: Да! Добавьте несколько маппингов для одного локального файла

### Q: Как проверить, работает ли?
A: Выполните `SVGStorageConsole.showStats()` в консоли

### Q: Нужно ли вручную кэшировать?
A: Нет! Всё кэшируется автоматически при загрузке страницы

## ✨ Преимущества

✅ **Быстрее** - локальная загрузка вместо интернета
✅ **Надежнее** - работает офлайн после первой загрузки
✅ **Проще** - просто замените URLs
✅ **Безопаснее** - контроль над всеми ресурсами
✅ **Экономнее** - меньше запросов на сервер

---

**Готово!** 🎉 Ваши SVG теперь загружаются локально!
