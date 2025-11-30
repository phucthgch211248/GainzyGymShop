# IMPORTANT ALGORITHMS IN GYMSHOP SYSTEM

## 1. SECURITY ALGORITHMS

### 1.1. Password Hashing Algorithm (bcrypt)
**Location:** `backend-app/src/modules/user/models/User.js`

**Description:** Uses bcrypt to hash passwords before storing in database
- **Time Complexity:** O(n) where n is the number of rounds (salt rounds = 10)
- **Purpose:** Secure user passwords
- **Mechanism:** 
  - Generate random salt
  - Hash password with salt
  - Compare password during login using `bcrypt.compare()`

```javascript
// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

### 1.2. JWT Token Generation Algorithm
**Location:** `backend-app/src/utils/generateToken.js`

**Description:** Generates JWT token for user authentication
- **Time Complexity:** O(1)
- **Purpose:** Authenticate and authorize users
- **Expiration Time:** 30 days (configurable)

```javascript
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};
```

---

## 2. DATA PROCESSING ALGORITHMS

### 2.1. Slug Generation Algorithm
**Location:** 
- `backend-app/src/modules/product/services/productService.js` (generateUniqueSlug)
- `backend-app/src/modules/blog/services/blogService.js` (generateSlug)

**Description:** Creates URL-friendly string from product/blog name
- **Time Complexity:** O(n) where n is the string length
- **Purpose:** Generate SEO-friendly URLs
- **Mechanism:**
  - Convert Vietnamese accented characters to non-accented
  - Remove special characters
  - Replace spaces with hyphens
  - Ensure uniqueness by appending number if duplicate

```javascript
// Product slug with uniqueness guarantee
const generateUniqueSlug = async (name, excludeId = null) => {
  let slug = slugify(name, { lower: true, strict: true });
  const slugRegEx = new RegExp(`^${slug}(-[0-9]+)?$`, 'i');
  const existingSlugs = await Product.find({ slug: slugRegEx });
  if (existingSlugs.length > 0) {
    slug = `${slug}-${existingSlugs.length}`;
  }
  return slug;
};

// Blog slug with Vietnamese character handling
const generateSlug = (title) => {
  const from = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ';
  const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';
  let slug = title.toLowerCase().trim();
  for (let i = 0; i < from.length; i++) {
    slug = slug.replace(new RegExp(from[i], 'g'), to[i]);
  }
  return slug.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
};
```

### 2.2. Pagination Algorithm
**Location:** Multiple service files (productService, orderService, reviewService, etc.)

**Description:** Paginates data to optimize performance
- **Time Complexity:** O(n) where n is the number of records
- **Purpose:** Reduce data load, improve UX
- **Formula:**
  - `skip = (page - 1) * limit`
  - `totalPages = Math.ceil(count / limit)`

```javascript
const products = await Product.find(query)
  .limit(limit * 1)
  .skip((page - 1) * limit)
  .sort(sort);

const count = await Product.countDocuments(query);

return {
  products,
  totalPages: Math.ceil(count / limit),
  currentPage: Number(page),
  total: count,
};
```

---

## 3. SEARCH AND FILTER ALGORITHMS

### 3.1. Filtering & Searching Algorithm
**Location:** `backend-app/src/modules/product/services/productService.js`

**Description:** Filters and searches products by multiple criteria
- **Time Complexity:** O(n) where n is the number of products
- **Purpose:** Search products by multiple conditions
- **Criteria:**
  - Search by name (regex, case-insensitive)
  - Filter by category, brand, effect
  - Filter by price range (minPrice, maxPrice)
  - Filter by status (isActive, isFeatured)

```javascript
const query = {};

if (search) {
  query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
}

if (minPrice || maxPrice) {
  query.price = {};
  if (minPrice) query.price.$gte = Number(minPrice);
  if (maxPrice) query.price.$lte = Number(maxPrice);
}

