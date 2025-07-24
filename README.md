# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с компонентами
- src/components/base/ — папка с базовым кодом
- src/components/common/ — папка с общими компонентами
- src/components/views/ — папка с компонентами представления
- src/components/api/ — папка с API компонентами
- src/data/ — папка с моделями данных
- src/types/ — папка с типами данных
- src/utils/ — папка с утилитами

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

```typescript
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

```typescript
export interface IOrder {
  payment: PaymentMethod
  email: string
  phone: string
  address: string
  total: number
  items: IProduct[]
}
```

### Способы оплаты

```typescript
export enum PaymentMethod {
  Online = 'online',
  Receive = 'receive'
}
```

### Ответ API для заказа

```typescript
export interface IOrderPostResponse {
  id: string
  total: number
  items: IProduct[]
}
```

### Типы для отображения

```typescript
export type IProductCard = Omit // Данные для карточки продукта в каталоге
export type IProductModal = IProduct & {isOrdered: boolean} // Данные для модального окна продукта
export type IProductShort = Pick & { index?: number } // Данные для корзины
export type IOrderModal = Pick & { items: IProductShort[] } // Данные для модального окна корзины
export type IPaymentModal = Pick // Данные для формы оплаты
export type IContactModal = Pick // Данные для формы контактов
export type IFormErrors = Partial<Pick<Record, 'payment' | 'email' | 'phone' | 'address'>> // Ошибки валидации форм
```

## Архитектура приложения

Приложение построено по принципу MVP (Model-View-Presenter) с использованием событийной архитектуры. Основные компоненты:

### Базовые классы

#### Класс Component<T>
Абстрактный базовый класс для всех компонентов представления.

```typescript
export abstract class Component {
  public container: HTMLElement;
  protected constructor(container: HTMLElement);

  // Методы для работы с DOM
  toggleClass(element: HTMLElement, className: string, force?: boolean): void;
  protected setText(element: HTMLElement, value: unknown): void;
  setDisabled(element: HTMLElement, state: boolean): void;
  protected setHidden(element: HTMLElement): void;
  protected setVisible(element: HTMLElement): void;
  protected setImage(element: HTMLImageElement, src: string, alt?: string): void;

  // Абстрактный метод рендеринга
  render(data?: Partial): HTMLElement;
}
```

#### Класс Model
Базовый класс для моделей данных с поддержкой событий.

```typescript
export abstract class Model {
  constructor(events: EventEmitter);
  protected emitChanges(event: string, payload?: object): void;
}
```

#### Класс EventEmitter
Реализует паттерн "Наблюдатель" для связи компонентов.

```typescript
export class EventEmitter implements IEvents {
  on(eventName: EventName, callback: (event: T) => void): void;
  off(eventName: EventName, callback: Subscriber): void;
  emit(eventName: string, data?: T): void;
  trigger(eventName: string, context?: Partial): (event: T) => void;
}
```

### Модели данных

#### Класс ProductsData
Управляет данными о продуктах.

```typescript
export class ProductsData extends Model implements IProductsData {
  private products: IProduct[];
  private preview: IProduct | undefined;

  setProducts(products: IProduct[]): void;
  getAll(): Promise;
  getById(id: string): Promise;
  setPreview(id: string): void;
}
```

Методы:
- `setProducts(products: IProduct[]): void` — установка списка продуктов
- `getAll(): Promise<IProduct[]>` — получение всех продуктов
- `getById(id: string): Promise<IProduct>` — получение продукта по ID
- `setPreview(id: string): void` — установка превью продукта

#### Класс OrdersData
Управляет данными заказа и корзины.

```typescript
export class OrdersData extends Model implements IOrdersData {
  protected _items: IProduct[];
  protected _payment: PaymentMethod | null;
  protected _email: string | null;
  protected _phone: string | null;
  protected _address: string | null;

  // Управление корзиной
  addItemToOrder(product: IProduct): void;
  removeItemFromOrder(id: string): void;
  isInOrder(id: string): boolean;
  getItemsCount(): number;
  getTotal(): number;

  // Управление данными заказа
  setPaymentData(payment: string, address: string): void;
  setContactData(email: string, phone: string): void;

  // Валидация
  validatePayment(): IFormErrors | null;
  validateContact(): IFormErrors | null;

