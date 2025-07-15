# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, которые используются в проекте

### Интерфейс продукта

```
export interface IProduct {
id: string
title: string
price: number | null
description: string
image: string
category: string
}
```

### Интерфейс заказа

```
export interface IOrder {
payment: string
email: string
phone: string
address: string
total: number
items: IProduct[]
}
```

### Интерфейс ответа API для списка данных


```
export type ApiListResponse<Type> = {
total: number
items: Type[]
};
```

### Ответ API для заказа

```
export interface IOrderPostResponse {
id: string
total: number
items: IProduct[]
}
```

### Типы для отображения 

```
export type IProductCard = Omit<IProduct, 'description'> - Данные для карточки продукта
export type IProductModal = IProduct - Данные формы карточки продукта
export type IProductShort = Pick<IProduct, 'id' | 'title' | 'price'> - Данные формы для информации о корзине
export type IOrderModal = Pick<IOrder, 'total'> & { items: IProductShort[] }
export type IPaymentModal = Pick<IOrder, 'payment' | 'email' | 'phone' | 'address'> - Данные формы для информации о платеже
export type IFormErrors = Partial<Pick<IOrder, 'payment' | 'email' | 'phone' | 'address'>> - Данные формы для информации о платеже

```
### Типы для перечисления

```
export enum ModalStage {
Closed = 'closed',
Orders = 'orders',
Payment = 'payment',
Contact = 'contact',
Finish = 'finish'
}
```
```
export enum PaymentMethod {
Card = 'card',
Cash = 'cash'
}
```

### Интерфейсы моделей данных

Интерфейс: для модели данных продуктов на странице

```
export interface IProductsData {
	products: IProduct[]
	preview: string|null
	getAll(): Promise<void>
	getById(id: string): Promise<IProduct>
	setPreview(id: string | null): void
}
```

Интерфейс: для модели данных кoрзины

```
export interface IOrdersData {
	order: IOrder
	orderModalStage: ModalStage
	addItemToOrder(product: IProduct): void
	removeItemFromOrder(id: string): void
	toPayOrder(payment: string, address: string): void
	getTotal(): number
	checkValidation(data: IPaymentModal): IFormErrors | null
}
```

### Интерфейсы представления

Интерфейс для карточки продукта

```
export interface IProductView {
template: HTMLElement
events: IEvents
id: string
render(productData: IProduct): HTMLElement;
}
```

Интерфейс для контейнера продуктов

```
export interface IProductsContainerView {
    container: HTMLElement
    addProducts(...productElements: HTMLElement[]): void
}
```

Интерфейс для корзины

```
export interface IOrderView {
    template: HTMLElement
    events: IEvents
    render(order: IOrderModal, stage: ModalStage): HTMLElement;
    updateStage(stage: ModalStage): void
```

Интерфейс для модального окна

```
export interface IModalView {
    template: HTMLElement
    events: IEvents
    open(): void
    close(): void
    render(content: HTMLElement): void
}
```

Интерфейс для счетчика корзины

```
export interface IPageCartCounterView {
    counter: number
    catalog: HTMLElement
    updateCounter(count: number): void
}
```

Интерфейс для формы контактов

```
export interface IContactView {
    template: HTMLElement
    events: IEvents
    render(data: IPaymentModal, errors?: IFormErrors): HTMLElement;
}
```

Интерфейс для уведомления об успешном заказе

```
export interface ISuccessView  {
    template: HTMLElement
    events: IEvents
    render(total: number): HTMLElement;
}
```

Интерфейс для формы оплаты (адрес и способ оплаты):

```
export interface IPaymentView {
    template: HTMLElement
    events: IEvents
    render(data: Pick<IOrder, 'payment' | 'address'>, errors?: IFormErrors): HTMLElement
}
```

Интерфейс для базового компонента формы:

```
export interface IFormView {
    template: HTMLElement
    events: IEvents
    valid: boolean
    errors: IFormErrors
    render(data: Partial<IOrder>): HTMLElement
    onInputChange(field: keyof IOrder, value: string): void
    setErrors(errors: IFormErrors): void
    clearErrors(): void
}
```

Интерфейс для шагов заказа (общий):

```
export interface IOrderStepView {
    template: HTMLElement;
    events: IEvents
    stage: ModalStage;
    render(data: Partial<IOrder>, errors?: IFormErrors): HTMLElement;
    validate(data: Partial<IOrder>): IFormErrors | null;
    getFormData(): Partial<IOrder>;
}
```


### Интерфейсы базовых классов

Брокер событий

