-- Tablas: plural, snake_case
CREATE TABLE public.users (...);
CREATE TABLE public.user_profiles (...);
CREATE TABLE public.order_items (...);

-- Columnas: snake_case
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

-- Índices: idx_{table}_{columns}
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_orders_user_created ON public.orders(user_id, created_at DESC);

-- Constraints: {table}_{type}_{description}
CONSTRAINT users_email_unique UNIQUE (email),
CONSTRAINT orders_amount_positive CHECK (amount > 0),