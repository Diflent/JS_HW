# RPG-game

Проект для домашних заданий 4.1–4.3 и итогового задания 5.

## Команды

```bash
npm install          # установка зависимостей
npm start            # dev-сервер webpack на http://localhost:9000
npm run build        # production-сборка webpack в dist
npm run show:dist    # сборка и запуск HTTP-сервера для dist на http://localhost:8080
npm run lint         # проверка кода ESLint (airbnb-base)
npm test             # unit-тесты Jest
npm run coverage     # тесты с отчётом о покрытии (порог — 70% строк)
```

## Структура

- `src/index.js` — точка входа webpack, запускает игру
- `src/js/game.js` — модуль игры, функция `play`
- `src/js/weapons/` — классы оружия, по модулю на класс
- `src/js/players/` — классы персонажей, по модулю на класс
- `src/css/style.css`, `src/index.html` — стили и шаблон для HtmlWebpackPlugin

## Игра

`play(players)` проводит королевскую битву: каждый раунд живые игроки по очереди
выбирают самого слабого соперника, двигаются к нему и атакуют. Ход боя выводится
в консоль, функция возвращает победителя. Без аргументов играет стандартный состав
из шести персонажей (`createPlayers`).