if (category) query.category = category;
if (brand) query.brand = brand;
if (effect) query['effective.label'] = { $regex: effect, $options: 'i' };
```

### 3.2. Sorting Algorithm
**Location:** Multiple service files

**Description:** Sorts data by multiple criteria
- **Time Complexity:** O(n log n) - MongoDB uses quicksort
- **Purpose:** Display data in desired order
- **Sort Criteria:**
  - By price
  - By creation date (createdAt)
  - By rating
  - By sales quantity (sold)

```javascript
// Sort with multiple fields
const sortOptions = {};
const sortField = sortBy || 'createdAt';
const sortOrder = order === 'asc' ? 1 : -1;
sortOptions[sortField] = sortOrder;

if (sortField !== 'createdAt') {
  sortOptions.createdAt = -1; // Secondary sort
}
```

---

## 4. PRICING CALCULATION ALGORITHMS

### 4.1. Discount Price Calculation Algorithm
**Location:** `backend-app/src/modules/cart/services/cartService.js`

**Description:** Calculates price after applying discount
- **Time Complexity:** O(1)
- **Purpose:** Calculate final selling price for customers
- **Formula:** `price = originalPrice * (1 - discount / 100)`

```javascript
const price = product.discount > 0 
  ? product.price * (1 - product.discount / 100)
  : product.price;
```

### 4.2. Order Total Calculation Algorithm
**Location:** `backend-app/src/modules/order/services/orderService.js`

**Description:** Calculates total order value
- **Time Complexity:** O(n) where n is the number of products in order
- **Purpose:** Calculate total amount customer must pay
- **Formula:** 
  - `itemsPrice = sum(price * quantity)`
  - `totalPrice = itemsPrice + shippingPrice`

```javascript
const itemsPrice = orderItems.reduce((acc, item) => {
  return acc + item.price * item.quantity;
}, 0);

const totalPrice = itemsPrice + shippingPrice;
```

---

## 5. INVENTORY MANAGEMENT ALGORITHMS

### 5.1. Stock Management Algorithm
**Location:** 
- `backend-app/src/modules/order/services/orderService.js`
- `backend-app/src/modules/cart/services/cartService.js`
- `backend-app/src/modules/product/services/productService.js`

**Description:** Manages inventory quantity when placing/canceling orders
- **Time Complexity:** O(1) per product
- **Purpose:** Ensure no overselling of inventory
- **Mechanism:**
  - Check stock before adding to cart
  - Decrease stock and increase sold when creating order
  - Increase stock and decrease sold when canceling order

```javascript
// When creating order
for (const item of orderItems) {
  await Product.findByIdAndUpdate(item.product, {
    $inc: { stock: -item.quantity, sold: item.quantity },
  });
}

// When canceling order
for (const item of order.items) {
  await Product.findByIdAndUpdate(item.product, {
    $inc: { stock: item.quantity, sold: -item.quantity },
  });
}
```

---

## 6. RATING ALGORITHMS

### 6.1. Average Rating Update Algorithm
**Location:** `backend-app/src/modules/review/services/reviewServices.js`

**Description:** Calculates and updates product average rating
- **Time Complexity:** O(n) where n is the number of reviews
- **Purpose:** Display average rating for products
- **Formula:** `avgRating = sum(ratings) / count(reviews)`

```javascript
async function updateProductRating(productId) {
  const reviews = await Review.find({ product: productId });
  
  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      numReviews: 0,
    });
  } else {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const avgRating = totalRating / reviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: avgRating.toFixed(1),
      numReviews: reviews.length,
    });
  }
}
```

---

## 7. STATISTICS AND ANALYTICS ALGORITHMS

### 7.1. MongoDB Aggregation Algorithm
**Location:** `backend-app/src/modules/admin/services/adminService.js`

**Description:** Uses MongoDB Aggregation Pipeline for data statistics
- **Time Complexity:** O(n) where n is the number of documents
- **Purpose:** Efficiently calculate complex statistics
- **Statistics:**
  - Total revenue
  - Monthly revenue
  - Top customers
  - Order status statistics

```javascript
// Calculate total revenue
const revenueResult = await Order.aggregate([
  {
    $match: {
      status: ORDER_STATUS.DELIVERED,
      paymentStatus: PAYMENT_STATUS.PAID,
    },
  },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: '$totalPrice' },
    },
  },
]);