```
export interface IEvents {
on<T>(event: string, callback: (data: T) => void): void
off<T>(event: string, callback: (data: T) => void): void
emit<T>(event: string, data?: T): void
onAll(callback: (event: string, data: any) => void): void
offAll(): void
trigger<T>(event: string): (data?: T) => void
}
```

API-клиент

```
export interface IApiClient {
    baseUrl: string
    headers?: Record<string, string>
    get<T>(endpoint: string): Promise<T>
    post<T, D>(endpoint: string, data: D, method?: string): Promise<T>
}
```


## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Поля:
- `baseUrl` - базовый адрес сервера
- `options` - объект с заголовками запросов
Методы:
- `get<T>(endpoint: string): Promise<T>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post<T, D>(endpoint: string, data: D, method?: string): Promise<T>` - выполняет POST/PUT/DELETE-запрос.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `off` - отписка от события.
- `emit` - инициализация события
- `onAll` - подписка одновременно на все события.
- `offAll` - сброс ВСЕХ обработчиков.
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных моделей

#### Класс ProductsData
Реализует IProductsData. Класс отвечает за модель хранения и логику работы с данными карточек созданных пользователями.
Конструктор класса принимает инстант брокера событий.
В полях класса хранятся следующие данные:
- `products: IProduct[]` - массив карточек
- `preview: string | null` - id карточки, выбранной для просмотра в модальной окне
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- `getAll(): Promise<void>` - получение всех продуктов
- `getById(id: string): Promise<IProduct>` - выбор продукта по id
- `setPreview(id: string | null): void` - метод для управления preview, хранит ID выбранного товара

