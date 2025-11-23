# Vélora - Premium Luxury E-Commerce Platform

A sophisticated e-commerce website for luxury fashion and accessories, built with React, FastAPI, and Supabase.

## Features

- ✨ **Premium UI/UX** - Elegant design with custom color palette
- 🛍️ **Full E-Commerce** - Product browsing, cart, checkout
- 🔐 **Supabase Authentication** - Secure user accounts
- 📦 **Real-time Cart** - Synchronized across devices
- 📦 **Order Management** - Track purchases and history
- 📱 **Fully Responsive** - Mobile, tablet, desktop optimized

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios for API calls
- Supabase JS Client
- Lucide React for icons
- Sonner for toast notifications
- Custom CSS with premium design system

### Backend
- FastAPI (Python)
- Supabase for database and auth
- JWT authentication
- Python Jose for token verification

### Database
- Supabase (PostgreSQL)
- Row Level Security for data protection

## Color Palette

- **Royal Black**: `#0A0A0C` - Primary background
- **Champagne Gold**: `#D4AF37` - CTAs and highlights
- **Pearl White**: `#F7F5F2` - Light backgrounds
- **Charcoal Gray**: `#2E2E30` - Secondary elements
- **Emerald Green**: `#046E4E` - Accent badges

## Getting Started

### Prerequisites

1. **Supabase Account**: Create a project at [supabase.com](https://supabase.com)
2. **Run the Database Schema**:
   - Open Supabase SQL Editor
   - Copy and run the SQL from `/app/SUPABASE_SCHEMA.sql`
   - This creates all tables and security policies

### Installation

1. **Backend Setup**:
```bash
cd /app/backend
pip install -r requirements.txt
```

2. **Frontend Setup**:
```bash
cd /app/frontend
yarn install
```

### Configuration

1. **Backend Environment** (`/app/backend/.env`):
   - Supabase URL and keys are already configured
   - JWT_SECRET is set from your Supabase project

2. **Frontend Environment** (`/app/frontend/.env`):
   - React app backend URL is configured
   - Supabase client credentials are set

### Running the Application

The application runs automatically via supervisord:
- Backend: `http://localhost:8001`
- Frontend: `http://localhost:3000`
- Both services auto-restart on file changes

To manually restart:
```bash
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

## Project Structure

```
/app/
├── backend/
│   ├── server.py          # Main FastAPI application
│   ├── auth.py            # Authentication middleware
│   ├── config.py          # Configuration settings
│   ├── requirements.txt   # Python dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # Auth & Cart contexts
│   │   ├── pages/         # Route pages
│   │   ├── lib/           # Supabase client
│   │   ├── App.js         # Main app component
│   │   └── App.css        # Premium styles
│   ├── package.json       # Node dependencies
│   └── .env               # Environment variables
└── SUPABASE_SCHEMA.sql   # Database setup
```

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `GET /api/products/category/{category}` - Products by category

### Protected Endpoints (Requires Authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{item_id}` - Update cart item
- `DELETE /api/cart/{item_id}` - Remove from cart
- `POST /api/orders/checkout` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{order_id}` - Get order details

## Features Breakdown

### Authentication
- Supabase email/password authentication
- JWT token-based API protection
- Persistent sessions
- Secure sign up and sign in flows

### Shopping Cart
- Real-time cart updates
- Quantity management
- Persistent across sessions
- Cart count badge in header

### Products
- Category filtering
- Search functionality
- Product detail pages
- Stock management
- Premium product cards with hover effects

### Checkout
- Multi-step checkout form
- Order summary
- Demo payment (UI only)
- Order confirmation

### Orders
- Order history
- Order details
- Status tracking

## Design Philosophy

Vélora embodies premium luxury through:

1. **Minimalism** - Clean layouts with generous spacing
2. **Typography** - Playfair Display for headings, Inter for body
3. **Color Harmony** - Sophisticated palette with gold accents
4. **Micro-interactions** - Subtle animations on hover and click
5. **Responsive Design** - Seamless experience across all devices

## Database Schema

### Tables
- `products` - Product catalog
- `carts` - User shopping carts
- `cart_items` - Items in carts
- `orders` - Customer orders
- `order_items` - Items in orders
- `profiles` - Extended user information

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Products are publicly readable
- Cart and orders are user-specific

## Customization

### Adding Products
Run SQL in Supabase (prices in Indian Rupees):
```sql
INSERT INTO products (name, description, price, stock, image_url, category)
VALUES ('Product Name', 'Description', 8499.00, 10, 'image-url', 'Category');
```

### Changing Colors
Edit CSS variables in `/app/frontend/src/App.css`:
```css
:root {
  --royal-black: #0A0A0C;
  --champagne-gold: #D4AF37;
  --pearl-white: #F7F5F2;
  --charcoal-gray: #2E2E30;
  --emerald-green: #046E4E;
}
```

### Logo
The logo is loaded from the provided URL. To change it:
1. Update the `src` in `/app/frontend/src/components/Header.jsx`
2. Update the `src` in `/app/frontend/src/components/Footer.jsx`

## Deployment

### Frontend
1. Build the React app: `yarn build`
2. Deploy the `build` folder to any static host
3. Update `REACT_APP_BACKEND_URL` to production API URL

### Backend
1. Deploy FastAPI to any Python hosting (Heroku, Railway, etc.)
2. Set environment variables from `.env`
3. Ensure Supabase credentials are configured

## Support

For issues or questions:
1. Check Supabase dashboard for database errors
2. View backend logs: `tail -f /var/log/supervisor/backend.*.log`
3. View frontend logs in browser console

## License

MIT License - Feel free to use for personal or commercial projects.

---

**Vélora** - Where timeless elegance meets modern e-commerce.
