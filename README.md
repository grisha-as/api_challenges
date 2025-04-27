## Часть II Дипломной работы по итогам прохождения курса 
## [QA.GURU | Автоматизация тестирования JS + Playwright](https://qa.guru/playwright_js)


## Репозиторий API автотестов для сервиса [API Challenges](https://apichallenges.herokuapp.com/)
---
## Содержание
- [Описание](#Описание)
- [Стек](#Стек)
- [Тестовый набор API challenges](#Тестовый-набор-API-challenges)
- [Запуск тестов и генерация отчета](#Запуск-тестов-и-генерация-отчета)
- [Пример Allure отчета](#Пример-Allure-отчета)
- [Запуск в Jenkins](#Запуск-в-Jenkins)
- [Интеграция с AllureTestOps](#Интеграция-с-AllureTestOps)
- [Уведомление в Telegram](#Уведомление-в-Telegram)




---
## Описание
Данный репозиторий содержит коллекцию API-тестов для сервиса API Challenges – специализированного инструмента, предназначенного для оттачивания навыков автоматизированного тестирования backend-приложений.

Ключевые особенности:
- [x] Проверка корректности HTTP-запросов и ответов
- [x] Автоматизация работы с заголовками, токенами и JSON-данными
- [x] Валидация статус-кодов и структуры ответов
- [x] Поддержка различных сценариев взаимодействия с API

---




## Стек
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="JS" width="50" height="50"/><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/playwright/playwright-original.svg" alt="PW" width="50" height="50" /><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GH" width="50" height="50"/><img src="https://github.com/allure-framework/allure2/blob/main/.idea/icon.png" alt="JS" width="50" height="50"/><img src="https://github.com/devicons/devicon/blob/master/icons/git/git-original.svg" title="Git" alt="Git" width="50" height="50"/>
  <img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWVleDFxZzBoZThhd2dxZXI3MXFycm82MTBiczJnYmdqaDJ0eXRhbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/ZcdZ7ldgeIhfesqA6E/giphy.gif" width="50" height="50"/>
  <img src="https://softfinder.ru/upload/styles/logo/public/logo/logo-2605.png?itok=vqVq1c7j" width="50" height="50"/><img src="https://github.com/devicons/devicon/blob/master/icons/jenkins/jenkins-original.svg" title="Jenkins" alt="Jenkins" width="50" height="50"/>
  <img src="https://fakerjs.dev/logo.svg" width="50" height="50"/>
  


Автотесты для проекта написаны с использованием JS + Playwright, для CI/CD используется Jenkins, генерация отчетов в Allure, реализована интеграция с тест-менеджмент системой AllureTestOps и отправка уведомлений о статусе выполнения тестов в Telegram.

---
## Тестовый набор API challenges

- [x] ID 02 GET /challenges
- [x] ID 03 GET /todos
- [x] ID 04 GET /todo (404) not plural
- [x] ID 05 GET /todos/{id}
- [x] ID 06 GET /todos/{id} (404)
- [x] ID 07 GET /todos ?filter
- [x] ID 08 HEAD /todos
- [x] ID 09 POST todos
- [x] ID 10 POST /todos (400) doneStatus
- [x] ID 11 POST /todos (400) title too long
- [x] ID 12 POST /todos (400) description too long
- [x] ID 13 POST /todos (201) max out content
- [x] ID 14 POST /todos (413) content too long
- [x] ID 15 POST /todos (400) extra
- [x] ID 16 PUT /todos/{id} (400) 
- [x] ID 17 POST /todos/{id} (200) 
- [x] ID 18 POST /todos/{id} (404) 
- [x] ID 19 PUT /todos/{id} full 
- [x] ID 20 PUT /todos/{id} partial 
- [x] ID 21	PUT /todos/{id} no title (400)
- [x] ID 22 PUT /todos/{id} no amend id (400)
- [x] ID 22 PUT /todos/{id} no amend id (400)
- [x] ID 23 DELETE /todos/{id}
- [x] ID 24 OPTIONS /todos (200)
- [x] ID 25 GET /todos (200) XML
- [x] ID 26 GET /todos (200) JSON
- [x] ID 27 GET /todos (200) ANY (skipping)
- [x] ID 28 GET /todos (200) XML pref
- [x] ID 29 GET /todos (200) no accept
- [x] ID 30 GET /todos (406)
- [x] ID 31 POST /todos XML
- [x] ID 32 POST /todos JSON
- [x] ID 33 POST /todos (415)
- [x] ID 34 GET /challenger/guid (existing X-CHALLENGER)
- [x] ID 35 PUT /challenger/guid RESTORE
- [x] ID 36 PUT /challenger/guid CREATE
- [x] ID 37 GET /challenger/database/guid (200)
- [x] ID 38 PUT /challenger/database/guid (Update)
- [x] ID 39 POST /todos XML to JSON
- [x] ID 40 POST /todos JSON to XML
- [x] ID 41 DELETE /heartbeat (405)
- [x] ID 42 PATCH /heartbeat (500)
- [x] ID 43 TRACE /heartbeat (501)
- [x] ID 44 GET /heartbeat (204)

---
## Запуск тестов и генерация отчета

Команда для локального запуска тестов

```
npm run test
```
Команда для локального запуска в режиме ui

```
npm run testui
```

Команда для локального формирования отчета

```
npm run report
npm run reportOpen
```
---
## Пример [Allure отчета]()



---
## Запуск в [Jenkins](https://jenkins.autotests.cloud/job/002-pw-js_Grish/)

Для запуска выполнения тестов необходимо авторизоваться на сайте [Jenkins](https://jenkins.autotests.cloud/login?from=%2F), перейти в нужную [джобу](https://jenkins.autotests.cloud/job/002-pw-js_Grish/) и нажать <code>Build Now</code>. 
После завершения паплайна будет сформирован Allure-отчет, результаты выполнения будут отправлены в AllureTestOps и в Telegram. 



---
## Интеграция с [AllureTestOps](https://allure.autotests.cloud/project/4731/dashboards)



---
## Уведомление в Telegram

После завершения выполнения тестов бот, созданный в Telegram, автоматически обрабатывает данные и отправляет сообщение с отчетом о результате тестирования в чат.