#### Класс OrdersData
Класс отвечает за модель хранения и логику работы с данными корзины.
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.
- `order: Pick<IOrder, 'payment' | 'email' | 'phone' | 'address'>` — частичные данные заказа
- `items: IProduct[]` — товары в корзине
- `orderModalStage: ModalStage` — текущая стадия модального окна.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- `getTotal(): number` - возвращает общую стоимость корзины
- `addItemToOrder(product: IProduct): void` - добавить продукт в корзину
- `removeItemFromOrder(id: string): void` - удалить продукт из корзины
- `toPayOrder(): void` - перейти к оплате заказа
- `checkValidation(data: IPaymentModal):IFormErrors` - проверяет объект с данными пользователя на валидность

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс ProductComponent
Абстрактный базовый класс UI.
Методы:
- `setData(productData: IProduct): void` - заполняет атрибуты элементов карточки продукта данными .....
- `toggleClass(element: HTMLElement, className: string)` - переключает класс.
- `setText(element: HTMLElement, text: string): void` - устанавливает текстовое содержимое для переданного элемента.
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` - устанавливает изображения и альтернативный текст для изоображения(опционально) для переданного элемента типа HTMLImageElement.
- `setDisabled(element: HTMLElement, state: boolean): void` - изменяет статус блокировки для переданного элемента.
- `setHidden(element: HTMLElement): void` , setVisible - скрывает, отображает переданный элемент.
- `render(data?: any): HTMLElement` - рендерит компонент, используя переданные данные. Метод должен быть переназначен в дочерних класса

#### Класс Product
Отображает карточку продукта. Реализует IProductView. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\
Поля:
- `template: HTMLElement` -  шаблон карточки.
- `events: IEvents` - брокер событий.
- `title: HTMLElement` - элемент заголовка.
- `image: HTMLImageElement` -  элемент изображения.
- `price: HTMLElement` - элемент цены.
- `category: HTMLElement` -  элемент категории.
- `description: HTMLElement` - элемент описания.
- `button: HTMLButtonElement` - кнопка действия.
  Методы:
- `render(productData: IProduct): HTMLElement;` - заполняет карточку данными.
- сеттеры: `id, title, price, description, image, category`.
- геттеры `id`.

#### Класс ProductsContainer
Отображает контейнер с карточками продуктов. Реализует IProductsContainerView.
Поля:
- `template: HTMLElement` - шаблон контейнера.
Методы:
- `addProducts(...productElements: HTMLElement[]): void.`

#### Класс Cart
Отображает корзину в модальном окне. Реализует IOrderView.
Поля:
- list: HTMLElement - элемент содержимого корзины (карточек продуктов).
- total - элемент суммы продуктов в корзине.
- CartButton - элемент кнопки оформления заказа в корзине.
- template: HTMLElement — шаблон корзины.
- events: IEvents — брокер событий.
Методы:
- render(order: IOrderModal, stage: ModalStage): HTMLElement; — заполняет корзину данными.
- updateStage(stage: ModalStage): void — обновляет UI корзины.
- Сеттер: cartItems, total.
- Геттер: cartItems.

#### Класс Form
Абстрактный базовый класс для всех форм. Реализует IFormView.
Поля:
- `template: HTMLElement` - шаблон формы
- `events: IEvents` - брокер событий
- `valid: boolean` - состояние валидности формы
- `errors: IFormErrors` - объект с ошибками валидации
- `submitButton: HTMLButtonElement` - кнопка отправки формы
- `errorContainer: HTMLElement` - контейнер для отображения ошибок
Методы:
- render(data: Partial): HTMLElement - рендерит форму с переданными данными
- onInputChange(field: keyof IOrder, value: string): void - обработчик изменения полей ввода
- setErrors(errors: IFormErrors): void - устанавливает ошибки валидации
- clearErrors(): void - очищает все ошибки
- toggleSubmitButton(state: boolean): void - управляет состоянием кнопки отправки
- getFormData(): Partial<IOrder> - возвращает данные формы


#### Класс Payment
Отображает форму оплаты (адрес и способ оплаты). Реализует IPaymentView.
Наследуется от Form.
Поля:
- template: HTMLElement - шаблон формы оплаты
- events: IEvents - брокер событий
- addressInput: HTMLInputElement - поле ввода адреса
- cardButton: HTMLButtonElement - кнопка выбора оплаты картой
- cashButton: HTMLButtonElement - кнопка выбора оплаты наличными
- nextButton: HTMLButtonElement - кнопка перехода к следующему шагу
- errorContainer: HTMLElement - контейнер для ошибок
Методы:
- render(data: Pick<IOrder, 'payment' | 'address'>, errors?: IFormErrors): HTMLElement - рендерит форму с данными оплаты
-  setErrors(errors: IFormErrors): void - устанавливает ошибки валидации
-  selectPaymentMethod(method: PaymentMethod): void - выбирает способ оплаты
-  setAddress(address: string): void - устанавливает адрес
-  Сеттеры: payment, address
 - Геттеры: payment, address

#### Класс Contact
Отображает форму контактных данных. Реализует IContactView.
Наследуется от Form.
Поля:
- template: HTMLElement - шаблон формы контактов
- events: IEvents - брокер событий
- emailInput: HTMLInputElement - поле ввода email
- phoneInput: HTMLInputElement - поле ввода телефона
- payButton: HTMLButtonElement - кнопка оплаты заказа
- errorContainer: HTMLElement - контейнер для ошибок
Методы:
- render(data: IPaymentModal, errors?: IFormErrors): HTMLElement - рендерит форму с контактными данными
- setErrors(errors: IFormErrors): void - устанавливает ошибки валидации
- validateEmail(email: string): boolean - валидирует email
- validatePhone(phone: string): boolean - валидирует телефон
- Сеттеры: email, phone
- Геттеры: email, phone, valid

#### Класс OrderStep
Отображает шаги заказа. Реализует IOrderStepView.
Поля:
- template: HTMLElement - шаблон шага заказа
- events: IEvents - брокер событий
- stage: ModalStage - текущая стадия заказа
- formContainer: HTMLElement - контейнер для формы
- navigationButtons: HTMLElement - контейнер с кнопками навигации
- progressIndicator: HTMLElement - индикатор прогресса
Методы:
- render(data: Partial, errors?: IFormErrors): HTMLElement - рендерит шаг заказа
- validate(data: Partial<IOrder>): IFormErrors | null - валидирует данные текущего шага
- getFormData(): Partial<IOrder> - возвращает данные формы текущего шага
- updateProgress(currentStep: ModalStage): void - обновляет индикатор прогресса
- showErrors(errors: IFormErrors): void - отображает ошибки валидации
- enableNavigation(canProceed: boolean): void - управляет доступностью кнопок навигации

#### Класс PageCartCounter
Реализует IPageCartCounterView. Отвечает за отображение количество товаров в корзине на главной странице.
Поля:
- `counter: number` - элемент счетчика продуктов в корзине.
- `catalog: HTMLElement` -  элемент каталога на странице.
Методы:
- `updateCounter(count: number): void` — обновляет счетчик.
  
#### Класс ModalComponent
Управляет модальным окном. Реализует IModalView.
Поля класса
- template: HTMLElement - элемент модального окна, найденный по переданному селектору
- events: IEvents - брокер событий
- content - установка содержимого модального окна
- closeBtn - установка кнопки закрытия

Методы:
- open(): void - открывает модальное окно, добавляя класс modal_active к элементу modal. Инициализирует событие modal:open через EventEmitter, передавая идентификатор текущего шаблона.
- close(): void - закрывает модальное окно, убирая класс modal_active с элемента modal. Инициирует событие modal:close через EventEmitter.
- render(content: HTMLElement): void - рендерит модальное окно с переданным содержимым и открывает его.


#### Класс Success
Реализует ISuccessView. Отвечает за отображение уведомления о успешном оформлении заказа.
Поля:
- `template: HTMLElement` - шаблон уведомления.
- `btnFinish:HTMLButtonElement` - элемент кнопки закрытия уведомления.
- `total: HTMLElement` - элемент общего количества заказанных продуктов.
- `events: IEvents` — брокер событий.
Методы:
- render(total: number): HTMLElement -  устанавливает сумму.


### Слой коммуникации

#### Класс AppApi
Реализует IApiClient. Базовый класс для отправки и получения запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Поля:
- `baseUrl: string` - базовый адрес сервера.
- `options: RequestInit`  - объект с заголовками запросов
Методы:
- `getProducts(): Promise<ApiListResponse<IProduct>>` - возвращает список продуктов
- `getProductById(id: string): Promise<IProduct>` - возвращает продукт по его id
- `createOrder(order: IOrder): Promise<IOrderPostResponse>` - создает заказ


## Взаимодействие компонентов
Презентер (index.ts) связывает слои данных (ProductsData, OrdersData) и представления (Product, Cart, ModalComponent, etc.) через EventEmitter.
- При загрузке страницы вызывается ProductsData.getAll() для получения продуктов, которые отображаются через ProductsContainer.
- При клике на продукт генерируется событие product:select, открывается модальное окно (ModalComponent) с данными продукта (Product).
- При добавлении в корзину (product:add-to-order) обновляется OrdersData, счетчик корзины (PageCartCounter) и модальное окно (Cart).
- Корзина отображается в модальном окне с динамическим контентом (orders, payment, contact, finish) через Cart, Contact, и Success.
*Список всех событий, которые могут генерироваться в системе:*\

```
export enum AppEvents {
ProductSelect = 'product:select', // Выбор продукта для модального окна
ProductAddToOrder = 'product:add-to-order', // Добавление в корзину
ProductRemoveFromOrder = 'product:delete', // Удаление из корзины
ModalOpen = 'modal:open', // Открытие модального окна
ModalClose = 'modal:close', // Закрытие модального окна
OrderSubmit = 'order:submit', // Оформление заказа
PaymentNext = 'payment:next', // Переход к форме оплаты
ContactPay = 'contact:pay', // Оплата заказа
FinishNewProducts = 'finish:newProducts', // Возврат к покупкам
PaymentAddressInput = 'payment-address:input', // Изменение адреса
EmailPhoneInput = 'email-phone:input', // Изменение контактов
EditAddressValidation = 'edit-address:validation', // Валидация адреса
EditEmailPhoneValidation = 'edit-email-phone:validation', // Валидация контактов
}
```

```
export interface IProductSelectEvent { id: string }
export interface IProductAddToOrderEvent { product: IProduct }
export interface IProductRemoveFromOrderEvent { id: string }
export interface IOrderSubmitEvent { order: IOrder }
export interface IPaymentInputEvent { field: keyof IPaymentModal; value: string }
export interface IValidationEvent { data: IPaymentModal }
```

## Логика работы приложения

Загрузка страницы:
- ProductsData.getAll() загружает продукты через AppApi.getProducts().
- ProductsContainer отображает карточки (Product).
- PageCartCounter показывает количество товаров в корзине.

Выбор продукта:
- Клик по карточке (Product) генерирует product:select.
- ModalComponent открывается с содержимым Product (полные данные).

Добавление в корзину:
- Клик на кнопку "В корзину" генерирует product:add-to-order.
- OrdersData.addItemToOrder добавляет продукт в order.items.
- PageCartCounter обновляет счетчик.

Просмотр корзины:
- Клик на иконку корзины генерирует modal:open.
- ModalComponent открывается с Cart в стадии orders.
- Пользователь может удалять товары (product:delete) или перейти к оплате (order:submit).

Оформление заказа:
- В стадии payment отображается форма для ввода адреса и метода оплаты.
- В стадии contact вводятся email и телефон.
- После валидации (checkValidation) и оплаты (contact:pay) отправляется запрос через AppApi.createOrder.
- В стадии finish отображается Success.

Возврат к покупкам:

- Клик на кнопку "За новыми покупками" (finish:newProducts) очищает корзину и закрывает модальное окно.



