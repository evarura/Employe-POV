import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Role = 'waiter' | 'chef';

type OrderStatus =
  | 'New'
  | 'Accepted'
  | 'Preparing'
  | 'Ready'
  | 'Served';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  emoji: string;
}

interface OrderItem {
  name: string;
  qty: number;
  note?: string;
}

interface Order {
  id: number;
  table: string;
  items: OrderItem[];
  status: OrderStatus;
  created: number;
  waiter: string;
  note?: string;
}

interface StockItem {
  name: string;
  qty: number;
  unit: string;
  min: number;
}

interface GamingStation {
  id: string;
  type: 'PC Gaming' | 'PlayStation';
  customer: string;
  game: string;
  sessionMinutes: number;
  orders: number;
  status: 'Occupied' | 'Available';
  selfOrdering: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {

  readonly Math = Math;

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  role: Role | null = null;

  loginId = '';
  loginPassword = '';
  loginError = '';

  private readonly sessionKey = 'sanctum-demo-session';

  private readonly demoUsers = [
    {
      employeeId: 'waiter01',
      password: 'Waiter@123',
      role: 'waiter' as Role,
      name: 'Alex Morgan'
    },
    {
      employeeId: 'chef01',
      password: 'Chef@123',
      role: 'chef' as Role,
      name: 'Chef Jordan'
    }
  ];

  login(): void {
    this.loginError = '';

    const employee = this.demoUsers.find(user =>
      user.employeeId.toLowerCase() === this.loginId.trim().toLowerCase() &&
      user.password === this.loginPassword
    );

    if (!employee) {
      this.loginError = 'Invalid employee ID or password.';
      return;
    }

    this.role = employee.role;
    this.staffName = employee.name;
    this.page = 'dashboard';

    localStorage.setItem(
      this.sessionKey,
      JSON.stringify({
        employeeId: employee.employeeId,
        role: employee.role,
        name: employee.name
      })
    );

    this.loginId = '';
    this.loginPassword = '';

    this.notify(`Welcome back, ${employee.name}`);
  }

  private restoreSession(): void {
    try {
      const saved = localStorage.getItem(this.sessionKey);

      if (!saved) return;

      const session = JSON.parse(saved);

      const employee = this.demoUsers.find(user =>
        user.employeeId === session.employeeId &&
        user.role === session.role &&
        user.name === session.name
      );

      if (!employee) {
        localStorage.removeItem(this.sessionKey);
        return;
      }

      this.role = employee.role;
      this.staffName = employee.name;
      this.page = 'dashboard';

    } catch {
      localStorage.removeItem(this.sessionKey);
    }

    
  }

  // =====================================================
  // GENERAL APP STATE
  // =====================================================

  page = 'dashboard';

  staffName = 'Alex Morgan';

  selectedTable = 'T03';

  toast = '';
  toastTimer?: ReturnType<typeof setTimeout>;

  // =====================================================
  // MY TABLES CATEGORIES
  // =====================================================

  myTablesCategory = 'Dining Tables';

  myTablesCategories = [
    'Dining Tables',
    'PC Gaming',
    'PlayStation'
  ];

  // =====================================================
  // MENU AND ORDER STATE
  // =====================================================

  activeCategory = 'All';

  searchTerm = '';

  cart: OrderItem[] = [];

  orderNote = '';

  categories = [
    'All',
    'Starters',
    'Mains',
    'Drinks',
    'Desserts'
  ];

  menu: MenuItem[] = [
  {
    id: 1,
    name: 'Chicken Burger',
    category: 'Mains',
    price: 249,
    emoji: '\u{1F354}'
  },
  {
    id: 2,
    name: 'Paneer Tikka',
    category: 'Starters',
    price: 219,
    emoji: '\u{1F362}'
  },
  {
    id: 3,
    name: 'Loaded Fries',
    category: 'Starters',
    price: 169,
    emoji: '\u{1F35F}'
  },
  {
    id: 4,
    name: 'Margherita Pizza',
    category: 'Mains',
    price: 299,
    emoji: '\u{1F355}'
  },
  {
    id: 5,
    name: 'Alfredo Pasta',
    category: 'Mains',
    price: 279,
    emoji: '\u{1F35D}'
  },
  {
    id: 8,
    name: 'Brownie Sundae',
    category: 'Desserts',
    price: 159,
    emoji: '\u{1F368}'
  },
  {
    id: 9,
    name: 'Chicken Wings',
    category: 'Starters',
    price: 229,
    emoji: '\u{1F357}'
  },
  {
    id: 10,
    name: 'Club Sandwich',
    category: 'Mains',
    price: 199,
    emoji: '\u{1F96A}'
  }
];

  // =====================================================
  // DINING TABLES
  // =====================================================

  tables = [
    { id: 'T01', seats: 2, status: 'Occupied', amount: 540 },
    { id: 'T02', seats: 4, status: 'Occupied', amount: 458 },
    { id: 'T03', seats: 4, status: 'Occupied', amount: 796 },
    { id: 'T04', seats: 2, status: 'Available', amount: 0 },
    { id: 'T05', seats: 6, status: 'Reserved', amount: 0 },
    { id: 'T06', seats: 4, status: 'Occupied', amount: 318 },
    { id: 'T07', seats: 2, status: 'Cleaning', amount: 0 },
    { id: 'T08', seats: 4, status: 'Occupied', amount: 688 },
    { id: 'T09', seats: 6, status: 'Available', amount: 0 },
    { id: 'T10', seats: 2, status: 'Available', amount: 0 },
    { id: 'T11', seats: 4, status: 'Available', amount: 0 },
    { id: 'T12', seats: 4, status: 'Reserved', amount: 0 }
  ];

  // =====================================================
  // GAMING STATIONS
  // =====================================================

  gamingStations: GamingStation[] = [

    {
      id: 'PC-01',
      type: 'PC Gaming',
      customer: 'Rahul Sharma',
      game: 'Valorant',
      sessionMinutes: 45,
      orders: 2,
      status: 'Occupied',
      selfOrdering: true
    },

    {
      id: 'PC-02',
      type: 'PC Gaming',
      customer: '',
      game: '',
      sessionMinutes: 0,
      orders: 0,
      status: 'Available',
      selfOrdering: true
    },

    {
      id: 'PC-03',
      type: 'PC Gaming',
      customer: 'Arjun Kumar',
      game: 'GTA V',
      sessionMinutes: 60,
      orders: 1,
      status: 'Occupied',
      selfOrdering: true
    },

    {
      id: 'PC-04',
      type: 'PC Gaming',
      customer: '',
      game: '',
      sessionMinutes: 0,
      orders: 0,
      status: 'Available',
      selfOrdering: true
    },

    {
      id: 'PS-01',
      type: 'PlayStation',
      customer: 'Kiran',
      game: 'FIFA 26',
      sessionMinutes: 30,
      orders: 3,
      status: 'Occupied',
      selfOrdering: true
    },

    {
      id: 'PS-02',
      type: 'PlayStation',
      customer: '',
      game: '',
      sessionMinutes: 0,
      orders: 0,
      status: 'Available',
      selfOrdering: true
    },

    {
      id: 'PS-03',
      type: 'PlayStation',
      customer: 'Vikram',
      game: 'Mortal Kombat',
      sessionMinutes: 55,
      orders: 1,
      status: 'Occupied',
      selfOrdering: true
    }

  ];

  getGamingStations(category: string): GamingStation[] {
  if (category === 'PC Gaming') {
    return this.gamingStations.filter(station =>
      station.id.startsWith('PC-')
    );
  }

  if (category === 'PlayStation') {
    return this.gamingStations.filter(station =>
      station.id.startsWith('PS-')
    );
  }

  return [];
}

countGamingStations(category: string): number {
  return this.gamingStations.filter(
    station => station.type === category
  ).length;
}


  // =====================================================
  // ORDERS
  // =====================================================

  orders: Order[] = [
    {
      id: 1042,
      table: 'T03',
      items: [
        { name: 'Chicken Burger', qty: 2, note: 'No onions' },
        { name: 'Loaded Fries', qty: 1 },
        { name: 'Cold Coffee', qty: 2, note: 'Less sugar' }
      ],
      status: 'Preparing',
      created: Date.now() - 8 * 60000,
      waiter: 'Alex Morgan'
    },
    {
      id: 1043,
      table: 'T06',
      items: [
        { name: 'Paneer Tikka', qty: 1 },
        { name: 'Lime Soda', qty: 2 }
      ],
      status: 'New',
      created: Date.now() - 2 * 60000,
      waiter: 'Jamie Lee'
    },
    {
      id: 1044,
      table: 'T02',
      items: [
        { name: 'Margherita Pizza', qty: 1 },
        { name: 'Brownie Sundae', qty: 1 }
      ],
      status: 'Ready',
      created: Date.now() - 14 * 60000,
      waiter: 'Alex Morgan'
    },
    {
      id: 1045,
      table: 'T08',
      items: [
        { name: 'Chicken Wings', qty: 2 },
        { name: 'Cold Coffee', qty: 2 }
      ],
      status: 'Accepted',
      created: Date.now() - 5 * 60000,
      waiter: 'Sam Patel'
    }
  ];

  // =====================================================
  // INVENTORY
  // =====================================================

  stock: StockItem[] = [
    { name: 'Paneer', qty: 4.4, unit: 'kg', min: 5 },
    { name: 'Chicken', qty: 12, unit: 'kg', min: 4 },
    { name: 'Tomatoes', qty: 7.5, unit: 'kg', min: 5 },
    { name: 'Cheese', qty: 3, unit: 'kg', min: 2 },
    { name: 'Burger buns', qty: 45, unit: 'units', min: 20 },
    { name: 'Lettuce', qty: 1.2, unit: 'kg', min: 2 },
    { name: 'French fries', qty: 8, unit: 'kg', min: 3 }
  ];

  // =====================================================
  // WASTAGE
  // =====================================================

  wastageItem = 'Paneer';

  wastageQty = 0.5;

  wastageReason = 'Preparation error';

  wastageLog = [
    {
      item: 'Tomatoes',
      qty: '300 g',
      reason: 'Spoiled',
      time: '10:42 AM'
    },
    {
      item: 'Burger buns',
      qty: '2 units',
      reason: 'Damaged',
      time: '09:18 AM'
    }
  ];

  // =====================================================
  // STOCK REQUESTS
  // =====================================================

  stockRequests = [
    { item: 'Paneer', qty: '2 kg', status: 'Pending' },
    { item: 'Burger buns', qty: '24 units', status: 'Approved' }
  ];

  // =====================================================
  // RECIPES
  // =====================================================

  recipes = [
    {
      name: 'Chicken Burger',
      ingredients: 'Bun 1 · Chicken patty 150 g · Cheese 1 slice · Lettuce 20 g',
      cost: 92,
      price: 249
    },
    {
      name: 'Paneer Tikka',
      ingredients: 'Paneer 180 g · Curd 40 g · Spice mix 15 g · Capsicum 30 g',
      cost: 86,
      price: 219
    },
    {
      name: 'Margherita Pizza',
      ingredients: 'Pizza base 1 · Mozzarella 100 g · Tomato sauce 50 g · Basil 5 g',
      cost: 104,
      price: 299
    },
    {
      name: 'Alfredo Pasta',
      ingredients: 'Pasta 120 g · Cream 60 ml · Cheese 25 g · Herbs 5 g',
      cost: 98,
      price: 279
    }
  ];

  // =====================================================
  // CONSTRUCTOR AND CLEANUP
  // =====================================================

  constructor() {
    this.loadState();
    this.restoreSession();

    window.addEventListener('storage', this.onStorage);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.onStorage);

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  private onStorage = (event: StorageEvent): void => {
    if (event.key === 'sanctum-demo-orders' && event.newValue) {
      try {
        this.orders = JSON.parse(event.newValue) as Order[];
      } catch {
        // Ignore invalid storage updates.
      }
    }
  };

  // =====================================================
  // LOCAL STORAGE
  // =====================================================

  private loadState(): void {
    try {
      const saved = localStorage.getItem('sanctum-demo-orders');

      if (saved) {
        this.orders = JSON.parse(saved) as Order[];
      }
    } catch {
      // Keep starter demo orders.
    }
  }

  private save(): void {
    localStorage.setItem(
      'sanctum-demo-orders',
      JSON.stringify(this.orders)
    );
  }

  // =====================================================
  // ROLE MANAGEMENT
  // =====================================================

  setRole(role: Role): void {
    this.role = role;

    this.page = 'dashboard';

    this.staffName =
      role === 'waiter' ? 'Alex Morgan' : 'Chef Jordan';
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);

    this.role = null;
    this.page = 'dashboard';

    this.cart = [];

    this.loginId = '';
    this.loginPassword = '';
    this.loginError = '';

    this.notify('You have been logged out.');
  }

