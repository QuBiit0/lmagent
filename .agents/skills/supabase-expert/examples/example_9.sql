-- Para búsquedas por texto
CREATE INDEX idx_users_name_search ON public.users 
  USING gin(to_tsvector('spanish', name));

-- Para filtros compuestos frecuentes
CREATE INDEX idx_orders_user_status ON public.orders(user_id, status)
  WHERE status != 'cancelled';

-- Para sorting + pagination
CREATE INDEX idx_posts_created ON public.posts(created_at DESC)
  WHERE status = 'published';

-- Para JSONB queries
CREATE INDEX idx_users_settings ON public.users 
  USING gin(settings jsonb_path_ops);