// Top customers
const result = await Order.aggregate([
  { $match: { status: ORDER_STATUS.DELIVERED } },
  {
    $group: {
      _id: '$user',
      totalSpent: { $sum: '$totalPrice' },
      orderCount: { $sum: 1 },
    },
  },
  { $sort: { totalSpent: -1 } },
  { $limit: limit },
]);
```

### 7.2. Growth Calculation Algorithm
**Location:** `backend-app/src/modules/admin/services/adminService.js`

**Description:** Calculates growth percentage between periods
- **Time Complexity:** O(1)
- **Purpose:** Compare performance between months
- **Formula:** `growth = ((current - previous) / previous) * 100`

```javascript
const userGrowth = newUsersLastMonth > 0
  ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
  : 100;

const revenueGrowth = revenueLastMonth > 0
  ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
  : 100;
```

### 7.3. Monthly Revenue Statistics Algorithm
**Location:** `backend-app/src/modules/admin/services/adminService.js`

**Description:** Groups and calculates total revenue by month
- **Time Complexity:** O(n) where n is the number of orders
- **Purpose:** Analyze revenue trends over time

```javascript
const result = await Order.aggregate([
  {
    $match: {
      status: ORDER_STATUS.DELIVERED,
      paymentStatus: PAYMENT_STATUS.PAID,
      createdAt: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 11)),
      },
    },
  },
  {
    $group: {
      _id: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
      },
      revenue: { $sum: '$totalPrice' },
      orderCount: { $sum: 1 },
    },
  },
  {
    $sort: { '_id.year': 1, '_id.month': 1 },
  },
]);
```

---

## 8. CART MANAGEMENT ALGORITHMS

### 8.1. Add/Update Product to Cart Algorithm
**Location:** `backend-app/src/modules/cart/services/cartService.js`

**Description:** Adds or updates product quantity in cart
- **Time Complexity:** O(n) where n is the number of products in cart
- **Purpose:** Manage user's shopping cart
- **Mechanism:**
  - Find existing product in cart (linear search)
  - If exists: add to quantity
  - If not: add new item to cart

```javascript
const existingItemIndex = cart.items.findIndex(
  (item) => item.product.toString() === productId
);

if (existingItemIndex > -1) {
  const newQuantity = cart.items[existingItemIndex].quantity + quantity;
  if (product.stock < newQuantity) {
    throw new Error('Insufficient stock');
  }
  cart.items[existingItemIndex].quantity = newQuantity;
} else {
  cart.items.push({ product: productId, quantity, price });
}
```

---

## 9. RELATED PRODUCT SEARCH ALGORITHMS

### 9.1. Related Product Recommendation Algorithm
**Location:** `backend-app/src/modules/product/services/productService.js`

**Description:** Finds related products based on category and rating
- **Time Complexity:** O(n) where n is the number of products in category
- **Purpose:** Recommend similar products to customers
- **Criteria:**
  - Same category
  - Different from current productId
  - Sorted by highest rating

```javascript
const products = await Product.find({
  _id: { $ne: productId },
  category: categoryId,
  isActive: true,
})
  .limit(limit)
  .sort('-rating');
```

---

## COMPLEXITY SUMMARY

| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Password Hashing (bcrypt) | O(n) where n = salt rounds | O(1) |
| JWT Token Generation | O(1) | O(1) |
| Slug Generation | O(n) where n = string length | O(1) |
| Pagination | O(n) | O(1) |
| Filtering & Searching | O(n) | O(1) |
| Sorting (MongoDB) | O(n log n) | O(1) |
| Discount Price Calculation | O(1) | O(1) |
| Order Total Calculation | O(n) where n = number of products | O(1) |
| Stock Management | O(1) | O(1) |
| Rating Update | O(n) where n = number of reviews | O(1) |
| MongoDB Aggregation | O(n) | O(1) |
| Growth Calculation | O(1) | O(1) |
| Cart Management | O(n) where n = number of products | O(1) |

---

## CONCLUSION

The above algorithms ensure:
- **Security:** Password hashing, JWT authentication
- **Performance:** Pagination, indexing, aggregation
- **User Experience:** Search, filter, sort, recommendations
- **Business Management:** Stock management, order processing, statistics