  // =====================================================
  // NAVIGATION AND ACCESS CONTROL
  // =====================================================

  navigate(page: string): void {
    if (!this.role) return;

    const waiterPages = [
      'dashboard',
      'tables',
      'new-order',
      'orders',
      'ready',
      'history'
    ];

    const chefPages = [
      'dashboard',
      'live-orders',
      'preparation',
      'ready',
      'stock',
      'recipes',
      'wastage',
      'orders'
    ];

    const allowedPages =
      this.role === 'waiter'
        ? waiterPages
        : chefPages;

    if (!allowedPages.includes(page)) {
      this.notify(
        'You do not have permission to access this page.'
      );

      return;
    }

    this.page = page;
  }

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  notify(message: string): void {
    this.toast = message;

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.toast = '';
    }, 2600);
  }

  // =====================================================
  // ORDER FILTERS AND STATISTICS
  // =====================================================

  get activeOrders(): Order[] {
    return this.orders.filter(
      order => order.status !== 'Served'
    );
  }

  get newOrders(): Order[] {
    return this.orders.filter(
      order => order.status === 'New'
    );
  }

  get preparingOrders(): Order[] {
    return this.orders.filter(
      order =>
        order.status === 'Preparing' ||
        order.status === 'Accepted'
    );
  }

  get readyOrders(): Order[] {
    return this.orders.filter(
      order => order.status === 'Ready'
    );
  }

  get servedOrders(): Order[] {
    return this.orders.filter(
      order => order.status === 'Served'
    );
  }

  get filteredMenu(): MenuItem[] {
    return this.menu.filter(item =>
      (
        this.activeCategory === 'All' ||
        item.category === this.activeCategory
      ) &&
      item.name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }

  get cartTotal(): number {
    return this.cart.reduce(
      (sum, line) =>
        sum +
        (
          this.menu.find(
            menuItem => menuItem.name === line.name
          )?.price ?? 0
        ) * line.qty,
      0
    );
  }

  get lowStock(): StockItem[] {
    return this.stock.filter(
      item => item.qty < item.min
    );
  }

  get elapsedLabel(): string {
    return 'Live service';
  }

  countStatus(status: string): number {
    return this.orders.filter(
      order => order.status === status
    ).length;
  }

  orderAge(order: Order): number {
    return Math.max(
      1,
      Math.floor(
        (Date.now() - order.created) / 60000
      )
    );
  }

  // =====================================================
  // CART MANAGEMENT
  // =====================================================

  addToCart(item: MenuItem): void {
    const existing = this.cart.find(
      line => line.name === item.name
    );

    if (existing) {
      existing.qty++;
    } else {
      this.cart.push({
        name: item.name,
        qty: 1
      });
    }
  }

  changeQty(line: OrderItem, amount: number): void {
    line.qty += amount;

    if (line.qty <= 0) {
      this.cart = this.cart.filter(
        item => item !== line
      );
    }
  }

  // =====================================================
  // SUBMIT DINING / GAMING ORDER
  // =====================================================

  submitOrder(): void {
    if (!this.cart.length) {
      this.notify(
        'Add at least one item to the order.'
      );

      return;
    }

    const order: Order = {
      id: Math.max(
        1040,
        ...this.orders.map(item => item.id)
      ) + 1,

      table: this.selectedTable,

      items: this.cart.map(item => ({
        ...item
      })),

      status: 'New',

      created: Date.now(),

      waiter: this.staffName,

      note: this.orderNote.trim() || undefined
    };

    this.orders = [
      order,
      ...this.orders
    ];

    this.save();

    this.cart = [];
    this.orderNote = '';

    this.page = 'orders';

    this.notify(
      `Order #${order.id} sent to kitchen`
    );
  }

  // =====================================================
  // GAMING STATION ORDER MANAGEMENT
  // =====================================================

  setGamingStation(stationId: string): void {
    const station = this.gamingStations.find(
      item => item.id === stationId
    );

    if (!station) {
      this.notify('Gaming station not found.');
      return;
    }

    if (station.status !== 'Occupied') {
      this.notify(
        'Assign a customer to this station first.'
      );

      return;
    }

    this.selectedTable = station.id;

    this.page = 'new-order';
  }

  // Simulates an order placed directly by a gaming customer.
  // The order is added to the shared kitchen/waiter order list.

  simulateCustomerOrder(station: GamingStation): void {
    if (station.status !== 'Occupied') {
      this.notify(
        'This gaming station is not currently occupied.'
      );

      return;
    }

    if (!station.selfOrdering) {
      this.notify(
        'Self-ordering is disabled for this station.'
      );

      return;
    }

    const item = this.menu[0];

    if (!item) {
      this.notify('No menu items available.');
      return;
    }

    const order: Order = {
      id: Math.max(
        1040,
        ...this.orders.map(existingOrder => existingOrder.id)
      ) + 1,

      table: station.id,

      items: [
        {
          name: item.name,
          qty: 1
        }
      ],

      status: 'New',

      created: Date.now(),

      waiter: 'Customer self-order',

      note: 'Placed directly from gaming station interface.'
    };

    this.orders = [
      order,
      ...this.orders
    ];

    station.orders++;

    this.save();

    this.notify(
      `Customer order from ${station.id} sent to kitchen.`
    );
  }

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  updateStatus(
    order: Order,
    status: OrderStatus
  ): void {
    order.status = status;

    this.save();

    this.notify(
      `Order #${order.id} marked ${status.toLowerCase()}`
    );
  }

  nextChefAction(order: Order): void {
    if (order.status === 'New') {
      this.updateStatus(order, 'Accepted');
    } else if (order.status === 'Accepted') {
      this.updateStatus(order, 'Preparing');
    } else if (order.status === 'Preparing') {
      this.updateStatus(order, 'Ready');
    }
  }

  markServed(order: Order): void {
    this.updateStatus(order, 'Served');

    const table = this.tables.find(
      item => item.id === order.table
    );

    if (table) {
      table.status = 'Occupied';
    }
  }

  // =====================================================
  // TABLE MANAGEMENT
  // =====================================================

  setTable(table: string): void {
    this.selectedTable = table;

    this.page = 'new-order';
  }

  // =====================================================
  // WASTAGE MANAGEMENT
  // =====================================================

  recordWastage(): void {
    if (this.wastageQty <= 0) {
      this.notify(
        'Enter a quantity greater than zero.'
      );

      return;
    }

    const item = this.stock.find(
      stockItem => stockItem.name === this.wastageItem
    );

    if (item) {
      item.qty = Math.max(
        0,
        item.qty - this.wastageQty
      );
    }

    this.wastageLog.unshift({
      item: this.wastageItem,

      qty: `${this.wastageQty} ${item?.unit ?? 'kg'}`,

      reason: this.wastageReason,

      time: new Date().toLocaleTimeString(
        [],
        {
          hour: '2-digit',
          minute: '2-digit'
        }
      )
    });

    this.wastageQty = 0.5;

    this.notify(
      'Wastage entry recorded and stock adjusted.'
    );
  }

  // =====================================================
  // STOCK REQUESTS
  // =====================================================

  requestStock(item: StockItem): void {
    this.stockRequests.unshift({
      item: item.name,

      qty: `${
        Math.max(
          1,
          item.min - item.qty + 1
        )
      } ${item.unit}`,

      status: 'Pending'
    });

    this.notify(
      `Stock request raised for ${item.name}`
    );
  }

  // =====================================================
  // PRICE AND ORDER TOTAL HELPERS
  // =====================================================

  itemPrice(name: string): number {
    return this.menu.find(
      item => item.name === name
    )?.price ?? 0;
  }

  orderTotal(order: Order): number {
    return order.items.reduce(
      (sum, item) =>
        sum +
        this.itemPrice(item.name) * item.qty,
      0
    );
  }

  trackByOrder(
    _: number,
    order: Order
  ): number {
    return order.id;
  }

  selectMyTablesCategory(category: string): void {
  this.myTablesCategory = category;
}

}