  // Создание и сброс заказа
  createOrder(): IOrder;
  resetOrder(): void;
}
```

### Компоненты представления

#### Класс Page
Управляет главной страницей приложения.

```typescript
export class Page extends Component {
  protected _counter: HTMLElement;
  protected _catalog: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  set counter(value: number);
  set catalog(items: HTMLElement[]);
  set locked(value: boolean);
}
```

#### Класс Product
Компонент карточки продукта в каталоге.

```typescript
export class Product extends Component {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;

  set title(value: string);
  set image(value: string);
  set price(value: number | null);
  set category(value: string);
}
```

#### Класс ProductPreview
Компонент модального окна с детальной информацией о продукте.

```typescript
export class ProductPreview extends Component {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _description: HTMLElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;
  protected _button: HTMLButtonElement;

  disableButton(): void;
  enableButton(): void;
}
```

#### Класс Basket
Компонент корзины товаров.

```typescript
export class Basket extends Component {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLElement;

  set items(items: HTMLElement[]);
  set total(total: number);
  set selected(items: string[]);
}
```

#### Класс BasketItem
Компонент элемента корзины.

```typescript
export class BasketItem extends Component {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLElement;

  set index(value: number);
  set title(value: string);
  set price(value: number | null);
}
```

#### Класс PaymentForm
Компонент формы выбора способа оплаты и ввода адреса.

```typescript
export class PaymentForm extends Component {
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;
  protected _address: HTMLInputElement;
  protected _submit: HTMLButtonElement;

  set payment(value: PaymentMethod);
  get payment(): PaymentMethod;
  set address(value: string);
  get address(): string;
}
```

#### Класс ContactForm
Компонент формы ввода контактных данных.

```typescript
export class ContactForm extends Component {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;
  protected _submit: HTMLButtonElement;

  set email(value: string);
  get email(): string;
  set phone(value: string);
  get phone(): string;
}
```

#### Класс Modal
Базовый компонент модального окна.

```typescript
export class Modal extends Component {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  set content(value: HTMLElement);
  open(): void;
  close(): void;
}
```

#### Класс FinishForm
Компонент экрана успешного оформления заказа.

```typescript
export class FinishForm extends Component {
  protected _close: HTMLElement;
  protected _description: HTMLElement;

  set description(value: string);
}
```

### API

#### Класс AppApi
Класс для работы с серверным API.

```typescript
export class AppApi extends Api implements IApiApi {
  getProductList(): Promise;
  getProductItem(id: string): Promise;
  orderProducts(order: IOrder): Promise;
}
```

## События приложения

Приложение использует следующие события для связи между компонентами:

```typescript
export enum AppEvent {
  // События продуктов
  PRODUCTS_CHANGED = 'products:changed',
  PRODUCT_SELECT = 'product:select',
  PRODUCT_ADDED_TO_CART = 'product:add-to-cart',

  // События корзины
  BASKET_OPEN = 'basket:open',
  BASKET_REMOVE = 'basket:remove',
  BASKET_ORDER = 'basket:order',

  // События заказа
  ORDER_OPEN = 'order:open',
  ORDER_SUBMIT = 'order:submit',
  ORDER_FINISHED = 'order:finished',

  // События форм
  PAYMENT_CHANGE = 'payment:change',
  CONTACTS_CHANGE = 'contacts:change',

  // События модального окна
  MODAL_OPENED = 'modal:open',
  MODAL_CLOSED = 'modal:close'
}
```

## Взаимодействие компонентов

1. **Загрузка данных**: `AppApi` загружает продукты → `ProductsData` сохраняет данные → эмитирует событие `PRODUCTS_CHANGED`

2. **Отображение каталога**: `Page` получает событие → создает компоненты `Product` → отображает в каталоге

3. **Выбор продукта**: клик по продукту → событие `PRODUCT_SELECT` → открытие `ProductPreview` в `Modal`

4. **Добавление в корзину**: клик "В корзину" → событие `PRODUCT_ADDED_TO_CART` → `OrdersData` добавляет товар → обновление счетчика

5. **Оформление заказа**: открытие корзины → `PaymentForm` → `ContactForm` → отправка через `AppApi` → `FinishForm`

Все взаимодействие между компонентами происходит через события (`EventEmitter`), что обеспечивает слабую связанность и легкость тестирования.